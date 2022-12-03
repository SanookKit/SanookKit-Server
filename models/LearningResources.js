const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Activity = new Schema({
    title: String,
    description: String,
    qr_name: String,
    imgs_name: [String]
})

const learningResource = new Schema({
    title: String,
    grade: Number,
    learning_type: String,
    description: String,
    img_name: String,
    pdf_name: String,
    teacher_des: String,
    parent_des: String,
    refer_link: String,
    media_type: String,
    activities: [Activity]
});

const StudentModel = mongoose.model('learning_resources', learningResource);

module.exports = StudentModel;