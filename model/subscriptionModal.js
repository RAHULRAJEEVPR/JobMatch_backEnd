const mongoose =require("mongoose")

const subscriptionSchema=new mongoose.Schema({
    empId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    pack:{
        type:String,
        required:true
    },
    orderId:{
        type:String,
        required:true
    }
},{
    timestamps:true
 })

 const subscriptionModal=mongoose.model("subscription",subscriptionSchema)
 module.exports=subscriptionModal