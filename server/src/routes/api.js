const express = require('express');
const upload = require('./multer')
const router = express.Router();
const fs = require('fs')
const zipper = require("zip-local");
const jsonfile = require("jsonfile")

const dataProcessFunc = require('../models/dataprocess');
const dataProcess = dataProcessFunc.dataProcess
const dataBuffer = dataProcessFunc.dataBuffer
const fakeDataBaseProcess = dataProcessFunc.fakeDataBaseProcess
const dataInitFDB = dataProcessFunc.dataInitFDB

//api
    //上传并保存数据
router.post('/changeAvatar', upload.single(), function(req, res){
    const avatar = req.files.null;
    avatar.mv('./src/upload/'+ avatar.name, function(err){
        if(err)
            return res.status(500).send(err);
        dataname = avatar.name.split('.')[0];
        datatype = avatar.name.split('.')[1];
        dataProcess.storeData(dataname, datatype)
        temp = {
            "name": dataname
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(temp)
        //res.send('File uploaded!')
    });
})

//获取已上传数据列表
router.post('/getDataInfo', function(req, res, next){
    
    let dataDimensions = dataBuffer.getAllDimensions()
    let resdata = []
    
    dataDimensions.forEach(function(d,i){
        let name = d['name'],
            dimensions = d['dimensions'],
            length = d['length']
        
        let dataCounts = dataBuffer.getDataLength(name)
            pagesCounts = dataBuffer.getDataPagesCount(name)
            tempdimensions = []
        
        dimensions.forEach(function(v,j){
            tempdimensions.push({'name': v['name'], 'type': v['type']})
        })

        resdata.push({
            'dimensions': tempdimensions,
            'name': name,
            'pages':pagesCounts,
            'dataCounts':dataCounts
        })

    })
    res.setHeader('Content-Type', 'application/json');
    res.json(resdata)
})

//获取指定文件数据
router.post('/getSingleData' ,function(req, res, next){
    // params :{dataName, preview, page }
    let params = req.body,
        dimensions = null,
        description = null,
        values = null

    dimensions = dataBuffer.getSingleDimensions(params.dataName)
    if(params.preview == 0){
        //数据全部返回
        values = dataBuffer.getSingleData(params.dataName)
    } else {
        //返回某一页面
        values = dataBuffer.getPageData(params.dataName, params.page)
    }

    resData = {
        "dimensions": dimensions,
        "description": "",
        "data": {
            "values": values
        }
    }
    res.setHeader('Content-Type', 'application/json');
    res.json(resData);
})

//获取单个数据文件属性列表
router.post('/getDatalist', function(req, res, next){
    res.setHeader('Content-Type', 'application/json');
    res.json(dataBuffer.getAllDimensions())
})

router.post('/joinFunc' ,function(req, res, next){
    const params = req.body
        dataName_1 = params.dataName_1,
        dataName_2 = params.dataName_2,
        column_1 = params.column_1,
        column_2 = params.column_2,
        joinWay = params.joinWay,
        resData = {"data": "", "name": ""}
        resName = ""
        switch(joinWay){
            case "Left":
                resData["data"] = dataProcess.leftJoin(dataName_1, dataName_2, column_1, column_2)
                break;
            case "Right":
                resData["data"] = dataProcess.rightJoin(dataName_1, dataName_2, column_1, column_2)
                break;
            case "Inner":
                resData["data"] = dataProcess.innerJoin(dataName_1, dataName_2, column_1, column_2)
                break;
            case "Outer":
                resData["data"] = dataProcess.outerJoin(dataName_1, dataName_2, column_1, column_2)
                break;
        }
    resData["name"] = column_1 + "_" + column_2 + "_" + joinWay
    dataProcess.storeData(resData, "join")
    res.setHeader('Content-Type', 'application/json');
    res.json(resData.name)
})


router.post('/getData' ,function(req, res, next){
    let dataName = req.body.dataName
    let values = dataBuffer.getData(dataName)
    let dimensions = dataBuffer.getSingleDimensions(dataName)
    
    resData = {
        "tr": values,
        "th": dimensions
    }
    res.setHeader('Content-Type', 'application/json');
    res.json(resData)
})

router.post('/getDataDetail' ,function(req, res, next){

    let dataName = req.query.dataname
    
    resData = {
        "dimensions": dataBuffer.getDataDimensions(dataName),
        "description": dataName,
        "data": {
            "values": dataBuffer.getData(dataName)
        },
        "title": {
            "text": "",
            "anchor": "",
            "fontSize": ""
        }
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.json(resData)
})

router.post('/getAllData' ,function(req, res, next){

    let dataName = req.query.dataname
    
    resData = {
        "dimensions": dataBuffer.getDataDimensions(dataName),
        "description": "",
        "data": {
            "values": dataBuffer.getData(dataName)
        },
        "title": {
            "text": "A Simple Bar Chart",
            "anchor": "middle",
            "fontSize": 20
        }
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.json(resData)
})

router.post("/testdrawdata", function(req, res, next){
    res.setHeader("Content-Type", "application/json");
    //console.log(dataProcess.getDataFromDB())
    res.json(dataBuffer.drawData)
})

router.post("/testdata", function(req, res, next){
    let dataName = req.body.dataName
    res.setHeader("Content-Type", "application/json");
    //console.log(dataProcess.getDataFromDB())
    res.json(dataBuffer.data[dataName])
})

router.post("/getDrawData", function(req, res, next){
    let dataName = req.body.dataName
    res.setHeader("Content-Type", "application/json");
    //console.log(dataProcess.getDataFromDB())
    res.json(dataBuffer.getDrawData(dataName))
})
router.post("/getDrawDataInfo", function(req, res, next){
    let dataName = req.body.dataName,
        data = dataBuffer.getDrawData(dataName),
        attrName = []
    
    data.forEach((d,i) => {
        const temp = {
            "index": i,
            "name": d.name
        }
        attrName.push(temp)
    })

    res.setHeader("Content-Type", "application/json");
    //console.log(dataProcess.getDataFromDB())
    let obj = {
        "length": data.length,
        "attr": attrName
    }
    res.json(obj)
})

router.post('/downloadSetting', function(req, res) {
    let template = req.body.template
    let zipUrl = "../server/src/download/app/"
    let zipFileName = template + ".zip"
    let configJsonFile = "../server/src/download/app/" + template + "/config.json"
    let fileObj = req.body.data
    res.setHeader("Content-Type", "application/json");

    if(template == "templateA" || template == "templateB"){
        zipUrl = "../server/src/download/app/" + template
    } else {
        res.json({"message": "template folder error"})
        return;
    }
    //write and compress
    jsonfile.writeFile(configJsonFile, fileObj, { spaces: 2 }).then(response => {
        zipper.zip(zipUrl, function(error, zipped) {
            if (!error) {
                zipped.compress(); // compress before exporting
                var buff = zipped.memory(); // get the zipped file as a Buffer
                // or save the zipped file to disk
                zipped.save("./src/download/zip/" + zipFileName, function(error) {
                    if (!error) {
                        console.log("Ziped files successfully!");
                        res.json({"message": "success"})
                    }
                });
            } else {
                res.json({"message": error})
                console.log(error)
            }
        });
    }).catch(err => {
        res.json({"message": err})
        console.log(err)
    })
    
})

    //暂时使用默认存入数据功能
const storeDefaultData = function(){
    fs.readdir(process.cwd() + "/src/upload", function(err, files){
        //file -> list
        if (err) {
            console.log(err);
        }
        files.forEach(function(d,i){
            let dataName = d.split('.')[0]
            let dataType = d.split('.')[1]
            dataProcess.storeData(dataName, dataType)
        })
    })
}

const dataPrepare = function(isUseDB){
    if(isUseDB){
        /* callback function
        dataProcess.getDataFromDB(function(err,doc){
            if(err){
                console.log(err)
            }else{
                //console.log(doc)
            }
        })
        */
       storeDefaultData()
    }else{
        dataInitFDB.init()
    }
}

dataPrepare(0) //switch prepare data function 0 DB 1 local
//storeDefaultData();

module.exports = router;