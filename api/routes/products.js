const express = require('express');
const router = express.Router();
const multer = require('multer');

//import middlewares
const checkAuth = require('../middlewares/check-auth')

//import controlers
const ProductsController = require('../controllers/products');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');3
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

const upload = multer ({storage: storage, limits: {
    fileSize: 1024 * 1024 * 5 //5mb
}});


// Handle incoming requests 
router.get('/', ProductsController.products_get_all);

router.get('/:productId', ProductsController.products_get_product);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;