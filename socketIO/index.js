module.exports = function (server) {
    //引入Model对象
    const {ChatModel} = require('../db/model')
    //引入socketio
    const io = require('socket.io')(server)
    //监听连接
    io.on('connection',(socket)=>{
        console.log('有一个浏览器连接上了~~~')
        //接收浏览器发送的数据
        socket.on('sendMessage',function (data) {
            /*
            * 我理解的是只有收到服务器发送来的消息之后，才知道与服务器连接上了，
            * 因此如果需要向服务器发送消息，那么应该在接收消息的回调函数里
            * */
            console.log('浏览器向服务器发送的数据：',data)
            const {from,to,content} = data
            //处理接收到的数据
            const chat_id = [from,to].sort().join('_')
            const create_time = Date.now()
            new ChatModel({from,to,chat_id,content,create_time}).save(function (err,chatMsg) {
                //保存完成之后，向客户端发送消息
                io.emit('receiveMessage',chatMsg) //全局发送，所以连接的客户端都可以收到消息
                console.log('向所有连接的客户端发送消息',chatMsg)
            })
        })
    })
}
