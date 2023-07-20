const messageModel=require("../model/messageModal")
const chatModal=require("../model/chatModal")

const createChat=async(req,res)=>{
try {
    const newChat=new chatModal({
        members:[req.body.senderId,req.body.receiverId]
    })
 const result = await newChat.save()
 res.status(200).json(result)
} catch (error) {
    console.log(error);
    res.status(500).json(error)
}
}
const userChat=async(req,res)=>{
try {
    const chat= await chatModal.find({members:{$in:[req.params.userId]}})
    res.status(200).json(chat)

} catch (error) {
    console.log(error);
    res.status(500).json(error)

}
}
const findChat=async(req,res)=>{
try {
    const chat= await chatModal.find({members:{$all:[req.params.firstId,req.params.secondId]}})
    res.status(200).json(chat)
} catch (error) {
    console.log(error);
    res.status(500).json(error)
}
}
module.exports={
    createChat,
    userChat,
    findChat
}