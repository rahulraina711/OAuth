const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const User = require('./models');
const jwt = require('jsonwebtoken');


const app = express(); // instanciating express() in app variable
dotenv.config();       // to use .env variables

const PORT = process.env.PORT;      // retrieving port from .env variable PORT

app.use(morgan('combined'));                    // server requests logger logger

const corsOptions ={
    origin:['http://localhost:3000','http://localhost:300'], 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(express.json());                        // json body parser from expesss
app.use(express.urlencoded({extended: true}));  // urlencoded parser for rich text
app.use(cors(corsOptions));
// setting the port up for listening
app.listen(PORT, (err, data)=>{
    if(err) return console.log(err);
    console.log(`Server up and running at Port : ${PORT}`);
})

// connecting to mongoDB atlas cluster to store and retrieve data
mongoose.connect(process.env.MDB_CONNECT_STRING,{ useNewUrlParser: true , useUnifiedTopology: true}, (err, data)=>{
    if(err) return console.log(err);
    console.log("-------------Connected to Atlas CLuster-------------")
});

// setting up routes for the server here //
// domain route
app.get('/', (req, res)=>{
    res.status(200).json({message: "Every thing is working FINE !"});
});

// user routes
app.post('/signup',async(req, res)=>{
    try {
        //(a password and email validation can be added here as well)
        const name = req.body.name;
        const email = req.body.email;

        // unique email
        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            return res.status(400).json({
                message: "user already exists"
            })
        }
        const user = new User({
            name,
            email
        })
        const savedUser = await user.save();
        res.status(201).json(savedUser);

    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
})

app.post('/signin',async(req, res)=>{
    try {

        const token = req.body.token;
        //console.log(token);

        const decoded = jwt.decode(token);
        const existingUser = await User.findOne({email:decoded.email})
        //console.log(decoded);
        existingUser ? res.status(200).json({user: {
            name: decoded.name,
            email:decoded.email,
            picture:decoded.picture
        }}) : res.status(404).json({message: "User Not Found"});
        


    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
})