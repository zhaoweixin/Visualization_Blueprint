import { map } from "d3"
import * as d3 from "d3";
export default class caculator_modules {

    //Set calculator's operator, if A is occupied, set the B
    static setOperator(dimension){
        this.parent=dimension.parentname
        if(this.parent=="Sort"||this.parent=="Aggregation"||this.parent=="Filters"){
            this.dimensionA = dimension.name
            this.dimensionB = dimension.name
        }
        if(this.targname==undefined){
            this.targname=new Array()
            this.targname.push(dimension.targetname)
        }
            
        else{
            this.targname.push(dimension.targetname)
        }
        if(this.dimensionA == undefined)
            this.dimensionA = dimension.name
        else
            this.dimensionB = dimension.name
    }
    
    //Clear the operators
    static resetOperators(){

        this.dimensionA = undefined
        this.dimensionB = undefined
        this.targname=undefined
        this.parent=undefined
    }

    //Return if all the operactor is been setted
    static operatorsSetted(){
        // if(this.parent=="Sort"){
        //     return true
        // }
        if(this.dimensionA != undefined && this.dimensionB != undefined){

            return true
        }
        return false
    }
    static sum(data) {

        let name = "sum_"
        let that = this

        name = name + this.dimensionA + '_' + this.dimensionB
        let xdata=[]
        for(let i=0;i<data.length;i++){
            data[i][name]=parseFloat(data[i][that.dimensionA])+parseFloat(data[i][that.dimensionB])
            xdata[i]=data[i]
        }
        console.log(xdata)
        // data.forEach(function(d){
        //     d[name] = parseFloat(d[that.dimensionA]) + parseFloat(d[that.dimensionB])
        //     console.log(d)
        // })
        // console.log(cdata)
        return {'data':xdata,'name':name}
    }
    static reduce(data) {

        let name = 'reduce_'
        let that = this

        name = name + this.dimensionA + '_' + this.dimensionB

        let xdata=[]
        for(let i=0;i<data.length;i++){
            data[i][name]=parseFloat(data[i][that.dimensionA])-parseFloat(data[i][that.dimensionB])
            xdata[i]=data[i]
        }

        return {'data':xdata,'name':name}
    }
    static multiple(data) {

        let name = 'multi_'
        let that = this

        name = name + this.dimensionA + '_' + this.dimensionB

        let xdata=[]
        for(let i=0;i<data.length;i++){
            data[i][name]=parseFloat(data[i][that.dimensionA])*parseFloat(data[i][that.dimensionB])
            xdata[i]=data[i]
        }
       
        return {'data':xdata,'name':name}
    }
    static Filters(sele,data){
        let that=this
        let cdata=new Array()
        if(that.dimensionA!=undefined){
            let min=Number(d3.select(sele).select(".labelleft").text())
            let max=Number(d3.select(sele).select(".labelright").text())
            for(let i=0;i<data.length;i++){
                let num=Number(data[i][that.dimensionA])
                if(num>=min&&num<=max){
                    cdata.push(data[i])
                }
            }
            return  {'data':cdata,'name':that.dimensionA}
        }
    }
    static Aggregations(data){
        let that=this
        let name="Aggregation_"
        let xdata=new Array()
        if(that.dimensionA!=undefined){
            let xmap=new Map()
            name=name+this.dimensionA
            
            for(let i=0;i<data.length;i++){
                
                if(xmap.get(data[i][this.dimensionA])==null){
                    xmap.set(data[i][this.dimensionA],1)
                }
                else{
                    xmap.set(data[i][this.dimensionA],xmap.get(data[i][this.dimensionA])+1)
                    
                }
            }
           console.log(xmap.keys())
            for(let k of xmap.keys()){
                let x={}
                x[this.dimensionA]=k
                x[name]=xmap.get(k)
                console.log(x)
                xdata.push(x)
            }
            console.log(xdata,name)
           
        }
        return {'data':xdata,'name':name}
    }
    static Sorts(data){
        let name=""
        let that=this
        console.log(this.dimensionA,this.dimensionB)
        console.log(this.targname)
        if(this.dimensionA!=undefined){
            name=that.dimensionA
            if(this.targname[this.targname.length-1]=="ascending")
            {
                data.sort((a, b) => {
                    let as=a[that.dimensionA],bs=b[that.dimensionA]
                    if(!isNaN(Number(a[that.dimensionA]))){
                        as=parseFloat(a[that.dimensionA])
                        bs=parseFloat(b[that.dimensionA])
                    }
                    return (as < bs) ? -1 : (as > bs) ? 1 : 0
                })
                console.log(data,name)
                return {'data':data,'name':name}
            }
            if(this.targname[this.targname.length-1]=="descending")
            {
                data.sort((a, b) => {
                    let as=a[that.dimensionA],bs=b[that.dimensionA]
                    if(!isNaN(Number(a[that.dimensionA]))){
                        as=parseFloat(a[that.dimensionA])
                        bs=parseFloat(b[that.dimensionA])
                    }
                    return (as < bs) ? 1 : (as > bs) ? -1 : 0
                })
                console.log(data,name)
                return {'data':data,'name':name}
            }
        }
    }
    
  
}