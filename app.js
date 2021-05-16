const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const imageRoutes = require('./api/routes/images');

mongoose.connect('mongodb+srv://admin_khaled:'+ process.env.CLUSTER_PW +'@cluster0.eoccn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
useNewUrlParser : true,
useUnifiedTopology: true
});

app.use(morgan('dev'));
app.use('/uploads/', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method == 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", "POST, GET");
        res.status(200).json({});
    }
    next();
});



app.use('/images', imageRoutes);


app.use((req, res, next)=>{
    const err = new Error('Not Found');
    err.status= 404;
    next(err);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});


module.exports = app;