<template>
  <div id="mapx" ref="basicMapbox"></div>
</template>

<script>
    import mapboxgl from 'mapbox-gl'

    export default {
        name: "AppMapx",
        data(){
            return {
                data:[],
                map:null,
                style: {
                    'map-style':{
                        style: 'light-v10',// 'light-v10','dark-v10','outdoors-v11','satellite-v9'
                        center:'',
                        zoom:''
                    },
                    'point-style':{
                        'circle-color':'#ff355a',
                        'circle-opacity':1,
                        'circle-radius':10,
                        'circle-stroke-color':'#ffffff',
                        'circle-stroke-opacity':'',
                    },
                    'line-style':{
                        'line-color':'#f9fdff',
                        'line-opacity':.6,
                        'line-width':4
                    },
                    'polygon-style':{
                        'fill-color':'#57dd95',
                        'fill-opacity':.5,
                        'fill-outline-color':'#646464'
                    }
                }
            }
        },
        mounted(){
            // this.map_config()
            this.data = this.$store.state.mapdata

            console.log(this.$store.state.mapdata);

            if(this.data.maptype ==="TrackMap")
            {
                this.map_config()

                this.map.setCenter([104.732971, 31.465042])
                this.map_lines('',this.data.data.map(d=>{return {path:eval(d.path).map(s=>[s[1],s[0]])}}))
            }


            if(this.data.maptype ==="ScatterMap"){
                this.map_config()
                // console.log(data.data)
                this.map.setCenter([this.data.data[0].lng,this.data.data[0].lat])
                this.map_points(null,this.data.data)
            }
            if(this.data.maptype==="HeatMap"){
                // console.log(data)
                this.map_config()
                this.map.setCenter([this.data.data[0].lng,this.data.data[0].lat])
                this.map_heatmap(null,this.data.data)
            }
            // this.map_polygons('',[{
            //     polyline:[[104.732971, 31.465042], [104.642886, 31.464969],[104.532076, 31.454854]]
            // }])

            //   this.map_lines('',[{
            //     path:[[104.732971, 31.465042], [104.642886, 31.464969],[104.532076, 31.454854]]
            // }])
            // this.map_points(null,[{lng:104.732971, lat:31.465042}])

            // this.map_heatmap(null,[
            //     {lng:116.357701,lat:40.012707},
            //     {lng:116.323206,lat:39.941051},
            //     {lng:116.389896,lat:39.898109},
            //     {lng:116.280087,lat:39.930871}
            // ])
        },
        methods:{
            /*------------------Mapbox Init----------------------*/
            map_config() {
                mapboxgl.accessToken = 'pk.eyJ1IjoicWFzaW01NyIsImEiOiJjanZzMTN4YmYwbTJoNDRtc3lveTUycjR5In0.NHo5uv7_XQpM7fPEus_M-w';
                this.map = new mapboxgl.Map({
                    container: this.$refs.basicMapbox,
                    style: `mapbox://styles/mapbox/${this.style["map-style"].style}`, //地图样式自定义
                    center: [104.732971, 31.465042], // 地图中心自定义
                    zoom: 12  // 设置地图比例
                    //pitch:50
                });
            },
            /*------------------------------------------------------*/
            map_center(lng,lat){
                this.map.on('load',()=>{
                    this.map.setCenter([lng, lat])
                })
            },
            map_fly(lng,lat){
                this.map.on('load',()=>{
                    this.map.flyTo({center:[lng,lat]});
                })
            },
            map_style(name){
                this.map.on('load',()=>{
                    map.setStyle('mapbox://styles/mapbox/' + name);
                })
            },
            /*------------------Points Drawing----------------------*/
            map_points(style,data){
                // this.map.setStyle('mapbox://styles/mapbox/' +style["map-style"]['style']
                let points_features = []

                // data.forEach( (d) =>{
                //     points_features.push({
                //         "type": "Feature",
                //         "properties": {
                //             "color": 'red',
                //             "opacity":.8,
                //             "radius":20
                //         },
                //         "geometry": {
                //             "type": "Point",
                //             "coordinates": [d.lng, d.lat]
                //         }
                //     });
                // });
                for(let i=0;i<data.length;i++){
                    points_features[i]={
                        "type": "Feature",
                        "properties": {
                            "color": 'red',
                            "opacity":.8,
                            "radius":20
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [data[i].lng, data[i].lat]
                        }
                    }
                }

                let points_source = {
                    "type": "geojson",
                    'data': {
                        "type": "FeatureCollection",
                        "features": points_features
                    }
                }

                this.map.on('load',()=>{
                    this.map.addSource("points_source", points_source);
                    this.map.addLayer({
                        "id": "points",
                        "source": "points_source",
                        "minzoom":7,
                        "type": "circle",
                        "paint": {
                            "circle-radius": this.style["point-style"]['circle-radius'],
                            "circle-color":this.style["point-style"]['circle-color'],
                            "circle-opacity":this.style["point-style"]['circle-opacity'],
                        }
                    })
                })
            },
            /*------------------------------------------------------*/
            /*
            *****Points Style*****
            * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle
            circle-blur
            *circle-color
            *circle-opacity
            circle-pitch-alignment  //Orientation of circle when map is pitched.
            circle-pitch-scale //Controls the scaling behavior of the circle when the map is pitched.
            *circle-radius
            circle-sort-key  //Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key.
            *circle-stroke-color
            *circle-stroke-opacity
            *circle-stroke-opacity
            circle-translate  //The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively.
            circle-translate-anchor  //Controls the frame of reference for circle-translate.
            *visibility  //Whether this layer is displayed.
            */

            /*------------------Lines Drawing----------------------*/
            map_lines(style,data){

                let lines_features = []

                data.forEach( d=> {
                    lines_features.push({
                        'type': 'Feature',
                        'properties':{
                            'color': "#fff",
                        },
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': d.path
                        }
                    });
                });

                let lines_source = {
                    'type': 'geojson',
                    'data': {
                        "type": "FeatureCollection",
                        "features": lines_features
                    }
                }

                this.map.on('load',()=>{
                    this.map.addSource("lines_source",lines_source)
                    this.map.addLayer({
                        'id': 'lines',
                        'type': 'line',
                        'source': 'lines_source',
                        'paint': {
                            'line-width': this.style["line-style"]['line-width'],
                            'line-color': this.style["line-style"]['line-color'],
                            'line-opacity':this.style["line-style"]['line-opacity'],
                        }
                    });
                })

            },
            /*------------------------------------------------------*/
            /*
            *****Lines Style*****
            * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line
            line-blur
            line-cap  //The display of line endings. One of "butt", "round", "square". Defaults to "butt".
            *line-color
            line-dasharray
            line-gap-width
            line-gradient
            line-join  //Optional enum. One of "bevel", "round", "miter". Defaults to "miter".
            line-miter-limit
            line-offset
            *line-opacity
            line-pattern
            line-round-limit
            line-sort-key
            line-translate
            line-translate-anchor
            *line-width
            *visibility
            */

            /*------------------polygons Drawing----------------------*/
            map_polygons(style,data){
                let polygons_features = []
                data.forEach(d=>{
                    polygons_features.push({
                        'type': 'Feature',
                        "properties": {
                            'color': '#cc5039',
                        },
                        'geometry': {
                            'type': 'Polygon',
                            'coordinates': [d.polyline]
                        }
                    });
                })

                let polygons_source = {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": polygons_features
                    }
                }

                this.map.on('load',()=>{
                    this.map.addSource('polygons_source',polygons_source)
                    this.map.addLayer({
                        'id': 'polygons',
                        'type': 'fill',
                        'source': 'polygons_source',
                        'layout': {},
                        'paint': {
                            'fill-color': this.style["polygon-style"]['fill-color'],
                            'fill-opacity': this.style["polygon-style"]['fill-opacity'],
                            'fill-outline-color':this.style["polygon-style"]['fill-outline-color'],
                        }
                    });
                })

            },
            /*------------------------------------------------------*/
            /*
            ****Polygons Style*****
            * //https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#fill
            fill-antialias
            *fill-color
            *fill-opacity
            *fill-outline-color
            fill-pattern
            fill-sort-key
            fill-translate
            fill-translate-anchor
            *visibility
            */

            /*------------------Heatmap Drawing----------------------*/
            map_heatmap(style,data){
                let heat_features = []

                data.forEach( (d) =>{
                    heat_features.push({
                        "type": "Feature",
                        "properties": {
                            "color": "#eae33f",
                            "opacity":0.5,
                            "radius":5
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [d.lng, d.lat]
                        }
                    });
                });

                let heat_source = {
                    "type": "geojson",
                    'data': {
                        "type": "FeatureCollection",
                        "features": heat_features
                    }
                }

                this.map.on('load',()=>{
                    this.map.addSource('heatmap_source',heat_source)
                    this.map.addLayer({
                        "id": "heatmap",
                        "type": "heatmap",
                        "source": "heatmap_source",
                        "paint": {
                            // "heatmap-color": [
                            //     "interpolate",
                            //     ["linear"],
                            //     ["heatmap-density"],
                            //     0,
                            //     "rgba(0, 0, 255, 0)",0.1,
                            //     "royalblue",0.3,
                            //     "cyan",0.5,
                            //     "lime",0.7,
                            //     "yellow",1,
                            //     "red"]
                        }
                    })
                })
            }

            /*------------------------------------------------------*/
        },
        computed:{
            getmapdata(){
                return this.$store.state.mapdata;
            }
        },
        watch:{
            getmapdata:{
               handler(data){


                    //  this.map_lines('',[{path:[[104.732971, 31.465042], [104.642886, 31.464969],[104.532076, 31.454854]]}])
                //    console.log(data.data.map(d=>{return {path:eval(d.path).map(s=>[s[1],s[0]])}}))
                // //    data.data.

                if(data.maptype=="TrackMap")
                {
                     this.map_config()

                     this.map.setCenter([104.732971, 31.465042])
                     this.map_lines('',data.data.map(d=>{return {path:eval(d.path).map(s=>[s[1],s[0]])}}))
                }


                if(data.maptype=="ScatterMap"){
                    this.map_config()
                    console.log(data.data)
                    this.map.setCenter([data.data[0].lng,data.data[0].lat])
                    this.map_points(null,data.data)
                }
                if(data.maptype=="HeatMap"){
                    console.log(data)
                    this.map_config()
                    this.map.setCenter([data.data[0].lng,data.data[0].lat])
                    this.map_heatmap(null,data.data)
                }

                }
            }
        }
    }
</script>

<style scoped>
 @import url('mapbox-gl/dist/mapbox-gl.css');
  #mapx{
    position: relative;
    width: 100%;
    height: 100%;
    /*background-color: #171C30;*/
    padding: auto 0;
  }
</style>
