var express = require('express');
var router = express.Router();
const {UserModel, ChatModel} = require('../db/model')
const md5 = require('blueimp-md5')
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

//注册路由
router.post('/register', function (req, res) {
    const {username, password, type} = req.body
    //判断当前数据是否在数据库中
    UserModel.findOne({username}, function (err, user) {
        if (user) {
            res.send({code: 0, msg: '该用户已存在'})
        } else {
            //保存到数据库
            new UserModel({username, password: md5(password), type}).save(function (err, user) {
                res.send({code: 200, data: {_id: user._id, username, type}})
            })
        }
    })
})

//登录路由
router.post('/login', function (req, res) {
    //获取请求中的参数
    const {username, password} = req.body
    //查询该用户是否存在
    /*注意：查询需要过滤掉password，因为不能将其进行返回*/
    UserModel.findOne({username, password: md5(password)}, {password: 0, __v: 0}, function (err, user) {
        if (!user) {
            //没有找到该错误
            res.send({code: 0, msg: '用户名或密码错误'})
        } else {
            res.send({code: 1, data: {user}})
        }
    })
})

//更新个人信息
router.post('/update', function (req, res) {
    const {_id} = req.body
    if (!_id) {
        res.send({code: 0, msg: '用户不存在'})
    }
    //根据id更新数据
    UserModel.findByIdAndUpdate({_id: req.body._id}, req.body, function (err, user) {
        //user是原来数据库中的数据
        const {_id, username, type} = user
        const data = Object.assign(req.body, {_id, username, type})
        res.send({code: 1, data})
    })
})

//获取用户列表
router.post('/list', function (req, res) {
    const {type} = req.body
    UserModel.find({type}, {password: 0}, function (err, user) {
        if (user.length !== 0) {
            res.send({code: 1, data: user})
        } else {
            res.send({code: 0, msg: '查无此人'})
        }
    })

})

//获取当前用户的聊天消息列表
router.post('/msglist', function (req, res) {
    //获取当前用户的id
    const {userid} = req.body
    //查询所有用户信息
    UserModel.find(function (err,userDocs) {
        // 用对象存储所有 user 信息: key 为 user 的_id, val 为 name 和 header 组成的 user 对象
        const users = {} // 对象容器
        userDocs.forEach(doc =>{
            users[doc._id] = {username:doc.username,header:doc.header}
        })
        console.log(userid)
        //查询与userid有关的所有信息
        ChatModel.find({'$or':[{from: userid}, {to: userid}]}, function (err, chatMsgs) {
            res.send({code:1,data:{users,chatMsgs}})
        })
    })
})

//修改指定消息为已读
router.post('/readmsg',function (req,res) {
    //发送消息用户的id：from，接收信息用户的id：to
    const {from,to} = req.body
    console.log('from',from)
    console.log('to',to)
    ChatModel.update({from,to,read:false},{read: true},{multi:true},function (err,doc) {
        console.log('/readmsg',doc)
        res.send({code:1,data:doc.nModified})
    })

})
module.exports = router;
