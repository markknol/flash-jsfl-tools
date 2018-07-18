/**
 * Bitmap Selection to MovieClips
 * @version 1
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
	SelectionToMovieClips();
}

function SelectionToMovieClips()
{
	var selectedItems = doc.selection;
	
	if (!selectedItems || !selectedItems.length)
	{
		alert('Select at least 1 item on stage')
		return;
	}
	
	var alignments = ["top left", "top center", "top right", "center left", "center", "center right", "bottom left", "bottom center", "bottom right"];
	
	//var prefix = prompt('Enter new name (prefix):', '')
	var dialogXML = ''
	
	dialogXML += '<label width="380" value="Alignment:"/>';
	
	dialogXML += '<menulist id="alignment" editable="false" width="380"><menupopup>'
	for (var i =0;i<alignments.length;i++) dialogXML += '<menuitem selected="' + (i==0) + '" label="' + alignments[i] + '"/>'
	dialogXML += '</menupopup></menulist>'
	
	var dialogData = createDialogXML(dialogXML)
	
	if (dialogData && dialogData.alignment)
	{
		var dom = fl.getDocumentDOM();
		var library = dom.library;
		
		var count = 1;
		
		for each(var selectedItem in selectedItems)
		{
			fl.getDocumentDOM().selectNone();
			
			selectedItem.selected = true;
			
			var newName = selectedItem.libraryItem.name.split("/").pop().split(".png").shift().split(".jpeg").shift().split(".jpg").shift().split(".gif").shift();
			dom.convertToSymbol("movie clip", newName, dialogData.alignment);
			
			var newLibraryIndex = dom.library.findItemIndex(newName);
			var newLibraryItem = dom.library.items[newLibraryIndex];
			setAsSprite(newLibraryItem);
			
			count ++
			selectedItem.selected = false;
			
		}
	}
	
	function createDialogXML(xmlString, description)
	{
		var dialogXML = '<dialog title="' + description + '" buttons="accept, cancel">';
		dialogXML += '<vbox>';
		dialogXML += 	 xmlString;
		dialogXML +='</vbox>';
		dialogXML +='</dialog>';
		
		var url = fl.configURI + '/Commands/temp-dialog-' + parseInt(Math.random() * 777 * 777) + '.xml';
		FLfile.write(url, dialogXML);
		
		var panelOutput = fl.getDocumentDOM().xmlPanel(url);
		
		FLfile.remove(url); 
		
		return panelOutput;
	}
	
	function setAsSprite(item)
	{
		item.linkageExportForAS = true;
		item.name = item.name.split("/").pop().split("-").join("_").split(" ").join("_");
		item.linkageClassName = item.name.split("/").pop();
		item.linkageBaseClass = "flash.display.Sprite";
		item.linkageExportInFirstFrame = true;
	}
	
	function getClassPackageName()
	{
		var retval = doc.name.toLowerCase().split('.fla')[0].split('.xfl')[0];
		if (retval) retval = retval.split('..').join('.').split(' ').join('').split('-').join('_').toLowerCase();
		return retval;
	}
}

var scriptPath = FLfile.uriToPlatformPath(fl.scriptURI);
var scriptPathEnd = scriptPath.lastIndexOf("\\");
scriptPath = scriptPath.slice(0, scriptPathEnd + 1);
fl.runScript(FLfile.platformPathToURI(scriptPath + "[mm] Organize library.jsfl"));
fl.runScript(FLfile.platformPathToURI(scriptPath + "[mm] Check Flump library.jsfl"));
