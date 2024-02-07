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
        roles: {
            User: {
                type: Number,
                default: 2001,
            },
            Subscriber: Number,
            Admin: Number,
            Developer: Number,
            Editor: Number,
            Author: Number,
        },
        employeeOf: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        verified: {
            type: Boolean,
            default: false,
        },

        verificationCode: {
            code: {
                type: String,
                default: null,
            },
            expiresAt: {
                type: Date,
                default: null,
            },
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
