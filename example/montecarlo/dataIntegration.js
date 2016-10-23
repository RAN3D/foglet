/*
* Updatepi global value on local view
*/
function changeData(value){
	$('#InLabelGlobal').html("IN:" + value[0]);
	$('#TotalLabelGlobal').html("TOTAL:" + value[1]);
	$('#pi-result').html(4*(value[0]/value[1]));
}