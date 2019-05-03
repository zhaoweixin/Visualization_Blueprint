import axios from 'axios';

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
}

//DataProvider
