import * as d3 from 'd3'

export default class BlueComponent {

    constructor(canvas, options) {
        
        let that = this
        this.frame = 2
        this.fill = '#F6BB42'
        this.stroke = 'none'
        this.name = 'UNAMED'
        this.type = 'default' 
        this.inPorts = [] //Inports of component
        this.outPorts = [] //Outports of component
        this.property = {}
        this.width = 180
        this.dx = 0 //Horizonal delta
        this.dy = 0 //Vertical delta
        this.x = 300 * Math.random() + 100 //Init horizonal position
        this.y = 100 * Math.random() + 100 //Init vertical position
        this.dimPreview = '' 
        this.filterRange = [] //If there have a filter plug in component
        this.isDelete = false
        this.delta = 0.1
        this.dividingLine = ''
        this.time = 1
        this.isLoading = true
        this.id = ''

        for(let key in options){
            //deep copy
            if(key == "inPorts" || key == "outPorts"){
                let _ports = options[key]
                _ports.forEach(function(d){
                    that[key].push(JSON.parse(JSON.stringify(d)))
                })
            }
            else{
                that[key] = options[key]
            }
             //Set the initial parameter 设置初始参数
        }
        
        this.width = this.name.length > 15 ? this.name.length * 10 : 180 
        this.height = this.inPorts.length > this.outPorts.length ? 50 + this.inPorts.length * 30 : 50 + this.outPorts.length * 30

        this.canvas = canvas

        this.container = canvas
            .datum({'x': this.x, 'y': this.y})
            .append('g')
            .attr('transform', function(d){
                return 'translate(' + d.x + ',' + d.y + ')'
            })
            .on('dblclick', function(d){
                that.setDelete()
            })

        ////////////////////////////////
        ///Add drag event to component
        ///////////////////////////////
        
        this.container.call(d3.drag()
            .on("start", function(d){
                that.dragstarted(this, d)
            })
            .on("drag",function(d){
                that.dragged(this, d)
            })
            .on("end", function(d){
                that.dragended(this, d)
            }));
        
        this.draw(this.type)
        
    }
    //force to solve the unknown error through deep copy
    getParmas() {
        let that = this
        let paramslist = ["frame", "fill", "stroke", "name",
         "type", "width", "dx", "dy", "x", "y", "dimPreview",
        "filterRange", "isDelete", "delta", "dividingLine", 
        "time", "isLoading", "id"]
        let params = {
            inPorts: [...that.inPorts],
            outPorts: [...that.outPorts],
        }
        let paramsT = new Object()
        paramslist.forEach(function(d){
            params[d] = that[d]
        })
        return {...params}
    }
    //Get the current position and delta translation
    getPos(){

        return {'x':this.x,'y':this.y, 'dx':this.dx, 'dy':this.dy}
    }
    animate(){

        let that = this

        this.time += 1

        if(this.frame > 8){

            this.delta = this.delta * -1
        }
        else if(this.frame < 2){

            this.delta = this.delta * -1
        }

        this.frame += this.delta

        this.container.select('#glow').select('feGaussianBlur').attr('stdDeviation', this.frame)


        let lineGenerator = d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveBasis)

        let linePoint = d3.range(0,11).map(function(d){
            return {'x': d * (that.width/10), 'y': 30}
        })

        let height = 30

        //linePoint.forEach(d => d.y = (Math.sin(d.x / 10 + this.time/20)) * height/6 + height)

        //linePoint[8].y = 30 - this.frame * 2

        this.dividingLine
            .attr('d',lineGenerator(linePoint))
        
    }
    //reset the delta translation
    resetDeltaPos(){

        this.dx = 0
        this.dy = 0
    }
    //After been connected by curve, the port name 
    setFieldName(name){
        if(this.outPorts.length > 0){
            this.outPorts[0].name = name
            this.outPorts[0].dimension_type = 'quantitative'
        }
    }
    //Add a new port to component
    addPort(type, port){

        port.text = port.text[0].toUpperCase() + port.text.slice(1, port.text.length)//array.slice:数组切片
        if(type == 'in'){
            this.inPorts.push(port)
        }
        else{
            this.outPorts.push(port)
        }
        //console.log(type,port);
        this.redraw()
    }
    //Draw the back retangle

    drawBack(height){
        this.container
            .append('rect')
            .attr('class','back')
            .attr("rx", 6)
            .attr("ry", 6)
            .attr('width', this.width)
            .attr('height', height || this.height)
            .attr('fill', this.fill)
            .attr('stroke', this.stroke)
            .attr('stroke-width', 2)

        //Container for the gradients
        var defs = this.container.append("defs");

        //Filter for the outside glow
        var filter = defs.append("filter")
            .attr("id","glow");

        filter.append("feGaussianBlur")
            .attr("stdDeviation","2")
            .attr("result","coloredBlur");

        var feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
            .attr("in","coloredBlur");

        feMerge.append("feMergeNode")
            .attr("in","SourceGraphic");

        //Apply to your element(s)
        this.container.selectAll(".back")
        .style("filter", "url(#glow)");
    }
    redraw(){
        this.container
        .selectAll('.port').remove()

        this.container
        .selectAll('.portname').remove()

        this.height = this.inPorts.length > this.outPorts.length ? 50 + this.inPorts.length * 30 : 50 + this.outPorts.length * 30
        this.container.selectAll('.back').attr('height', this.height)

        this.drawInPorts()
        this.drawOutPorts()

    }
    drawInPorts(){
        let that = this
        this.container
        .selectAll('port')
        .data(this.inPorts)
        .enter()
        .append('circle')
        .attr('class','port')
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', '2')
        .attr('cx', function(d){
            d.x = 20
            return d.x
        })
        .attr('cy', function(d,i){
            d.y = 20 + (i+1) * 30
            return d.y
        })
        .attr('r', 6)


        this.container
        .selectAll('portname')
        .data(this.inPorts)
        .enter()
        .append('text')
        .attr('class','portname')
        .attr("text-anchor", "start")
        .attr('alignment-baseline', 'central')
        .attr('x', function(d){
            return 30
        })
        .attr('y', function(d,i){
            return d.y 
        })
        .attr('fill','white')
        .attr('font-size','14')
        .text(function(d){
            return d.text
        })
    }
    drawOutPorts(){
        let that = this
        this.container
        .selectAll('port')
        .data(this.outPorts)
        .enter()
        .append('circle')
        .attr('class','port')
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', '2')
        .attr('cx', function(d,i){
            d.x = that.width - 20
            return d.x 
        })
        .attr('cy', function(d,i){
            d.y = 20 + (i+1) * 30
            return d.y
        })
        .attr('r', 6)
        
        this.container
        .selectAll('portname')
        .data(this.outPorts)
        .enter()
        .append('text')
        .attr('class','portname')
        .attr("text-anchor", "end")
        .attr('alignment-baseline', 'central')
        .attr('x', this.width - 30)
        .attr('y', function(d,i){
            return d.y
        })
        .attr('fill','white')
        .attr('font-size','14')
        .text(function(d){
            return d.text
        })
    }
    drawTitle(){

        let that = this

        this.container
        .append('text')
        .attr('x', this.width/2)
        .attr('y', 20)
        .attr("text-anchor", "middle")
        .attr('fill','white')
        .text(this.name.toUpperCase())

        let lineGenerator = d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveBasis)

        let linePoint = d3.range(0,11).map(function(d){

            return {'x': d * (that.width/10), 'y': 30}
        })

        this.dividingLine = this.container
        .append('path')
        .attr('d',lineGenerator(linePoint))
        .attr('stroke','#fff')
        .attr('fill','none')
        .attr('stroke-width','2')
       
    }
    drawTemp(){
        let that = this;
        let name = that.name;
        //console.log(that)
        let dataTodraw = ['A','B','C','D'];
        this.container
           // .data(dataTodraw)
            //.enter()
            .append("rect")
            .attr("class",'myRect')
            .attr("x",that.width*2/5)
            .attr("y",that.height*7/27)
            .attr("width",that.width/2)
            .attr("height",that.height*2/3-10)
            .attr("fill","#f47a55")

        let startX = that.width*2/5;
        let endX = that.width*9/10;
        let startY = that.height*7/27;
        let endY = that.height*25/27-10;
        let data1 = [[startX,(startY+endY)/2],[endX,(startY+endY)/2]]; //画横线的数据
        let data2 = [[(startX+endX)/2,startY],[(startX+endX)/2,endY]]; //画竖线的数据

        let data11 = [[startX,(endY-startY)*3/4+startY],[endX,(endY-startY)*3/4+startY]];
        let data22 = [[(endX-startX)*2/3+startX,startY],[(endX-startX)*2/3+startX,(endY-startY)*3/4+startY]];
        let data33 = [[(endX-startX)*2/3+startX,startY+(endY-startY)*3/8],[endX,startY+(endY-startY)*3/8]];
        
        let lineGenerator = d3.line()
            .x(function(d){
                return d[0];
            })
            .y(function(d){
                return d[1];
            });
        
        if(name === 'Template A'){
            this.container
        .append("path")
        .attr('stroke','#fff')
        .attr('fill','none')
        .attr('stroke-width','2')
        .attr('d',lineGenerator(data1));

        this.container.append("path")
        .attr('stroke','#fff')
        .attr('fill','none')
        .attr('stroke-width','2')
        .attr('d',lineGenerator(data2));

        this.container.selectAll(".info")
            .data(dataTodraw)
            .enter()
            .append("text")
            .attr("class","info")
            .attr("text-anchor", "middle")
            .attr('fill','white')
            .attr("x",function(d,i){
                if(i===0||i===2){
                    return (endX-startX)/4+startX
                }
                else{
                    return (endX-startX)*3/4+startX
                }
            })
            .attr("y",function(d,i){
                if(i===1||i===0){
                    return (endY-startY)/4+startY+6
                }
                else{
                    return (endY-startY)*3/4+startY+6
                }
            })
            .text(function(d,i){
                return d
            })
        }
        else{
            this.container
        .append("path")
        .attr('stroke','#fff')
        .attr('fill','none')
        .attr('stroke-width','2')
        .attr('d',lineGenerator(data11));

        this.container.append("path")
        .attr('stroke','#fff')
        .attr('fill','none')
        .attr('stroke-width','2')
        .attr('d',lineGenerator(data22));
       
        this.container.append("path")
        .attr('stroke','#fff')
        .attr('fill','none')
        .attr('stroke-width','2')
        .attr('d',lineGenerator(data33));
        
        this.container.selectAll(".info")
            .data(dataTodraw)
            .enter()
            .append("text")
            .attr("class","info")
            .attr("text-anchor", "middle")
            .attr('fill','white')
            .attr("x",function(d,i){
                if(i===0){
                    return (endX-startX)/3+startX
                }
                else if(i===3){
                    return (endX-startX)/2+startX
                }
                else{
                    return (endX-startX)*5/6+startX
                }
            })
            .attr("y",function(d,i){
                let thisY;
                if(i===0){
                    thisY= startY+(endY-startY)*3/8
                }
                else if(i ===1){
                    thisY= startY+(endY-startY)*3/16
                }
                else if(i===2){
                    thisY= startY+(endY-startY)*9/16
                }
                else{
                    thisY= startY+(endY-startY)*7/8
                }
                return thisY + 6
            })
            .text(function(d,i){
                return d
            })
    
    
    }

    }
    draw(type){
       
        if(type === 'Layout'){
            this.width *= 1.5
            this.drawBack()
            this.drawTitle()
            this.drawInPorts()
            this.drawOutPorts()
            this.drawTemp()
        }else{
        this.drawBack()
        this.drawTitle()
        this.drawInPorts()
        this.drawOutPorts()
        }
    }
    dragstarted(node, d) {
       // d3.select(node).raise().classed("active", true);
    }
    dragged(node, d){
        let that = this
        
        d3.select(node).attr("transform", function(q){
            
            //console.log("d3.event.x y, that.x,y", d3.event.x, d3.event.y, that.x, that.y)
            that.dx = d3.event.x - that.x
            that.dy = d3.event.y - that.y
            that.x  = d3.event.x
            that.y  = d3.event.y
            d.x = d3.event.x
            d.y = d3.event.y
            return 'translate(' + d.x + ',' + d.y + ')'
        });
        
        
        this.container.selectAll('.port')
            .attr('none', function(d){
            d.parentX = that.x
            d.parentY = that.y
        })
        
    }
    dragended(node,d) {
        //d3.select(node).classed("active", false);
    }
    //Get all the ports' circles
    getAllCircles(){

        return this.container.selectAll('.port')
    }
    //Get all the ports
    getAllPorts(){

        let that = this
        let ret = new Object()
        ret['inPorts'] = JSON.parse(JSON.stringify(this.inPorts))
        ret['outPorts'] = JSON.parse(JSON.stringify(this.outPorts))

        return ret
    }
    //Shows the data distribution in component
    showDataPreview(data, dim){

        //console.log(data)
        if(!this.container.select('#showPanel').empty()){

            return 
        }

        let showPanel = this.container.append('g').attr('id','showPanel')

        this.dimPreview = dim
             
        let that = this
        let bins = {}
        
        let data_max = d3.max(data, d => parseFloat(d[dim]))
        let data_min = d3.min(data, d => parseFloat(d[dim]))

        let factor = (data_max - data_min) / 20

        let brush = d3.brushX()
            .extent([[this.width * 0.1, 10], [this.width * 0.9, 50]])
            .on("brush end", function(d){
                brushed(that)
            });
  
        data.forEach(function(d){

            let q = parseInt((d[dim] - data_min) / factor)

            if(q in bins)
                bins[q] += 1
            else
                bins[q] = 1
        })


        let bins_array = []

        for(let key in bins){

            bins_array.push({'key': parseInt(key) * factor + data_min, 'value': bins[key]})
        }

        let max_x = d3.max(bins_array, d => d.key)
        let min_x = d3.min(bins_array, d => d.key)

        let max_y = d3.max(bins_array, d => d.value)
        let min_y = d3.min(bins_array, d => d.value)

        if(max_y == min_y) min_y -= 1

        let x_scale = d3.scaleLinear()
        .domain([min_x, max_x])
        .range([that.width * 0.1, that.width * 0.9])

        let y_scale = d3.scaleLinear()
        .domain([min_y, max_y])
        .range([0,40])

        function brushed(that){

            if (!d3.event.sourceEvent) return; // Only transition after input.
            if (!d3.event.selection) return; // Ignore empty selections.

            let selection = d3.event.selection || x_scale.range();
            let range = selection.map(x_scale.invert, x_scale);
            that.filterRange = range

            that.container.selectAll('.binRect').attr('fill', function(d){

                if(d.key <= that.filterRange[1] && d.key >= that.filterRange[0]){

                    return 'steelblue'
                }

                return '#ccc'
            })
        }

        this.filterRange = [min_x, max_x]

        let offset = 30

        showPanel.append('line')
        .attr('x1', that.width * 0.1)
        .attr('y1', that.height + offset)
        .attr('x2', that.width * 0.9)
        .attr('y2', that.height + offset)
        .attr('stroke','black')

        let binsChart = showPanel
        .append('g')
       // .attr('transform', function(d){
       // //    return 'translate(' + that.width * 0.1 + ',0' + ')' 
       /// })
        .selectAll('bins')
        .data(bins_array)
        .enter()
        .append('rect')
        .attr('class','binRect')
        .attr('x', d => {
            return x_scale(d.key)
        })
        .attr('y', d => that.height + offset - y_scale(d.value) / 2)
        .attr('width', d => 70 / bins_array.length)
        .attr('height', function(d){
            return 0
        })
        .attr('fill','#ccc')
        .attr('stroke','none')

        binsChart.transition()
        .duration(500)
        .attr('delay', 500)
        .attr('height', d => y_scale(d.value))

        showPanel.append('text')
        .attr('x', that.width * 0.1)
        .attr('y', that.height + offset)
        .attr('alignment-baseline', 'central')
        .attr('text-anchor','end')
        .attr('fill','white')
        .text(parseInt(min_x))

        showPanel.append('text')
        .attr('x', that.width * 0.9)
        .attr('y', that.height + offset)
        .attr('alignment-baseline', 'central')
        .attr('fill','white')
        .text(parseInt(max_x))

        showPanel.append('text')
        .attr('x', that.width * 0.5)
        .attr('y', that.height + offset + 25)
        .attr('text-anchor','center')
        .attr('alignment-baseline', 'central')
        .attr('fill','white')
        .text(parseInt(min_y))

        showPanel.append('text')
        .attr('x', that.width * 0.5)
        .attr('y', that.height + offset - 25)
        .attr('text-anchor','center')
        .attr('alignment-baseline', 'central')
        .attr('fill','white')
        .text(parseInt(max_y))

        showPanel.append("g")
        .attr("class", "brush")
        .call(brush)
        .attr('transform','translate(0,' + that.height + ')')

        this.container.selectAll('.back')
        .transition()
        .attr('height',  that.height + 70)
    }
    //Get the selected range of users' filter operation
    getFilterRangeAndDim(){

        return {'range':this.filterRange, 'dim':this.dimPreview}
    }
    //After data joined, add the data name to the ports' name 
    addDataName2Ports(){
        this.outPorts.forEach(d => {
            d.name = d.parent + '&' + d.name;
        })
    }
    setDelete(){
        this.isDelete = !this.isDelete
    }
    removeGraph(){
        this.container.selectAll('*').remove()
        this.container.remove()
    }
    getId(){
        return this.id
    }
    getType(){
        return this.type
    }
}
