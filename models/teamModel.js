const mongoose = require("mongoose");
const slugify = require("slugify");

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    job: {
        type: String,
        required: [true, "Job is required"],
        trim: true,
    },
    image: {
        type: String,
    },
    slugImg: {
        type: String,
    },
    skills: {
        expertise: {
            type: Number,
            required: [true, "Expertise is required"],
        },
        efficiency: {
            type: Number,
            required: [true, "Efficiency is required"],
        },
        proficiency: {
            type: Number,
            required: [true, "Proficiency is required"],
        },
    },
}, {
    timestamps: true,
});


teamSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
