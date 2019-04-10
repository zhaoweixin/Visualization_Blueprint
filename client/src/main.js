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
import 'material-icons/iconfont/material-icons.css';
//import store from './store'

import Entrance from './pages/HomePage/Home'
import BlueEditor from './pages/BluePage/BlueEditor'
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
  { path: '/blue', name: 'blue', component: BlueEditor}
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
    tableData : null
  },
  mutations: {
    getFilesListData (state, payload) {
      state.filesListData = payload.data
    },
    getFileAttrList (state, payload) {
      state.fileAttrList = payload.data
    },
    updateListdata (state, payload) {
      console.log(payload)
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
    }
  },
  getters: {},
  actions: {
    changeTableData(ctx,tableData){
      ctx.commit('changeTableData',tableData)
    },
    getFilesListData (context) {
      //获取文件数据列表
      DataManager.getDataInfo().then(response => {
        let re = []
        response.data.forEach( (d, i) => {
            let checkModel = d + '_' + i
            let obj = {'title': d.name}
              obj[checkModel] = false
            re.push(obj)
        })
        context.commit('getFilesListData', {data: re})
      })
    },
    getFileAttrList (context, payload) {
      //获取数据文件属性
      DataManager.getFileAttrList(payload.dataName).then(response => {
        console.log(response.data)
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
  mounted() {
    this.$store.dispatch('getFilesListData') // init listdata
  }
}).$mount('#app')

