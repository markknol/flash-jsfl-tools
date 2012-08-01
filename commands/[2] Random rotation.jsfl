/**
 * Rotates instances
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
	RandomRotation();
}

function RandomRotation()
{
	var selectedItems = doc.selection;
	
	if (!selectedItems || !selectedItems.length)
	{
		alert('Select at least 1 item on stage')
		return;
	}
	
	var rotations = [0,90,180,270];
	
	for each(var selectedItem in selectedItems)
	{
		selectedItem.rotation = rotations[Math.floor(Math.random() * rotations.length)];
	}
}
