 const mongoose =require("mongoose")

 const chatSchema=new mongoose.Schema({
    members:{
        type:Array
    }
 },{
    timestamps:true
 })

 const chatModal=mongoose.model("Chat",chatSchema)
 module.exports=chatModal