const router = require('express').Router();
const Post = require('../models/Post');
const { verifyToken } = require('../middleware/auth');

/**
 * @route GET /api/posts
 * @decs get all posts
 * @access private
 */
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.userId }).populate('user', [
            'username',
            'profilePicture',
        ]);

        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

/**
 * @route POST /api/posts
 * @body title, description, url, status, user
 * @decs create new post
 * @access private
 */
router.post('/', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;
    !title &&
        res.status(400).json({ success: false, message: 'title is required' });

    try {
        const newPost = new Post({
            title,
            description,
            url: url.startsWith('https://') ? url : `https://${url}`,
            status: status || 0,
            user: req.userId,
        });
        await newPost.save();

        res.status(200).json({
            success: true,
            message: 'Post created successfully',
            post: newPost,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

/**
 * @route PUT /api/posts/:id
 * @body title, description, url, status, user
 * @decs update post
 * @access private
 */
router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;
    !title &&
        res.status(400).json({ success: false, message: 'title is required' });

    try {
        let updatedPost = {
            title,
            description: description || '',
            url: (url.startsWith('https://') ? url : `https://${url}`) || '',
            status: status || 0,
        };
        const updatedCondition = { _id: req.params.id, user: req.userId };

        updatedPost = await Post.findOneAndUpdate(
            updatedCondition,
            updatedPost,
            { new: true }
        );

        // user not authorised to update post or post not found
        if (!updatedPost)
            res.status(401).json({
                success: false,
                message: 'Post not found or user not authorised',
            });

        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            post: updatedPost,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

/**
 * @route DELETE /api/posts/:id
 * @decs delete post
 * @access private
 */
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deletedCondition = { _id: req.params.id, user: req.userId };
        const deletedPost = await Post.findOneAndDelete(deletedCondition);

        // user not authorised to update post or post not found
        if (!deletedPost)
            res.status(401).json({
                success: false,
                message: 'Post not found or user not authorised',
            });

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
            post: deletedPost,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

module.exports = router;
