(function() {
    let shadowRoot;

    var Ar = [];
    var xvaluearr = [];	
    var yvaluearr = [];	
	
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
          width:800px;
          overflow: visible;
        }


          .svg {
            width:800px;
            height:400px;
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
          background: #FA283D;
          width: 150px;
          position: absolute;
          display: none;
          padding:3px 6px;
          margin-left: -80px;
          font-size: 11px;
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
          border-bottom-color: #FA283D;
          top: -20px;
        }
        </style>													  
        <body>
          <div id = "container">
          <div class = "svg"></div>
          <div id = "tag"></div>
          </div>
        </body>    
	  `
	
    //https://d3js.org/d3.v3.min.js
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
	})();
