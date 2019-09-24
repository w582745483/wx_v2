var express = require('express');
var router = express.Router();

let formidable = require('formidable')
let app = express()
let fs = require('fs-extra')
let path = require('path')
let concat = require('concat-files')
let opn = require('opn')
const  ffmpeg = require('fluent-ffmpeg')
let uploadDir = 'video'
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function (req, resp) {
    let query = req.query
    resp.send('success!!')
})

// 检查文件的MD5
router.get('/check/file', (req, resp) => {
    let query = req.query
    let fileName = query.fileName
    let fileMd5Value = query.fileMd5Value
    // 获取文件Chunk列表
    getChunkList(
        path.join(uploadDir, fileName),
        path.join(uploadDir, fileMd5Value),
        data => {
            resp.send(data)
        }
    )
})

// 检查chunk的MD5
router.get('/check/chunk', (req, resp) => {
    let query = req.query
    let chunkIndex = query.index
    let md5 = query.md5

    fs.stat(path.join(uploadDir, md5, chunkIndex), (err, stats) => {
        if (stats) {
            resp.send({
                stat: 1,
                exit: true,
                desc: 'Exit 1'
            })
        } else {
            resp.send({
                stat: 1,
                exit: false,
                desc: 'Exit 0'
            })
        }
    })
})

router.all('/merge', (req, resp) => {
    let query = req.query
    let md5 = query.md5
    let size = query.size
    let fileName = query.fileName
    console.log('fileName', fileName)
    mergeFiles(path.join(uploadDir, md5), uploadDir, fileName, size).then(()=>{
        captureImageOne(`video/${fileName}`).then(()=>{
            resp.send({
                videoimage: `Templates/${fileName.substring( fileName.lastIndexOf('/') + 1).split(".")[0]}.jpg`
            })
        })
       
    })
   
})

router.all('/saveimg', (req, resp) => {
    //接收前台POST过来的base64
    var {
        imgPoster,
        imgName
    } = req.body;
    //过滤data:URL
    var base64Data = imgPoster.replace(/^data:image\/\w+;base64,/, "");
    // var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile(`./img/${imgName}.jpg`, base64Data, 'base64', function (err) {
        if (err) {
            resp.send(err);
        } else {
            resp.send("保存成功！");
        }
    });
});
router.all('/upload', (req, resp) => {
    var form = new formidable.IncomingForm({
        uploadDir: 'video'
    })
    form.parse(req, function (err, fields, file) {
        let index = fields.index
        let total = fields.total
        let fileMd5Value = fields.fileMd5Value
        let folder = path.resolve(uploadDir, fileMd5Value)
        folderIsExit(folder).then(val => {
            let destFile = path.resolve(folder, fields.index)
            console.log('----------->', file.data.path, destFile)
            copyFile(file.data.path, destFile).then(
                successLog => {
                    resp.send({
                        stat: 1,
                        desc: index
                    })
                },
                errorLog => {
                    resp.send({
                        stat: 0,
                        desc: 'Error'
                    })
                }
            )
        })
    })
    // 文件夹是否存在, 不存在则创建文件
    function folderIsExit(folder) {
        console.log('folderIsExit', folder)
        return new Promise(async (resolve, reject) => {
            let result = await fs.ensureDirSync(path.join(folder))
            console.log('result----', result)
            resolve(true)
        })
    }
    // 把文件从一个目录拷贝到别一个目录
    function copyFile(src, dest) {
        let promise = new Promise((resolve, reject) => {
            fs.rename(src, dest, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve('copy file:' + dest + ' success!')
                }
            })
        })
        return promise
    }
})

// 获取文件Chunk列表
async function getChunkList(filePath, folderPath, callback) {
    let isFileExit = await isExist(filePath)
    let result = {}
    // 如果文件(文件名, 如:node-v7.7.4.pkg)已在存在, 不用再继续上传, 真接秒传
    if (isFileExit) {
        result = {
            stat: 1,
            file: {
                isExist: true,
                name: filePath
            },
            desc: 'file is exist'
        }
    } else {
        let isFolderExist = await isExist(folderPath)
        console.log('folderPath', folderPath)
        // 如果文件夹(md5值后的文件)存在, 就获取已经上传的块
        let fileList = []
        if (isFolderExist) {
            fileList = await listDir(folderPath)
        }
        result = {
            stat: 1,
            chunkList: fileList,
            desc: 'folder list'
        }
    }
    callback(result)
}

// 文件或文件夹是否存在
function isExist(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            // 文件不存在
            if (err && err.code === 'ENOENT') {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}

// 列出文件夹下所有文件
function listDir(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            // 把mac系统下的临时文件去掉
            if (data && data.length > 0 && data[0] === '.DS_Store') {
                data.splice(0, 1)
            }
            resolve(data)
        })
    })
}
// 合并文件
function mergeFiles(srcDir, targetDir, newFileName, size) {
    return new Promise(resolve=>{
        console.log('arguments', ...arguments)
        let targetStream = fs.createWriteStream(path.join(targetDir, newFileName))
        listDir(srcDir).then((fileArr) => {
            // 把文件名加上文件夹的前缀
            for (let i = 0; i < fileArr.length; i++) {
                fileArr[i] = srcDir + '/' + fileArr[i]
            }
            console.log('fileArr', fileArr)
            concat(fileArr, path.join(targetDir, newFileName), () => {
                console.log('Merge Success!')
                resolve()
            })
        })
    })
}
//视频截图
const captureImageOne = (src)=> {
    return new Promise((reslove, reject) => {
        try {
            let imageName = '';
            let fileName = src.substring( src.lastIndexOf('/') + 1).split(".")[0];
            let width,height
            ffmpeg.ffprobe(src,(err,data)=>{
                 width=data.streams[0].width?data.streams[0].width:data.streams[1].width
                 height=data.streams[0].height?data.streams[0].height:data.streams[1].height
                 if(width<height){
                     width=393
                     height=640
                 }
                 console.log('width',width,'height',height)
                 ffmpeg(src)
                 .on('filenames', (filenames)=> {
                     imageName = filenames[0];
                     console.log(filenames);
                 })
                 .on('end', ()=> {
                     reslove(imageName);
                 })
                 .screenshots({
                     // Will take screens at 20%, 40%, 60% and 80% of the video
                     //timestamps: [30.5, '50%', '01:10.123'],
                     timestamps: ['00:01.000'],
                     folder: 'img/Templates',
                     filename: fileName + '.jpg',
                     size: `${width}x${height}`
                 })
            })      
        } catch(err) {
            reject(err);
        }
    })
}
module.exports = router;