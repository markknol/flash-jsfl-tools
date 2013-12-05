/**
 * Adds a new layer with frame labels.
 * @version 1
 * @author: Mediamonks - http://www.mediamonks.com
 * @author: Mark Knol  - http://blog.stroep.nl
 */ 
 
var predefinedLabels = ["in out","show hide","up in over down out","over in over out","down press down release","selected select selected deselect","disabled	disable	disabled enable", "focus focus focused blur", "over in over out down press down release selected select selected deselect disabled	disable	disabled enable focus focus focused blur"];
var defaultLabelIndex = 2;

var doc = fl.getDocumentDOM();

if (!doc)
{
	alert("Please open or create a flashfile.");
}
else
{
	CreateLabels();
}

function CreateLabels()
{
	var dialogXML = '';
	dialogXML += '<label value="Enter frame label names (separated with spaces)" width="280" />'
	
	dialogXML += '<menulist id="names" editable="true" width="380"><menupopup>'
	for (var i=0;i<predefinedLabels.length;i++) dialogXML += '<menuitem selected="'+(i==defaultLabelIndex)+'" label="' + predefinedLabels[i] + '"/>'
	dialogXML += '</menupopup></menulist>'
	
	dialogXML += '<hbox><label value="Space between labels:" width="150" />'
	dialogXML += '<menulist id="frameSpace" editable="false" width="225"><menupopup>'
	for (var i=1;i<=25;i++) dialogXML += '<menuitem selected="'+(i==5)+'" label="' + i + '"/>'
	dialogXML += '</menupopup></menulist></hbox>'
	
	var data = createDialogXML(dialogXML);
	var timeline = doc.getTimeline();
	
	if (data && data.names && data.frameSpace)
	{
		var labelNames = data.names.split(" ");
		var space = Number(data.frameSpace);
		var layerIndex = timeline.addNewLayer("labels", "normal", true);
		var layer = timeline.layers[layerIndex];
		while (layer.frames.length < labelNames.length * space)
		{
			timeline.insertFrames(1, false, 0);
		}
		var i = 0;
		for (var frameIndex = 0; frameIndex < labelNames.length * space; frameIndex += space)
		{
			if (frameIndex != 0) timeline.insertKeyframe(frameIndex);
			layer.frames[frameIndex].name = labelNames[i];
			i++;
			
		}
		layer.color = 0xF21743;
	}
}

function createDialogXML(xmlString)
{
	var dialogXML = '<dialog title="Selection transform manager" buttons="accept, cancel" >';
	dialogXML += '<vbox>' + xmlString + '</vbox>';
	dialogXML +='</dialog>';
	
	var url = fl.configURI + '/Commands/temp-dialog-' + parseInt(Math.random() * 777 * 777) + '.xml';
	FLfile.write(url, dialogXML);
	
	var panelOutput = fl.getDocumentDOM().xmlPanel(url);
	
	FLfile.remove(url); 
	
	return panelOutput;
}