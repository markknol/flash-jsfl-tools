/**
 * Random item swapper. 
 * Howto: Select multiple library items, select multiple items on stage. Randomize.
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
	RandomSwap();
}

function RandomSwap()
{
	var libraryItems = fl.getDocumentDOM().library.getSelectedItems();
	var selectedItems = doc.selection;
	
	if (!libraryItems.length)
	{
		alert('Select at least 1 item in your library')
		return;
	}
	
	if (!selectedItems || !selectedItems.length)
	{
		alert('Select at least 1 item on stage')
		return;
	}
	
	for each(var selectedItem in selectedItems)
	{
		selectedItem.libraryItem = libraryItems[Math.floor(Math.random() * libraryItems.length)]
	}
}
