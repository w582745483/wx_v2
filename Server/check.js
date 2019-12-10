let fs = require('fs-extra');
let process = require('child_process');
//监控的程序
let ChildProcess  = process.fork('./bin/www'); 
ChildProcess.on('exit',function (code) {
    console.log('process exits + '+code);
    fs.appendFileSync('./log/log.txt',`${new Date()} 线程退出`+code);
    if(code !== 0){
        console.log('服务退出，正在重启。。。')
        process.fork('./check.js');
        console.log('服务器重启成功！')
    }else{
        console.log('Restart failed');
    } 
});