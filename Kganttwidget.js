(function() {
    let shadowRoot;

    var Ar = [];
    var typearr = [];	
    var taskarr = [];	
    var detailsarr = [];	
    var startarr = [];	
    var endarr = [];	

    let template = document.createElement("template");

    template.innerHTML = `
			<style>
				* {
				      margin: 0;
				      padding: 0;
				  }
				  body {
				      background: #fff;
				      font-family: 'Open-Sans',sans-serif;

				  }

				#container{
				  margin: 0 auto;
				  position: relative;
				  width:1600px;
				  overflow: visible;
				}


				  .svg {
				    width:1600px;
				    height:800px;
				    overflow: visible;
				    position:absolute;
				}

				.grid .tick {
				    stroke: lightgrey;
				    opacity: 0.3;
				    shape-rendering: crispEdges;
				}
				.grid path {
				      stroke-width: 0;
				}


				#tag {
				  color: white;
				  background: #93003A;
				  width: 150px;
				  position: absolute;
				  display: none;
				  padding:3px 6px;
				  margin-left: -80px;
				  font-size: 11px;
				  z-index: 10; 	
				}



				#tag:before {
				  border: solid transparent;
				  content: ' ';
				  height: 0;
				  left: 50%;
				  margin-left: -5px;
				  position: absolute;
				  width: 0;
				  border-width: 10px;
				  border-bottom-color: #93003A;
				  top: -20px;
				  z-index: 10; 	
				}
			</style>
		`

     //https://cdnjs.cloudflare.com/ajax/libs/d3/3.3.3/d3.min.js
    const d3library = "https://sylvainparcollet.github.io/SACgantt/D3lib.js";

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
    function KGanttcreate(divid) {

	var w = 1600;
  	var h = 800;	      	
	console.log("/////////////// Kgantt chart : " + JSON.stringify(divid));    	    
	console.log("/////////////// D3 -1 : " + divid);    
	var canvas = divid.getElementById("kganttchart");	
	console.log(canvas);

	  var svg = d3.select(canvas)
	  .append("svg")
	  .attr("width", w)
	  .attr("height", h)
	  .attr("class", "svg");

	console.log("/////////////// D3 after : " + JSON.stringify(d3));    
	console.log("/////////////// A"); 
	
/*	    
	var taskArray = [];		
			for (var i = 0; i < startarr.length; i++) {
				taskArray.push({
					"task": taskarr[i],
					"type": typearr[i],
					"startTime": startarr[i],
					"endTime": endarr[i],
					"details": detailsarr[i]
				});
			}    
	    
	    
	    
	    
	    
console.log("---- taskarray " + taskArray);
*/
	    
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

console.log("/////////////// B"); 
var dateFormat = d3.time.format("%Y-%m-%d");
//var dateFormat = d3.time.format("%d-%m-%Y");	    

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
/*
var title = svg.append("text")
              .text("Gantt Chart Process")
              .attr("x", w/2)
              .attr("y", 25)
              .attr("text-anchor", "middle")
              .attr("font-size", 18)
              .attr("fill", "#009FFC");
*/


function makeGant(tasks, pageWidth, pageHeight){

var barHeight = 20;
var gap = barHeight + 4;
var topPadding = 75;
var sidePadding = 75;

var colorScale = d3.scale.linear()
    .domain([0, categories.length])
    .range(["#1976D2", "#E3F2FD"])
    .interpolate(d3.interpolateHcl);

makeGrid(sidePadding, topPadding, pageWidth, pageHeight);
drawRects(tasks, gap, topPadding, sidePadding, barHeight, colorScale, pageWidth, pageHeight);
vertLabels(gap, topPadding, sidePadding, barHeight, colorScale);

}

console.log("/////////////// C"); 
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

     console.log("/////////////// D"); 
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

console.log("/////////////// E"); 
console.log("/////////////// Mouse ON A1 : " + JSON.stringify(d3)); 		
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
	
	
         //SPACMNT var output = document.getElementById("tag");
	 var output = divid.getElementById("tag");
	
          var x = this.x.animVal.getItem(canvas) + "px";
          var y = this.y.animVal.getItem(canvas) + 25 + "px";

         output.innerHTML = tag;
         output.style.top = y;
         output.style.left = x;
         output.style.display = "block";
       }).on('mouseout', function() {
         //SPACMNT var output = document.getElementById("tag");
	 var output = divid.getElementById("tag");
         output.style.display = "none";
             });

console.log("/////////////// F"); 
innerRects.on('mouseover', function(e) {
 //console.log(this);
         var tag = "";
console.log("/////////////// Mouse ON B"); 
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
         //SPACMNT var output = document.getElementById("tag");
	 var output = divid.getElementById("tag");

         var x = (this.x.animVal.value + this.width.animVal.value/2) + "px";
         var y = this.y.animVal.value + 25 + "px";

         output.innerHTML = tag;
         output.style.top = y;
         output.style.left = x;
         output.style.display = "block";
       }).on('mouseout', function() {
         //SPACMNT var output = document.getElementById("tag");
	 var output = divid.getElementById("tag");
         output.style.display = "none";

 });
}

console.log("/////////////// G"); 
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
console.log("/////////////// H"); 
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
console.log("/////////////// I"); 
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
	    
console.log("/////////////// EOF : " + JSON.stringify(divid)); 	    
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

            if ("inptask" in changedProperties) {
                console.log("task: " + changedProperties["inptask"]);
                this.$inptask = changedProperties["inptask"];
            }

	
	//taskarr = this.$inptask.split(';');
	//console.log("task : " + JSON.stringify(taskarr));	
	
	    if ("inptype" in changedProperties) {
                console.log("type: " + changedProperties["inptype"]);
                this.$inptype = changedProperties["inptype"];
            }

	//typearr = this.$inptype.split(';');
	//console.log("task : " + JSON.stringify(typearr));
	
	    if ("inpstarttime" in changedProperties) {
                console.log("starttime: " + changedProperties["inpstarttime"]);
                this.$inpstarttime = changedProperties["inpstarttime"];
            }

	//startarr = this.$inpstarttime.split(';');
	//console.log("task : " + JSON.stringify(startarr));	
	
	    if ("inpendtime" in changedProperties) {
                console.log("endtime: " + changedProperties["inpendtime"]);
                this.$inpendtime = changedProperties["inpendtime"];
            }

	//endarr = this.$inpendtime.split(';');
	//console.log("task : " + JSON.stringify(endarr));	
	
	    if ("inpdetails" in changedProperties) {
                console.log("details: " + changedProperties["inpdetails"]);
                this.$inpdetails = changedProperties["inpdetails"];
            }

	//detailsarr = this.$inpdetails.split(';');
	//console.log("task : " + JSON.stringify(detailsarr));
		
	console.log("%%%%%% INPUT %%%%%%");	
	console.log("firsttime: " + this._firstConnection);
	var that = this;

	if (this._firstConnection === 0) {

	console.log("@@@@@@@@  html @@@@@@@@");	
	const div = document.createElement('div');
	let divid = changedProperties.widgetName;
	this._tagContainer = divid;
	div.innerHTML =  '<body><div id = "kganttchart"><div class = "svg"></div><div id = "tag"></div></div></body>';
	shadowRoot.appendChild(div);
	console.log(div);

	console.log("@@@@@@@@ Shadow Root   @@@@@@@@");
	console.log(shadowRoot);
	var mapcanvas_divstr = shadowRoot.getElementById("kganttchart");	
	console.log(mapcanvas_divstr);	
	Ar.push({
	'div': mapcanvas_divstr
	});
	console.log("@@@@@@@@ Ar   @@@@@@@@");
	console.log(Ar[0].div);
		async function LoadLibs() {
			try {
				await loadScript(d3library);	
				//await loadScript(Kganttlib);
			} catch (e) {
				alert(e);
			} finally {	
				that._firstConnection = 1;	
			}
		}
		LoadLibs();
	} else {		
			console.log("************ Chart ************");   
			taskarr = this.$inptask.split(';');
			typearr = this.$inptype.split(';');
			startarr = this.$inpstarttime.split(';');
			endarr = this.$inpendtime.split(';');
			detailsarr = this.$inpdetails.split(';');
			

			console.log("************ARRAY DATA************");    
			

			KGanttcreate(shadowRoot);
			
		}			
        }

		//When the custom widget is removed from the canvas or the analytic application is closed
        	onCustomWidgetDestroy() {
		console.log("onCustomWidgetDestroy");
        }
    }
    customElements.define("com-karamba-kgantt", Kganttmain);
})();
