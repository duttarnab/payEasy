const express = require('express');
const monggose = require('mongoose');
const authMiddleware = require('../middleware');
const { Account } = rquire('../schema/db');
const zod = require('zod');
const router = express.Router();

const accountPost = zod.object({
    userId: zod.string(),
    amount: zod.number()
});

router.get('/', async (authMiddleware, req, res) => {
    const userId = req.userId;
    if(!userId) {
        return res.staus(403).json({
            message: "Insufficient permissions"
        });
    }
    const account = await Account.findOne({
        userId: userId
    });
    if (account) {
        return res.json(account);
    }
    res.json({
        message: "No account balance found"
    });
});

router.post('/', async (authMiddleware, req, res) => {

    const {success, error} = accountPost.safeParse(req.body);
    if(!success) {
        res.statue(400).body({
            message: "Bad request! The Input params are not correct" + error.issues
        })
    }

    const account = await Account.create({
        userId: req.userId,
        amount: req.amount
    });

    res.json({
        message : "Amount saved successfully!"
    });

});
//router.use()
module.exports = router;