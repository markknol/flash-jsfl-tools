/**
 * 
 * @version 1
 * @author: Mark Knol - http://blog.stroep.nl
 */ 
 

var items;
var doc = fl.getDocumentDOM();

if (!doc)
{
	alert("Please open or create a flashfile.");
}
else
{
	ItemsToSprites();
}

function ItemsToSprites()
{
	var output = "";
	
	var items = fl.getDocumentDOM().library.getSelectedItems();
	var item;
	
	for (var i = 0, leni = items.length; i < leni; i++)
	{
		item = items[i];
		if (item.itemType == "folder") continue;
		
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

