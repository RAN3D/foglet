var salesData=[
	{label:"Oui", color:"#2AABD2"},
	{label:"Non", color:"#265A88"}
];

var svg = d3.select("#chart").append("svg").attr("width",300).attr("height",300);

svg.append("g").attr("id","quotesDonut");

Donut3D.draw("quotesDonut", randomData(), 150, 150, 130, 100, 30, 0);
	
function changeData(){
	Donut3D.transition("quotesDonut", randomData(), 130, 100, 30, 0);
}

function randomData(){
	return salesData.map(function(d){
		return {label:d.label, value:1000*Math.random(), color:d.color};
	});
}
