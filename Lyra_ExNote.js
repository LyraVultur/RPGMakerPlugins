//=============================================================================
// Lyra_ExNote.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.1] Lets you have notetags read in from external JSON files.
@author Lyra Vultur
@url http://www.koutacles.com.au/
 
License
MIT
<https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE>

@param showdebug
@text Show Debug Info
@type boolean
@default false
@desc Will print debug info into the console. Playtest mode only. Can be laggy.

@help 
This lets you load notetags from external JSON files.
It will look for them in the data subfolder.
There is no guarantee that your JSON files will get copied over when you 
use Deployment and have "Exclude Unused Files" ticked. So be sure to 
double check after you deploy!

To use a file simply add <ExNote: filename> in ANY notebox. Replace filename 
with the actual name of your file (case sensitive, no file extension).
I recommend not using spaces in your filenames, use underscores instead.

The data from the file will be added onto any data already in the notebox.
This is done before the game parses the metadata, so it will act as though 
you had written out the entire contents of the file in the box -- text codes 
and the like should all work.

The contents of your JSON files should look something like this:

[
"Stuff",
"More stuff",
"This one.\nHas a new line!"
]

The square brackets start and end the file. 
Each line needs to be enclosed in double quotes, and if it is not the last 
line then it needs a comma afterwards.
If you need a new line in the middle of a string, use \n.
If your text includes a lone \ anywhere, you will need to use \\.

MIT License - credit to "LyraVultur".
https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE

Free for commercial and non-commercial use.
*/
 
var Imported = Imported || {};
Imported.Lyra_ExNote = true;

var LyraVultur = LyraVultur || {};
LyraVultur.ExNote = LyraVultur.ExNote || {};

LyraVultur.ExNote.printdebug = {};
LyraVultur.ExNote.printdebug = JSON.parse(PluginManager.parameters('Lyra_ExNote')['showdebug']);

LyraVultur.originalDataManager_extractArrayMetadata = DataManager.extractArrayMetadata;
DataManager.extractArrayMetadata = function(array) {
    if (Array.isArray(array)) {
		let newnote = {};
		
        for (const data of array) {
			if (data && "note" in data && data.note != "" && LyraVultur.ExNote.hasExNoteData(data.note)) {
				newnote = data.note;
				const expanded = LyraVultur.ExNote.extractExternalFileNames(data.note);
				
				for (file of expanded) {
					let filedata = LyraVultur.ExNote.extractExternalFileData(file);
					
					newnote = newnote.concat('\n', filedata.join('\n'));
				}
			
				data.note = newnote;
			}
        }
		
		LyraVultur.originalDataManager_extractArrayMetadata.call(this, array);
    }
};

LyraVultur.originalDataManager_extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function(data) {
	let newnote = {};
	
	if (DataManager.isMapObject(data)) {
		if (data && "note" in data && data.note != "" && LyraVultur.ExNote.hasExNoteData(data.note)) {
			newnote = data.note;
			const expanded = LyraVultur.ExNote.extractExternalFileNames(data.note);
			
			for (file of expanded) {
				let filedata = LyraVultur.ExNote.extractExternalFileData(file);
				
				newnote = newnote.concat('\n', filedata.join('\n'));
			}
		
			data.note = newnote;
		}
	}
	
	LyraVultur.originalDataManager_extractMetadata.call(this, data);
};

LyraVultur.ExNote.extractExternalFileNames = function(note) {
    const rx = /<ExNote:\s*(.*?)>/g;
    let exdata = [];
	
    for (;;) {
        const match = rx.exec(note);
        if (match) {
			exdata.push(match[1]);
        } else {
            break;
        }
    }
	
	return exdata;
};

LyraVultur.ExNote.extractExternalFileData = function(file) {
    const filePath = "data/" + file + ".json";

	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", filePath, false);
	xmlhttp.send(null);
	
	if (Utils.isOptionValid('test') && LyraVultur.ExNote.printdebug) {
		console.log("[ExNote] Read External Notetag File: ", filePath);
	}

	try {
		var fileContent = JSON.parse(xmlhttp.responseText);
		
		if (fileContent && typeof fileContent === "object") {
			return fileContent;
		}
	}
	catch (e) {
		//
	}
	
	return ["[ExNote] Invalid JSON file: ".concat(filePath)];
};

LyraVultur.ExNote.hasExNoteData = function(note) {
	const rx = /<ExNote:\s*(.*?)>/g;
	
	return rx.test(note);
};