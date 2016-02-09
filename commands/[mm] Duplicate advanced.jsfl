/**
 * Deep Duplicate tool
 * @version 1.0
 * @author: Mark Knol - http://blog.stroep.nl
 */ 
 
var doc = fl.getDocumentDOM();
var INSTANCE = "instance";
var SYMBOL = "symbol";
var BITMAP = "bitmap";

if (!doc)
{
	alert("Please open or create a flashfile.");
}
else
{
	DuplicateAdvanced();
}

function DuplicateAdvanced()
{
	var selectedItems = doc.selection;
	var library = fl.getDocumentDOM().library;
	var items = library.getSelectedItems();
	var item;
	if (items.length == 1)
	{
		item = items[0];
	}
	if (!item)
	{
		if (items.length == 0)
		{
			var items = fl.getDocumentDOM().selection;
			if (items.length == 1)
			{
				item = items[0].libraryItem;
			}
		}
	}
	if (!item)
	{
		alert("Select one item on stage or in your library to do the magic");
		return;
	}
	var usedFolder = false;
	
	var dialogXML = '<label value="I\'d love to duplicate \'' + item.name + '\'."/>';
	
	var libraryNames = findNamesRecursive(item);
	
	if (libraryNames && libraryNames.length) 
	{
		dialogXML += '<separator/><label value="Select the related symbols you also want to duplicate. Those will be swapped inside the duplicated \'' + item.name + '\'" />'
		var index = 0;
		for (var a in libraryNames)
		{
			if (libraryNames.length >= 8 && index % 4 == 0) dialogXML += '<hbox>';
			
			var libraryName = libraryNames[a];
			
			dialogXML += '<checkbox checked="'+ (item.name == libraryName)+'" id="checkbox_'+libraryName+'" label="' +libraryName+ '" width="280"/>';
			
			if (libraryNames.length >= 8 && index % 4 == 3) dialogXML += '</hbox>';
			index++;
		}
		
		if (libraryNames.length >= 8 && (index - 1) % 4 < 3) dialogXML += '</hbox>'; // make sure its closed
		
		//oncommand="this.fl.xmlui.setEnabled(\'replaceFrom1\',false);this.o=\'\';for(a in fl) {this.o+=a+\':\'+fl[a]+\'\\n\'};alert(this.o);"
		
		dialogXML += '<separator/><label value="Enter new name pre- or postfix: (will apply to all newly created symbols)"/>'
		dialogXML += '<hbox><textbox id="prefix" value="" width="150" /><label value=" + original symbol name + " width="130" /><textbox id="postfix" value="" width="150" /></hbox>';
		dialogXML += '<separator/><label value="Replace values in selected symbol names: (case sensitive / will apply to all newly created symbols)"/>'
		dialogXML += '<hbox><textbox id="replaceFrom1" value="" width="150" /><label value="                to " width="130"/><textbox id="replaceTo1" value="" width="150" /></hbox>';
		dialogXML += '<hbox><textbox id="replaceFrom2" value="" width="150" /><label value="                to " width="130"/><textbox id="replaceTo2" value="" width="150" /></hbox>';
		dialogXML += '<hbox><textbox id="replaceFrom3" value="" width="150" /><label value="                to " width="130"/><textbox id="replaceTo3" value="" width="150" /></hbox>';
		dialogXML += '<separator/><label value="Options:"/><checkbox checked="true" id="persistExportRS" label="Persist export for runtime sharing." />'
		dialogXML += '<separator/><label value="Note: If duplication fails (mostly on duplicate names), delete the selected items in your library."/>'
	}
	var data;
	
	if (libraryNames && libraryNames.length)
	{
		data = createDialogXML(dialogXML, "Duplicate Advanced - Library Symbol - " + item.name);
		if (data.dismiss === 'accept')
		{
			if (!data.prefix && !data.postfix && !(data.replaceFrom1 || data.replaceFrom2 || data.replaceFrom3)) 
			{
				if (confirm("Paupert! Enter name pre- or postfix or replacement")) alert("I mean the next time you run this tool, ofcourse. So.. try again.");
				return;
			}
			
			var selectedItemsCount = 0
			for(var id in data)	{ if (id.indexOf('checkbox_') > -1) selectedItemsCount ++}
			if (selectedItemsCount > 20)
			{ 
				if (!confirm("Hmm.. you've selected a lot of symbols.. It could take a while. I hope you have saved. Give it a try anyway?")) return;
			}
			
			var replaces = [/*{from:item.name, to: data.prefix + item.name.split(data.replaceFrom1).join(data.replaceTo1).split(data.replaceFrom2).join(data.replaceTo2).split(data.replaceFrom3).join(data.replaceTo3) + data.postfix}*/];
			
			for(var id in data)
			{
				if (id.indexOf('checkbox_') > -1)
				{
					var originalLibraryName = id.split('checkbox_').join('');
					var newName = data.prefix + originalLibraryName.split("/").pop().split(data.replaceFrom1).join(data.replaceTo1).split(data.replaceFrom2).join(data.replaceTo2).split(data.replaceFrom3).join(data.replaceTo3) + data.postfix;
					if (data[id] === 'true') // checkbox checked, sad it's a string
					{
						var libraryItem = getLibraryItem(originalLibraryName);
						
						fl.getDocumentDOM().library.duplicateItem(originalLibraryName);
						
						var convertedName = originalLibraryName.split("/").pop();
						var newLibraryItem = getLibraryItem(convertedName  + " copy") || getLibraryItem(originalLibraryName + " copy"); // Hacky way to find new symbol
						//alert(originalLibraryName + " > " + newName);
						newLibraryItem.name = newName;
						
						replaces.push({from: originalLibraryName, to: newLibraryItem.name});
						
						copyClassInfo(libraryItem, newLibraryItem, data.persistExportRS === 'true');
						
						// apply replacement on linkage class name
						if (newLibraryItem.linkageExportForAS == true) 
						{
							newLibraryItem.linkageClassName = newLibraryItem.linkageClassName.split(data.replaceFrom1).join(data.replaceTo1).split(data.replaceFrom2).join(data.replaceTo2).split(data.replaceFrom3).join(data.replaceTo3)
						}
					}
				}
			}
			
			var leni = replaces.length;
			
			// loop through all selected movieclips' keyframes/elements, and swap with those who are selected
			for(var i = 0, leni = replaces.length; i < leni; i++)
			{
				var replaceItem = getLibraryItem(replaces[i].to);
				//alert(replaces[i].from + " >> " + replaces[i].to);
				if (!replaceItem || !replaceItem.timeline) return;
				
				for each(var layer in replaceItem.timeline.layers)
				{
					var frameNumber = 0;
					for each(var frame in layer.frames)
					{
						if (frameNumber === layer.frames[frameNumber].startFrame) // keyframes only
						{
							for each(var element in frame.elements)
							{
								if (element.elementType === INSTANCE && element.libraryItem)
								{
									for (var j = leni - 1; j >= 0; j--)
									{
										var replaceJ = replaces[j];
										var originalLibraryItem = getLibraryItem(replaceJ.from);
										
										if (element.libraryItem.name === originalLibraryItem.name)
										{
											var targetLibraryItem = getLibraryItem(replaceJ.to);
											if (targetLibraryItem)
											{
												element.libraryItem = targetLibraryItem;
											}
										}
									}
								}
							}
						}
						frameNumber++;
					}
				}
			}
		}
	}
	else
	{
		alert("You have not selected anything to duplicate. Nothing will happen.");
	}
	
	function getLibraryItem(name)
	{
		for each(var item in library.items)
		{
			if (item.name === name) return item;
		}
	}
}

function copyClassInfo(fromLibraryItem, toLibraryItem, persistExportRS)
{
	if (toLibraryItem == fromLibraryItem) return;
	var linkageClassName
	if (fromLibraryItem.linkageImportForRS) // remember linkageClassName before turning 'linkageImportForRS' off
	{
		linkageClassName = fromLibraryItem.linkageClassName;
	}
	if (toLibraryItem.linkageImportForRS) toLibraryItem.linkageImportForRS = false;
	if (toLibraryItem.linkageExportForRS) toLibraryItem.linkageExportForRS = false;
	
	if (toLibraryItem && fromLibraryItem && (fromLibraryItem.linkageExportForAS || fromLibraryItem.linkageImportForRS))
	{
		toLibraryItem.linkageExportForAS = true;
		toLibraryItem.linkageClassName = linkageClassName ? linkageClassName.split(fromLibraryItem.name).join(toLibraryItem.name) : fromLibraryItem.linkageClassName.split(fromLibraryItem.name).join(toLibraryItem.name);
		toLibraryItem.linkageBaseClass = fromLibraryItem.linkageBaseClass;
		toLibraryItem.linkageExportInFirstFrame = fromLibraryItem.linkageExportInFirstFrame;
		toLibraryItem.linkageExportForRS = persistExportRS ? (fromLibraryItem.linkageImportForRS ? false : fromLibraryItem.linkageExportForRS) : false;
	}
}

function findNamesRecursive(item, list)
{
	if (!list) list = (item.name.indexOf("'") == -1 && item.name.indexOf('<') == -1 && item.name.indexOf('>') == -1 && item.name.indexOf('"') == -1) ? [item.name] : [];
	if (!item.timeline) return list;
	for each (var layer in item.timeline.layers)
	{
		for each(var frame in layer.frames)
		{
			for each(var element in frame.elements)
			{
				if (element.elementType === INSTANCE && element.instanceType === SYMBOL)
				{
					if (list.indexOf(element.libraryItem.name) == -1) 
					{
						var libraryName = element.libraryItem.name
						if (libraryName.indexOf("'") == -1 && libraryName.indexOf('<') == -1 && libraryName.indexOf('>') == -1 && libraryName.indexOf('"') == -1)
						{
							list.push(libraryName);
							list = findNamesRecursive(element.libraryItem, list);
						}
					}
				}
			}
		}
	}
	return list;
}

function createDialogXML(xmlString, title)
{
	var dialogXML = '<dialog title="'+title+'" buttons="accept, cancel" >';
	dialogXML += '<vbox>' + xmlString + '</vbox>';
	dialogXML +='</dialog>';
   
	var localConfigURI = fl.configURI;
	// Verify that the provided path ends with ‘/’
	if (localConfigURI.charAt(localConfigURI.length – 1) != "/") localConfigURI = localConfigURI + "/";

	var url = localConfigURI + 'Commands/temp-dialog-' + parseInt(Math.random() * 777 * 777) + '.xml';
	FLfile.write(url, dialogXML);
	
	var panelOutput = fl.getDocumentDOM().xmlPanel(url);
	
	FLfile.remove(url); 
	
	return panelOutput;
}