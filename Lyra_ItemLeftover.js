//=============================================================================
// Lyra_ItemLeftover.js
//=============================================================================

/*:
@plugindesc [v1.1] After using an item, get something back. 
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
Use the tag <Leftover:x,y> in an item's note box in the database.
When used, the item will give the party y amount of item id x.
eg <Leftover:1,4> in a default project will give the party 4 Potions since 
item ID 1 is Potion.

MIT License - credit to "LyraVultur".
https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE

Free for commercial and non-commercial use.
*/
 
var Imported = Imported || {};
Imported.Lyra_ItemLeftover = true;

var LyraVultur = LyraVultur || {};
LyraVultur.Leftover = LyraVultur.Leftover || {};

LyraVultur.Leftover.printdebug = {};
LyraVultur.Leftover.printdebug = JSON.parse(PluginManager.parameters('Lyra_ItemLeftover')['showdebug']);

LyraVultur.Leftover.Game_Action_prototype_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
	LyraVultur.Leftover.Game_Action_prototype_apply.call(this, target);
	if (this.item()) {
		const data = LyraVultur.Leftover.parseItemNote(this.item().note);
		if (LyraVultur.Leftover.printdebug && !!data && data.length > 0) {
			console.log(data[0].groups);
		}
		if (!!data && data.length > 0) {
			if (data[0].groups && data[0].length > 1) {
				$gameParty.gainItem($dataItems[Number(data[0].groups.item)], Number(data[0].groups.amount), false);
			}
		}
	}
};

LyraVultur.Leftover.parseItemNote = function(note) {
	const rx = /^<Leftover:\s?(?<item>\d+),\s?(?<amount>\d+)>/gmi;
	
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