const router = require('express').Router();
const User = require('../models/User');

// get all user
router.get('/all', async (req, res) => {
    try {
        const users = await User.find({});

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// get a user
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;

    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username });

        !user && res.status(400).json({ message: 'User not found' });

        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
