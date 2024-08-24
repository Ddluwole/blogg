const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

//Create a new post
router.post('/blogs', auth, async(req, res) => {
    const {title, content, author} = req.body;
    try {
        const blog = new Blog({title, content, author});
        await blog.save();
        res.status(201).send(blog);
    } catch(error) {
        console.error('Error creating blog post:', error.message);
        res.status(500).send('An error occured while creating the blog post');
    }
});


//Get all Blog posts
router.get('/blogs', async(req, res) => {
    try {
        const blogs = await Blog.find();
        return res.status(201).send(blogs);
    } catch(error) {
        console.error('Error fetching blog posts:', error.message);
        res.status(500).send('An error occured while fetching blog posts');

    }
});

// Get Blog Posts by ID
router.get('/blogs/:id', auth, async(req, res) => {
    const {id} = req.params;
    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).send('Blog post cannot be found');
        };
        res.status(201).send(blog);
    } catch (error) {
        console.error('Error fetching blog post:', error.message);
        return res.status(500).send("An error occured while fetching blog post");
    }
});

// Update Blog post
router.put('/blogs/:id', auth, async(req, res) => {
    const {id} = req.params;
    const { title, author, content}= req.body;
    try {
        const blog = await Blog.findByIdAndUpdate(id,
            {title, author, content},
            {new:true, runValidators:true}
        );
        if (!blog) {
            return res.status(404).send('Blog post cannot be found');
        };
        res.status(201).send(blog);
    } catch (error) {
        console.error("Error fetching blog post:", error.message);
        res.status(500).send('An error occured while updating blog post.');
    }
});

// Delete a blog post by ID
router.delete('/blogs/:id',auth,  async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).send('Blog post not found');
        }
        res.status(200).send('Blog post deleted');
    } catch (error) {
        console.error('Error deleting blog post:', error.message);
        res.status(500).send('An error occurred while deleting the blog post.');
    }
});

module.exports = router;