const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

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

const upload = multer({ storage: storage });

const {
    getAllTeams,
    getTeamById,
    createTeam,
    deleteTeam,
    updateTeam,
} = require("../controllers/ourTeamController");
const { ErrorMiddleware } = require("../utils/ErrorHandlers");


router.get("/", getAllTeams);
router.get("/:id", getTeamById);
router.post("/", upload.fields([{ name: "image" }, { name: "slugImg" }]), createTeam); ``
router.delete("/:id", deleteTeam);
router.put("/:id", updateTeam);


router.use(ErrorMiddleware);

module.exports = router;
