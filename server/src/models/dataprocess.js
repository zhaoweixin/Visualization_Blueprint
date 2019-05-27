const fs = require('fs')
const staticBasePath = "../../src/upload/"
const path = require('path');
const d3 = require('d3')
const csvToJson = require('convert-csv-to-json');
const flatten = require('flat');
const keys = require('all-object-keys');
const dsv = d3.dsvFormat(",")
const db = require("./db.js")
const mongoose = require("mongoose")
const ss = require("simple-statistics")
const cav = require("count-array-values")
//命名空间 首先检查dataprocess是否已经被定义 
//如果是的话，那么使用现有的dataprocess全局对象
//否则，创建一个名为dataprocess的空对象用来封装方法，函数，变量和对象。
var dataProcess = dataProcess || {};

const dbSchema = new mongoose.Schema({
    "name": String,
    "data": String
})

dbSchema.statics.findByName = function(name, cb){
    return this.find({name: new RegExp(name, "i")}, cb)
}

const funcStore = {
    jsonAddId: function(obj){
        //递归遍历确保所有变量加上id
        let that = this
        function recursion(obj) {
            for(let a in obj){
                if(!Array.isArray(obj[a])){
                    recursion(obj[a]); //递归遍历
                } else {
                    //循环赋值id
                    for(let i=0; i<obj[a].length;i++){
                        obj[a][i]['StoreId'] = that.createRandomId()
                        obj[a][i]['isDelete'] = false
                    }
                }
            }
        }
        
        //判断数据是否为obj从而决定是否用递归赋值
        if(Array.isArray(obj)){
            for(let i=0; i<obj.length;i++){
                obj[i]['StoreId'] = that.createRandomId()
                obj[i]['isDelete'] = false
                /*
                let temp = obj[i]
                obj[i] = flatten(temp)
                */
            }
        } else {
            recursion(obj)
        }
        return obj
    },
    createRandomId: function () {
        return (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+'-'+Math.random().toString().substr(2,5);
    },
    addRawDataToBuffer: function (json, dataName) {
        //rawdata.data = json
        //把读入的数据存入dataBuffer
        if(!dataBuffer.data.hasOwnProperty(dataName)){
            dataBuffer.data[dataName] = json;
        }
    },
    createIndex: function (json, dataName){
        if(!dataBuffer.index.hasOwnProperty(dataName)){
            dataBuffer.index[dataName] = {}

            for(let i=0; i<json.length; i++){
                let key = json[i]['StoreId'];
                let value = i;
                if(!dataBuffer.index[dataName].hasOwnProperty(key)){
                    dataBuffer.index[dataName][key] = value
                }     
            }
        }
    },
    generateDimensions: function (columns, dataName) {
        let obj = {
            'name': dataName,
            'dimensions': [],
            'length': dataBuffer.getDataLength(dataName)
        }

        columns.forEach(function(d,i){
            //通过统计属性内数据类型出现次数决定类型
            let key = d,
                dataList = dataBuffer.getData(dataName),
                length = dataList.length < 100 ? dataList.length : 100,
                dict = {
                'quantitative': 0,
                'temporal': 0,
                'ordinal': 0
            }

            for(let i=0; i<length; i++){
                let str = dataList[i][key];
                //let test = Number(str)

                if(isNaN(str) && ('' + (Date.parse(str)) != 'NaN')){
                    //是否为时间型 -> example: YYYY-MM-DD
                    dict.temporal++
                    continue;
                } else if(!isNaN(str)){
                    //是否为数字 quantitative
                    dict.quantitative++
                    continue;
                } else {
                    //是否为字符型
                    dict.ordinal++
                }
            }

            let type = 'ordinal'
            let maxTemp = 0
            for(let key in dict){
                if(dict[key] > maxTemp){
                    maxTemp = dict[key];
                    type = key
                }
            }

            obj.dimensions.push({
                'index': obj.dimensions.length,
                'name': d,
                'type': type,
                'isSelected': false
            })

        })
        dataBuffer.dimensions.push(obj)
        //To do judge type
    },
    storeToDB: function(dataName){
        const dbModel = mongoose.model("dbModel", dbSchema);
        const storeData = JSON.stringify(dataBuffer.getSingleData(dataName))
        dbModel.updateOne({"name": dataName}, {"data": storeData}, {upsert: true}, function(err){
            if(err){
                console.log(err)
            }else{
                console.log(dataName, "update success")
            }
        })
    },
    calDimensionPreview(rawdata, dataName){
        let dimension = JSON.parse(JSON.stringify(dataBuffer.getSingleDimensions(dataName)))
        let regression = function(data){
            let linearData = []
            data.forEach((d,i) => {
                linearData.push([i, +d])
            })
            
            let l = ss.linearRegressionLine(ss.linearRegression(linearData))
            linearData.forEach((d,i) => {
                d.push(l(i))
            })

            let reLinearData = []
            linearData.forEach( (d,i) =>{
                const obj = {"x": d[0], "cy": d[1], "ly": d[2]}
                reLinearData.push(obj)
            })

            return reLinearData
        }
        dimension.forEach(function(d,i){
            d["data"] = []
            rawdata.forEach(function(v,j){
                d["data"].push(v[d["name"]])
            })
            if(d["type"] == "quantitative"){
                //circle chart with regression line
                d["value"] = regression(JSON.parse(JSON.stringify(d["data"])))
            }else if(d["type"] == "ordinal"){
                //barchart
                d["value"] = cav(d["data"])
            }else if(d["type"] == "temporal"){
                //barchart
                d["value"] = cav(d["data"])
            }
        })
        dimension.forEach((d,i) => {
            delete d.data
        })
        if(!dataBuffer.drawData.hasOwnProperty(dataName)){
            dataBuffer.drawData[dataName] = JSON.parse(JSON.stringify(dimension))
            console.log(dataName, " calculate preview success")
        }
    }
}


dataProcess = {
    storeData: function(dataName, dataType){
        if(dataType == 'csv'){
            //使用插件convert-csv-to-json读入csv并转成json赋id
            fs.readFile(path.join(__dirname, staticBasePath + dataName + '.' + dataType), 'utf-8', function(err, data){
                if (err) throw err;
                //处理字符串首字符问题
                let firstCode = data.charCodeAt(0)
                if (firstCode < 0x20 || firstCode > 0x7f){
                    data = data.substring(1)
                }
                
                let json = dsv.parse(data)
                let rawdata = []
                let columns = json.columns

                json.forEach(function(d,i){
                    rawdata.push(d)
                })
                funcStore.addRawDataToBuffer(rawdata, dataName);
                funcStore.generateDimensions(columns, dataName);
                funcStore.calDimensionPreview(rawdata, dataName);
                //funcStore.jsonAddId(rawdata);
                //funcStore.createIndex(rawdata, dataName);
                funcStore.storeToDB(dataName)
                console.log(dataName + "." + dataType + " successful loading~")
            })
        } else if(dataType == 'json'){
            //使用fs读入json
            fs.readFile(path.join(__dirname, staticBasePath + dataName + '.' + dataType), 'utf-8', function(err, data) {
                if (err) throw err;

                //处理字符串首字符问题
                let firstCode = data.charCodeAt(0)
                if (firstCode < 0x20 || firstCode > 0x7f){
                    data = data.substring(1)
                }
                
                let rawdata = JSON.parse(data);
                let columns = Object.keys(flatten(rawdata[0]))
                funcStore.addRawDataToBuffer(rawdata, dataName);
                funcStore.generateDimensions(columns, dataName);
                funcStore.calDimensionPreview(rawdata, dataName);
                //funcStore.jsonAddId(rawdata);
                //funcStore.createIndex(rawdata, dataName);
                funcStore.storeToDB(dataName);
                console.log(dataName + "." + dataType + " successful loading~")
            })
        } else if(dataType == "join"){
            let data = arguments[0]["data"],
                dataName = arguments[0]["name"],
                columns = []
            if(data.length != 0){
                columns = Object.keys(data[0])
            }
            funcStore.addRawDataToBuffer(data, dataName);
            funcStore.generateDimensions(columns, dataName);
            funcStore.calDimensionPreview(data, dataName);
            //funcStore.jsonAddId(rawdata);
            //funcStore.createIndex(rawdata, dataName);
            //funcStore.storeToDB(dataName)
            console.log(dataName + "." + dataType + " successful loading~")
        }
    },
    innerJoin: function(dataName_1, dataName_2, column_1, column_2){
        return fakeDataBaseProcess._inner(dataName_1, dataName_2, column_1, column_2)
    },
    outerJoin: function(dataName_1, dataName_2, column){
        let innerData = fakeDataBaseProcess._inner(dataName_1, dataName_2, column_1, column_2)
        let leftData = fakeDataBaseProcess._part(dataName_1, dataName_2, column_1, column_2)
        let rightData = fakeDataBaseProcess._part(dataName_2, dataName_1, column_2, column_1)
        return innerData.concat(leftData.concat(rightData))
    },
    leftJoin: function(dataName_1, dataName_2, column_1, column_2){
        let innerData = fakeDataBaseProcess._inner(dataName_1, dataName_2, column_1, column_2),
            leftData = fakeDataBaseProcess._part(dataName_1, dataName_2, column_1, column_2)
        return innerData.concat(leftData)
    },
    rightJoin: function(dataName_1, dataName_2, column_1, column_2){
        let innerData = fakeDataBaseProcess._inner(dataName_1, dataName_2, column_1, column_2),
            rightData = fakeDataBaseProcess._part(dataName_2, dataName_1, column_2, column_1)
            //console.log(innerData, "~~~~~", rightData)
        return innerData.concat(rightData)
    },
    deleteData: function(StoreId, filename){
        dataName = filename.split('.')[0]
        index = dataBuffer.index[dataName][StoreId]
        //isDelete = true 表示已经删除
        dataBuffer.data[dataName][index].isDelete = true
    },
    unDeleteData: function(StoreId, filename){
        dataName = filename.split('.')[0]
        index = dataBuffer.index[dataName][StoreId]
        //isDelete = false 表示未删除
        dataBuffer.data[dataName][index].isDelete = false
    },
    sortData: function(filename){
        dataName = filename.split('.')[0]
    },
    getDataFromDB: function(callback){
        const dbModel = mongoose.model("dbModel", dbSchema);
        dbModel.find().select("name data -_id").exec(callback)
        
        //dbModel.findByName("name", callback)
        //return promise
    }
}

const dataBuffer = {
    data: {},
    index: {},
    dimensions: [],
    drawData: {},
    getDrawData: function(dataName){
        if(this.drawData.hasOwnProperty(dataName)){
            return this.drawData[dataName]
        }
    },
    getAllDimensions: function(){
        return this.dimensions;
    },
    getSingleDimensions: function(dataName){
        //console.log(this.dimensions)
        const list = []
        for(let i in dataBuffer.dimensions){
            if(dataBuffer.dimensions[i]["name"] == dataName){
                const temp = dataBuffer.dimensions[i]["dimensions"]
                for(let j=0; j<temp.length; j++){
                    list.push({"name": temp[j]["name"], "type": temp[j]["type"], "sortkey": temp[j]["name"]})
                }
                return list
            }
        }
        return null
    },
    getDataDimensions: function(dataName){
        for(let i in this.dimensions){
            if(this.dimensions[i]['name'] == dataName)
                return this.dimensions[i]['dimensions']
        }
    },
    getColoumnsList: function(dataName){
        let data = this.getSingleDimensions(dataName)
        let datalist = []
        data.forEach(function(d){
            if(datalist.indexOf(d.name) == -1){
                datalist.push(d.name)
            }
        })
        return datalist
    },
    getDataPagesCount: function(dataName){
        return Math.ceil(this.getDataLength(dataName) / 5)
    },
    getSingleData: function(dataName){
        if(this.data.hasOwnProperty(dataName)) return this.data[dataName]
    },
    getPageData: function(dataName, page){
        if(!this.data.hasOwnProperty(dataName)) return false
        let resdata = []
        page = parseInt(page)
        //判断页数是否在范围内
        let pageCounts = this.getDataLength(dataName)
        if(page < 1 || page > pageCounts) return false
        
        let start = 5 * page,
            end = 5 * (page + 1)
        for(let i = start; i < end; i++){
            resdata.push(this.data[dataName][i])
        }
        return resdata

    },
    getIndex: function(dataName){
        if(this.index.hasOwnProperty(dataName)) return this.index[dataName]
    },
    getDataLength: function(dataName){
        if(this.data.hasOwnProperty(dataName)) return parseInt(this.data[dataName].length)
    },
    getData: function(dataName){
        if(this.data.hasOwnProperty(dataName)) return this.data[dataName]
    }
}

const fakeDataBaseProcess = {
    // innerJoin = _inner
    // leftJoin = _inner + _part(left)
    // rightJoin = _inner+ _part(right)
    // outerJoin = _inner + _part(left) + _part(right)
    
    _inner: function(dataName_1, dataName_2, column_1, column_2){
        //首先根据this.getSameColumns生成相同属性列
        //根据相同属性this.constructToJoinData生成待处理数据格式(便于后续操作)
        //两个数据表根据findSameKeyinTwoTableColumn找到对应列相同值
        //最后根据相同值生成合成数据
        //重复值处理 n*n
        
        let sameColumns = this.getSameColumns(dataName_1, dataName_2),
            redata_1 = this.constructToJoinData(dataName_1, column_1),
            redata_2 = this.constructToJoinData(dataName_2, column_2),
            sameKey = this.findSameKeyinTwoTableColumn(dataName_1, dataName_2, column_1, column_2),
            resList = []
        
        //根据相同Key填充
        sameKey.forEach(function(d,i){
            let key = d,
                table_1 = redata_1[d],
                table_2 = redata_2[d]
            for(let i=0; i< table_1.length; i++){
                let table_1_value = table_1[i],
                    obj = null
                for(let j=0; j < table_2.length; j++){
                    let table_2_value = table_2[j]
                    obj = Object.assign(table_1_value, table_2_value)
                }
                resList.push(obj)
            }
        })
        return resList
        //根据sameKey生成合成数据
    },
    _part: function(dataName_1, dataName_2, column_1, column_2){
        //用于生成每个数据独有部分
        //left data_1 right data_2
        let diffKey = this.findDiffKeyinTwoTable(dataName_1, dataName_2, column_1, column_2),
            redata_1 = this.constructToJoinData(dataName_1, column_1),
            redata = [],
            redata_2_dataNamelist = this.getDataNameColoumnsList(dataName_2, column_1)
        let addObj = {}
        //填充null
        redata_2_dataNamelist.forEach(function(d){
            if(!addObj.hasOwnProperty(d)){
                addObj[d] = null
            }
        })
        //根据不同Key填充
        diffKey.forEach(function(d){
            let objList = redata_1[d]
            for(let i = 0; i< objList.length; i++){
                let obj = objList[i]
                redata.push(Object.assign(obj, addObj))
            }
        })
        return redata
    },
    getSameColumns: function(dataName_1, dataName_2){
        //查找相同列 查找两个数据表相同列
        let data_1_list = dataBuffer.getColoumnsList(dataName_1),
            data_2_list = dataBuffer.getColoumnsList(dataName_2),                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
            redata = []

        data_1_list.forEach(function(d){
            if(data_2_list.indexOf(d) != -1)
                redata.push(d)
        })
        
        return redata
    },
    constructToJoinData: function(dataName, column){
        //根据将要处理的列 改变数据到预处理格式 便于后续搜索操作
        /*
            {'key':{},'key':{}}
        */
        let data = dataBuffer.getSingleData(dataName),
            redata = {},
            tempdata = [],
            col = dataName + '_' + column
        //改变键值 'key' -> 'dataName.key'
        data.forEach(function(d,i){
            let objectKeys = Object.keys(d),
                obj = {}
            for(let j=0; j<objectKeys.length; j++){
                let key = objectKeys[j],
                    addKey = dataName + '_' + objectKeys[j]
                if(!obj.hasOwnProperty(addKey) && key != 'StoreId' && key != 'isDelete'){
                    obj[addKey] = d[key]
                }
            }
            tempdata.push(obj)
        })
        
        tempdata.forEach(function(d,i){
            let key = d[col]
            if(redata.hasOwnProperty(key)){
                //如果已有该key 则追加数据
                redata[key].push(d)
            } else {
                //如果没有该key 则新建
                redata[key] = []
                redata[key].push(d)
            }
        })
        return redata
    },
    findSameKeyinTwoTableColumn: function(dataName_1, dataName_2, column_1, column_2){
        //在两个表指定列找到相同值
        let data_1_list = this.getColumnAttrUnrepeat(dataName_1, column_1),
            data_2_list = this.getColumnAttrUnrepeat(dataName_2, column_2),
            sameKey = []

        //A -> C
        data_1_list.forEach(function(d,i){
            if(data_2_list.indexOf(d) != -1 && sameKey.indexOf(d) == -1){
                //元素如果在表2存在并且未加入sameKey
                sameKey.push(d)
            }
        })
        //B -> C
        data_2_list.forEach(function(d,i){
            if(data_1_list.indexOf(d) != -1 && sameKey.indexOf(d) == -1){
                //元素如果在表1存在并且没有加入到sameKey中
                sameKey.push(d)
            }
        })
        return sameKey
    },
    findDiffKeyinTwoTable : function(dataName_1, dataName_2, column_1, column_2){
        ////在两个表指定列找到不同值 (table1 相对于 table2)
        let data_1_list = this.getColumnAttrUnrepeat(dataName_1, column_1),
            data_2_list = this.getColumnAttrUnrepeat(dataName_2, column_2),
            diffKey = data_1_list.filter( x => !data_2_list.includes(x)),
            redata = [...new Set(diffKey)];
        return diffKey
    },
    getColumnAttrUnrepeat: function(dataName_1, column){
        //获取数据某列所有不重复项
        let data = dataBuffer.getSingleData(dataName_1),
            data_list = [],
            data_obj = {}
        //table A B C
        //去重初始化 每次合并根据结果多次添加

        data.forEach(function(d,i){
            if(d.hasOwnProperty(column)){
                if(!(d[column] in data_obj)){
                    //去重添加
                    data_obj[d[column]] = null
                }
            }
        })
        return Object.keys(data_obj)
    },
    getDataNameColoumnsList: function(dataName){
        //构造 dataName + key 属性返回
        return dataBuffer.getColoumnsList(dataName).map(x => dataName + '_' + x)
    }
}

const dataInitFDB = {
    //get data
    init: function(){
        const dbModel = mongoose.model("dbModel", dbSchema);
        dbModel.find({},{"name": 1, "data": 1}, function(err, docs){
            if(err){console.log(err)}
            else{
                for(const key in docs){
                    const name = docs[key]["name"],
                        data = JSON.parse(docs[key]["data"])
                    funcStore.addRawDataToBuffer(data, name);
                    funcStore.generateDimensions(Object.keys(data[0]), name);
                    funcStore.calDimensionPreview(data, name);
                    funcStore.createIndex(data, name);
                    console.log(name, "loading from DB success~")
                }
            }
            
        })
    }
}
module.exports = {dataProcess, dataBuffer, fakeDataBaseProcess, dataInitFDB};
