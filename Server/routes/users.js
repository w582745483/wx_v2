var express = require('express');
const md5 = require('blueimp-md5')
const transporter = require('../email')
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
router.all('/', (req, res) => {
  res.clearCookie('password')
  res.send()
})
router.all('/updateUserCard', (req, res) => {
  const { wxid, password } = req.body
  var cardWordExpire, nowDate = new Date()
  UserModel.findOne({ password }, function (err, user) {
    if (!user.wxdbid) {
      //根据卡密类型设置过期时间
      switch (user.cardType) {
        case 'day':
          cardWordExpire = nowDate.setTime(new Date().getTime() + 1000 * 60 * 60 * 24)
          // console.log(cardWordExpire, nowDate.toLocaleString())
          break;
        case 'week':
          cardWordExpire = nowDate.setTime(new Date().getTime() + 1000 * 60 * 60 * 24 * 7)
          //console.log(cardWordExpire, nowDate.toLocaleString())
          break;
        case 'month':
          cardWordExpire = nowDate.setTime(new Date().getTime() + 1000 * 60 * 60 * 24 * 31)
          // console.log(cardWordExpire, nowDate.toLocaleString())
          break;
      }

      //卡密写入数据库
      UserModel.update({ password }, { $set: { wxdbid: wxid, cardWordExpire } }, { upsert: false }, (err) => {
        if (!err) {
          console.log(`用户更新wxid和cardWordExpire成功`)
          //发送邮件信息
          var message = {
            // Comma separated lsit of recipients 收件人用逗号间隔
            to: '2948942411@qq.com',//,542906219@qq.com
            // Subject of the message 信息主题
            subject: '卡密会员登录更新成功',
            html: `<p>wxid:<b>${wxid}</b>     卡密类型:<b>${user.cardType}</b>      卡密:<b>${password}</b></p>`

          }
          //正式发送邮件
          transporter.sendMail(message, (error, info) => {
            if (error) {
              console.log('Error occurred');
              console.log(error.message);
              return;
            }
            console.log('Send Mail');
            console.log('Message sent successfully!');
            console.log('Server responded with %s', info.response);
            transporter.close();
          });
          res.send({ code: 0, data: { wxdbid: wxid } })
        }
        else {
          console.log(`用户更新wxid和cardWordExpire失败(此卡密已经存在wxid)`)
          res.send({ code: 1, msg: "用户更新wxid和cardWordExpire失败(此卡密已经存在wxid)" })
        }
      })
    }
    else {
      res.send({ code: 1, data: user.wxdbid })
    }
  })


})

router.all('/login', function (req, resp) {
  const { password } = req.body
  console.log('header',req.headers)
  console.log('req.body', req.body)
  console.log('(req.cookies',req.cookies)
  if (req.headers.token!=='null') {
   console.log('if')
    UserModel.findOne({ password: req.headers.token }, (err, user) => {
      if (!user) {
        resp.clearCookie('password')
        resp.send({ code: 3, msg: '不存在用户' })
        return
      }
      else if (user.cardWordExpire < new Date().getTime()) {
        resp.clearCookie('password')
        resp.send({ code: 2, msg: '卡密过期' })
        return
      }
      else {
        console.log(`用户登录成功`)
        resp.send({ code: 0, data: user })
        return
      }
    })

  } else {
    console.log('else')
    UserModel.findOne({ password }, function (err, user) {
      if (!password) {
        resp.send({ code: 3, msg: '密码不能为空' })
        return
      }
      if (!user) {
        resp.send({ code: 1, msg: '密码错误' })
      } else {
        if (user.cardWordExpire < new Date().getTime()) {
          resp.send({ code: 2, msg: '卡密过期' })
        }
        else {
          resp.cookie('password', password);
          // resp.cookie('username','zhangsan',{maxAge:10000}); //有效期以毫秒为单位
          //获取cookie
          resp.send({ code: 0, data: user })
        }
      }
    })
  }


})

router.all('/registerCard', (req, res) => {
  const { cardType } = req.body

  var password = createCode()
  //卡密写入数据库
  UserModel.update({ password }, { $set: { cardType } }, { upsert: true }, (err, user) => {
    if (!err) {
      console.log(`用户注册成功`)
      //发送邮件信息
      var message = {
        // Comma separated lsit of recipients 收件人用逗号间隔
        to: '2948942411@qq.com',//,542906219@qq.com
        // Subject of the message 信息主题
        subject: '卡密会员注册成功',
        html: `卡密类型:<b>${cardType}</b>      卡密:<b>${password}</b></p>`

      }
      //正式发送邮件
      transporter.sendMail(message, (error, info) => {
        if (error) {
          console.log('Error occurred');
          console.log(error.message);
          return;
        }
        console.log('Send Mail');
        console.log('Message sent successfully!');
        console.log('Server responded with %s', info.response);
        transporter.close();
      });
      res.send({ code: 0, data: { cardType } })
    }
    else {
      console.log(`用户注册失败`, err)
      res.send({ code: 1, msg: "卡密生成失败" })
    }
  })
})

module.exports = router;
