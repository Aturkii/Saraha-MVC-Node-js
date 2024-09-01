import { model, Schema } from "mongoose";

const messageSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
})


const Message = model("Message",messageSchema)

export default Message