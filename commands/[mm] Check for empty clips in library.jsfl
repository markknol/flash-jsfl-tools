/**
 * Check for empty clips in library
 
 * @author: Mediamonks - http://www.mediamonks.com
 * @author: Mark Knol  - http://blog.stroep.nl
 */ 
 
fl.outputPanel.clear();

var doc = fl.getDocumentDOM();

FindEmptyClipsInLibrary();

function FindEmptyClipsInLibrary()
{
	var foundSomething = false;
	var libraryItems = fl.getDocumentDOM().library.items;
	var completed = [];
	for (var i = libraryItems.length - 1; i >= 0; i--) {
		var item = libraryItems[i];
		if (item.timeline) {
			var hasItems = false;
			
			var layers = item.timeline.layers;
			loop1: 
			for (var j=0; j < layers.length; j++) {
				var layer = layers[j];
				if (layer.layerType == "normal" || layer.layerType == "mask" || layer.layerType == "masked") {
					var frames = layer.frames;
					loop2: 
					for (var k=0; k<frames.length; k++) {
						var frame = frames[k];
						if (k == frame.startFrame) {
							if (!frame.isEmpty) {
								hasItems = true;
								break loop1;
								break loop2;
							}
						}
					}
				}
			}
			if (!hasItems) {
				foundSomething= true;
				fl.trace(item.name + " has no content");
			}
		}
	}
	
	if (!foundSomething) fl.trace("All clips have content");
}
