/**
 * Runs all flump files in directory of current file
 * @author: Mediamonks - http://www.mediamonks.com
 * @author: Mark Knol  - http://blog.stroep.nl
 */ 
var pathToFlump = "C:\\Program Files (x86)\\Flump\\Flump.exe";
var doc = fl.getDocumentDOM();
var directory = getDirectory(doc);
var files = FLfile.listFolder(directory + "*.flump");
for(var i=0; i<files.length; i++) {
	var file = files[i];
	var command = 'call "'+ pathToFlump +'" --export "' + FLfile.uriToPlatformPath(directory)+file + '"';
	fl.trace(command);
	FLfile.runCommandLine(command);
}

function getDirectory(doc){
   var lastSlash = doc.path.lastIndexOf("\\");
   var temp = doc.path.substr(0, lastSlash).split("\\");
   // format directory path url encoded
   for (var i=1; i<temp.length; i++) temp[i] = escape(temp[i]);
   return "file:///" + temp.join("/") + "/";
}