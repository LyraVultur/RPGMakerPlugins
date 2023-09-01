//=============================================================================
// Lyra_NickEquip.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0] Lets you have actor nicknames change based on state/equipment.
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
Changes the actor's nickname based on current state or equipment.
Add the tag <NickEquip: x> to a weapon, armour, or state notebox.
Change x to be the text you want the nickname to be.

Very basic at the moment, and doesn't properly support multiple objects setting 
a nickname at once. If you do this, then when you unequip one of the objects, 
the nickname will return to normal.

MIT License - credit to "LyraVultur".
https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE

Free for commercial and non-commercial use.
*/
 
var Imported = Imported || {};
Imported.Lyra_NickEquip = true;

var LyraVultur = LyraVultur || {};
LyraVultur.NickEquip = LyraVultur.NickEquip || {};

LyraVultur.NickEquip.printdebug = {};
LyraVultur.NickEquip.printdebug = JSON.parse(PluginManager.parameters('Lyra_NickEquip')['showdebug']);

LyraVultur.NickEquip.originalGame_ActorchangeEquip = Game_Actor.prototype.changeEquip;
Game_Actor.prototype.changeEquip = function(slotId, item) {
    if (!item || this.equipSlots()[slotId] === item.etypeId) {
		if (item && item.meta.NickEquip) {
			if (Utils.isOptionValid('test') && LyraVultur.NickEquip.printdebug) {
				console.log("[NickEquip] Changing " + String(this._name) + "'s nickname to ", item.meta.NickEquip.trim());
			}
			
			this.setNickname(item.meta.NickEquip.trim());
		}
		
		if (!item) {
			if (Utils.isOptionValid('test') && LyraVultur.NickEquip.printdebug) {
				console.log("[NickEquip] Restoring " + String(this._name) + "'s nickname");
			}
			
			this.setNickname(this._originalNickname);
		}
		
        LyraVultur.NickEquip.originalGame_ActorchangeEquip.call(this, slotId, item);
    }
};

LyraVultur.NickEquip.originalGame_ActorinitMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
	LyraVultur.NickEquip.originalGame_ActorinitMembers.call(this);
    this._originalNickname = "";
};

LyraVultur.NickEquip.originalGame_Actorsetup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
    const actor = $dataActors[actorId];
	LyraVultur.NickEquip.originalGame_Actorsetup.call(this, actorId);
    this._originalNickname = actor.nickname;
};

LyraVultur.NickEquip.originalGame_BattlerBaseaddNewState = Game_BattlerBase.prototype.addNewState;
Game_BattlerBase.prototype.addNewState = function(stateId) {
	LyraVultur.NickEquip.originalGame_BattlerBaseaddNewState.call(this, stateId);
	
    if ($dataStates[stateId] && $dataStates[stateId].meta.NickEquip) {
		if (Utils.isOptionValid('test') && LyraVultur.NickEquip.printdebug) {
			console.log("[NickEquip] Changing " + String(this._name) + "'s nickname to ", $dataStates[stateId].meta.NickEquip.trim());
		}
		
		this.setNickname($dataStates[stateId].meta.NickEquip.trim());
	}
};

LyraVultur.NickEquip.originalGame_BattlerremoveState = Game_Battler.prototype.removeState;
Game_Battler.prototype.removeState = function(stateId) {
    if (this.isStateAffected(stateId)) {
        if ($dataStates[stateId].meta.NickEquip && this.nickname() === $dataStates[stateId].meta.NickEquip.trim()) {
			if (Utils.isOptionValid('test') && LyraVultur.NickEquip.printdebug) {
				console.log("[NickEquip] Restoring " + String(this._name) + "'s nickname");
			}
			
			this.setNickname(this._originalNickname);
		}
    }
	
	LyraVultur.NickEquip.originalGame_BattlerremoveState.call(this, stateId);
};