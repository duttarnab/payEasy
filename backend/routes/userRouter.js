const express = require('express');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config');
const { User } = require('../schema/db');
const userRouter = express.Router();

const signupBody = zod.object({
    username: zod.string().min(3).max(15),
    email: zod.email(),
    password: zod.string().min(3).max(15),
    firstName: zod.string().min(3).max(15),
    lastName: zod.string().min(3).max(15),
});

const signinBody = zod.object({
    username: zod.string(),
    password: zod.string()
});

userRouter.post('/signup', async (req, res) => {

    const { success, error } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "User registered Failed due to incorrect inputs!" + JSON.stringify(error.issues)
        });
    }

    const userExist = await User.findOne({
        username: req.body.username
    });

    if (userExist) {
        return res.status(411).json({
            message: "User with same username already exist!" + JSON.stringify(error.issues)
        });
    }

    const cryptedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(req.body.password, 5, function (err, hash) {
            if (err) {
                reject(err);
            }
            resolve(hash);
        })
    });

    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: cryptedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });
    const userId = user._id;
    const responseJWT = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        message: "User registered successfully!",
        token: responseJWT
    });
});

userRouter.post('/signin', async (req, res) => {
    const { success, error } = signinBody.safeParse(req.body);

    if (!success) {
        return res.json({
            message: 'Error due to incorrect inputs!' + JSON.stringify(error.issues)
        });
    }

    const user = await User.findOne({
        username: req.body.username
    });

    const passwordMatched = await new Promise((resolve, reject) => {
        bcrypt.compare(req.body.password, user.password, function (err, result) {
            if(err) {
                reject(err);
            }
            resolve(result);
        })
    });
    if(!passwordMatched) {
        return res.json({
            message: 'Incorrect username or password'
        });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET)

    if (user) {
        return res.json({
            message: "User signed-in successfully",
            token: token
        });
    }
    return res.json({
        message: 'Error due to incorrect inputs!' + JSON.stringify(error.issues)
    });
});



module.exports = userRouter;