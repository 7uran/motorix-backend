const Blog = require("../models/blogModel");

const createBlog = async (req, res) => {
    try {
        const { title, content, comments = [] } = req.body;
        const image = req.files?.image?.[0]?.path || null;
        const slugImgs = {
            img1: req.files?.['slugImgs.img1']?.[0]?.path || null,
            img2: req.files?.['slugImgs.img2']?.[0]?.path || null,
            img3: req.files?.['slugImgs.img3']?.[0]?.path || null,
        };

        const newBlog = new Blog({ title, content, image, slugImgs, comments });
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const { offset = 0, limit = 10 } = req.query;
        const totalCount = await Blog.countDocuments();


        const blogs = await Blog.find()
            .skip(Number(offset))
            .limit(Number(limit));

        res.status(200).json({
            totalCount,
            blogs,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const image = req.files?.image?.[0]?.path || null;
        const slugImgs = {
            img1: req.files?.['slugImgs.img1']?.[0]?.path || null,
            img2: req.files?.['slugImgs.img2']?.[0]?.path || null,
            img3: req.files?.['slugImgs.img3']?.[0]?.path || null,
        };

        const updatedData = {
            title,
            content,
            ...(image && { image }),
            ...(slugImgs.img1 || slugImgs.img2 || slugImgs.img3 ? { slugImgs } : {}),
        };

        const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const fs = require('fs');
const path = require('path');
const updateBlogImage = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const newImagePath = req.files?.image?.[0]?.path || null;

        if (!newImagePath) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        if (blog.image) {
            const oldImagePath = path.join(__dirname, "../", blog.image);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Error deleting old image:", err);
            });
        }

        blog.image = newImagePath;
        await blog.save();

        res.status(200).json({ message: "Image updated successfully", blog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }


        if (deletedBlog.image) {
            const imagePath = path.join(__dirname, '../uploads', deletedBlog.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error deleting image:", err);
            });
        }


        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, content } = req.body;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }


        const newComment = {
            username,
            content,
            date: new Date().toISOString(),
        };


        blog.comments.push(newComment);


        const updatedBlog = await blog.save();

        res.status(201).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { blogId, commentId } = req.params;


        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }


        const commentIndex = blog.comments.findIndex(comment => comment._id.toString() === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }


        blog.comments.splice(commentIndex, 1);


        const updatedBlog = await blog.save();

        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    addComment,
    deleteComment,
    updateBlogImage
};
