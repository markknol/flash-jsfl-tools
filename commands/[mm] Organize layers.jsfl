/**
 * Renames layers according first item in layer. With coding standards warnings. Folders are skipped by default.
 * @version 1.5
 * @author: Mediamonks - http://www.mediamonks.com
 * @author: Mark Knol  - http://blog.stroep.nl
 */ 
 
fl.outputPanel.clear();
var doc = fl.getDocumentDOM();
autoNameLayers(true);

function autoNameLayers(showWarnings)
{
	var timeline = doc.getTimeline();
	
	for (var i = timeline.layers.length - 1; i >= 0; i--)
	{
		var layer = timeline.layers[i];
		
		if (layer.layerType != "guide" &&  layer.layerType != "mask" && layer.layerType != "folder")
		{
			var frameNumber = 0;
			var element;
			
			var layerHasCode = false;
			var layerHasLabel = false;
			var layerHasComment = false;
			var layerHasAnchor = false;
			var layerHasSound = false;
			
			for (var j = 0, totalFrames = layer.frames.length; j < totalFrames; j++)
			{
				var frame = layer.frames[j];
				if (j === frame.startFrame) // keyframes only
				{
					element = frame.elements[0]; // first element on frame1
					
					if (frame.soundLibraryItem) layerHasSound = true;
					if (frame.labelType != "none")
					{
						if (frame.labelType == "name") layerHasLabel = true
						if (frame.labelType == "comment") layerHasComment = true;
						if (frame.labelType == "anchor") layerHasAnchor = true;
					}
					if (frame.actionScript && frame.actionScript.length > 0)
					{
						layerHasCode = true;
					}
				
					if (element)
					{
						if(element.name)
						{
							layer.name = element.name;
							
							if (showWarnings)
							{
								if (element.elementType == "instance" && element.name.substring(0, 2) != 'mc' )
								{
									fl.trace('Warning: instance name of "' + element.name + '" isn\'t named right; should start with "mc".');
								}
								else if(element.elementType == "text" && element.name.substring(0, 3) != 'txt')
								{
									fl.trace('Warning: instance name of "' + element.name + '" isn\'t named right; should start with "txt".');
								}
							}
						}
						else if (element.libraryItem)
						{
							layer.name = element.libraryItem.name.split("/").pop().split(".").shift();
						}
						else if (element.elementType == "text") 
						{
							// empty textfields
							layer.name = "textfield";
							
							// textfields with some text
							var charsToShow = 17;
							if (element.getTextString()) layer.name = "textfield (" + (element.getTextString().length > charsToShow ? (element.getTextString(0, charsToShow-2) +  "..") : element.getTextString()) + ")"; 
						}
						else if (element.elementType == "shapeObj") 
						{
							// You'r able to give it your own name
							layer.name = (layer.name.indexOf("Layer ") > -1) ? frame.elements.length > 1 ? "objects" : "object" : layer.name;
						}
						else if (element.elementType == "shape") 
						{
							// You'r able to give it your own name
							layer.name = (layer.name.indexOf("Layer ") > -1) ? frame.elements.length > 1 ? "shapes" : "shape" : layer.name;
						}
						else 
						{
							// dont rename the rest
						}
						break;
					}
				}
			}
			
			if (!element && !layerHasCode && !layerHasLabel && !layerHasComment && !layerHasAnchor && !layerHasSound) 
			{
				// remove empty layers
				timeline.deleteLayer(i);
			}
			else
			{
				// layer names if contains labels or actions
				var newLayerName = "";
				var isLabelLayer = false;
				
				if (layerHasLabel) {newLayerName += "/labels"; isLabelLayer = true};
				if (layerHasComment) {newLayerName +=  "/comments"; isLabelLayer = true};
				if (layerHasAnchor) {newLayerName +=  "/anchors"; isLabelLayer = true};
				if (layerHasCode) {newLayerName +=  "/actions"; isLabelLayer = true};
				if (layerHasSound) {newLayerName +=  "/sounds"; isLabelLayer = true};
				
				if (isLabelLayer)
				{
					layer.name = newLayerName.substr(1); // remove first slash
				}
			}
			
		}
		if (layer.layerType == "mask") layer.name = "mask";
		else if (layer.layerType == "guide" && layer.name.indexOf("Layer_") != -1) layer.name = "guide";
	}
}
