import axios from 'axios';
import download from "downloadjs";
import fs from "fs";

export default class DataManager {
    static getDataInfo() {
        return axios.post('http://localhost:3000/api/getDataInfo')
    }
    static getFileAttrList (dataName) {
        let data = JSON.stringify({
            'dataName': dataName
        })
        return axios.post('http://localhost:3000/api/getDataList', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    static getData (dataName) {
        let data = {
            'dataName': dataName
        }
        return axios.post('http://localhost:3000/api/getData', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    static joinFunc (data) {
        return axios.post('http://localhost:3000/api/joinFunc', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    static getDrawData (dataName) {
        let data = {
            'dataName': dataName
        }
        return axios.post('http://localhost:3000/api/getDrawData', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    
    static getDrawDataInfo (dataName) {
        let data = {
            'dataName': dataName
        }
        return axios.post('http://localhost:3000/api/getDrawDataInfo', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static downloadSetting(data){
        return axios.post("http://localhost:3000/api/downloadSetting", data, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(res){
            if(res.data.message == "success"){
                let zipUrl = 'http://localhost:3000/download/zip/' + data.template + ".zip"
            axios({
                url: zipUrl,
                method:'get',
                responseType: "blob",
                headers: {
                'Content-Type': 'application/zip'
            }}).then(function(response){
                let blob = new Blob([response.data]);
                let link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = data.template + ".zip"
                let evt = document.createEvent("HTMLEvents");
                evt.initEvent("click", false, false);
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(link.href);
              })
            }
        })
    }
}

//DataProvider
