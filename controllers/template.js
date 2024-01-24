const templateModel = require("../model/Template");

const createTemplate = async (req, res) => {
    try {
        let templateData = req.body
        templateModel.create(templateData)
            .then(() => {
                res.send({ success: true, message: "your template has saved" })
            })
            .catch(() => {
                res.send({ success: false, message: "please try again later" })
            })
    }
    catch (err) {
        res.send({ success: false, message: "please try again later" })
    }


};

const findAllTemplates = async (req, res) => {
    try {
        const templates = await templateModel.find().populate({
            path: 'user_id',
            select: 'name', // Select field to show by using "name"  //Exclude field by using '-password'
        });
        res.send(templates);
    }
    catch (err) {
        console.log(err)
        res.send({ success: false, message: "please try again later" })
    }

};

const findOneTemplate = async (req, res) => {
    let templateID = req.params.id;
    templateModel.findById({ _id: templateID })
        .then((data) => {
            res.send(data)
        })
        .catch(() => {
            res.status(404).json({ success: false, message: "please try again later" })
        })

};

const updateTemplate = async (req, res) => {
    let templateID = req.params.id;
    let templateData = req.body
    templateModel.updateOne({ _id: templateID }, templateData)
        .then((data) => {
            res.send(data)
        })
        .catch(() => {
            res.send({ success: false, message: "please try again later" })
        })

};

const deleteTemplate = async (req, res) => {
    let templateID = req.params.id;

    templateModel.deleteOne({ _id: templateID })
        .then(() => {
            res.send({ success: true, message: "template data has been deleted" })
        })
        .catch((err) => {
            res.send({ success: false, message: "please try again later" })
        })

};

module.exports = { createTemplate, findAllTemplates, findOneTemplate, updateTemplate, deleteTemplate };
