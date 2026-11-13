import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title:{type:String , required:true,trim:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:"Author",required:true},
    category:{type:String, required:true,trim:true},
    description:{type:String,trim:true,default:""},
    quantity:{type:Number,required:true,min:0},
    publishedYear:{type:Number,min:1000, max:9999,default:null}
},{timestamps:true});

const Book = mongoose.model("Book", bookSchema);
export default Book;

