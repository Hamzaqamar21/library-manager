import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    name:{type:String , required:true,trim:true},
    bio:{type:String,trim:true,default:""},
    nationality:{type:String, trim:true,default:""},
    birthDate:{type:Date,default:null},

},{timestamps:true});

const Author = mongoose.model("Author", authorSchema);
export default Author;