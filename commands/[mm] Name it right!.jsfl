/**
 * Renames instance names, layers, library items with an easy wizard.
 * @version 2.8
 * @author: Mediamonks - http://www.mediamonks.com
 * @author: Mark Knol  - http://blog.stroep.nl
 */ 
var doc = fl.getDocumentDOM();
var selectedInstance;
var SEPARATOR_XML = '<label value="..............................................................................................................................."/>';
var DEFAULT_CLASS_NAME = "Symbol" // + (Math.random() * 777).toFixed(0);

if (!doc) 
{
	alert("Please open or create a flashfile.");
} 
else 
{
	NameItRight();
}

function NameItRight()
{
	var localStorage = new LocalStorage("[0] Name it right!");
	if (!doc.selection || !doc.selection[0]) 
	{
		alert("You need to select an instance on stage to do the magic.");
		return;
	}
	else if (doc.selection.length != 1)
	{
		if (confirm("Warning: You have selected multiple items.\nDo you want to convert your selection to a new library item?"))
		{
			var newName;
			if (doc.getTimeline().name == "Scene 1") newName = DEFAULT_CLASS_NAME;
			else newName = doc.getTimeline().name + DEFAULT_CLASS_NAME;
			
			convertToSymbol(newName);
			selectedInstance.libraryItem.linkageExportForAS = true;
			selectedInstance.libraryItem.linkageClassName = getClassPackageName(selectedInstance.libraryItem) + "." + newName;
			selectedInstance.libraryItem.linkageBaseClass = "flash.display.MovieClip";
			
			// when multiple items on current frame > distributeToLayers
			/*if (selectedInstance.layer.frames[doc.getTimeline().currentFrame].elements.length > 1)
			{
				fl.getDocumentDOM().distributeToLayers();
			}*/
		}
		else
		{
			return;
		}
	}
	
	selectedInstance = doc.selection[0];
	var base;
	
	if (!selectedInstance.libraryItem || selectedInstance.instanceType == "bitmap")
	{
		if (confirm("Warning: Your selection is not a library item.\nDo you want to convert your selection to a new library item?"))
		{
			var newName;
			if (doc.getTimeline().name == "Scene 1") newName = DEFAULT_CLASS_NAME;
			else newName = doc.getTimeline().name + DEFAULT_CLASS_NAME;
			
			// smart name
			if (selectedInstance.instanceType == "bitmap") newName = upperCaseFirstLetter(selectedInstance.libraryItem.name.split(".").shift()) + "Image";
			if (selectedInstance instanceof Text) 
			{
				if (doc.getTimeline().name == "Scene 1") newName = "MyLabel";
				else newName = doc.getTimeline().name + "Label";
			}
			convertToSymbol(newName);
			selectedInstance.libraryItem.linkageExportForAS = true;
			selectedInstance.libraryItem.linkageClassName = getClassPackageName(selectedInstance.libraryItem) + "." + newName;
			selectedInstance.libraryItem.linkageBaseClass = "flash.display.MovieClip";
			
			// when multiple items on current frame > distributeToLayers
			if (selectedInstance.layer.frames[doc.getTimeline().currentFrame].elements.length > 1)
			{
				fl.getDocumentDOM().distributeToLayers();
			}
		}
		else
		{
			return;
		}
	}
		
	var selectedInstanceLibraryItem = selectedInstance.libraryItem;
	
	var CLASS_LIST = [];
	
	CLASS_LIST.push(
	 'flash.display.MovieClip',
	 'flash.display.Sprite',
	 'temple.core.display.CoreMovieClip',
	 'temple.core.display.CoreSprite',
	 'temple.ui.animation.ContinualMovieClip',
	 'temple.ui.animation.FrameStableMovieClip',
	 'temple.ui.animation.SelfRemovieClip',
	 'temple.multilanguage.elements.MultiLanguageMovieClip',
	 'temple.ui.buttons.MultiStateButton',
	 'temple.ui.buttons.MultiStateElement',
	 'temple.ui.buttons.BaseButton',
	 'temple.ui.buttons.LabelButton',
	 'temple.ui.buttons.AdvancedButton',
	 'temple.ui.buttons.SwitchButton',
	 'temple.ui.buttons.TweenButton',
	 'temple.ui.buttons.URLButton',
	 'temple.ui.buttons.LiquidButton',
	 'temple.ui.buttons.LiquidLabelButton',
	 'temple.ui.layout.liquid.LiquidContainer',
	 'temple.ui.layout.liquid.LiquidMovieClip',
	 'temple.ui.layout.liquid.LiquidSprite',
	 'temple.ui.ImageLoader',
	 'temple.multilanguage.ui.MultiLanguageLabel',
	 'temple.ui.label.Label',
	 'temple.ui.label.LiquidLabel',
	 'temple.ui.tooltip.ToolTip',
	 'temple.ui.pagination.PaginatorComponent',
	 'temple.ui.mouse.MouseCursor',
	 'temple.ui.form.components.AutoCompleteInputField',
	 'temple.ui.form.components.CheckBox',
	 'temple.ui.form.components.ComboBox',
	 'temple.ui.form.components.DateInputField',
	 'temple.ui.form.components.DateSelector',
	 'temple.ui.form.components.InputField',
	 'temple.ui.form.components.List',
	 'temple.ui.form.components.ListRow',
	 'temple.ui.form.components.SubmitButton',
	 'temple.ui.form.components.ResetButton',
	 'temple.ui.form.components.RadioButton',
	 'temple.ui.accordion.Accordion',
	 'temple.ui.accordion.AccordionItem',
	 'temple.ui.accordion.AccordionHeader',
	 'temple.ui.scroll.ScrollBar',
	 'temple.ui.scroll.ScrollComponent',
	 'temple.ui.scroll.ScrollPane',
	 'temple.ui.slider.SliderComponent',
	 'temple.ui.slider.StepSliderComponent',
	 'temple.ui.states.BaseState',
	 'temple.ui.states.BaseFadeState',
	 'temple.ui.states.BaseTimelineState',
	 'temple.ui.states.disabled.DisabledState',
	 'temple.ui.states.disabled.DisabledTimelineState',
	 'temple.ui.states.disabled.DisabledFadeState',
	 'temple.ui.states.down.DownState',
	 'temple.ui.states.down.DownTimelineState',
	 'temple.ui.states.down.DownFadeState',
	 'temple.ui.states.error.ErrorState',
	 'temple.ui.states.error.ErrorTimelineState',
	 'temple.ui.states.error.ErrorFadeState',
	 'temple.ui.states.focus.FocusState',
	 'temple.ui.states.focus.FocusTimelineState',
	 'temple.ui.states.focus.FocusFadeState',
	 'temple.ui.states.open.OpenState',
	 'temple.ui.states.open.OpenTimelineState',
	 'temple.ui.states.open.OpenFadeState',
	 'temple.ui.states.over.OverState',
	 'temple.ui.states.over.OverTimelineState',
	 'temple.ui.states.over.OverFadeState',
	 'temple.ui.states.select.SelectState',
	 'temple.ui.states.select.SelectTimelineState',
	 'temple.ui.states.select.SelectFadeState',
	 'temple.ui.states.up.UpState',
	 'temple.ui.states.up.UpTimelineState',
	 'temple.ui.states.up.UpFadeState'
	);
	
	var foundInDoc = 0;
	for(var i = 0, leni = doc.library.items.length; i < leni; i++)
	{
		var item = doc.library.items[i];
		if (item.linkageExportForAS && CLASS_LIST.indexOf(item.linkageBaseClass) == -1 && item.linkageBaseClass != "flash.text.Font") {
			CLASS_LIST.unshift(item.linkageBaseClass);
			foundInDoc++;
		}
	}
	
	if (selectedInstanceLibraryItem.linkageExportForAS)
	{
		CLASS_LIST.unshift(selectedInstanceLibraryItem.linkageBaseClass); // put current active class on top of list
	}
	else
	{
		CLASS_LIST.unshift("flash.display.MovieClip");
	}

	var steps = {};
	steps.step1 = {
		question: 'Rename library symbol name?', 
		label: 'Type new symbol name:',
		input: selectedInstanceLibraryItem.name.split('/').pop()
	}
	
	if(!selectedInstanceLibraryItem.linkageImportForRS)
	{
		steps.step2 = {
			question: 'The library symbol ' + (selectedInstanceLibraryItem.linkageExportForAS ? 'already has a base class, change it?' : 'has no Base Class, add it?'), 
			label: selectedInstanceLibraryItem.linkageExportForAS ? 'Enter new base class:' : 'Enter a base class:',
			input: CLASS_LIST
		}
	}
	
	var dialogXML = getQuestionXML(steps);
	
	if (selectedInstanceLibraryItem.linkageImportForRS) 
	{
		dialogXML += '<label width="340" value="Note: You cannot change the base class of a symbol that is imported for runtime sharing. Current import source url: \'' + selectedInstanceLibraryItem.linkageURL + '\'."/>' + SEPARATOR_XML;
	}
	else
	{
		dialogXML += '<hbox>';
		dialogXML += '<checkbox width="200" id="exportFrame1" label="Export in frame 1" checked="' + selectedInstanceLibraryItem.linkageExportInFirstFrame + '"/>';
		dialogXML += '<checkbox id="runtimeSharedAsset" label="Runtime shared asset" checked="' + selectedInstanceLibraryItem.linkageExportForRS + '"/>';
		dialogXML += '</hbox>'+ SEPARATOR_XML;
	}
	dialogXML += '<checkbox id="renameInstance" label="Add / rename instance name" checked="' + (localStorage.getProperty("renameInstance_checked") || true) + '"/>'
	var settingsData = createDialogXML(dialogXML, 'Step 1 / 2 : Update the library item ' + selectedInstanceLibraryItem.name + '.');
	
	if (settingsData.dismiss == 'accept')
	{
		// store settings locally
		if (settingsData.step1) localStorage.saveProperty("step1_checked", settingsData.step1);
		if (settingsData.step2) localStorage.saveProperty("step2_checked", settingsData.step2);
		if (settingsData.renameInstance) localStorage.saveProperty("renameInstance_checked", settingsData.renameInstance);
		
		if (settingsData.step1 == 'true')
		{
			selectedInstanceLibraryItem.name = settingsData.step1_input;
			if (selectedInstanceLibraryItem.linkageExportForAS) selectedInstanceLibraryItem.linkageClassName = getClassPackageName(selectedInstanceLibraryItem) + '.' + getClassName(selectedInstanceLibraryItem);
		}
		if (settingsData.step2 && settingsData.step2 == 'true')
		{
			if (!selectedInstanceLibraryItem.linkageExportForAS) 
			{
				selectedInstanceLibraryItem.linkageExportForAS = true;
				selectedInstanceLibraryItem.linkageClassName = getClassPackageName(selectedInstanceLibraryItem) + '.' + getClassName(selectedInstanceLibraryItem);
			}
			selectedInstanceLibraryItem.linkageBaseClass = settingsData.step2_input;
			selectedInstanceLibraryItem.linkageExportInFirstFrame = (settingsData.exportFrame1 == 'true');
			selectedInstanceLibraryItem.linkageExportForRS = (settingsData.runtimeSharedAsset == 'true');
			if (selectedInstanceLibraryItem.linkageExportForRS)
			{
				selectedInstanceLibraryItem.linkageExportInFirstFrame = true;
				if (!selectedInstanceLibraryItem.linkageURL)selectedInstanceLibraryItem.linkageURL = doc.name.split(".fla").shift() + ".swf"
			}
		}
		if (settingsData.renameInstance == 'true')
		{
			settingsData = createDialogXML(
			getQuestionXML({step3:{
				question: '', 
				label: 'Enter the new instance name:', 
				input: 'mc' + upperCaseFirstLetter(selectedInstanceLibraryItem.name.split('/').pop())
			}})
			, 'Step 2 / 2 : ' + (selectedInstance.name ? 'Change the name of the selected instance ' + selectedInstance.name + ' on the timeline.' : 'The selected instance has no instance name, add it?'));
			
			if (settingsData.dismiss == 'accept')
			{
				if (settingsData.step3_input) renameAcrossLayer(settingsData.step3_input, doc);
			}
		}
	}
	
	// dialog functions
	
	function getQuestionXML(UIsettings)
	{
		var retval = '';
		
		for (var UIsetting in UIsettings)
		{
			var dialogElementXML = "";
			if (UIsettings[UIsetting].question) dialogElementXML += '<checkbox id="{id}" checked="{checked}" label="{question}"/>'
			
			dialogElementXML += '<label value="{label}" />'
			if(typeof(UIsettings[UIsetting].input) == "string" )
			{
				dialogElementXML += '<textbox id="{id}_input" width="380" label="{label}" value="{input}"/>'
			}
			else
			{
				dialogElementXML += '<menulist id="{id}_input" editable="true" width="380"><menupopup>'
				for(var i =0;i<UIsettings[UIsetting].input.length;i++) dialogElementXML += ' <menuitem selected="' + (i==0) + '" label="' + UIsettings[UIsetting].input[i] + '"/>'
				dialogElementXML += '</menupopup></menulist>'
			}
			dialogElementXML += SEPARATOR_XML;
			//dialogElementXML += '<separator/>'
			
			var variables = UIsettings[UIsetting];
			variables.id = UIsetting;
			variables.checked = localStorage.getProperty(UIsetting + "_checked") || true;
			for(var variable in variables)
			{
				dialogElementXML = dialogElementXML.split('{' + variable + '}').join(variables[variable]);
			}
			retval += dialogElementXML;
		}
		
		return retval;
	}

	function createDialogXML(xmlString, description)
	{
		var dialogXML = '<dialog title="Name it right! - ' + description + '" buttons="accept, cancel" >';
		dialogXML += '<vbox>';
		dialogXML += 	 xmlString;
		dialogXML +='</vbox>';
		dialogXML +='</dialog>';
		
		var url = fl.configURI + 'Commands/temp-dialog-' + parseInt(Math.random() * 777 * 777) + '.xml';
		FLfile.write(url, dialogXML);
		
		var panelOutput = fl.getDocumentDOM().xmlPanel(url);
		
		FLfile.remove(url); 
		
		return panelOutput;
	}
	
	
	// other functions
	
	function convertToSymbol(newName)
	{
		if (!fl.getDocumentDOM().library.itemExists(newName))
		{
			fl.getDocumentDOM().convertToSymbol("movie clip", newName, "top left");
			selectedInstance = doc.selection[0];  
			return;
		}
		
		var count = 1; // start count
		
		while (count < 1000) 
		{
			if (!fl.getDocumentDOM().library.itemExists(newName + count))
			{
				fl.getDocumentDOM().convertToSymbol("movie clip", newName + count, "top left");
				break;
			}
			count ++;
		}
		// reset selection
		selectedInstance = doc.selection[0];  
	}
	
	function unique(arr) 
	{
		var a = [];
		var l = arr.length;
		for(var i = 0; i < l; i++) 
		{
			for(var j = i + 1; j<  l; j++) 
			{
				if (arr[i] === arr[j]) j = ++i;
			}
			a.push(arr[i]);
		}
		return a;
	}
	
	function LocalStorage(name)
	{
		this.url = fl.configURI + "/Commands/" + name + ".localsettings.xml";
		this.saveProperty = function(name, value)
		{
			var file = this.getSettingsFile();
			if (file) 
			{
				var currentValue = this.getProperty(name, true);
				if (currentValue)
				{
					file = file.split("<"+name+">" + currentValue + "<").join("<"+name+">" + encode(value) + "<");
				}
				else
				{
					file = file.split("</settings>").shift() + "\t<"+name+">" + encode(value) + "</"+name+">\n</settings>" + file.split("</settings>").pop();
				}
			}
			else
			{
				file = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\n<settings>\n\t<"+name+">" + encode(value) + "</"+name+">\n</settings>"
			}
			FLfile.write(this.url, file);
		}
		this.getProperty = function(name, undecoded)
		{
			var file = this.getSettingsFile();
			if (file.indexOf("<"+name+">") != -1) 
			{
				var value = file.split("<"+name+">").pop().split("</"+name+">").shift();
				return !undecoded ? decode(value) : value;
			}
			return null;
		}
		this.getSettingsFile = function()
		{
			if (FLfile.exists(this.url)) 
			{
				return FLfile.read(this.url);
			}
			else 
			{
				FLfile.write(this.url, "");
				return FLfile.read(this.url);
			}
		}
		function encode(value)
		{
			return value
				.split("<").join("&lt;")
				.split(">").join("&gt;")
				.split("&").join("&amp;")
				.split("'").join("&apos;")
				.split('"').join("&quot;");
		}
		function decode(value)
		{
			return value
				.split("&lt;").join("<")
				.split("&gt;").join(">")
				.split("&amp;").join("&")
				.split("&apos;").join("'")
				.split("&quot;").join('"');
		}
	}
	
	function upperCaseFirstLetter(value)
	{
		return value.substring(0, 1).toUpperCase() + value.substr(1, value.length - 1);
	}
	
	function getClassPackageName(item)
	{
		var retval = doc.name.toLowerCase().split('.fla')[0].split('.xfl')[0];
		if (retval) retval = retval.split('..').join('.').split(' ').join('').split('-').join('_').toLowerCase();
		return retval;
	}
	
	function getClassName(item)
	{
		var retval = item.name.substr(item.name.lastIndexOf('/') + 1);
		retval = retval.substr(0, 1).toUpperCase() + retval.substr(1);
		retval = retval.split('.').join('').split(' ').join('');
		return retval;
	}
	
	function renameAcrossLayer(instancename, doc)
	{
		var timeline = doc.getTimeline();
		var selectedFrame = timeline.getSelectedFrames();
		var layer = timeline.layers[timeline.currentLayer];
		layer.name = instancename;
		var framesList = layer.frames;

		var layerList = [];
		for (var i = 0, total = timeline.layers.length; i < total; i++)
		{
			layerList.push(timeline.layers[i].locked);
		}

		timeline.setLayerProperty("locked", true, "others");
		timeline.setLayerProperty("locked", false, "selected");
		
		for (var i = 0; i < framesList.length; i++)
		{
			var frameListItem = framesList[i];
			var frameListItemElements = frameListItem.elements;
			if (frameListItemElements.length > 1)
			{
				alert("Renaming instance names only works with layers containing one instance across frames. There is more than one item on frame " + (i + 1) + ".\n\nUse 'Distribute to layers' and try again.");
				//fl.getDocumentDOM().distributeToLayers();
				break;
			}
			else
			{
				if (frameListItemElements.length > 0)
				{
					var frameListItemElement = frameListItemElements[0];
					var symbolname = frameListItemElement.libraryItem.name;
					
					doc.selectNone();
					
					if (selectedInstanceLibraryItem.name == symbolname && frameListItem.startFrame == i)
					{
						timeline.setSelectedFrames(i, i + 1);
						doc.selectAll();
						doc.selection[0].name = instancename;
					}
				}
			}
		}

		for (var i = 0, total = layerList.length; i < total; i++)
		{
			timeline.setSelectedLayers(i, i);
			timeline.setLayerProperty("locked", layerList[i], "selected");
		}

		timeline.setSelectedFrames(selectedFrame, selectedFrame + 1);
	}
	

};
