const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cliImgAssetSchema = new Schema({
    ori_name: String,
    name: { type : String , unique : true },
    file_type: String,
    img_section: String,
    school: String
});

const cliImgAssetModel = mongoose.model('cli_img_assets', cliImgAssetSchema);

module.exports = cliImgAssetModel;