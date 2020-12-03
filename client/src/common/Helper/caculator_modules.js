import { map } from "d3"
import * as d3 from "d3";
export default class caculator_modules {

    //Set calculator's operator, if A is occupied, set the B
    static setOperator(dimension){
        this.parent=dimension.parentname
        // if(this.parent=="Aggregation"){
        //     if(this.dimensionA == undefined)
        //     this.dimensionA = dimension.name
        //     else
        //     this.dimensionB = dimension.name
        // }
        if(this.parent=="Sort"||this.parent=="Filters"){
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
        // if(this.parent=="Aggregation" && this.dimensionA != undefined)
        if(this.dimensionA != undefined && this.dimensionB != undefined){

            return true
        }
        return false
    }
    static sum(data) {

        let name = "sum_"
        let that = this
        console.log(this.dimensionA,this.dimensionB)
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
    static features(data){
        let that=this;
        let min=0;
        let max=0;
        let bins=100;
        let bin_length=0;
        let startbin=0
        let bindata={}
        if(that.dimensionA!=undefined){
            min=parseFloat(data[0][that.dimensionA])
            max=parseFloat(data[0][that.dimensionA])
            for(let i=0;i<data.length;i++){
                if(parseFloat(data[i][that.dimensionA])<min){
                    min=parseFloat(data[i][that.dimensionA])
                }
                if(parseFloat(data[i][that.dimensionA])>max){
                    max=parseFloat(data[i][that.dimensionA]);
                }
            }
            bin_length=(max-min)/data.length
            startbin=min;
            while(startbin<=max){
                if(bindata[(startbin+bin_length)/2]==undefined){
                    bindata[(startbin+bin_length)/2]=[]
                }
                startbin=startbin+bin_length
            }
            data.sort((a,d)=>parseFloat(a[that.dimensionA])>parseFloat(b[that.dimensionB])?1:-1)
            // for(let i=0;i<data.length;i++){
            //     if(parseFloat(data[i][that.dimensionA])){

            //     }
            // }
            console.log(data)
        }
        // let cdata=new Array()
        // let testdata=[]
        // if(this.dimensionA!=undefined){
        //     let bins=d3.bin()
        // }
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
    static Aggregations(choose,data){
        let that=this
        let name="Aggregation_"
        console.log(this.targname)
        console.log(choose)
        let ks=new Array()
        for(let k in data[0]){
            ks.push(k)
            if(!isNaN(data[0][k])){
                name=k
            }
        }
        if(data[0][this.dimensionB]==undefined)
        return {'data':data,'name':name}
        if(this.targname.length==1){
            if(this.targname[0]=="Dimension"){
                let xdata=new Array()
                let xmap=new Map()
                name=name+"count_"+this.dimensionA
            
                for(let i=0;i<data.length;i++){
                
                    if(xmap.get(data[i][this.dimensionA])==null){
                                xmap.set(data[i][this.dimensionA],1)
                    }
                    else{
                            xmap.set(data[i][this.dimensionA],xmap.get(data[i][this.dimensionA])+1)
                    }
                }
                for(let k of xmap.keys()){
                    let x={}
                    x[this.dimensionA]=k
                    x[name]=xmap.get(k)
                    xdata.push(x)
                }
                return {'data':xdata,'name':name}
                    
            }
            if(this.targname[0]=="Measure"){
                if(!isNaN(Number(data[0][this.dimensionA]))){
                    if(choose=="Sum"){
                        let sum=0
                        name=name+"sum_"+this.dimensionA
                        for(let i=0;i<data.length;i++){
                            sum=sum+Number(data[i][this.dimensionA])
                        }
                        return {'data':{name:sum},'name':name}
                    }
                    if(choose=="Avg"){
                        let avg=0
                        name=name+"savg_"+this.dimensionA
                        for(let i=0;i<data.length;i++){
                            avg=avg+Number(data[i][this.dimensionA])
                        }
                        return {'data':{name:avg/data.length},'name':name}
                    }
                    if(choose=="Count"){
                        let xdata=new Array()
                        let xmap=new Map()
                        name=name+"count_"+this.dimensionA
            
                        for(let i=0;i<data.length;i++){
                
                            if(xmap.get(data[i][this.dimensionA])==null){
                                xmap.set(data[i][this.dimensionA],1)
                            }
                            else{
                                xmap.set(data[i][this.dimensionA],xmap.get(data[i][this.dimensionA])+1)
                            }
                        }
                        for(let k of xmap.keys()){
                            let x={}
                            x[this.dimensionA]=k
                            x[name]=xmap.get(k)
                            xdata.push(x)
                        }
                        return {'data':xdata,'name':name}
                    }
                }
            }
        }
        else{
            if(this.targname.length==2){
                let exchange=''
                let exchange1=""
                if(this.targname[0]!="Dimension"){
                    exchange=this.this.targname[0]
                    this.targname[0]=this.targname[1]
                    this.targname[1]=exchange
                    exchange1=this.dimensionA
                    this.dimensionA=this.dimensionB
                    this.dimensionB=exchange1
                }
                console.log(this.dimensionA,this.dimensionB)
                let xdata=new Array()
                let xmap=new Map()
                if(choose=="Sum"){
                    name=name+"sum_"+this.dimensionA
                    console.log(data)
                    for(let i=0;i<data.length;i++){
                        if(xmap.get(data[i][this.dimensionA])==null){
                            console.log(data[i][this.dimensionB],Number(data[i][this.dimensionB]),parseFloat(data[i][this.dimensionB]))
                            xmap.set(data[i][this.dimensionA],Number(data[i][this.dimensionB]))
                        }
                        else{
                            xmap.set(data[i][this.dimensionA],xmap.get(data[i][this.dimensionA])+Number(data[i][this.dimensionB]))
                        }
                    }
                    for(let k of xmap.keys()){
                        let x={}
                        x[this.dimensionA]=k
                        x[name]=xmap.get(k)
                        xdata.push(x)
                    }
                    return {'data':xdata,'name':name}
                }
                if(choose=="Count"){
                    name=name+"count_"+this.dimensionA
                    for(let i=0;i<data.length;i++){
                        if(xmap.get(data[i][this.dimensionA])==null){
                            xmap.set(data[i][this.dimensionA],1)
                        }
                        else{
                            xmap.set(data[i][this.dimensionA],xmap.get(data[i][this.dimensionA])+1)
                        }
                    }
                    for(let k of xmap.keys()){
                        let x={}
                        x[this.dimensionA]=k
                        x[name]=xmap.get(k)
                        xdata.push(x)
                    }
                    return {'data':xdata,'name':name}
                }
                if(choose=="Avg"){
                    let cmap=new Map()
                    name=name+"avg_"+this.dimensionA
                    for(let i=0;i<data.length;i++){
                        if(xmap.get(data[i][this.dimensionA])==null){
                            xmap.set(data[i][this.dimensionA],1)
                            cmap.set(data[i][this.dimensionA],Number(data[i][this.dimensionB]))
                        }
                        else{
                            xmap.set(data[i][this.dimensionA],xmap.get(data[i][this.dimensionA])+1)
                            cmap.set(data[i][this.dimensionA],xmap.get(data[i][this.dimensionA])+Number(data[i][this.dimensionB]))
                        }
                    }
                    for(let k of xmap.keys()){
                        let x={}
                        x[this.dimensionA]=k
                        x[name]=cmap.get(k)/xmap.get(k)
                        xdata.push(x)
                    }
                    return {'data':xdata,'name':name}
                }
            }
        }
        return {'data':data,'name':this.dimensionA}
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