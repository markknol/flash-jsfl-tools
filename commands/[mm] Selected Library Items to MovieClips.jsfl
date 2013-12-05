/**
 * @author: Mediamonks - http://www.mediamonks.com
 * @author: Mark Knol  - http://blog.stroep.nl
 */ 
 

var items;
var doc = fl.getDocumentDOM();

if (!doc)
{
	alert("Please open or create a flashfile.");
}
else
{
	ItemsToMovieClips();
}

function ItemsToMovieClips()
{
	var output = "";
	
	var items = fl.getDocumentDOM().library.getSelectedItems();
	var item;
	
	for (var i = 0, leni = items.length; i < leni; i++)
	{
		item = items[i];
		
		item.linkageExportForAS = true;
		item.linkageClassName = item.name.split("/").pop();
		item.linkageBaseClass = "flash.display.MovieClip";
		item.linkageExportInFirstFrame = true;
	}
	
	function getClassPackageName()
	{
		var retval = doc.name.toLowerCase().split('.fla')[0].split('.xfl')[0];
		if (retval) retval = retval.split('..').join('.').split(' ').join('').split('-').join('_').toLowerCase();
		return retval;
	}
}

