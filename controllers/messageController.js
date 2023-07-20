const messageModel=require("../model/messageModal")

const addMessage=async(req,res)=>{
    try {
      const {chatId,senderId,text}=req.body  
      const message=new messageModel({
        chatId,
        senderId,
        text
      })
      const result=await message.save()
      if(result){
        return res.status(200).json(result)
      }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}
const getMessages=async(req,res)=>{
    try {
        const {chatId}=req.params
        const result=await messageModel.find({chatId})
        if(result){
            return res.status(200).json(result)
          }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

module.exports={
    addMessage,
    getMessages
}