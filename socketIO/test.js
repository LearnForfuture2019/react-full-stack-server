module.exports = function (server) {
    //得到IO对象
    const io  =  require('socket.io')(server)

    //绑定监听事件(回调函数参数是socket对象)
    io.on('connection',function (socket) {
        console.log('socketio connected')
        //绑定sendMessage监听，获取客户端数据
        socket.on('sendMessage',function (data) {
            console.log('服务器收到客户端发送的消息：'+data)
            //服务器向客户端发送消息
            socket.emit('receiveMessage',data.name+'_'+data.date)
            console.log('服务端向客户端发送的消息：',data.name+'_'+data.date)

        })
    })
}
