//=============================================================================
// Lyra_HideDisabledEquips.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0] Hides unequippable (greyed out) items.
@author Lyra Vultur
@url http://www.koutacles.com.au/
 
License
MIT
<https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE>

@param showdebug
@text Show Debug Info
@type boolean
@default false
@desc Will print debug info into the console. Playtest mode only.

@param defaultstate
@text Hide By Default
@type boolean
@default true
@desc Sets if grey items are hidden initially.

@command SetHidden
@text Hide Equipment Toggle
@desc Show or hide greyed out equipment?

    @arg isenabled
    @text Enabled?
    @type boolean
    @desc Hide greyed out equipment?
    @default true

@help 
dfgjdfgldlfkgjdflgjkdflkgjdfklgjdflkgjdfklgjdklfgjdlfkgjdklfgjdklfgjldkfgk

MIT License - credit to "LyraVultur".
https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE

Free for commercial and non-commercial use.
*/
 
var Imported = Imported || {};
Imported.Lyra_HideDisabledEquips = true;

var LyraVultur = LyraVultur || {};
LyraVultur.HideDisabledEquips = LyraVultur.HideDisabledEquips || {};

LyraVultur.HideDisabledEquips.printdebug = {};
LyraVultur.HideDisabledEquips.printdebug = JSON.parse(PluginManager.parameters('Lyra_HideDisabledEquips')['showdebug']) && Utils.isOptionValid('test');
LyraVultur.HideDisabledEquips.defaultstate = {};
LyraVultur.HideDisabledEquips.defaultstate = !!PluginManager.parameters('Lyra_HideDisabledEquips')['defaultstate'];

LyraVultur.HideDisabledEquips.enabled = true;

//==========Init
LyraVultur.HideDisabledEquips.Initialise = function() {
	LyraVultur.HideDisabledEquips.enabled = LyraVultur.HideDisabledEquips.defaultstate;
	
	if (LyraVultur.HideDisabledEquips.printdebug) {
		console.log("[HideDisabledEquips] enabled", LyraVultur.HideDisabledEquips.enabled);
	}
};
LyraVultur.HideDisabledEquips.Initialise();

//==========Command binds
PluginManager.registerCommand('Lyra_HideDisabledEquips', 'SetHidden', args => {
	const arg0 = JSON.parse(args.isenabled);
	  
	LyraVultur.HideDisabledEquips.enabled = !!arg0;
});

//==========Main
LyraVultur.HideDisabledEquips.OrigWindow_EquipItemisEnabled = Window_EquipItem.prototype.isEnabled;
Window_EquipItem.prototype.isEnabled = function(item) {
	let result = LyraVultur.HideDisabledEquips.OrigWindow_EquipItemisEnabled.call(this, item);
	
	if (LyraVultur.HideDisabledEquips.printdebug && item) {
		console.log("[HideDisabledEquips] Window_EquipItem.isEnabled", item.name, result);
	}
	
    return result;
};

LyraVultur.HideDisabledEquips.OrigWindow_EquipItemincludes = Window_EquipItem.prototype.includes;
Window_EquipItem.prototype.includes = function(item) {
    let result = LyraVultur.HideDisabledEquips.OrigWindow_EquipItemincludes.call(this, item);
	
	if (item && LyraVultur.HideDisabledEquips.enabled && !this.isEnabled(item)) {
		result = false;
	}
	
	if (LyraVultur.HideDisabledEquips.printdebug && item) {
		console.log("[HideDisabledEquips] Window_EquipItem.includes", item.name, result);
	}
	
    return result;
};