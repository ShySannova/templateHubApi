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
            type: [{
                token: {
                    type: String,
                    required: true,
                },
                expiresAt: {
                    type: Date,
                    required: true,
                },
            }],
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
