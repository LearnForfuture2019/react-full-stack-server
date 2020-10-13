
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/boss',{useNewUrlParser: true,useUnifiedTopology: true})
const conn = mongoose.connection
conn.once('open',function () {
    console.log('数据库已连接')
})

//定义Schema对象
const userSchema = mongoose.Schema({
    username:{type:String,required:true},
    password:{type: String,required: true},
    type:{type:String,required:true},
    info:{type:String},//个人或职位简介
    salary:{type:String},//薪水
    header:{type:String},//头像
    post:{type:String},//职位
    company:{type:String} //公司名称
})
//定义Model
const UserModel = mongoose.model('users',userSchema)
//暴露UserModel
exports.UserModel = UserModel

//定义聊天信息Schema对象
const chatSchema = mongoose.Schema({
    to:{type:String,required:true},//这是聊天信息发送用户的id
    from:{type:String,required:true},//这是聊天信息接收用户的id
    chat_id:{type:String,required:true},//聊天信息的id，from和to组成的字符串
    content:{type:String,required:true},//聊天内容
    create_time:{type:String,required:true},//创建时间
    read:{type:Boolean,default:false}//标识是否已读
})
//定义Model
const ChatModel = mongoose.model('chats',chatSchema)
//暴露Model
exports.ChatModel = ChatModel
