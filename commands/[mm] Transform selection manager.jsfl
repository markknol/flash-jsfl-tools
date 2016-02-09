/**
 * Selection transform manager. Transforms all selected items individually. 
 * @version 1.1
 * @author: Mediamonks - http://www.mediamonks.com
 * @author: Mark Knol  - http://blog.stroep.nl
 */ 
 
fl.outputPanel.clear();

var doc = fl.getDocumentDOM();

if (!doc)
{
	alert("Please open or create a flashfile.");
}
else
{
	TransformSelection();
}

function TransformSelection()
{
	var selectedItems = doc.selection;
	
	if (!selectedItems || !selectedItems.length)
	{
		alert('Select at least 1 item on stage')
		return;
	}
	
	var properties = ["scaleX","scaleY","skewX","skewY","x","y","width","height","rotation"];
	var defaultValue = ["1","1","0","0","0","0","","","0"];
	
	var dialogXML = '<label value="Selection transform manager." width="250" class="header" /><label value="Apply a transformation on all selected items individually. " /><separator/>';
	
	var c = 0;
	
	for each (var prop in properties)
	{
		dialogXML += '<hbox><label value="'+prop+': " width="80" />'
			
		if (prop!="rotation")
		{
			if (!defaultValue[c])
			{
				dialogXML += '<textbox id="'+prop+'_value" width="110" value="" type="number"/>'
			}
			else
			{
				dialogXML += '<menulist id="'+prop+'_value" editable="true" width="110"><menupopup>'
				dialogXML += '<menuitem selected="true" label=""/>'
				dialogXML += '<menuitem selected="false" label="'+defaultValue[c]+'"/>'
				dialogXML += '</menupopup></menulist>'
			}
		}
		else
		{
			dialogXML += '<menulist id="'+prop+'_value" editable="true" width="110"><menupopup><menuitem selected="true" label=""/>'
			for(var i=0;i<=360;i++) dialogXML += '<menuitem selected="false" label="'+i+'"/>'
			dialogXML += '</menupopup></menulist>'
		}
		
		dialogXML += '<checkbox id="'+prop+'_relative" checked="false" label="Relative"  width="60"/>'
		dialogXML += '</hbox>'
		
		c++;
	}
	dialogXML += '<separator/><label value="Note: Empty values will be skipped." /><label value=" " />'
	
	var data = createDialogXML(dialogXML);
	
	for each(var selectedItem in selectedItems)
	{
		for each(var prop in properties)
		{
			if (data[prop + "_value"]) 
			{
				if (data[prop + "_relative"] == "true")
				{
					selectedItem[prop] += Number(data[prop + "_value"]);
				}
				else
				{
					selectedItem[prop] = Number(data[prop + "_value"]);
				}
			}
		}
	}
}

function createDialogXML(xmlString)
{
	var dialogXML = '<dialog title="Selection transform manager" buttons="accept, cancel" >';
	dialogXML += '<vbox>' + xmlString + '</vbox>';
	dialogXML +='</dialog>';
   
	
	var localConfigURI = fl.configURI;
	// Verify that the provided path ends with ‘/’
	if (localConfigURI.charAt(localConfigURI.length – 1) != "/") localConfigURI = localConfigURI + "/";

	var path = localConfigURI + "Commands/.dialog-" + parseInt(Math.random() * 1000) + ".xml"
	FLfile.write(path, xmlString);
	var xmlPanelOutput = fl.getDocumentDOM().xmlPanel(path);
	FLfile.remove(path);
	return xmlPanelOutput;
}