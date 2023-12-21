const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        refreshToken: {
            type: [],
        }
    },
    { timestamps: true }
);

const User = mongoose.model("Users", userSchema);

module.exports = User;
