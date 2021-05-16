const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};
const upload = multer({
    storage: storage, 
    limits:{
        fileSize: 1024*1024*5,
    },
    fileFilter: fileFilter
});

const Image = require('../models/image');

router.get('/', (req, res, next) =>{
    Image.find()
    .select(" link ")
    .exec()
    .then(doc =>{
        console.log(doc);
        res.status(200).json({
            msg: "Success",
            data: doc
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', upload.single('image'), (req, res, next)=>{

    console.log(req.file);
    const image = new Image({
        _id: new mongoose.Types.ObjectId(),
        link: req.file.path.replace("\\","/")
    });
    image.save().then(result=>{
        console.log(result);
        res.status(200).json({
            item: image
        });
    }).catch(err => {
        console.log(err);
        res.status().json({
            error: err
        }); 
    
    });
});

router.delete('/', (req, res, next)=>{
    Image.remove().exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({result})
    }).catch(err => {
            console.log(err);
            res.status().json({
                error: err
            });
        });
});

module.exports = router;