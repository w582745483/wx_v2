// 1. 连接数据库
// 1.1. 引入mongoose
var mongoose=require('mongoose')
// 1.2. 连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/wx_app')
// 1.3. 获取连接对象
const conn=mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected',function(){
    console.log('数据库连接成功')
})
// 2. 定义出对应特定集合的Model 并向外暴露
// 2.1. 字义Schema(描述文档结构)
const userSchema=mongoose.Schema({
    username:{type:String,require:true},
    password:{type:String,require:true},
    email:{type:String,require:true},
    phone:{type:String,require:true}
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel=mongoose.model('user',userSchema)
// 2.3. 向外暴露Model
exports.UserModel=UserModel
