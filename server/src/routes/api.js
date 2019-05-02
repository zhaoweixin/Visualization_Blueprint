const express = require('express');
const upload = require('./multer')
const router = express.Router();
const fs = require('fs')


const dataProcessFunc = require('../models/dataprocess');
const dataProcess = dataProcessFunc.dataProcess
const dataBuffer = dataProcessFunc.dataBuffer
const fakeDataBaseProcess = dataProcessFunc.fakeDataBaseProcess
const dataInitFDB = dataProcessFunc.dataInitFDB

//api
    //上传并保存数据
router.post('/changeAvatar', upload.single(), function(req, res){
    const avatar = req.files.null;
    avatar.mv('./upload/'+ avatar.name, function(err){
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

router.post("/testdata", function(req, res, next){
    console.log("testdata")
    let dataName = req.body.dataName
    console.log(dataName)
    res.setHeader("Content-Type", "application/json");
    //console.log(dataProcess.getDataFromDB())
    res.json(dataBuffer.data[dataName])
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

dataPrepare(1) //switch prepare data function 0 DB 1 local
//storeDefaultData();

module.exports = router;