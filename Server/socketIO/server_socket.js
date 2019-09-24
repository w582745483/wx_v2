module.exports=function(server){
    const io=require('socket.io').listen(server)
    io.on('connect',function(socket){
        console.log('有客户端连接上服务器')
        socket.on('message',function(data){
            console.log('服务器接收到消息',data)
           
        })
        socket.send('欢迎！')
    })
}