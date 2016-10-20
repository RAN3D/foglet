/*
* Votes data structure for d3
*/
var votesData=[
	{label:"Oui", color:"#2AABD2"},
	{label:"Non", color:"#265A88"}
];

/*
* Create the canvas in chart id html tag
* and draw the pieGraph
*/
var svg = d3.select("#chart").append("svg").attr("width",300).attr("height",300);
svg.append("g").attr("id","quotesDonut");
Donut3D.draw("quotesDonut", updateData(toto.getValue()), 150, 150, 130, 100, 30, 0);


/*
* Update the canvas with new values
*/
function changeData(value){
	$('#yesLabel').html("Oui:" + value[0]);
	$('#noLabel').html("Non:" + value[1]);
	Donut3D.transition("quotesDonut", updateData(value), 130, 100, 30, 0);
}
function updateData(votes){
	return votesData.map(function(d,i){
		return {label:d.label, value:votes[i], color:d.color};
	});
}
