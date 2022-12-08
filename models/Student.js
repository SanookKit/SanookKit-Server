const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Address = new Schema({
    house_no: String,
    road: String,
    district: String,
    subdistrict: String,
    city: String,
    postal_code: String
})

const studentSchema = new Schema({
  firstname: String,
  surname: String,
  sex: String,
  id_card: String,
  bag_id:  { type : String , unique : true },
  school: String,
  grade: Number,
  score: String,
  address: Address
});

const StudentModel = mongoose.model('students', studentSchema);

module.exports = StudentModel;