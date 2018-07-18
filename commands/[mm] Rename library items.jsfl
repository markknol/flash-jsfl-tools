/**
 * Check for empty clips in library
 
 * @author: Mediamonks - http://www.mediamonks.com
 * @author: Mark Knol  - http://blog.stroep.nl
 */ 
 
fl.outputPanel.clear();

var doc = fl.getDocumentDOM();

RenameClipsInLibrary();

function RenameClipsInLibrary()
{
	var fromRename = prompt("Search for");
	if (fromRename != null) {
		var toRename = prompt("Replace to");
		if (toRename != null) {
			fl.trace("Replacing clips with '" + fromRename +  "' to '" + toRename + "'");
			var foundSomething = false;
			var libraryItems = fl.getDocumentDOM().library.items;
			var completed = [];
			for (var i = libraryItems.length - 1; i >= 0; i--) {
				var item = libraryItems[i];
				if (item.itemType =="movie clip" || item.itemType =="graphic") {
					var index = item.name.indexOf(fromRename);
					if (index != -1) {
						var oldName = item.name;
						item.name = item.name.split("/").pop().replace(fromRename, toRename);
						item.linkageClassName = item.name.split("/").pop();
						fl.trace(oldName + " is renamed to " + toRename);
						foundSomething = true;
					}
				}
			}
			
			if (!foundSomething) fl.trace("No clips have been renamed");
		}
	}
	
	
}
