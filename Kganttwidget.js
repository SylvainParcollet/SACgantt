(function() {
    let shadowRoot;

    var Ar = [];
    var xvaluearr = [];	
    var yvaluearr = [];	
	


    let template = document.createElement("template");

	
    template.innerHTML = `
		<style type="text/css">	
		body {
		font-family: -apple-system, BlinkMacSystemFont,"Open-Sans", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
		}
		</style>       
	`
	
     //https://cdnjs.cloudflare.com/ajax/libs/d3/3.3.3/d3.min.js
    const d3library = "https://sylvainparcollet.github.io/SACgantt/D3lib.js";
    //https://www.amcharts.com/lib/4/core.js
    //const amchartscorejs = "https://sylvainparcollet.github.io/amchartslib/core.js";
    //https://www.amcharts.com/lib/4/charts.js
    //const amchartschartsjs = "https://sylvainparcollet.github.io/amchartslib/charts.js";
    //https://www.amcharts.com/lib/4/themes/animated.js
    //const amchartsanimatedjs = "https://sylvainparcollet.github.io/amchartslib/animated.js";
    //https://www.amcharts.com/lib/4/maps.js
    //const amchartsmapsjs = "https://sylvainparcollet.github.io/amchartslib/maps.js";
    //https://www.amcharts.com/lib/4/geodata/continentsLow.js
    //const amchartscontinentlowjs = "https://sylvainparcollet.github.io/amchartslib/continentsLow.js";
    //https://www.amcharts.com/lib/4/geodata/worldLow.js
    //const amchartsworldlowjs = "https://sylvainparcollet.github.io/amchartslib/worldLow.js";

	function loadScript(src) {
	  return new Promise(function(resolve, reject) {
		let script = document.createElement('script');
		console.log("¦¦¦¦¦¦¦¦¦¦¦¦ Load script ¦¦¦¦¦¦¦¦¦¦");
		console.log(src);	    
		console.log("¦¦¦¦¦¦¦¦¦¦¦¦ Load script ¦¦¦¦¦¦¦¦¦¦");	    
		script.src = src;

		script.onload = () => {console.log("Load: " + src); resolve(script);}
		script.onerror = () => reject(new Error(`Script load error for ${src}`));

		shadowRoot.appendChild(script)
	  });
	}

	

    // Create the chart
    function Amchartkaramba(value) {

        var data = {};
		console.log("/////////////// Gantt - " + value);    
			if (value !== "") {
				data = JSON.parse(value);
				console.log(data);
			}
		var w = 800;
  var h = 400;


  var svg = d3.selectAll(".svg")
  //.selectAll("svg")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr("class", "svg");


    var taskArray = [
  {
    task: "conceptualize",
    type: "development",
    startTime: "2013-1-28", //year/month/day
    endTime: "2013-2-1",
    details: "This actually didn't take any conceptualization"
},

{
    task: "sketch",
    type: "development",
    startTime: "2013-2-1",
    endTime: "2013-2-6",
    details: "No sketching either, really"
},

{
    task: "color profiles",
    type: "development",
    startTime: "2013-2-6",
    endTime: "2013-2-9"
},

{
    task: "HTML",
    type: "coding",
    startTime: "2013-2-2",
    endTime: "2013-2-6",
    details: "all three lines of it"
},

{
    task: "write the JS",
    type: "coding",
    startTime: "2013-2-6",
    endTime: "2013-2-9"
},

{
    task: "advertise",
    type: "promotion",
    startTime: "2013-2-9",
    endTime: "2013-2-12",
    details: "This counts, right?"
},

{
    task: "spam links",
    type: "promotion",
    startTime: "2013-2-12",
    endTime: "2013-2-14"
},
{
    task: "eat",
    type: "celebration",
    startTime: "2013-2-8",
    endTime: "2013-2-13",
    details: "All the things"
},

{
    task: "crying",
    type: "celebration",
    startTime: "2013-2-13",
    endTime: "2013-2-16"
},

];

var dateFormat = d3.time.format("%Y-%m-%d");

var timeScale = d3.time.scale()
        .domain([d3.min(taskArray, function(d) {return dateFormat.parse(d.startTime);}),
                 d3.max(taskArray, function(d) {return dateFormat.parse(d.endTime);})])
        .range([0,w-150]);

var categories = new Array();

for (var i = 0; i < taskArray.length; i++){
    categories.push(taskArray[i].type);
}

var catsUnfiltered = categories; //for vert labels

categories = checkUnique(categories);


makeGant(taskArray, w, h);

var title = svg.append("text")
              .text("Gantt Chart Process")
              .attr("x", w/2)
              .attr("y", 25)
              .attr("text-anchor", "middle")
              .attr("font-size", 18)
              .attr("fill", "#009FFC");



function makeGant(tasks, pageWidth, pageHeight){

var barHeight = 20;
var gap = barHeight + 4;
var topPadding = 75;
var sidePadding = 75;

var colorScale = d3.scale.linear()
    .domain([0, categories.length])
    .range(["#00B9FA", "#F95002"])
    .interpolate(d3.interpolateHcl);

makeGrid(sidePadding, topPadding, pageWidth, pageHeight);
drawRects(tasks, gap, topPadding, sidePadding, barHeight, colorScale, pageWidth, pageHeight);
vertLabels(gap, topPadding, sidePadding, barHeight, colorScale);

}


function drawRects(theArray, theGap, theTopPad, theSidePad, theBarHeight, theColorScale, w, h){

var bigRects = svg.append("g")
    .selectAll("rect")
   .data(theArray)
   .enter()
   .append("rect")
   .attr("x", 0)
   .attr("y", function(d, i){
      return i*theGap + theTopPad - 2;
  })
   .attr("width", function(d){
      return w-theSidePad/2;
   })
   .attr("height", theGap)
   .attr("stroke", "none")
   .attr("fill", function(d){
    for (var i = 0; i < categories.length; i++){
        if (d.type == categories[i]){
          return d3.rgb(theColorScale(i));
        }
    }
   })
   .attr("opacity", 0.2);


     var rectangles = svg.append('g')
     .selectAll("rect")
     .data(theArray)
     .enter();


   var innerRects = rectangles.append("rect")
             .attr("rx", 3)
             .attr("ry", 3)
             .attr("x", function(d){
              return timeScale(dateFormat.parse(d.startTime)) + theSidePad;
              })
             .attr("y", function(d, i){
                return i*theGap + theTopPad;
            })
             .attr("width", function(d){
                return (timeScale(dateFormat.parse(d.endTime))-timeScale(dateFormat.parse(d.startTime)));
             })
             .attr("height", theBarHeight)
             .attr("stroke", "none")
             .attr("fill", function(d){
              for (var i = 0; i < categories.length; i++){
                  if (d.type == categories[i]){
                    return d3.rgb(theColorScale(i));
                  }
              }
             })
   

         var rectText = rectangles.append("text")
               .text(function(d){
                return d.task;
               })
               .attr("x", function(d){
                return (timeScale(dateFormat.parse(d.endTime))-timeScale(dateFormat.parse(d.startTime)))/2 + timeScale(dateFormat.parse(d.startTime)) + theSidePad;
                })
               .attr("y", function(d, i){
                  return i*theGap + 14+ theTopPad;
              })
               .attr("font-size", 11)
               .attr("text-anchor", "middle")
               .attr("text-height", theBarHeight)
               .attr("fill", "#fff");


rectText.on('mouseover', function(e) {
 // console.log(this.x.animVal.getItem(this));
               var tag = "";

         if (d3.select(this).data()[0].details != undefined){
          tag = "Task: " + d3.select(this).data()[0].task + "<br/>" + 
                "Type: " + d3.select(this).data()[0].type + "<br/>" + 
                "Starts: " + d3.select(this).data()[0].startTime + "<br/>" + 
                "Ends: " + d3.select(this).data()[0].endTime + "<br/>" + 
                "Details: " + d3.select(this).data()[0].details;
         } else {
          tag = "Task: " + d3.select(this).data()[0].task + "<br/>" + 
                "Type: " + d3.select(this).data()[0].type + "<br/>" + 
                "Starts: " + d3.select(this).data()[0].startTime + "<br/>" + 
                "Ends: " + d3.select(this).data()[0].endTime;
         }
         var output = document.getElementById("tag");

          var x = this.x.animVal.getItem(this) + "px";
          var y = this.y.animVal.getItem(this) + 25 + "px";

         output.innerHTML = tag;
         output.style.top = y;
         output.style.left = x;
         output.style.display = "block";
       }).on('mouseout', function() {
         var output = document.getElementById("tag");
         output.style.display = "none";
             });


innerRects.on('mouseover', function(e) {
 //console.log(this);
         var tag = "";

         if (d3.select(this).data()[0].details != undefined){
          tag = "Task: " + d3.select(this).data()[0].task + "<br/>" + 
                "Type: " + d3.select(this).data()[0].type + "<br/>" + 
                "Starts: " + d3.select(this).data()[0].startTime + "<br/>" + 
                "Ends: " + d3.select(this).data()[0].endTime + "<br/>" + 
                "Details: " + d3.select(this).data()[0].details;
         } else {
          tag = "Task: " + d3.select(this).data()[0].task + "<br/>" + 
                "Type: " + d3.select(this).data()[0].type + "<br/>" + 
                "Starts: " + d3.select(this).data()[0].startTime + "<br/>" + 
                "Ends: " + d3.select(this).data()[0].endTime;
         }
         var output = document.getElementById("tag");

         var x = (this.x.animVal.value + this.width.animVal.value/2) + "px";
         var y = this.y.animVal.value + 25 + "px";

         output.innerHTML = tag;
         output.style.top = y;
         output.style.left = x;
         output.style.display = "block";
       }).on('mouseout', function() {
         var output = document.getElementById("tag");
         output.style.display = "none";

 });



}


function makeGrid(theSidePad, theTopPad, w, h){

var xAxis = d3.svg.axis()
    .scale(timeScale)
    .orient('bottom')
    .ticks(d3.time.days, 1)
    .tickSize(-h+theTopPad+20, 0, 0)
    .tickFormat(d3.time.format('%d %b'));

var grid = svg.append('g')
    .attr('class', 'grid')
    .attr('transform', 'translate(' +theSidePad + ', ' + (h - 50) + ')')
    .call(xAxis)
    .selectAll("text")  
            .style("text-anchor", "middle")
            .attr("fill", "#000")
            .attr("stroke", "none")
            .attr("font-size", 10)
            .attr("dy", "1em");
}

function vertLabels(theGap, theTopPad, theSidePad, theBarHeight, theColorScale){
  var numOccurances = new Array();
  var prevGap = 0;

  for (var i = 0; i < categories.length; i++){
    numOccurances[i] = [categories[i], getCount(categories[i], catsUnfiltered)];
  }

  var axisText = svg.append("g") //without doing this, impossible to put grid lines behind text
   .selectAll("text")
   .data(numOccurances)
   .enter()
   .append("text")
   .text(function(d){
    return d[0];
   })
   .attr("x", 10)
   .attr("y", function(d, i){
    if (i > 0){
        for (var j = 0; j < i; j++){
          prevGap += numOccurances[i-1][1];
         // console.log(prevGap);
          return d[1]*theGap/2 + prevGap*theGap + theTopPad;
        }
    } else{
    return d[1]*theGap/2 + theTopPad;
    }
   })
   .attr("font-size", 11)
   .attr("text-anchor", "start")
   .attr("text-height", 14)
   .attr("fill", function(d){
    for (var i = 0; i < categories.length; i++){
        if (d[0] == categories[i]){
        //  console.log("true!");
          return d3.rgb(theColorScale(i)).darker();
        }
    }
   });

}

//from this stackexchange question: http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
function checkUnique(arr) {
    var hash = {}, result = [];
    for ( var i = 0, l = arr.length; i < l; ++i ) {
        if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
            hash[ arr[i] ] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

//from this stackexchange question: http://stackoverflow.com/questions/14227981/count-how-many-strings-in-an-array-have-duplicates-in-the-same-array
function getCounts(arr) {
    var i = arr.length, // var to loop over
        obj = {}; // obj to store results
    while (i) obj[arr[--i]] = (obj[arr[i]] || 0) + 1; // count occurrences
    return obj;
}

// get specific from everything
function getCount(word, arr) {
    return getCounts(arr)[word] || 0;
}

    };	

    class Kganttmain extends HTMLElement {
        constructor() {
	    console.log("-------------------------------------------------");	
        console.log("constructor");
	    console.log("-------------------------------------------------");	
            super();
            shadowRoot = this.attachShadow({
                mode: "open"
            });

            shadowRoot.appendChild(template.content.cloneNode(true));

            this._firstConnection = 0;

            this.addEventListener("click", event => {
                console.log('click');
                var event = new Event("onClick");
                this.dispatchEvent(event);

            });
            this._props = {};
        }

        //Fired when the widget is added to the html DOM of the page
		connectedCallback() {
            console.log("connectedCallback");
        }

		//Fired when the widget is removed from the html DOM of the page (e.g. by hide)
		disconnectedCallback() {
			console.log("disconnectedCallback");
        }

		//When the custom widget is updated, the Custom Widget SDK framework executes this function first
        onCustomWidgetBeforeUpdate(changedProperties) {
            console.log("onCustomWidgetBeforeUpdate");
            this._props = {
                ...this._props,
                ...changedProperties
            };
        }

		//When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
        onCustomWidgetAfterUpdate(changedProperties) {

           console.log("onCustomWidgetAfterUpdate");
           console.log(changedProperties);

	   console.log("%%%%%% INPUT %%%%%%");	

            if ("charttype" in changedProperties) {
                console.log("charttype:" + changedProperties["charttype"]);
                this.$charttype = changedProperties["charttype"];
            }

		
			if ("xvalue" in changedProperties) {
					console.log("xvalue:" + changedProperties["xvalue"]);
					this.$xvalue = changedProperties["xvalue"];

			}
				
			if ("yvalue" in changedProperties) {
					console.log("yvalue:" + changedProperties["yvalue"]);
					this.$yvalue = changedProperties["yvalue"];

			}
				

			var typeOfChart = this.$charttype;
			console.log("Type of chart : " + typeOfChart);	
			xvaluearr = this.$xvalue.split(';');
			console.log(xvaluearr);		
			yvaluearr = this.$yvalue.split(';');
			console.log(yvaluearr);	
			console.log("%%%%%% INPUT %%%%%%");	
            console.log("firsttime: " + this._firstConnection);
            var that = this;

		if (this._firstConnection === 0) {
			
		console.log("@@@@@@@@  html @@@@@@@@");	
		const div = document.createElement('div');
                let divid = changedProperties.widgetName;
                this._tagContainer = divid;
                div.innerHTML = '<div id="chartdiv"></div>';
                shadowRoot.appendChild(div);
				console.log(div);	
				const css = document.createElement('div');
				if (typeOfChart === "Sankey")
				{
					css.innerHTML = '<style>#chartdiv {margin:0 auto;width: 100%; height: 800px;overflow:hidden;}</style>'
					console.log("@@@@@@@@ Sankey CSS  @@@@@@@@");		
				}
				else if (typeOfChart === "Map")
				{
					css.innerHTML = '<style>#chartdiv {max-width: 100%;height: 800px;background-color:#fbebdb;}</style>'
					console.log("@@@@@@@@ Map css  @@@@@@@@");						
				}
				else if (typeOfChart === "Radar")
				{
					css.innerHTML = '<style>#chartdiv {max-width: 100%;width: 100%;height: 800px;background-color:#5f6062;}</style>'
					console.log("@@@@@@@@ Radar css  @@@@@@@@");						
				}
				else				
				{
					css.innerHTML = '<style>#container{margin:0auto;position:relative;width:800px;height:400px;overflow:visible;}.svg{width:800px;height:400px;overflow:visible;position:absolute;}.grid.tick{stroke:lightgrey;opacity:0.3;shape-rendering:crispEdges;}.gridpath{stroke-width:0;}#tag{color:white;background:#FA283D;width:150px;position:absolute;display:none;padding:3px6px;margin-left:-80px;font-size:11px;}#tag:before{border:solidtransparent;content:"";height:0;left:50%;margin-left:-5px;position:absolute;width:0;border-width:10px;border-bottom-color:#FA283D;top:-20px;}</style>'
					console.log("@@@@@@@@ XYChart CSS  @@@@@@@@");		
				}
		shadowRoot.appendChild(css);	
		var mapcanvas_divstr = shadowRoot.getElementById("chartdiv");	
                console.log(mapcanvas_divstr);	
		Ar.push({
                    'div': mapcanvas_divstr
                });
	
		console.log("@@@@@@@@ CSS  @@@@@@@@");
		console.log(css);
		console.log("@@@@@@@@ Shadow Root   @@@@@@@@");
		console.log(shadowRoot);
		console.log("@@@@@@@@  html @@@@@@@@");		
				async function LoadLibs() {
					try {
						await loadScript(d3library);				
					} catch (e) {
						alert(e);
					} finally {	
						that._firstConnection = 1;	
					}
				}
				LoadLibs();
		} else {		
				console.log("**********///////********");
				console.log("Type of chart : " + typeOfChart);
				if (typeOfChart === "Sankey")
				{
					
					console.log("************Sankey chart************");    
					Sankeychartkaramba(Ar[0].div,"");
				}
				else if (typeOfChart === "Map")
				{
					console.log("************Map chart************");    
					Mapkaramba(Ar[0].div,"");	
				}
				else if (typeOfChart === "Radar")
				{	
					console.log("************Radar chart************");    
					Radarchartkaramba(Ar[0].div,"");
				}
				else
				{	
					console.log("************Lolipop chart ************");    
					console.log(typeOfChart);
					var arraydata = [];
					for (var i = 0; i < xvaluearr.length; i++) {
						arraydata.push({
							"category": xvaluearr[i],
							"value": parseInt(yvaluearr[i])
						});
					}


					console.log("************ARRAY DATA************");    
					console.log(arraydata);
					Amchartkaramba(AJSON.stringify(arraydata));
				}
		}
	
			
        }

		//When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy() {
			console.log("onCustomWidgetDestroy");
        }
    }
    customElements.define("com-karamba-kgantt", Kganttmain);
})();
