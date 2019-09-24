var express = require('express');
const md5=require('blueimp-md5')
const filter={password:0}//过滤密码
var router = express.Router();
const {UserModel}=require('../db/db.models')
router.all('/register',(req,resp)=>{
  const {username,password,email,phone}=req.body
  UserModel.findOne({username},function(err,user){
    if(user){
      resp.send({code:1,msg:'此用户已经存在！'})
    }else{
      new UserModel({username,password:md5(password),email,phone}).save(function(err,user){
        resp.send({code:0,data:user})
      })
    }
  })
})

router.all('/login',function(req,resp){
  const {username,password}=req.body
  UserModel.findOne({username,password:md5(password)},filter,function(err,user){
    if(!user){
      resp.send({code:1,msg:'密码错误'})
    }else{
      resp.send({code:0,data:user})
    }
  })
})

module.exports = router;
