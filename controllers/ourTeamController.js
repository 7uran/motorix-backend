const teamlist = require("../models/teamModel");
const { ErrorHandler } = require("../utils/ErrorHandlers");

const getAllTeams = async (req, res, next) => {
    try {
        const teams = await teamlist.find();
        if (!teams.length) {
            return next(new ErrorHandler("No teams found", 404));
        }
        res.status(200).json({ success: true, teams });
    } catch (error) {
        next(error);
    }
};

const getTeamById = async (req, res, next) => {
    try {
        const team = await teamlist.findById(req.params.id);
        if (!team) {
            return next(new ErrorHandler("Team not found", 404));
        }
        res.status(200).json({ success: true, team });
    } catch (error) {
        next(new ErrorHandler("Invalid team ID", 400));
    }
};

const createTeam = async (req, res, next) => {
    try {
        const { name, job, skills } = req.body;
        const uploadedFiles = req.files;

        if (!name || !job || !skills) {
            return res.status(400).json({ message: 'Name, job, and skills are required' });
        }


        const image = uploadedFiles?.image ? `/uploads/${uploadedFiles.image[0].filename}` : null;
        const slugImg = uploadedFiles?.slugImg ? `/uploads/${uploadedFiles.slugImg[0].filename}` : null;


        const newTeam = await teamlist.create({
            name,
            job,
            skills,
            image,
            slugImg,
        });

        res.status(201).json({
            success: true,
            data: newTeam,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteTeam = async (req, res, next) => {
    try {
        const team = await teamlist.findByIdAndDelete(req.params.id);
        if (!team) {
            return next(new ErrorHandler("Team not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Team successfully deleted",
        });
    } catch (error) {
        next(new ErrorHandler("Invalid team ID", 400));
    }
};

const updateTeam = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedTeam = await teamlist.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedTeam) {
            return next(new ErrorHandler("Team not found", 404));
        }

        res.status(200).json({
            success: true,
            team: updatedTeam,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllTeams, getTeamById, createTeam, deleteTeam, updateTeam };
