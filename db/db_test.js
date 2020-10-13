const mongoose = require('mongoose')
const md5 = require('blueimp-md5') //用于隐藏密码

mongoose.connect('mongodb://127.0.0.1/user')

