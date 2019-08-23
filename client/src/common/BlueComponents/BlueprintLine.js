import * as d3 from 'd3'

let TextBlueLine = function(container, parent, point, source, sourceid, coverColor){
    //私有属性
    var attribu = {
        sourcePoint : '',
        sourcePort : '',
        targetPort : '',
        points : '', //用于存储预览曲线时的两点
        storePoints : '', //初始点和预览点
        isWaitPath : false, //false -> path正在移动 true -> path已经确定
        circleCoordinatesX : '', //预览路径时末端端点X
        circleCoordinatesY : '', //预览路径时末端端点Y
        pathCount : 1,
        container : '',
        //existingPort : []
        toUpdateSourcePoint : false, // false -> update target point / true -> update source point
        count : 10000,
        animateSpeed : 1,
        coverLine : '',
        baseLine : '',
        sourceParent : '',
        targetParent : '',
        targetId : '',
        sourceId : '',
        isDeleted : false,
        coverColor : "#808080",
        randomCoverId: ''
    }
    //私有方法

    function calculateCurvePointInterpolation(points) {
        //description 通过两点计算出中间曲线路径两个锚点
        //input [[xa,ya],[xb,yb]]
        //output [[xa,ya],[x1,y1],[x2,y2],[xb,yb]]
        let xa = points[0][0],
            ya = points[0][1],
            xb = points[1][0],
            yb = points[1][1];

        //[[xa,ya],[x1,y1],[x2,y2],[xb,yb]]
        let xabs = Math.abs(xa - xb),
            yabs = Math.abs(ya - yb),
            pControl = 0.3,
            x1, y1, x2, y2;

        //[xb,yb]相对于[xa,ya]的位置
        if ((xa == xb && ya > yb) || (xa == xb && ya < yb)) {
            //位于y轴负向 y轴正向
            x1 = xa;
            y1 = ya;
            x2 = xb - yabs * pControl;
            y2 = yb;
        }
        else if ((xa < xb && ya == yb) || (xa > xb && ya == yb)) {
            //位于x轴正向 位于x轴负向
            x2 = xa;
            y2 = ya;
            x1 = xb;
            y1 = yb;
        }
        else if ((xa < xb && ya > yb) || (xa < xb && ya < yb)) {
            //位于右上右下
            x2 = xb - xabs * pControl;
            y2 = yb;
            x1 = xa + xabs * pControl;
            y1 = ya;
        }
        else if ((xa > xb && ya < yb) || (xa > xb && ya > yb)) {
            //位于左上左下
            x2 = xb + xabs * pControl;
            y2 = yb;
            x1 = xa - xabs * pControl;
            y1 = ya;
        }
        else{

            x2 = xb;
            y2 = yb;
            x1 = xa;
            y1 = ya;
        }
        points = [[xa, ya], [x1, y1], [x2, y2], [xb, yb]]
        return points
    }

    function generateCurveLine(points) {
        //description 根据d3.curveBasis生成曲线
        //input [[xa,ya],[x1,y1],[x2,y2],[xb,yb]]
        //曲线生成器

        let lineGenerator = d3.line().curve(d3.curveBasis),
            pathData = lineGenerator(points),
            curveWidth = '3px';

        if (attribu.baseLine == '') {
            //没有待绘制路径,路径第一次绘制
            attribu.isWaitPath = true
            attribu.baseLine = attribu.container.append('path')
                .attr('d', pathData)
                .style('fill', 'none')
                .style('stroke', '#dcdcdc')
                .attr('stroke-width', curveWidth)
                .on("mouseover", baseLine_handleMouseOver)
                .on("mouseout", baseLine_handleMouseOut)
                .on('click', clickLineDelete)
        }
        else {
            //存在待绘制路径,反复绘制实现路径预览
            attribu.baseLine.attr('d', pathData)
        }
    }

    function updateCoverLine(){
        let points = calculateCurvePointInterpolation(attribu.storePoints)
        let lineGenerator = d3.line().curve(d3.curveBasis),
            pathData = lineGenerator(points);
        if(attribu.coverLine != ''){
            attribu.coverLine.attr('d', pathData)
        }
    }

    function generateAnimateCoverCurveLine() {

        //曲线生成器
        let points = calculateCurvePointInterpolation(attribu.storePoints)
        let lineGenerator = d3.line().curve(d3.curveBasis),
            pathData = lineGenerator(points),
            curveWidth = '3px'

        //生成渐变
        let defs = attribu.container.append('defs')
        let linearGradient = defs.append('linearGradient')
            .attr('id', attribu.randomCoverId)
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%')

        linearGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", attribu.coverColor);

       /* linearGradient.append("stop")
            .attr("offset", "50%")
            .style("stop-color", '#12D2FF');

        linearGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", '#1240FF');*/

        linearGradient.append("stop")
            .attr("offset", "100%") 
            .style("stop-color", attribu.coverColor)

        //绘制cover曲线
        attribu.coverLine = attribu.container.append('path')
            .attr('d', pathData)
            .style('fill', 'none')
            .style('stroke', "url(#" + attribu.randomCoverId + ")")
            .attr('class', 'rgbLine')
            .attr('stroke-width', curveWidth)

        //获取生成曲线长度并设定线段间隔为曲线长度
        let totalLength = attribu.coverLine.node().getTotalLength()
        attribu.coverLine.style('stroke-dasharray', 8 + "," + 8)
    }

    function generateEndPoints() {
        let that = this
        let pathCount = attribu.pathCount
        let circleSourceId = 'mySourceCircle_' + attribu.pathCount;
        let circleTargetId = 'myTargetCircle_' + attribu.pathCount;

        let circleSource = attribu.container.append('circle')
            .attr('id', circleSourceId)
            .attr('cx', that.storePoints[0][0])
            .attr('cy', that.storePoints[0][1])
            .attr('pathCount', pathCount)
            .attr('pointPosition', '0') // 0 -> source that.toUpdateSourcePoint = true
            .attr('r', 2)
            .style('opacity', 1)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

        let circleTarget = attribu.container.append('circle')
            .attr('id', circleTargetId)
            .attr('cx', that.storePoints[1][0])
            .attr('cy', that.storePoints[1][1])
            .attr('pathCount', pathCount)
            .attr('pointPosition', '1') // 1 -> target that.updatePoint = false
            .attr('r', 2)
            .style('opacity', 1)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

        function dragstarted(d) { }
        function dragged(d) {
            //端点随着鼠标移动
            d3.select(this).attr("cx", d3.event.x).attr("cy", d3.event.y);
            //judge source point / target point
            that.toUpdateSourcePoint = d3.select(this).attr('pointPosition') == '0' ? true : false

            let coverPathId = 'myCoverPath_' + d3.select(this).attr('pathCount'),
                coverPath = d3.select('#' + coverPathId);

            //删除coverPath
            coverPath.remove()

            let coordinates = d3.mouse(this)
            that.dynamicGenerateCurveLine(coordinates)
        }
        function dragended(d) {
            generateAnimateCoverCurveLine()
            that.isWaitPath == false
        }
    }

    function baseLine_handleMouseOver(d, i){
        d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0.1);
        if(attribu.coverLine != ''){
            attribu.coverLine
                .transition()
                .duration(200)
                .attr("stroke-width", '7px');
        }
    }

    function baseLine_handleMouseOut(d, i){
        d3.select(this)
            .transition()
            .duration(500)
            .style("opacity", 1);

        if(attribu.coverLine != ''){
            attribu.coverLine
                .transition()
                .duration(500)
                .attr("stroke-width", '3px');
        }
    }

    function clickLineDelete(){
        console.log('click line')
        forceRemove()
        //this.forceRemove();
    }

    function forceRemove(){
        attribu.container.remove()
        attribu.isDeleted = true
    }

    //特权方法
    this.setAttributions = function(){
        attribu.sourcePoint = point
        attribu.sourcePort = source
        attribu.points = [point, point]
        attribu.storePoints = [point, point]
        attribu.container = container.append('g')
        attribu.sourceParent = parent
        attribu.sourceId = sourceid
        attribu.coverColor = coverColor
        attribu.randomCoverId = "linearColor" + String(new Date()-0)
    }
    this.parentPosUpdated = function(dx, dy, inPorts, outPorts, curEleid) {
        
        if(attribu.sourceId == curEleid){
            attribu.storePoints[0][0] += dx
            attribu.storePoints[0][1] += dy
            this.dynamicGenerateCurveLine()
            updateCoverLine()
        }
        else if(attribu.targetId == curEleid){
            attribu.storePoints[1][0] += dx
            attribu.storePoints[1][1] += dy
            this.dynamicGenerateCurveLine()
            updateCoverLine()
        }
        
    }
    this.dynamicGenerateCurveLine = function(coordinates){

        if(coordinates){

            attribu.circleCoordinatesX = coordinates[0]
            attribu.circleCoordinatesY = coordinates[1]
    
            if (attribu.toUpdateSourcePoint == false && attribu.storePoints.length == 2) {
                //update target point [ [] , [to do] ]
                attribu.storePoints.pop()
                attribu.storePoints.push([attribu.circleCoordinatesX, attribu.circleCoordinatesY])
            }
    
            if (attribu.toUpdateSourcePoint == true && attribu.storePoints.length == 2) {
                //update source point [ [to do] , [] ]
                attribu.storePoints.shift()
                attribu.storePoints.unshift([attribu.circleCoordinatesX, attribu.circleCoordinatesY])
            }
        }
       
        let p = calculateCurvePointInterpolation(attribu.storePoints)
        generateCurveLine(p)
    }
    this.findNearestPoint = function(point, existingPort){
        let that = this
        if (existingPort.length > 0) {
            let nearPoints = []
            existingPort.forEach(function (port) {
                let x = port.x + port.parentX
                let y = port.y + port.parentY
                let dis = (x - point[0]) * (x - point[0]) +
                    (y - point[1]) * (y - point[1])
                if (dis < 400) {
                    nearPoints.push({ 'dis': dis, 'port': port, 'pos': [x, y], 'ID': port.id})
                }
            })

            nearPoints = nearPoints.sort(function (a, b) {
                return a.dis - b.dis
            })
            
            
            if (nearPoints[0] != undefined && nearPoints[0] != null) {
                attribu.container.on('mousemove.circle', null)
                attribu.targetPort = nearPoints[0].port
                attribu.targetParent = nearPoints[0].port.id
                attribu.storePoints[1] = nearPoints[0].pos

                generateAnimateCoverCurveLine()
                this.dynamicGenerateCurveLine()
            
                attribu.isWaitPath == false
                attribu.targetId = nearPoints[0].ID

            }

        }

    }
    this.animate = function(){
        if(attribu.targetPort != ''){
            attribu.count = attribu.count - attribu.animateSpeed;
            d3.selectAll('.rgbLine')
                .style('stroke-dashoffset', attribu.count)
        }
    }
    this.remove = function(){
        forceRemove()
    }
    this.setExstingPorts = function(ports){
        attribu.existingPort = ports;
    }
    this.getConnectInfo = function(){
        let re = {
            "source": attribu.sourcePort,
            "target": attribu.targetPort,
            "sourceId": attribu.sourceId,
            "targetId": attribu.targetId,
            "isDeleted": attribu.isDeleted
        }
        return re
    }
    //对象共有属性
    //构造器
    this.setAttributions()
}

export default TextBlueLine;