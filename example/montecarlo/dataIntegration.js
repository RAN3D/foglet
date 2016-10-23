var GRAPH_SIZE = 150;

var c = document.getElementById("MonteCarloGraph");
var ctx = c.getContext("2d");
ctx.canvas.width  = GRAPH_SIZE;
ctx.canvas.height = GRAPH_SIZE;

/*
* Init the canvas with 1/4 of a circle
*/
function initCanvas(){
	ctx.beginPath();
	// circle with GRAPH_SIZE rayon
	ctx.arc(0,GRAPH_SIZE,GRAPH_SIZE,0,2*Math.PI);
	ctx.stroke();
}

/*
* draw a point on the canvas
* parameter are coordinate bounded in [0-1]
*/
function drawPoint(x, y, isIn){
	if (isIn) {ctx.fillStyle="#5bc0de";}else{ctx.fillStyle="#337ab7";}
	ctx.fillRect(x*GRAPH_SIZE, GRAPH_SIZE-GRAPH_SIZE*y, 2, 2);
}

/*
* Update pi global value on local view
*/
function changeData(value){
	$('#InLabelGlobal').html("IN:" + value[0]);
	$('#TotalLabelGlobal').html("TOTAL:" + value[1]);
	$('#pi-result').html(4*(value[0]/value[1]));
}