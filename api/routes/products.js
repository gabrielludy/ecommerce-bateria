const express = require('express');
const router = express.Router();
const multer = require('multer');

//import middlewares
const checkAuth = require('../middlewares/check-auth');
const checkAuthAdmin = require('../middlewares/check-auth-admin');

//import controlers
const ProductsController = require('../controllers/products');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject file 
    if (file.mimetype === 'image/jpeg' || 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer ({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 55 //5mb
    },
    fileFilter: fileFilter
});


// Handle incoming requests 
router.get('/', ProductsController.products_get_all);

router.get('/:productId', ProductsController.products_get_product);

router.post('/', checkAuthAdmin, upload.single('productImage'), ProductsController.products_create_product);

router.patch('/:productId', checkAuthAdmin, ProductsController.products_update_product);

router.delete('/:productId', checkAuthAdmin, ProductsController.products_delete_product);

module.exports = router;