//=============================================================================
// Lyra_ErrorExtras.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0] Adds extra functionality to error messages.
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

@param erex_img
@text Error Background Image
@type file
@dir img/system/
@require 1
@desc The image to show, or blank for none.

@param erex_opacity
@text Error Background Opacity
@type number
@decimals 2
@default 0.50
@min 0
@max 1
@desc The opacity of the error background.
0 is totally visible and 1 is invisible.

@param erex_blur
@text Use Default Blur
@type boolean
@default false
@desc Enables the default blurred map effect on error.

@param erex_verbose
@text Verbose Errors
@type boolean
@default false
@desc Shows longer, more detailed error messages if enabled. MZ only.

@help 
This lets you optionally set an image to be shown in the background of 
an error message, and in MZ can make errors more verbose (stack trace) 
which may be more helpful for your users to send to you if they crash 
than the default, shorter errors.

MV or MZ compatible.

MIT License - credit to "LyraVultur".
https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE

Free for commercial and non-commercial use.
*/
 
var Imported = Imported || {};
Imported.Lyra_ErrorExtras = true;

var LyraVultur = LyraVultur || {};
LyraVultur.ErrorExtras = LyraVultur.ErrorExtras || {};

LyraVultur.ErrorExtras.printdebug = {};
LyraVultur.ErrorExtras.printdebug = JSON.parse(PluginManager.parameters('Lyra_ErrorExtras')['showdebug']);

LyraVultur.ErrorExtras.imgpath = {};
LyraVultur.ErrorExtras.imgpath = 'img/system/' + String(PluginManager.parameters('Lyra_ErrorExtras')['erex_img']);

LyraVultur.ErrorExtras.bgopacity = {};
LyraVultur.ErrorExtras.bgopacity = Number(PluginManager.parameters('Lyra_ErrorExtras')['erex_opacity']);

LyraVultur.ErrorExtras.useblur = {};
LyraVultur.ErrorExtras.useblur = JSON.parse(PluginManager.parameters('Lyra_ErrorExtras')['erex_blur']);

LyraVultur.ErrorExtras.verbose = {};
LyraVultur.ErrorExtras.verbose = JSON.parse(PluginManager.parameters('Lyra_ErrorExtras')['erex_verbose']);

LyraVultur.ErrorExtras.checkImagePath = function() {
	if (LyraVultur.ErrorExtras.imgpath) {
		if (LyraVultur.ErrorExtras.imgpath != 'img/system/' && !require('fs').existsSync(LyraVultur.ErrorExtras.imgpath + '.png')) {
			console.error("LyraVultur_ErrorExtras: image (", LyraVultur.ErrorExtras.imgpath, ") doesn't exist! this will cause problems!");
		}
		else if (Utils.isOptionValid('test') && LyraVultur.ErrorExtras.printdebug === true) {
			console.log("LyraVultur_ErrorExtras: image (", LyraVultur.ErrorExtras.imgpath, ") exists! yay!");
		}
	}
};
LyraVultur.ErrorExtras.checkImagePath();

LyraVultur.ErrorExtras.testError = function(text) {
	throw new Error(text);
};

//Add our settings
Graphics.printError = function(name, message, error = null) {
    this._errorShowed = true;
	
	if (!this._errorPrinter) {
        this._createErrorPrinter();
    }
	
    if (this._errorPrinter) {
        this._errorPrinter.innerHTML = this._makeErrorHtml(name, message, error);
    }
	
	if (Utils.RPGMAKER_NAME === "MZ") {
		this._wasLoading = this.endLoading();
	}
	
	if (LyraVultur.ErrorExtras.useblur) {
		this._applyCanvasFilter();
	}
	
	Graphics._canvas.style.opacity = LyraVultur.ErrorExtras.bgopacity;
	
	if (Utils.RPGMAKER_NAME === "MV") {
		this._clearUpperCanvas();
	}
};

//Error is passed in when using MZ
Graphics._makeErrorHtml = function(name, message, error) {
	var errbg = "";
	if (LyraVultur.ErrorExtras.imgpath != 'img/system/' && name) {
		errbg = '<style>body{background-image: url(\'' + LyraVultur.ErrorExtras.imgpath + '.png\');}</style>';
	}
	
	if (Utils.RPGMAKER_NAME === "MZ") {
		const nameDiv = document.createElement("div");
		const messageDiv = document.createElement("div");
		nameDiv.id = "errorName";
		messageDiv.id = "errorMessage";
		nameDiv.innerHTML = Utils.escapeHtml(name || "");
		messageDiv.innerHTML = Utils.escapeHtml(message || "");
		
		return errbg + nameDiv.outerHTML + messageDiv.outerHTML;
	}
	
	if (name && error && error.stack && LyraVultur.ErrorExtras.verbose === true) {
		return (errbg +
			'<font color="yellow"><b>' + name + '</b></font><br>' +
            '<font color="white">' + error.stack + '</font><br>');
	}
	else if (name && LyraVultur.ErrorExtras.verbose === true) {
		return (errbg +
			'<font color="yellow"><b>' + name + '</b></font><br>' +
            '<font color="white">' + message + ' [no stack trace available]</font><br>');
	}
	else if (name) {
		return (errbg +
				'<font color="yellow"><b>' + name + '</b></font><br>' +
				'<font color="white">' + message + '</font><br>');
	}
	
	return '';
};

//Clean up our effects in MV
Graphics.eraseLoadingError = function() {
    if (this._errorPrinter && !this._errorShowed) {
        this._errorPrinter.innerHTML = '';
		Graphics._canvas.style.opacity = 1;
        this.startLoading();
    }
};

//Clean up our effects in MZ
Graphics.eraseError = function() {
    if (this._errorPrinter) {
        this._errorPrinter.innerHTML = this._makeErrorHtml();
		Graphics._canvas.style.opacity = 1;
        if (this._wasLoading) {
            this.startLoading();
        }
    }
    this._clearCanvasFilter();
};