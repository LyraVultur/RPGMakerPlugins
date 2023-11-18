//=============================================================================
// Lyra_MapNoteSwitches.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.1] Allow you to automatically turn on/off a switch when entering/exiting a map.
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

LyraVultur.MapNoteSwitches._tempSwitches = new Array();
LyraVultur.MapNoteSwitches._tempAliases = new Array();
LyraVultur.MapNoteSwitches._tempUnifiedData = new Array();

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
			if (!$gameMap._prevSwitchStates) {
				$gameMap._prevSwitchStates = new Map();
			}
			
			if ($gameMap?._prevSwitchStates?.size > 0) {
				Array.from($gameMap._prevSwitchStates.keys()).forEach(restore => {
					$gameSwitches.setValue(Number(restore), !!$gameMap._prevSwitchStates.get(Number(restore)));
					
					if (LyraVultur.MapNoteSwitches.printdebug) {
						console.log("[MapNoteSwitches] Change switch to former state:", Number(restore), !!$gameMap._prevSwitchStates.get(Number(restore)));
					}
				});
			}
			
			//cleanse old data
			$gameMap._prevSwitchStates.clear();
			
			LyraVultur.MapNoteSwitches._tempUnifiedData = LyraVultur.MapNoteSwitches.getUnifiedMapNoteSwitchData($dataMap.note);
			
            if (!!$gameMap && LyraVultur.MapNoteSwitches?._tempUnifiedData?.length > 0) {
				if (LyraVultur.MapNoteSwitches.printdebug) {
					console.log("[MapNoteSwitches] Found switch data in map notes:", LyraVultur.MapNoteSwitches._tempUnifiedData);
				}
				
				if (LyraVultur.MapNoteSwitches?._tempUnifiedData?.length > 0) {
					LyraVultur.MapNoteSwitches?._tempUnifiedData.forEach(tag => {
						let id = Number(tag.groups.id);
						let al = tag.groups.alias;
						let bo = Boolean($gameSwitches.value(id));
						
						//Parse aliases into regular switches
						if (al != null && al != "" && LyraVultur.MapNoteSwitches.Aliases.size > 0) {
							id = Number(LyraVultur.MapNoteSwitches.Aliases.get(al));
						}
						
						//Save current state if temporary
						if (tag.groups.type.endsWith("temp")) {
							$gameMap._prevSwitchStates.set(id, $gameSwitches.value(id));
						}
						
						//Make changes to switch
						$gameSwitches.setValue(id, LyraVultur.MapNoteSwitches.noteToBoolean(tag.groups.type, $gameSwitches.value(id)));
					});
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

LyraVultur.MapNoteSwitches.getUnifiedMapNoteSwitchData = function(note) {
	const rx = /^<switch\s(?<type>[a-zA-Z]+)\s(?:(?<alias>[a-zA-Z]+)|(?<id>\d+))>$/gmi;
	
	let m;
	let result = new Array();
	
	do {
		m = rx.exec(note);
		if (m) {
			result.push(m);
		}
	} while (m);
	
	return result;
};