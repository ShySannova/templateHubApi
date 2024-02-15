const templateModel = require("../model/Template");
const { isObjectEmpty } = require("../utils/helpers");

const createTemplate = async (req, res) => {

    try {
        const templateData = req.body;

        if (!templateData) {
            return res.status(400).json({ success: false, message: "Please provide valid data" });
        }
        await templateModel.create(templateData);
        res.status(201).json({ success: true, message: "Your template has been saved" });
    } catch (error) {
        console.error(error);

        if (error.name === 'ValidationError') {
            // Handle validation errors (e.g., required fields missing)
            res.status(400).json({ success: false, message: "Validation error: Please check your data" });
        } else if (error.code === 11000) {
            // Handle duplicate key (e.g., unique constraint violation)
            res.status(409).json({ success: false, message: "Duplicate entry: This template already exists" });
        } else {
            // Handle other unexpected errors
            res.status(500).json({ success: false, message: "Internal Server Error: Please try again later" });
        }
    }
};

const findAllPublishedTemplates = async (req, res) => {
    try {
        const templates = await templateModel.find({ status: "published" }).populate({
            path: 'user',
            select: 'name', // Select field to show by using "name"  //Exclude field by using '-password'
        });
        res.status(200).json({ success: true, templates })
    } catch (error) {
        console.error(error);

        if (error.name === 'CastError') {
            // Handle invalid ObjectId in the request
            res.status(400).json({ success: false, message: "Invalid ObjectId in the request" });
        } else if (error.name === 'ValidationError') {
            // Handle custom schema validation errors
            res.status(400).json({ success: false, message: "Schema validation error: Please check your data" });
        } else if (error.code === 11000) {
            // Handle duplicate key (e.g., unique constraint violation)
            res.status(409).json({ success: false, message: "Duplicate entry: This template already exists" });
        } else if (error.message.includes('timeout')) {
            // Handle timeout-related errors
            res.status(503).json({ success: false, message: "Database operation timed out" });
        } else if (error.name === 'MongoNetworkError') {
            // Handle network-related errors
            res.status(503).json({ success: false, message: "Database connection error" });
        } else {
            // Handle other unexpected errors
            res.status(500).json({ success: false, message: "Internal Server Error: Please try again later" });
        }
    }
};

const findAllTemplates = async (req, res) => {
    try {
        const templates = await templateModel.find().populate({
            path: 'user',
            select: 'name', // Select field to show by using "name"  //Exclude field by using '-password'
        });
        res.status(200).json({ success: true, templates })
    } catch (error) {
        console.error(error);

        if (error.name === 'CastError') {
            // Handle invalid ObjectId in the request
            res.status(400).json({ success: false, message: "Invalid ObjectId in the request" });
        } else if (error.name === 'ValidationError') {
            // Handle custom schema validation errors
            res.status(400).json({ success: false, message: "Schema validation error: Please check your data" });
        } else if (error.code === 11000) {
            // Handle duplicate key (e.g., unique constraint violation)
            res.status(409).json({ success: false, message: "Duplicate entry: This template already exists" });
        } else if (error.message.includes('timeout')) {
            // Handle timeout-related errors
            res.status(503).json({ success: false, message: "Database operation timed out" });
        } else if (error.name === 'MongoNetworkError') {
            // Handle network-related errors
            res.status(503).json({ success: false, message: "Database connection error" });
        } else {
            // Handle other unexpected errors
            res.status(500).json({ success: false, message: "Internal Server Error: Please try again later" });
        }
    }
};


const findUserTemplates = async (req, res) => {
    try {
        const userID = req.params.id;
        const templates = await templateModel.find({ user: userID })
        if (templates.length === 0) {
            return res.status(404).json({ success: false, message: "No Templates Found" })
        }
        res.status(200).json({ success: true, templates })
    } catch (error) {
        console.error(error);

        if (error.name === 'CastError') {
            // Handle invalid ObjectId in the request
            res.status(400).json({ success: false, message: "Invalid ObjectId in the request" });
        } else if (error.name === 'ValidationError') {
            // Handle custom schema validation errors
            res.status(400).json({ success: false, message: "Schema validation error: Please check your data" });
        } else if (error.code === 11000) {
            // Handle duplicate key (e.g., unique constraint violation)
            res.status(409).json({ success: false, message: "Duplicate entry: This template already exists" });
        } else if (error.message.includes('timeout')) {
            // Handle timeout-related errors
            res.status(503).json({ success: false, message: "Database operation timed out" });
        } else if (error.name === 'MongoNetworkError') {
            // Handle network-related errors
            res.status(503).json({ success: false, message: "Database connection error" });
        } else {
            // Handle other unexpected errors
            res.status(500).json({ success: false, message: "Internal Server Error: Please try again later" });
        }
    }
};


const findOneTemplate = async (req, res) => {
    try {
        const templateID = req.params.id;
        if (!templateID) {
            return res.status(400).json({ success: false, message: "Please provide valid id" });
        }
        const data = await templateModel.findById({ _id: templateID });

        if (!data) {
            // Handle case where template with the specified ID is not found
            res.status(404).json({ success: false, message: "Template not found" });
        } else {
            res.status(200).json({ success: true, template: data })
        }
    } catch (error) {
        console.error(error);

        if (error.name === 'CastError') {
            // Handle invalid ObjectId in the request
            res.status(400).json({ success: false, message: "Invalid ObjectId in the request" });
        } else if (error.message.includes('timeout')) {
            // Handle timeout-related errors
            res.status(503).json({ success: false, message: "Database operation timed out" });
        } else if (error.name === 'MongoNetworkError') {
            // Handle network-related errors
            res.status(503).json({ success: false, message: "Database connection error" });
        } else {
            // Handle other unexpected errors
            res.status(500).json({ success: false, message: "Internal Server Error: Please try again later" });
        }
    }
};


const updateTemplate = async (req, res) => {
    try {
        const templateID = req.params.id;
        const templateData = req.body;
        const empty = isObjectEmpty(templateData)
        if (!templateID || empty) {
            return res.status(400).json({ success: false, message: "Please provide valid id or data" });
        }
        const data = await templateModel.updateOne({ _id: templateID }, templateData);

        if (data.modifiedCount === 1) {
            // The template was successfully updated
            res.status(200).json({ success: true, message: "Template updated successfully" });
        } else if (data.n === 0) {
            // Handle case where template with the specified ID is not found
            res.status(404).json({ success: false, message: "Template not found" });
        } else {
            // Handle other unexpected cases
            res.status(500).json({ success: false, message: "Internal Server Error: Please try again later 1" });
        }
    } catch (error) {
        console.error(error);

        if (error.name === 'CastError') {
            // Handle invalid ObjectId in the request
            res.status(400).json({ success: false, message: "Invalid ObjectId in the request" });
        } else if (error.message.includes('timeout')) {
            // Handle timeout-related errors
            res.status(503).json({ success: false, message: "Database operation timed out" });
        } else if (error.name === 'MongoNetworkError') {
            // Handle network-related errors
            res.status(503).json({ success: false, message: "Database connection error" });
        } else {
            // Handle other unexpected errors
            res.status(500).json({ success: false, message: "Internal Server Error: Please try again later 2" });
        }
    }
};


const deleteTemplate = async (req, res) => {

    try {
        const templateID = req.params.id;
        const data = await templateModel.deleteOne({ _id: templateID });

        if (data.deletedCount === 1) {
            // The template was successfully deleted
            res.status(200).json({ success: true, message: "Template deleted successfully" });
        } else if (data.deletedCount === 0) {
            // Handle case where template with the specified ID is not found
            res.status(404).json({ success: false, message: "Template not found" });
        } else {
            // Handle other unexpected cases
            res.status(500).json({ success: false, message: "Internal Server Error: Please try again later" });
        }
    } catch (error) {
        console.error(error);

        if (error.name === 'CastError') {
            // Handle invalid ObjectId in the request
            res.status(400).json({ success: false, message: "Invalid ObjectId in the request" });
        } else if (error.message.includes('timeout')) {
            // Handle timeout-related errors
            res.status(503).json({ success: false, message: "Database operation timed out" });
        } else if (error.name === 'MongoNetworkError') {
            // Handle network-related errors
            res.status(503).json({ success: false, message: "Database connection error" });
        } else {
            // Handle other unexpected errors
            res.status(500).json({ success: false, message: "Internal Server Error: Please try again later" });
        }
    }
};


module.exports = { createTemplate, findAllTemplates, findAllPublishedTemplates, findUserTemplates, findOneTemplate, updateTemplate, deleteTemplate };
