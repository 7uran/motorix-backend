const mongoose = require("mongoose");

const shopCardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
    },
    brand: {
        type: String,
        required: [true, "Brand is required"],
        trim: true,
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    comments: [
        {
            publisher: {
                type: String,
                required: [true, "Publisher is required"],
            },
            content: {
                type: String,
                required: [true, "Content is required"],
            },
            rating: {
                type: Number,
                required: [true, "Rating is required"],
                min: 1,
                max: 5,
            },
        },
    ],
});

const ShopCard = mongoose.model("ShopCard", shopCardSchema);
module.exports = ShopCard;
