const express =require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const dotenv = require("dotenv"); // dev dependency


dotenv.config(); // for .env variable (useless in heroku)

// connecting to mongoDB
mongoose.connect(process.env.MDB_CONNECT_STRING, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify: true
},(err)=>{
    if (err) return console.error(err);
    console.log("----Got the API key and the Secret key----\n:::::Connected to MongoDB:::::");
});

//setting up middlewares

app.use(morgan('dev')); // dev dependency
app.use(express.urlencoded({extended:true})); // body parser for json text
app.use(express.json());
// handling cors errors
const corsOptions ={
    origin:['https://insta-like.netlify.app','http://localhost:3000'], 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use('/uploads',express.static('uploads')); // adding static folder publically accesible

// default domain response
app.get("/",(req, res, next)=>{
    res.status(200).json({message:"Everything is working fine here"})
})

// routes
const postRoute = require('./api/routes/posts');
app.use('/posts', postRoute);

const userRoute = require('./api/routes/user');
app.use('/user', userRoute);

const commentRoute = require('./api/routes/comments');
const auth = require('./api/middleware/auth');
app.use('/comments', commentRoute);

app.get('/test', auth,(req, res)=>{
    const user= req.userData;
    res.status(200).json({message: "user Received", user: user});
})



module.exports = app