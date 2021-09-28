const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');

/**
 * @route GET /api/auth/logged
 * @desc check if user logged in
 * @access public
 */
router.get('/logged', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        !user &&
            res
                .status(400)
                .json({ success: false, message: 'User not found.' });

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Interal server error',
        });
    }
});

/**
 * @route POST /api/auth/register
 * @body username, email, password
 * @decs register user
 * @access public
 */
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // validate
    (!email || !password) &&
        res.status(400).json({
            success: false,
            message: 'Missing username and/or password',
        });

    try {
        const existedUser = await User.findOne({ email });
        existedUser &&
            res
                .status(400)
                .json({ success: false, message: 'User already exists.' });

        // hash password
        const salt = await bcrypt.genSalt(+process.env.SALT_ROUNDS || 10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        // return token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.ACCESS_TOKEN_SECRET
        );
        res.status(200).json({
            success: true,
            message: 'User created successfully',
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Interal server error',
        });
    }
});

/**
 * @route POST /api/auth/login
 * @body email, password
 * @decs login user
 * @access public
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
        res.status(400).json({
            success: false,
            message: 'Missing username and/or password',
        });

    try {
        // check user exists or none
        const user = await User.findOne({ email });
        if (!user)
            res.status(404).json({
                success: false,
                message: 'Incorrect username or password.',
            });

        // check matched password
        const matched = await bcrypt.compare(password, user.password);
        if (!matched)
            res.status(404).json({
                success: false,
                message: 'Incorrect username or password.',
            });

        // return token
        const token = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET
        );
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Interal server error',
        });
    }
});

module.exports = router;
