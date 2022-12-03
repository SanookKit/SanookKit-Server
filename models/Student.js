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
  firstname: { type : String , unique : true },
  surname: { type : String , unique : true },
  sex: String,
  id_card: { type : String , unique : true },
  bag_id:  { type : String , unique : true },
  school: String,
  grade: Number,
  score: String,
  address: Address
});

const StudentModel = mongoose.model('students', studentSchema);

module.exports = StudentModel;