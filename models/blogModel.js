const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
    },
    content: {
        type: String,
        required: [true, "Comment content is required"],
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
    },
    image: {
        type: String,
    },
    slugImgs: {
        img1: {
            type: String,
        },
        img2: {
            type: String,
        },
        img3: {
            type: String,
        },
    },
    comments: {
        type: [commentSchema],
        default: [],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Blog", blogSchema);
