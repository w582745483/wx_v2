var express = require('express');
const md5 = require('blueimp-md5')
const filter = { password: 0 }//过滤密码
var router = express.Router();
const { UserModel } = require('../db/db.models')
const createCode = require('../createPassword')
router.all('/register', (req, resp) => {
  const { username, password, email, phone } = req.body
  UserModel.findOne({ username }, function (err, user) {
    if (user) {
      resp.send({ code: 1, msg: '此用户已经存在！' })
    } else {
      new UserModel({ username, password: md5(password), email, phone }).save(function (err, user) {
        resp.send({ code: 0, data: user })
      })
    }
  })
})
router.all('/',(req,res)=>{
  res.clearCookie('username')
  res.send()
})

router.all('/login', function (req, resp) {
  const { password } = req.body
 
  if (req.cookies.username) {
    resp.send({ code: 0, data: req.cookies.username })
    return
  }
  UserModel.findOne({ password }, function (err, user) {
    if (!password) {
      return
    }
    if (!user) {
      resp.send({ code: 1, msg: '密码错误' })
    } else {
      if (user.cardWordExpire < new Date().getTime()) {
        resp.send({ code: 2, msg: '卡密过期' })
      }
      else {
        resp.cookie('username', user.wxid);
        // resp.cookie('username','zhangsan',{maxAge:10000}); //有效期以毫秒为单位
        //获取cookie
        console.log(req.cookies);
        resp.send({ code: 0, data: user })
      }
    }
  })
})

router.all('/registerCard', (req, res) => {
  const { wxid, cardType } = req.body
  var nowDate = new Date()
  var cardWordExpire
  switch (cardType) {
    case 'day':
      cardWordExpire = nowDate.setTime(new Date().getTime() + 1000 * 60 * 60 * 24)
      console.log(cardWordExpire, nowDate.toLocaleString())
      break;
    case 'week':
      cardWordExpire = nowDate.setTime(new Date().getTime() + 1000 * 60 * 60 * 24 * 7)
      console.log(cardWordExpire, nowDate.toLocaleString())
      break;
    case 'month':
      cardWordExpire = nowDate.setTime(new Date().getTime() + 1000 * 60 * 60 * 24 * 31)
      console.log(cardWordExpire, nowDate.toLocaleString())
      break;
  }

  UserModel.update({ wxid }, { $set: { cardWordExpire, password: createCode() } }, { upsert: true }, (err, user) => {
    if (!err) {
      res.send({ code: 0, data: { wxid, cardWordExpire } })
    }
    else {
      res.send({ code: 1, msg: "卡密生成失败" })
    }
  })
})

module.exports = router;
