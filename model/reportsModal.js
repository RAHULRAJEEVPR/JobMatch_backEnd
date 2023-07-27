const mongoose =require("mongoose")
const reportSchma=mongoose.Schema({
postId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
    required: true,
},reportedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
},
reason:{
    type:String,
    required:true
}
})
const reportModal=mongoose.model("reports",reportSchma)

module.exports=reportModal