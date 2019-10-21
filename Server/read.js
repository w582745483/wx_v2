var fs = require('fs');
// 从文件系统中读取请求的文件内容
fs.readFile('../password--201910211424.txt', function (err, data) {
    if (err) {
        console.log(err);

        
    }
    else{
        console.log(data.toString().split('---'))
    }
})
