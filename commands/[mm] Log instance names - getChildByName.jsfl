/**
 * Scans the current timeline and outputs variable definitions for instance variables to the output window. The getChildByName-way.
 *
 * Original by http://code.google.com/p/fueljsfl
 * @author: Mediamonks - http://www.mediamonks.com
 * @author: Mark Knol  - http://blog.stroep.nl
 */ 
 
fl.outputPanel.clear();

var items;
var doc = fl.getDocumentDOM();

var TEMPLATE1 = "\t\tprivate var _{variableName}:{className};";
var TEMPLATE2 = "\t\t_{variableName} = {className}(this.getChildByName(\"{variableName}\"));";

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
			if (j == frame.startFrame) // keyframes only
			{
				for (var k = 0, lenk = frame.elements.length; k < lenk; k++)
				{
					elem = frame.elements[k];

					if (elem.elementType == "text" && elem.name)
					{
						vars = {variableName:elem.name, className:"TextField"};
						arr1.push(replaceVars(TEMPLATE1, vars));
						arr2.push(replaceVars(TEMPLATE2, vars));
						continue;
					}

					if (!elem.libraryItem) continue;

					if (elem.libraryItem.linkageClassName || elem.libraryItem.linkageBaseClass)
					{
						if (elem.libraryItem.linkageBaseClass && elem.name)
						{
							cls = elem.libraryItem.linkageBaseClass.split(".").pop();
							vars = {variableName:elem.name, className:cls};
							arr1.push(replaceVars(TEMPLATE1, vars));
							arr2.push(replaceVars(TEMPLATE2, vars));
						}
						else if (elem.libraryItem.linkageClassName && elem.name)
						{
							cls = elem.libraryItem.linkageClassName.split(".").pop();
							vars = {variableName:elem.name, className:cls};
							arr1.push(replaceVars(TEMPLATE1, vars));
							arr2.push(replaceVars(TEMPLATE2, vars));
						}
					}
					else if (elem.name)
					{
						vars = {variableName:elem.name, className:"MovieClip"};
						arr1.push(replaceVars(TEMPLATE1, vars));
						arr2.push(replaceVars(TEMPLATE2, vars));
					}
				}
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
	
	var output1 = unique(arr1).join("\n");
	output1 = output1.substr(2, output1.length); // remove first 2 tabs for nice copy / paste
	
	fl.clipCopyString(output2);
	var output2 = unique(arr2).join("\n");
	
	fl.trace("********* Part 1 *********\n\n" + output1 + "\n\n********* Part 2 *********\n\n" + output2);
	
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
