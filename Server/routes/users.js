﻿var express = require('express');
const md5 = require('blueimp-md5')
const transporter = require('../email')
const fs = require('fs')
const filter = { password: 0 }//过滤密码
var router = express.Router();
const { UserModel, AdminModel } = require('../db/db.models')
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
  res.send({ code: 0, token: '' })
})
router.all('/updateUserCard', (req, res) => {
  const { wxid, password } = req.body
  var cardWordExpire, nowDate = new Date()
  UserModel.findOne({ password }, function (err, user) {
    if (user.wxdbid == undefined) {
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
          res.send({ code: 1, data: "用户更新wxid和cardWordExpire失败(此卡密已经存在wxid)" })
        }
      })
    }
    else {
      res.send({ code: 1, data: { wxdbid: user.wxdbid } })
    }
  })


})

router.all('/login', function (req, resp) {
  const { password } = req.body
  if (req.headers.token !== 'null' && req.headers.token !== '' && req.headers.token !== 'undefined') {
    console.log('走的token校验', password)
    UserModel.findOne({ password: req.headers.token }, (err, user) => {
      if (!user) {
        resp.send({ code: 3, msg: '不存在用户' })
        return
      }
      else if (user.cardWordExpire < new Date().getTime()) {
        resp.send({ code: 2, data: {}, msg: '卡密过期', token: '' })
        return
      }
      else {
        console.log(`用户登录成功`)
        resp.send({ code: 0, data: user, token: req.headers.token })
        return
      }
    })

  } else {
    console.log('走的本地密码校验', password)
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
          resp.send({ code: 0, data: user, token: password })
        }
      }
    })
  }


})

router.all('/registerCard', async (req, res) => {
  const { cardType, number, email } = req.body
  const date = new Date()
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString()
  const day = date.getDate().toString()
  const hour = date.getHours().toString()
  const minute = date.getMinutes().toString()
  const second=date.getSeconds().toString()
  const path = year + month + day + hour + minute+second
  for (var i = 0; i < number; i++) {
    var password = createCode()
    try {
      let user = await UserModel.findOne({ password })
      if (user) {
        password = createCode()
      }
      //卡密写入数据库
      await UserModel.update({ password }, { $set: { cardType } }, { upsert: true }).exec()

      await fs.writeFile(`../password--${path}.txt`, `${password}---`, { 'flag': 'a' }, function (err) {
        if (err) {
          console.log('写文件出错')
        }
      })
    }
    catch (err) {
      console.log(`用户注册失败`, err)
      res.send({ code: 1, msg: "卡密生成失败" })
      return
    }
  }

  console.log(`用户注册成功`)
  //发送邮件信息
  var message = {
    // Comma separated lsit of recipients 收件人用逗号间隔
    to: `2948942411@qq.com,${email}`,//,542906219@qq.com
    // Subject of the message 信息主题
    subject: '卡密会员注册成功',
    html: `<p>卡密类型:<b>${cardType}</b>`,
    attachments: [
      // String attachment
      {
        filename: `password--${path}.txt`,
        contentType: 'text/plain', // optional,would be detected from the filename 可选的，会检测文件名
        path: `../password--${path}.txt`
      }],
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


  res.send({ code: 0, data: {} })

})

router.all('/payfor', (req, res) => {
  const { amount, account } = req.body
  var total = 0
  AdminModel.findOne({ account }, (err, acc) => {
    if (acc.amount != undefined) {
      total = acc.amount + parseInt(amount)
    }
    //卡密写入数据库
    AdminModel.update({ account }, { $set: { amount: total } }, { upsert: false }, (err, user) => {
      if (!err) {
        console.log(`管理员充值成功`)
        //发送邮件信息
        var message = {
          // Comma separated lsit of recipients 收件人用逗号间隔
          to: '2948942411@qq.com',//,542906219@qq.com
          // Subject of the message 信息主题
          subject: '管理员充值成功',
          html: `<p>管理员密码:<b>${account}</b>   卡密金额:<b>${total}</b></p>`

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
        res.send({ code: 0, data: { account, amount: total } })
      }
      else {
        console.log(`管理员充值失败`, err)
        res.send({ code: 1, msg: "管理员充值失败" })
      }
    })
  })
})

router.all('/registerAdmin', (req, res) => {

  var password = createCode()
  AdminModel.findOne({ password }, (err, user) => {
    if (user) {
      password = createCode()
    }
    const amount = 0
    //卡密写入数据库
    AdminModel.update({ account: password }, { $set: { amount } }, { upsert: true }, (err, user) => {
      if (!err) {
        console.log(`管理员注册成功`)
        //发送邮件信息
        var message = {
          // Comma separated lsit of recipients 收件人用逗号间隔
          to: '2948942411@qq.com',//,542906219@qq.com
          // Subject of the message 信息主题
          subject: '管理员注册成功',
          html: `<p>管理员密码:<b>${password}</b>   卡密金额:<b>${amount}</b></p>`

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
        res.send({ code: 0, data: { password } })
      }
      else {
        console.log(`管理员注册失败`, err)
        res.send({ code: 1, msg: "管理员密码生成失败" })
      }
    })

  })

})

router.all('/adminlogin', function (req, resp) {
  const { password } = req.body
  AdminModel.findOne({ account: password }, function (err, user) {
    if (!password) {
      resp.send({ code: 3, msg: '密码不能为空' })
      return
    }
    if (!user) {
      resp.send({ code: 1, msg: '密码错误' })
    } else {
      resp.send({ code: 0, data: user })
    }
  })
})
router.all('/log', async (req, res) => {
  let totalNum = await UserModel.count({ password: { $exists: true } });
  let bindNum = await UserModel.count({ wxdbid: { $exists: true } })
  let agentNum = await AdminModel.count({ account: { $exists: true } })
  res.send({ code: 0, data: { totalNum, bindNum, agentNum } })
})
module.exports = router;
