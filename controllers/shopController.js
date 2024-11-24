const ShopCard = require("../models/shopCardModel");
const fs = require("fs");
const path = require("path");

const createShopCard = async (req, res) => {
    try {
        const { name, description, category, brand, rating, price, comments = [] } = req.body;
        const image = req.files?.image?.[0]?.path || null;

        if (!name || !description || !category || !brand || !rating || !price) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        const newShopCard = new ShopCard({
            name,
            description,
            category,
            brand,
            rating,
            price,
            comments,
            image,
        });

        const savedShopCard = await newShopCard.save();
        res.status(201).json(savedShopCard);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const getAllShopCards = async (req, res) => {
    try {
        const { offset = 0, limit = 10 } = req.query;
        const totalCount = await ShopCard.countDocuments();

        const shopCards = await ShopCard.find()
            .skip(Number(offset))
            .limit(Number(limit));

        res.status(200).json({
            totalCount,
            shopCards,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getShopCardById = async (req, res) => {
    try {
        const { id } = req.params;
        const shopCard = await ShopCard.findById(id);

        if (!shopCard) {
            return res.status(404).json({ message: "Shop card not found" });
        }

        res.status(200).json(shopCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const updateShopCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, brand, rating, price, comments = [] } = req.body;
        const image = req.files?.image?.[0]?.path || null;


        if (!name || !description || !category || !brand || !rating || !price) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        const updatedData = {
            name,
            description,
            category,
            brand,
            rating,
            price,
            comments,
            ...(image && { image }),
        };

        const updatedShopCard = await ShopCard.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedShopCard) {
            return res.status(404).json({ message: "Shop card not found" });
        }

        res.status(200).json(updatedShopCard);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const deleteShopCard = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedShopCard = await ShopCard.findByIdAndDelete(id);

        if (!deletedShopCard) {
            return res.status(404).json({ message: "Shop card not found" });
        }

        if (deletedShopCard.image) {
            const imagePath = path.join(__dirname, '../uploads', deletedShopCard.image);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting image:", err);
                } else {
                    console.log("Image deleted successfully");
                }
            });
        }

        res.status(200).json({ message: "Shop card deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { publisher, content, rating } = req.body;

        if (!publisher || !content || !rating) {
            return res.status(400).json({ message: "Publisher, content, and rating are required" });
        }

        const shopCard = await ShopCard.findById(id);
        if (!shopCard) {
            return res.status(404).json({ message: "Shop card not found" });
        }

        const newComment = {
            publisher,
            content,
            rating,
            date: new Date(),
        };

        shopCard.comments.push(newComment);
        await shopCard.save();

        res.status(201).json(shopCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { productId, commentId } = req.params;

       
        const shopCard = await ShopCard.findById(productId);
        if (!shopCard) {
            return res.status(404).json({ message: "Shop card not found" });
        }

   
        const commentIndex = shopCard.comments.findIndex(comment => comment._id.toString() === commentId);

       
        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

    
        shopCard.comments.splice(commentIndex, 1);

     
        await shopCard.save();

     
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Failed to delete comment", error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createShopCard,
    getAllShopCards,
    getShopCardById,
    updateShopCard,
    deleteShopCard,
    addComment,
    deleteComment,
};
