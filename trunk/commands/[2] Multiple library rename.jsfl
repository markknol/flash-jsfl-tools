/**
 * Renames selected library items
 * @version 1
 * @author: Mark Knol - http://blog.stroep.nl
 */ 
 
 
fl.outputPanel.clear();

var items;
var doc = fl.getDocumentDOM();
var PREFIX = "\t\tpublic var ";

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
	var items = fl.getDocumentDOM().library.getSelectedItems();
	if (!items.length){
		alert('Select multiple items in your librarys')
		return;
	}
	
	
	var newName = prompt('New name:','');
	for(var i = 0; i<items.length;i++)
	{
		var item = items[i];
		item.name = newName + (i+1);
	}
}
