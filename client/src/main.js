// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuesax from 'vuesax'
import * as d3 from 'd3'
import ElementUI from 'element-ui'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'vuesax/dist/vuesax.css' //Vuesax styles
import 'element-ui/lib/theme-chalk/index.css';
import 'material-icons/iconfont/material-icons.css';
// import store from './store/index'

import Entrance from './pages/HomePage/Home'
import BlueEditor from './pages/BluePage/BlueEditor'
import AutoPage from './pages/AutoBoard/AutoPage'
import DataManager from './common/DataManager'

Vue.use(VueRouter)
Vue.use(iView)
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(Vuesax, {
  theme:{
    colors:{
      primary:'rgb(200, 200, 200)',
      success:'rgb(23, 201, 100)',
      danger:'rgb(242, 19, 93)',
      warning:'rgb(255, 130, 0)',
      dark:'rgb(200, 200, 200)',
    }
  }
})

const routes = [
	{ path: '/', redirect: '/blue' },
  { path: '/home', name: 'home', component: Entrance},
  { path: '/blue', name: 'blue', component: BlueEditor},
  { path: '/page', name: 'page', component: AutoPage}
]

const router = new VueRouter({
  routes,
  mode:'history'
})


Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    filesListData:[
      {"title": ""}
    ],
    fileAttrList:[''],
    checkboxes:[],
    tableData : null,
    filesData: {},
    currentTable: "barley",
    mapdata:null,
    
  },
  mutations: {
    mapdata(state,mapdata){
            state.mapdata=mapdata;
    },
    getFilesList (state, payload) {
      state.filesListData = payload.data
    },
    getFilesData (state, payload){
      if(!state.filesData[payload["title"]]){
        state.filesData[payload["title"]] = payload["data"]
      }
    },
    addListdata (state, payload){
      state.checkboxes.push(payload)
    },
    removeListdata (state, payload){
      let arr = [...state.checkboxes],
        index = arr.indexOf(payload)
      if(index > -1){
        arr.splice(index, 1)
        state.checkboxes = arr
      }
    },
    changeTableData(state,tableData){
      state.tableData = tableData
    },
    updateTable(state, payload){
      state.currentTable = payload
    }
  },
  getters: {
    getFileData: (state, getters) => (dataName) => {
      console.log(1111, dataName, store.state.filesData.hasOwnProperty(dataName))
      //store.state.filesData.hasOwnProperty("")
      return store.state.filesData.hasOwnProperty(dataName) ? store.state.filesData["dataName"] : []
    },
    getmapdata: state => {
      return state.mapdata
    }
  },
  actions: {
    changeTableData(ctx,tableData){
      ctx.commit('changeTableData',tableData)
    },
    getFilesList (context) {
      //获取文件数据列表
      const that = this;
      (async function(){
        const re = [];
        const response = await DataManager.getDataInfo()
        response.data.forEach((d, i) => {
            let checkModel = d + '_' + i
            let obj = {'title': d.name}
              obj[checkModel] = false
            re.push(obj)
        });
        context.commit('getFilesList', {data: re});
        store.dispatch('getFilesData', {data: re});
      })();
    },
    getFilesData(context, payload){
      const req = async function(title){
        const response = await DataManager.getData(title)
        const obj = {"title": title, "data": response.data}
        context.commit('getFilesData', obj)
      }

      payload.data.forEach(d => {
        const title = d.title
        req(title)
        DataManager.getData(title).then(response => {
          const obj = {"title": title, "data": response.data}
          context.commit('getFilesData', obj)
        })
      })
    }
  },
})

/* eslint-disable no-new */
new Vue({
  el: '#app', 
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted(){
    this.$store.dispatch('getFilesList') // init listdata
  }
}).$mount('#app')
