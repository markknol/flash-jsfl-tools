/**
 * Flump ready FLA checks + fixes
 
 * @author: Mediamonks - http://www.mediamonks.com
 * @author: Mark Knol  - http://blog.stroep.nl
 */ 
 
fl.outputPanel.clear();

var doc = fl.getDocumentDOM();

ConfigureLibrary();

function ConfigureLibrary()
{
	var smooth = confirm("Make smooth?");
	var pixelate = false;
	if (!smooth) pixelate = confirm("Make pixelated?");
	
	var libraryItems = fl.getDocumentDOM().library.items;
	var completed = [];
	for (var i = libraryItems.length - 1; i >= 0; i--)
	{
		var item = libraryItems[i];
		if (item.itemType == "bitmap")
		{
			completed.length = 0;
			if (smooth) {
				if (!item.allowSmoothing) 
				{
					item.allowSmoothing = true;
					completed.push("smooth");
				}
			}
			if (pixelate) {
				if (item.allowSmoothing) 
				{
					item.allowSmoothing = false;
					completed.push("pixelated");
				}
			}
			
			if (item.compressionType != "lossless") 
			{
				item.compressionType = "lossless";
				completed.push("lossless");
			}
			if (completed.length > 0) fl.trace(item.name + " now " + completed.join(" and "));
		}
	}
	fl.trace("-- Configuring library done");
}
