const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { deleteComment } = require("../controllers/blogController");
const { createBlog, updateBlog, getAllBlogs, getBlogById, deleteBlog, addComment, updateBlogImage } = require("../controllers/blogController");

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
    { name: 'slugImgs.img1' },
    { name: 'slugImgs.img2' },
    { name: 'slugImgs.img3' },
]);

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", upload, createBlog);
router.post("/:id/comments", addComment);
router.put("/:id", upload, updateBlog);
router.delete("/:id", deleteBlog);
router.delete("/:blogId/comments/:commentId", deleteComment);
router.put("/:id/image", upload, updateBlogImage);


const { ErrorMiddleware } = require("../utils/ErrorHandlers");
router.use(ErrorMiddleware);

module.exports = router;
