import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        tabledata:null,
       
    },
    mutations:{
        changeData(state,data){
            state.tabledata = data
        }
    },
    actions:{
        changeData(ctx,data){
            ctx.commit('changeData',data)
        }
    },
    getters: {
       
      }
    
})