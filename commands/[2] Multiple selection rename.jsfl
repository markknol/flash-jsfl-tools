/**
 * Renames selected instances
 * @version 1
 * @author: Mark Knol - http://blog.stroep.nl
 */ 
 
 
fl.outputPanel.clear();
var doc = fl.getDocumentDOM();

if (!doc)
{
	alert("Please open or create a flashfile.");
}
else
{
	Rename();
}

function Rename()
{
	var selectedItems = doc.selection;
	
	if (!selectedItems || !selectedItems.length)
	{
		alert('Select at least 1 item on stage')
		return;
	}
	
	var newName = prompt('Enter new name (prefix):','');
	
	for(var i = 0; i<selectedItems.length;i++)
	{
		var selectedItem = selectedItems[i];
		selectedItem.name = newName + (i+1);
	}
}
