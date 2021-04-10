const User = require('../models/user_model')
const jwt = require('jsonwebtoken');
const Product = require('../models/post_model');

exports.sign_in = async (req, res, next) => {
    try {
        //(a password and email validation can be added here as well)
        const googleToken = req.headers.authorization;
        // console.log(googleToken);
        const googleContent = jwt.decode(googleToken);
        const {
            name,
            email,
            picture,
        } = googleContent;
        //console.log(name, email,  picture);


        // unique email
        const existingUser = await User.findOne({
            email
        });
        console.log("Existing User",existingUser);
        if (existingUser) {
            const token = jwt.sign({
                userId: existingUser._id
            }, process.env.JWT_KEY, {
                expiresIn: "1h"
            })
            return res.status(201).json({authToken: token, user: existingUser})
        }
        else{
            const user = new User({
                name,
                email,
                profilePic: picture
            })
            const savedUser = await user.save();
            //console.log("Saved User",savedUser);
            const newToken = jwt.sign({
                userId: savedUser._id
            }, process.env.JWT_KEY, {
                expiresIn: "1h"
            })
            return res.status(201).json({authToken: newToken, user: savedUser});
        }

    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
}


exports.get_user_posts = (req, res, next) => {
    let email = req.query.email;
    Product.find({
            email: email
        }).exec()
        .then(docs => {
            //console.log("displaying all documents")
            res.status(200).json(docs);

        })
        .catch((err) => {
            console.log(err)
        });

}

exports.get_user = async function(req, res, next) {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.status(200).json(user);
}