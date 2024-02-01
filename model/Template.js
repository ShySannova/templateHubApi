const mongoose = require("mongoose");

const TemplateSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        badge: {
            type: String,
        },
        tech: {
            type: [String],
        },
        responsive: {
            type: Boolean,
            default: false
        },
        image: {
            type: String,
        },
        status: {
            type: String,
            default: "draft",
        },
        stacks: {
            type: [String],
        },
        url: {
            type: String,
            unique: true,
        },
        metaTitle: {
            type: String,
        },
        metaDescription: {
            type: String,
        },
        keywords: {
            type: [String],
        },
        description: {
            type: String,
        },
        features: {
            type: [String],
        },
        price: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        images: {
            type: [],
        },
        sourceCode: {
            type: {
                frotend: String,
                backend: String
            },
        },
    },
    { timestamps: true }
);

const Template = mongoose.model("Template", TemplateSchema);

module.exports = Template;
