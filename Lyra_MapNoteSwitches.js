//=============================================================================
// Lyra_MapNoteSwitches.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0] Allow you to automatically turn on/off a switch when entering/exiting a map.
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

@param aliases
@text Switch ID Aliases
@type struct<switchalias>[]

@help 
Add any of these notetags to a map:
<switch on x>
<switch off x>
<switch toggle x>

<switch ontemp x>
<switch offtemp x>
<switch toggletemp x>

Replace x with the number of the switch you want to change.
The temp versions of the tags are temporary switches.
When you leave the map, it will be turned back to the previous state.

You can also setup aliases. Instead of a number for x, enter the alias 
that you defined in the plugin settings. Good for keeping notetags more 
human readable.

MIT License - credit to "LyraVultur".
https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE

Free for commercial and non-commercial use.
*/

/*~struct~switchalias:
 * @param id
 * @type number
 * @min 1
 * @max 9999
 * @default 1
 *
 * @param alias
 * @type text
 */

var Imported = Imported || {};
Imported.Lyra_MapNoteSwitches = true;

var LyraVultur = LyraVultur || {};
LyraVultur.MapNoteSwitches = LyraVultur.MapNoteSwitches || {};

LyraVultur.MapNoteSwitches.printdebug = {};
LyraVultur.MapNoteSwitches.printdebug = JSON.parse(PluginManager.parameters('Lyra_MapNoteSwitches')['showdebug']) && Utils.isOptionValid('test');

LyraVultur.MapNoteSwitches.Aliases = new Map();

LyraVultur.MapNoteSwitches.parseAliases = function() {
	if (!PluginManager.parameters('Lyra_MapNoteSwitches')['aliases']) {
		return new Map();
	}
	
	const mnsalias = JSON.parse(PluginManager.parameters('Lyra_MapNoteSwitches')['aliases']);
	var data = new Map();
	
	if (!mnsalias) {
		return {};
	}
	
	for (var i = 0; i < mnsalias.length; i++) {
		data.set(JSON.parse(mnsalias[i]).alias, JSON.parse(mnsalias[i]).id);
	}
	
	if (LyraVultur.MapNoteSwitches.printdebug) {
		console.log("[MapNoteSwitches] Loaded aliases:", data);
	}
	
	return data;
};
LyraVultur.MapNoteSwitches.Aliases = LyraVultur.MapNoteSwitches.parseAliases();

LyraVultur.MapNoteSwitches.origGame_PlayerperformTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function() {
    if (this.isTransferring()) {
        if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
			if (!!$gameMap._prevSwitchId) {
				$gameSwitches.setValue($gameMap._prevSwitchId, $gameMap._prevSwitchState);
				
				if (LyraVultur.MapNoteSwitches.printdebug) {
					console.log("[MapNoteSwitches] Change switch to former state:", $gameMap._prevSwitchId, $gameMap._prevSwitchState);
				}
			}
			
            if (LyraVultur.MapNoteSwitches.hasMapNoteSwitchData($dataMap.note) || LyraVultur.MapNoteSwitches.hasMapNoteSwitchAliasData($dataMap.note)) {
				let curmapswitchtype = "none";
				let curmapswitchnum = 0;
				
				if (LyraVultur.MapNoteSwitches.hasMapNoteSwitchData($dataMap.note)) {
					curmapswitchtype = LyraVultur.MapNoteSwitches.getMapNoteSwitchData($dataMap.note)[1];
					curmapswitchnum = Number(LyraVultur.MapNoteSwitches.getMapNoteSwitchData($dataMap.note)[2]);
				}
				else if (LyraVultur.MapNoteSwitches.Aliases.size > 0) {
					curmapswitchtype = LyraVultur.MapNoteSwitches.getMapNoteSwitchAliasData($dataMap.note)[1];
					curmapswitchnum = LyraVultur.MapNoteSwitches.getMapNoteSwitchAliasData($dataMap.note)[2];
					
					curmapswitchnum = LyraVultur.MapNoteSwitches.Aliases.get(curmapswitchnum);
					
					if (LyraVultur.MapNoteSwitches.printdebug) {
						console.log("[MapNoteSwitches] Parsed alias:", LyraVultur.MapNoteSwitches.getMapNoteSwitchAliasData($dataMap.note)[2], curmapswitchnum);
					}
				}
				
				if (LyraVultur.MapNoteSwitches.printdebug) {
					console.log("[MapNoteSwitches] Read notetag:", curmapswitchtype, curmapswitchnum);
				}
				
				if (LyraVultur.MapNoteSwitches.isTemp(curmapswitchtype)) {
					$gameMap._prevSwitchId = curmapswitchnum;
					$gameMap._prevSwitchState = $gameSwitches.value(curmapswitchnum);
				}
				else {
					$gameMap._prevSwitchId = 0;
					$gameMap._prevSwitchState = false;
				}
				
				if (curmapswitchtype != "none") {
					$gameSwitches.setValue(curmapswitchnum, LyraVultur.MapNoteSwitches.noteToBoolean(curmapswitchtype, curmapswitchnum));
				}
			}
        }
		
		LyraVultur.MapNoteSwitches.origGame_PlayerperformTransfer.call(this);
    }
};

LyraVultur.MapNoteSwitches.noteToBoolean = function(note2, note3) {
	const input = note2.toLowerCase();
	
	if (input === "on" || input === "ontemp") {
		return true;
	}
	
	if (input === "off" || input === "offtemp") {
		return false;
	}
	
	if (input === "toggle" || input === "toggletemp") {
		return !$gameSwitches.value(note3)
	}
	
	throw new Error("[MapNoteSwitches] Unknown switch state: " + input);
	return false;
};

LyraVultur.MapNoteSwitches.isTemp = function(note2) {
	const input = note2.toLowerCase();
	
	if (input.endsWith("temp")) {
		return true;
	}
	
	return false;
};

LyraVultur.MapNoteSwitches.hasMapNoteSwitchData = function(note) {
	const rx = /<switch\s([a-zA-Z]+)\s(\d+)>/gi;
	
	return rx.test(note);
};

LyraVultur.MapNoteSwitches.getMapNoteSwitchData = function(note) {
	const rx = /<switch\s([a-zA-Z]+)\s(\d+)>/gi;
	
	return rx.exec(note);
};

LyraVultur.MapNoteSwitches.hasMapNoteSwitchAliasData = function(note) {
	const rx = /<switch\s([a-zA-Z]+)\s([a-zA-Z]+)>/gi;
	
	return rx.test(note);
};

LyraVultur.MapNoteSwitches.getMapNoteSwitchAliasData = function(note) {
	const rx = /<switch\s([a-zA-Z]+)\s([a-zA-Z]+)>/gi;
	
	return rx.exec(note);
};