const mongoose = require("mongoose");

const TemplateSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        template_name: {
            type: String,
            required: true,
        },
        main_image: {
            type: String,
            required: true,
        },
        stacks: {
            type: [],
            required: true,
        },
        template_url: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        images: {
            type: [],
        }

    },
    { timestamps: true }
);

const Template = mongoose.model("Template", TemplateSchema);

module.exports = Template;
