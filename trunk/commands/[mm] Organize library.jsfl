/**
 * Organizes bitmaps, videos and sounds in right folders
 * @version 1.0
 * @author: Mediamonks - http://www.mediamonks.com
 * @author: Mark Knol  - http://blog.stroep.nl
 */ 
 
var doc = fl.getDocumentDOM();

if (!doc)
{
	alert("Please open or create a flashfile.");
}
else
{
	OrganizeLibrary();
}

function OrganizeLibrary()
{
	var library = doc.library;
	var items = library.items;
	
	organizeInRootFolder("bitmap", "_images");
	organizeInRootFolder("video", "_videos");
	organizeInRootFolder("sound", "_sounds");
	
	removeForbiddenFolders("_images", ["images","bitmap","_bitmap","image","_bitmaps","pictures","_pictures","_picture","_image"]);
	removeForbiddenFolders("_videos", ["video","_video","_movies","_movie","_flv","videos"]);
	removeForbiddenFolders("_sounds", ["sounds", "_sound", "_wav", "sound"]);
	
	function organizeInRootFolder(itemType, destinationFolder)
	{
		var i = items.length;
		while (i--)
		{
			var item = items[i];
			if (item.itemType === itemType && item.name.indexOf("/") === -1)
			{
				library.newFolder(destinationFolder);
				library.moveToFolder(destinationFolder, item.name, true);
			}
		}
	}
	
	function removeForbiddenFolders(goodFolderName, forbiddenFolderNames)
	{
		var k = forbiddenFolderNames.length;
		while(k--)
		{
			var forbiddenFolderName = forbiddenFolderNames[k]
			i = items.length;
			while (i--)
			{
				var item = items[i];
				if (item.itemType === "folder" && item.name === forbiddenFolderName)
				{
					var j = items.length;
					while (j--)
					{
						var itemj = items[j];
						if (itemj.itemType !== "folder"  && itemj.name.indexOf(forbiddenFolderName) === 0) 
						{
							library.newFolder(goodFolderName);
							library.moveToFolder(goodFolderName, itemj.name, true);
						}
					}
					library.deleteItem(item.name);
				}
				
			}
		}
	}
}