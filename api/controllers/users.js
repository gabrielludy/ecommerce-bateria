const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const xss = require('xss')

//import database models
const User = require('../models/user');
const { request } = require('express');

function verifyBot(){
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify?secret='+process.env.MONGO_ATLAS_PW
    request(verifyUrl, (err, res, body) => {
        if(err){
            res.status(200).json({
                error: err
            });
        }
        
        body = JSON.parse(body);
        if(!body.success || body.score < 0.4){
            return res.json({'bot':true, 'score': body.score});
        }

        return res.json({'bot': false});
    })
}

exports.users_signup = (req, res, next) => {
    if(verifyBot == false){
        return res.status(500).json({
            message: 'bot detected'
        })
    }

    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) { //não retorna null, retorna array vazio
                return res.status(500).json({
                    message: 'email exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        //getting the current timestamp
                        let date = new Date();
                        let timestamp = date.getTime();

                        //creating the document for mongodb
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: xss(req.body.email),
                            password: hash,
                            creationTimestamp: timestamp
                        });

                        //savin document in database
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'user created'
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
        .catch();
}

exports.users_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                else if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id,
                        admin: user[0].admin
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });

                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Auth failed'
                });
            })
        })
        .catch(erro => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.users_delete_user = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.users_delete_all = (req, res, next) => {
    User.deleteMany({}, function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
}