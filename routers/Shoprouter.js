const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
    createShopCard,
    updateShopCard,
    getAllShopCards,
    getShopCardById,
    deleteShopCard,
    addComment,
    deleteComment,
} = require("../controllers/shopController");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${file.fieldname}${ext}`;
        cb(null, filename);
    },
});

const upload = multer({
    storage: storage,
}).fields([
    { name: 'image' },
]);


router.get("/", getAllShopCards);
router.get("/:id", getShopCardById);
router.post("/", upload, createShopCard);
router.patch("/:id", upload, updateShopCard);
router.delete("/:id", deleteShopCard);


router.post('/:id/comments', addComment);
router.delete("/:productId/comments/:commentId", deleteComment);

const { ErrorMiddleware } = require("../utils/ErrorHandlers");
router.use(ErrorMiddleware);

module.exports = router;
