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
    static initAllData () {
        //this.$store.dispatch('getFilesListData') // init listdata
    }
}

//DataProvider
