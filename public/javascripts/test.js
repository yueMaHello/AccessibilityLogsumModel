var map;
var dataMatrix;
var q = d3.queue();
var check = false;
var largestIndividualArray = [];
var sort = [];
var selectZone = '101'; //default
var hoverZone;
var jobOption = 'Work'; //PSE,Other,Otherpurpose,GS
var incomeOption = 'Med'; //Hi,Lo
var carOption = 'Ins';//No, Suff,NCAW
var carOption3 = 'Ins'
var purposeOption = "All";//Eat,PB,PUDO,QS,Rec,Shop,Soc
var gradeOption = "Elem";//Elem,JHS,Pre,SHS_Lic,SHS_NoLic
var selectMatrixName='../data/Work/LogsumMed_Ins.csv'; //default matrix, show when loading the web page
var scaleCheck=false;
//load esri libraries
require(["esri/graphic","esri/geometry/Polyline","dojo/dom-construct",
  "esri/tasks/query","esri/dijit/Popup",
  "dojo/dom-class","esri/dijit/BasemapToggle","esri/dijit/Legend",
  "esri/map", "esri/layers/FeatureLayer","esri/symbols/SimpleFillSymbol", 
  "esri/symbols/SimpleLineSymbol","esri/renderers/ClassBreaksRenderer",
  "esri/Color", "dojo/dom-style", "dojo/domReady!"
], function(Graphic,Polyline,domConstruct,Query,Popup,domClass,BasemapToggle,Legend,Map, FeatureLayer,
  SimpleFillSymbol,SimpleLineSymbol,ClassBreaksRenderer,Color, domStyle
) { //convert radios to slider
    $('#radios1').radiosToSlider({animation: true});     
    $('#radios2').radiosToSlider({animation: true});      
    $('#radios3').radiosToSlider({animation: true});        
    $('#radios4').radiosToSlider({animation: true});     
    $('#radios5').radiosToSlider({animation: true});    
    $('#radios6').radiosToSlider({animation: true});
    //hide unused sliders     
    $('#radios6').css("visibility", "hidden");
    $('#radios4').css("visibility", "hidden");
    $('#radios5').css("visibility", "hidden");
    //load default csv
    q.defer(d3.csv,selectMatrixName).await(brushMap);
    function brushMap(error,selectMatrix,title){
      //click radio1 button, the visibility property of other radios is based on radio1 button
        $('#radios1').click(function() {
            var nowJobOption = $('input[name=options1]:checked').val();
            if(nowJobOption!= jobOption){
              jobOption=nowJobOption;
              // if(nowJobOption!= jobOption){
              //   jobOption=nowJobOption;
              // 
              //   for(var m=0;m<Object.keys(sliderType).length;m++){
              //     var jobType = Object.keys(sliderType)[m];
              //     console.log(jobType)
              //     if(jobOption === jobType){
              //       console.log(Object.keys(sliderType[jobType]).length)
              //       $('#dynamicRadios').empty();
              //       for (var j=0;j<Object.keys(sliderType[jobType]).length;j++){
              //         var id = 'radios'+jobType+j;
              //         var containerId = 'radiosContainer'+jobType+j;
              //         $('#dynamicRadios').append('<div id='+containerId+'></div>');
              //         $('#'+containerId).append('<div id='+id+'></div>');
              //         for(var n =0;n<sliderType[jobType][j].length;n++){
              //           $('#'+id).append('<input type = "radio" name="'+sliderType[jobType][j][0]+'" value="'+sliderType[jobType][j][n]+'" checked><label>'+sliderType[jobType][j][n]+'</label>');                    
              //         }
              //         $('#'+id).radiosToSlider({animation: true});
              //         $('#'+id).click(function(){console.log(222)})
              //       }
              //       break;
              //     }
              //   }
              if(jobOption === 'PSE'){
    
                $('#radios6').css("visibility", "visible");
                $('#radios2').css("visibility", "hidden");
                $('#radios3').css("visibility", "hidden");
                $('#radios4').css("visibility", "hidden");
                $('#radios5').css("visibility", "hidden");
                selectMatrixName =findMatrix();
  
              }
              else if(jobOption === 'GS'){
                $('#radios6').css("visibility", "visible");
                $('#radios2').css("visibility", "hidden");
                $('#radios3').css("visibility", "hidden");
                $('#radios4').css("visibility", "visible");
                $('#radios5').css("visibility", "hidden");
                selectMatrixName =findMatrix();
  
              }
              else if(jobOption === 'Work'){
                $('#radios2').css("visibility", "visible");
                $('#radios6').css("visibility", "hidden");
                $('#radios3').css("visibility", "visible");
                $('#radios4').css("visibility", "hidden");
                $('#radios5').css("visibility", "hidden");
                selectMatrixName =findMatrix();
  
              }
              else if(jobOption === 'Other'){
                $('#radios6').css("visibility", "visible");
                $('#radios2').css("visibility", "hidden");
                $('#radios3').css("visibility", "hidden");
                $('#radios4').css("visibility", "hidden");
                $('#radios5').css("visibility", "visible");
                selectMatrixName =findMatrix();
              }
              //read selected matrix and replot the map
              d3.csv(selectMatrixName,function(d){              
                dataMatrix = buildMatrixLookup(d);
                $("#wait").css("display", "none");
                changeScale();
                featureLayer.redraw();
              });
            }
        });

        $('#radios2').click(function() {
          var nowCarOption =  $('input[name=options2]:checked').val();
          if(nowCarOption!= carOption){
            carOption = nowCarOption;
            redrawLayer();
          }
        });
        
        $('#radios3').click(function() {
          var nowIncomeOption =  $('input[name=options3]:checked').val();
          if(nowIncomeOption!=incomeOption){
            incomeOption = nowIncomeOption;
            redrawLayer();
          }
        });
        $('#radios4').click(function() {
          var nowGradeOption =  $('input[name=options4]:checked').val();
          if(nowGradeOption !=gradeOption){
            gradeOption = nowGradeOption;
            redrawLayer();
          }
        });
        
        $('#radios5').click(function() {
          var nowPurposeOption =  $('input[name=options5]:checked').val();
          if(purposeOption != nowPurposeOption){
            purposeOption = nowPurposeOption;
            redrawLayer();
          }
        });
        
        $('#radios6').click(function() {
          var nowCarOption3 =  $('input[name=options6]:checked').val();
          if(nowCarOption3!= carOption3){
            carOption3 = nowCarOption3;
            redrawLayer();
          }
        });
        function redrawLayer(){
          selectMatrixName =findMatrix();
          
          d3.csv(selectMatrixName,function(d){
            dataMatrix = buildMatrixLookup(d);
            $("#wait").css("display", "none");
            changeScale()
            featureLayer.redraw();
        

          });
        }
        dataMatrix = buildMatrixLookup(selectMatrix);
        var popup = new Popup({  
          fillSymbol:
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              new Color([255, 0, 0]), 2)
        }, domConstruct.create("div"));
  
        map = new Map("map", {
            basemap: "dark-gray-vector",
            center: [-113.4909, 53.5444],
            zoom: 9,
            minZoom:6,
            slider: false
        });
        
        var toggle = new BasemapToggle({
           map: map,
           basemap: "streets"
         }, "viewDiv");
         
         toggle.startup();
               
        var featureLayer = new FeatureLayer("https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/newestTAZ/FeatureServer/0",{
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
    
        });
        var lrtFeatureLayer = new FeatureLayer("https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/LRT/FeatureServer/0",{
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
        });
        // PSELayer = addPSELocation();
        var pseLayer = new FeatureLayer("https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/pse/FeatureServer/0",{
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
        });

        var highlightSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([255,0,0]), 3
          ),
          new Color([125,125,125,0])
        );
        // featureLayer.on('click',function(evt){
        //     map.graphics.clear();
        //     var graphic = evt.graphic;
        //     selectZone = graphic.attributes.TAZ_New;
        //     var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
        //     map.graphics.add(highlightGraphic);
        //     featureLayer.redraw();
        // });
        // var accessibilityResult = [];
        // largestIndividualArray = findRangeForIndividualCalcultion();
        // console.log(dataMatrix)
        // sort = Object.values(largestIndividualArray).sort((prev,next)=>prev-next); //from smallest to largest
        // sort = sort.map(x =>x.toFixed(2));
        // console.log(sort)
        // var chunkZones = 89;
        var symbol = new SimpleFillSymbol(); 

       //legend. If you want to change legend scale or legend color, this part of code needs to be modified
       // renderer.addBreak(-Infinity, 0.5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([255, 255, 255,0.90])));
       // renderer.addBreak(0.5, 1, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	249, 238, 237,0.90])));
       // renderer.addBreak(1, 1.5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([243, 224, 219,0.90])));
       // renderer.addBreak(1.5,2, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([237, 214, 202,0.90])));
       // renderer.addBreak(2, 2.5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([225, 200, 170,0.90])));
       // renderer.addBreak(2.5,3, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([213, 196, 141,0.90])));
       // renderer.addBreak(3, 3.25, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([207, 197, 127,0.90])));
       // renderer.addBreak(3.25,3.5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([201, 199, 113,0.90])));
       // renderer.addBreak(3.5,3.75, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([185, 195, 101,0.90])));
       // renderer.addBreak(3.75,4, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([168, 189, 88,0.90])));
       // renderer.addBreak(4,4.25, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([149, 183, 77,0.90])));
       // renderer.addBreak(4.25,4.5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([129, 177, 66,0.90])));
       // renderer.addBreak(4.5,4.75, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([109, 171, 55,0.90])));
       // renderer.addBreak(4.75, 5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([87, 165, 45,0.90])));
       // renderer.addBreak(5, 5.25, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	66, 159, 36,0.90])));
       // renderer.addBreak(5.25,5.5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([44, 153, 27,0.90])));
       // renderer.addBreak(5.5,5.75, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	37, 121, 24,0.90])));
       // renderer.addBreak(5.75,6 , new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([11, 106, 18,0.90])));
       // renderer.addBreak(6, Infinity, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([5, 80, 15,0.90])));
       // featureLayer.setRenderer(renderer);
       
       
       changeScale();
       //legend
        $('#legendDiv').append('<div class="legendClass" id = "legendid" </div>');  
        var legend = new Legend({
          map: map,
          layerInfos: [{layer:pseLayer,title:'Institutions'},{layer:lrtFeatureLayer,title:'LRT'}]
        }, 'legendid');
      
        map.on('load',function(){
            map.addLayer(featureLayer);
            map.addLayer(lrtFeatureLayer);
            map.addLayer(pseLayer);
            legend.startup();
            featureLayer.redraw();
        });
        //slider which is used to switch between 'destination to origin' and 'origin to destination'
        $("#interact").click(function(e, parameters) {
            if($("#interact").is(':checked')){
                check = true;
                $('#sliderNote').html("D&nbspto&nbspO");
                changeScale();
                featureLayer.redraw();  
            }
            else{
              check = false;
              $('#sliderNote').html("O&nbspto&nbspD");
              changeScale();
              featureLayer.redraw();

            }
        });
        $("#interact2").click(function(e, parameters) {
            if($("#interact2").is(':checked')){
                scaleCheck = true;
                $('#sliderNote2').html("Absolute&nbspScale");
                changeScale()
                featureLayer.redraw();  
            }
            else{
              scaleCheck = false;
              $('#sliderNote2').html("Relative&nbspScale");
              changeScale()
              featureLayer.redraw();

            }
        });
        function changeScale(){
            if(scaleCheck===false){
              var renderer = new ClassBreaksRenderer(symbol, function(feature){
                //if 'var check' is false, then show origin to destination
                if(check === false){
      
                  return dataMatrix[feature.attributes.TAZ_New];
                }
                //else, destination to origin
                else{
                  //return dataMatrix[feature.attributes.TAZ_New][selectZone];
                    return dataMatrix[feature.attributes.TAZ_New];
      
                }
             });

              //legend. If you want to change legend scale or legend color, this part of code needs to be modified
              renderer.addBreak(-Infinity, 0.5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([255, 255, 255,0.90])));
              renderer.addBreak(0.5, 1, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	249, 238, 237,0.90])));
              renderer.addBreak(1, 1.5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([243, 224, 219,0.90])));
              renderer.addBreak(1.5,2, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([237, 214, 202,0.90])));
              renderer.addBreak(2, 2.5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([225, 200, 170,0.90])));
              renderer.addBreak(2.5,3, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([213, 196, 141,0.90])));
              renderer.addBreak(3, 3.25, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([207, 197, 127,0.90])));
              renderer.addBreak(3.25,3.5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([201, 199, 113,0.90])));
              renderer.addBreak(3.5,3.75, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([185, 195, 101,0.90])));
              renderer.addBreak(3.75,4, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([168, 189, 88,0.90])));
              renderer.addBreak(4,4.25, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([149, 183, 77,0.90])));
              renderer.addBreak(4.25,4.5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([129, 177, 66,0.90])));
              renderer.addBreak(4.5,4.75, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([109, 171, 55,0.90])));
              renderer.addBreak(4.75, 5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([87, 165, 45,0.90])));
              renderer.addBreak(5, 5.25, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	66, 159, 36,0.90])));
              renderer.addBreak(5.25,5.5, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([44, 153, 27,0.90])));
              renderer.addBreak(5.5,5.75, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	37, 121, 24,0.90])));
              renderer.addBreak(5.75,6 , new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([11, 106, 18,0.90])));
              renderer.addBreak(6, Infinity, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([5, 80, 15,0.90])));
              featureLayer.setRenderer(renderer);
            }
            else{
              var renderer = new ClassBreaksRenderer(symbol, function(feature){
                //if 'var check' is false, then show origin to destination
                if(check === false){
      
                  return dataMatrix[feature.attributes.TAZ_New];
                }
                //else, destination to origin
                else{
                  //return dataMatrix[feature.attributes.TAZ_New][selectZone];
                    return dataMatrix[feature.attributes.TAZ_New];
      
                }
             });

                var valueArray = Object.values(dataMatrix).sort();
                var chunksize = 90;
                renderer.addBreak(-Infinity, valueArray[chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([255, 255, 255,0.90])));
                renderer.addBreak(valueArray[chunksize], valueArray[2*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	249, 238, 237,0.90])));
                renderer.addBreak(valueArray[2*chunksize],valueArray[3*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([243, 224, 219,0.90])));
                renderer.addBreak(valueArray[3*chunksize],valueArray[4*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([237, 214, 202,0.90])));
                renderer.addBreak(valueArray[4*chunksize], valueArray[5*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([225, 200, 170,0.90])));
                renderer.addBreak(valueArray[5*chunksize],valueArray[6*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([213, 196, 141,0.90])));
                renderer.addBreak(valueArray[6*chunksize], valueArray[7*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([207, 197, 127,0.90])));
                renderer.addBreak(valueArray[7*chunksize],valueArray[8*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([201, 199, 113,0.90])));
                renderer.addBreak(valueArray[8*chunksize],valueArray[9*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([185, 195, 101,0.90])));
                renderer.addBreak(valueArray[9*chunksize],valueArray[10*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([168, 189, 88,0.90])));
                renderer.addBreak(valueArray[10*chunksize],valueArray[11*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([149, 183, 77,0.90])));
                renderer.addBreak(valueArray[11*chunksize],valueArray[12*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([129, 177, 66,0.90])));
                renderer.addBreak(valueArray[12*chunksize],valueArray[13*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([109, 171, 55,0.90])));
                renderer.addBreak(valueArray[13*chunksize], valueArray[14*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([87, 165, 45,0.90])));
                renderer.addBreak(valueArray[14*chunksize], valueArray[15*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	66, 159, 36,0.90])));
                renderer.addBreak(valueArray[15*chunksize], valueArray[16*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([44, 153, 27,0.90])));
                renderer.addBreak(valueArray[16*chunksize], valueArray[17*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	37, 121, 24,0.90])));
                renderer.addBreak(valueArray[17*chunksize], valueArray[18*chunksize], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([11, 106, 18,0.90])));
                renderer.addBreak(valueArray[18*chunksize], Infinity, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([5, 80, 15,0.90])));
                featureLayer.setRenderer(renderer);      
              }
            }
    }

});
//read csv file into a 2d matrix
function buildMatrixLookup(arr) {    
  var lookup = {};
  
  var logsumOfLogsum = {};
  var DtoOLogsumOfLogsum={};
  var index = arr.columns;
  var verbal = index[0];

  for(var i =0; i<arr.length;i++){
    var k = arr[i][verbal];
    delete arr[i][verbal];
    lookup[parseInt(k)] = Object.keys(arr[i]).reduce((obj, key) => (obj[parseInt(key)] = Number(arr[i][key]),obj), {});
  }

  for(var i in lookup){
      var total = 0;
      for(var j in lookup[i]){
          total += Math.exp(lookup[i][j])
      }
      total = getBaseLog(2.718,total);
      logsumOfLogsum[i] = total
  }
  console.log(logsumOfLogsum);
  return logsumOfLogsum;
}


//read csv file into a 2d matrix
function buildMatrixLookupMinus(logsum1,arr2) {    
  var logsum2 = {};
  var result = {};
  if(carOption === 'Ins'){
    d3.csv('./data/Work/LogsumMed_No.csv',function(arr2){
      
        logsum2 = buildMatrixLookup(arr2);

        for(var i in logsum1){
          
          result[i] = logsum1[i]-logsum2[i];
        }
    })
  }

  return result;
}

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}
//legend is based on this range
function findRangeForIndividualCalcultion(){
  return dataMatrix['101'];
}
//read radio buttons value and return selected matrix url
function findMatrix(){

    $("#wait").css("display", "block");
    var baseDirect = "../data/"+jobOption+'/Logsum';
    if(jobOption === 'Work'){
        baseDirect += incomeOption+'_'+carOption+'.csv';
    }
    else if(jobOption === 'PSE'){
        baseDirect += carOption3+'.csv';
    }
    else if(jobOption === 'GS'){
        baseDirect += gradeOption+'_'+carOption3+'.csv';
    }
    else if(jobOption==='Other'){
        if(purposeOption === 'All'){
            baseDirect+=carOption3+'.csv';
        }
        else{
            baseDirect = "../data/Otherpurpose/Logsum"+purposeOption+'_'+carOption3+'.csv';
        }
    }
    console.log(baseDirect);
    return baseDirect;

}
