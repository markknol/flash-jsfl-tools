/**
 * Scans the current timeline and outputs frame labels in several copy/pastable formats
 *
 * @author: Mediamonks - http://www.mediamonks.com
 * @author: Mark Knol  - http://blog.stroep.nl
 */ 
 
fl.outputPanel.clear();

var items;
var doc = fl.getDocumentDOM();

var TEMPLATE1 = "\t\tpublic static const {LABEL}:String = \"{label}\";";

if (!doc)
{
	alert("Please open or create a flashfile.");
}
else
{
	LogInstanceNames();
}

function LogInstanceNames()
{
	var timeline = doc.getTimeline();
	var layer, frame, elem, cls;
	var arr1 = [];
	var arr2 = [];
	var vars;
	
	// go through all frames in all layers and search for instance variables.
	for (var i = 0, leni = timeline.layers.length; i < leni; i++)
	{
		layer = timeline.layers[i];
		
		if (layer.layerType === "guide" || layer.layerType === "guided" || layer.layerType === "folder") continue;
		
		for (var j = 0, lenj = layer.frames.length; j < lenj; j++)
		{
			frame = layer.frames[j];
			if(frame.startFrame == j && frame.name)
			{
				arr1.push(replaceVars(TEMPLATE1, {label:frame.name,LABEL:frame.name.toUpperCase()}));
				arr2.push(frame.name);
			}
		}
	}
	
	function replaceVars(template, vars)
	{
		for (var value in vars)
		{
			template = template.split("{"+value+"}").join(vars[value]);
		}
		return template;
	}
	
	if (arr2.length > 0)
	{
		var output1 = (arr1).join("\n");
		output1 = output1.substr(2, output1.length); // remove first 2 tabs for nice copy / paste
		fl.trace((arr2).join(", ") + "\n\n\""+ (arr2).join("\", \"") + "\"\n\n"+ output1);
	}
	else
	{
		fl.trace('no labels found');
	}
	
	function unique(arr) 
	{
		var a = [];
		var l = arr.length;
		for(var i = 0; i < l; i++) 
		{
			for(var j = i + 1; j < l; j++) 
			{
				if (arr[i] === arr[j]) j = ++i;
			}
			a.push(arr[i]);
		}
		return a;
	}
}
