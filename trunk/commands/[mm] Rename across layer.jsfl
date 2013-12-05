/**
 * Renames instance names, layers, library items with easy 3-step wizard.
 * @version 1.1
 * @author: Mark Knol - http://blog.stroep.nl
 */ 

var doc = fl.getDocumentDOM();
var selectedInstance;

if (!doc) 
{
	alert("Please open or create a flashfile.");
} 
else 
{
	NameItRight();
}

function NameItRight()
{
	if (!doc.selection || !doc.selection[0]) 
	{
		alert("You need to select one instance on stage to do the magic.");
		return;
	}
	else if (doc.selection.length != 1)
	{
		alert("You may have no more than one stage element selected. You need to select one instance on stage to do the magic.");
		return;
	}
	
	selectedInstance = doc.selection[0];
	var base;
	
	if (!selectedInstance.libraryItem)
	{
		alert("Your selection is not a library item; First convert it to a symbol");
		return;
	}
	
	var selectedInstanceLibraryItem = selectedInstance.libraryItem;
	
	var newInstanceName = prompt('Enter new instance name.', 'mc' + upperCaseFirstLetter(selectedInstanceLibraryItem.name.split("/").pop()));
	if (newInstanceName) renameAcrossLayer(newInstanceName, doc);

	function upperCaseFirstLetter(value)
	{
		return value.substring(0, 1).toUpperCase() + value.substr(1, selectedInstanceLibraryItem.name.length - 1);
	}
	
	function renameAcrossLayer(instancename, doc)
	{
		var timeline = doc.getTimeline();
		var selectedFrame = timeline.getSelectedFrames();
		var layer = timeline.layers[timeline.currentLayer];
		layer.name = instancename;
		var framesList = layer.frames;

		var layerList = [];
		for (var i = 0, total = timeline.layers.length; i < total; i++)
		{
			layerList.push(timeline.layers[i].locked);
		}

		timeline.setLayerProperty("locked", true, "others");
		timeline.setLayerProperty("locked", false, "selected");

		for (var i = 0, total = framesList.length; i < total; i++)
		{
			var frameListItem = framesList[i];
			var frameListItemElements = frameListItem.elements;
			if (frameListItemElements.length > 1)
			{
				alert("There is more than one item on frame " + (i + 1) + ".\nRenaming instance names only works with layers containing one instance across frames.");
				break;
			}
			else
			{
				if (frameListItemElements.length > 0)
				{
					var frameListItemElement = frameListItemElements[0];
					var symbolname = frameListItemElement.libraryItem.name;
					
					doc.selectNone();
					
					if (selectedInstanceLibraryItem.name == symbolname && frameListItem.startFrame == i)
					{
						timeline.setSelectedFrames(i, i + 1);
						doc.selectAll();
						doc.selection[0].name = instancename;
					}
				}
			}
		}

		for (var i = 0, total = layerList.length; i < total; i++)
		{
			timeline.setSelectedLayers(i, i);
			timeline.setLayerProperty("locked", layerList[i], "selected");
		}

		timeline.setSelectedFrames(selectedFrame, selectedFrame + 1);
	}
};
