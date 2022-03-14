//=============================================================================
// Lyra_RandomEnemyNames.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.4] Assigns enemies random names and/or pronouns in battle.
@author Lyra Vultur
@url http://www.koutacles.com.au/
 
License
MIT
<https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE>

@param namefiles
@text Name Source Files
@type text[]
@desc File names (with extension) to load. Must be plain text files located in the data folder.
@default ["humans.txt", "robots.txt", "pixies.txt"]

@param pronounfiles
@text Pronoun Source Files
@type text[]
@desc File names (with extension) to load. Must be plain text files located in the data folder.
@default ["common-eng.txt", "neo-eng.txt"]

@param splitter
@text Seperator Character
@desc What character to use to split the text files.
@type text
@default |

@param showdebug
@text Show Debug Info
@type boolean
@default true
@desc Will print what file(s) it is loading into the console. Playtest mode only.

@param pronounsalways
@text Show Pronouns Everywhere
@type boolean
@default false
@desc Will append the enemy's pronouns to everywhere that their name appears, and not just at target selection.

@help 
Assigns enemies random names and/or pronouns in battle.
Use the enemy tag <NamePool: x> to pick a name set to use, where x is a file 
name (with extension).
You can also use <NamePool: any> to pick from any of the defined name files 
at random.

Use the enemy tag <PronounPool: x> to pick a pronoun set to use, where x is 
a file name (with extension).
You can also use <PronounPool: any> to pick from any of the defined pronoun 
files at random.

Use the enemy tag <NoDefaultName> to not keep the regular enemy name as the 
prefix.

If you are a programmer you can access the custom name & pronouns from the 
.customname and .customnoun properties that Game_Enemy clas has. 
You can access this data in Ultra Hud Maker PRO, for instance.

MIT License - credit to "LyraVultur".
https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE

Free for commercial and non-commercial use.
*/
 
var Imported = Imported || {};
Imported.Lyra_RandomEnemyNames = true;

var LyraVultur = LyraVultur || {};
LyraVultur.RandomEnemyData = LyraVultur.RandomEnemyData || {};

LyraVultur.RandomEnemyData.files = {};
LyraVultur.RandomEnemyData.files = JSON.parse(PluginManager.parameters('Lyra_RandomEnemyNames')['namefiles']);

LyraVultur.RandomEnemyData.pfiles = {};
LyraVultur.RandomEnemyData.pfiles = JSON.parse(PluginManager.parameters('Lyra_RandomEnemyNames')['pronounfiles']);

LyraVultur.RandomEnemyData.namepools = [];
LyraVultur.RandomEnemyData.pronounpools = [];

LyraVultur.RandomEnemyData.seperator = PluginManager.parameters('Lyra_RandomEnemyNames')['splitter'];

LyraVultur.RandomEnemyData.printdebug = {};
LyraVultur.RandomEnemyData.printdebug = JSON.parse(PluginManager.parameters('Lyra_RandomEnemyNames')['showdebug']);

LyraVultur.RandomEnemyData.pronounsalways = {};
LyraVultur.RandomEnemyData.pronounsalways = JSON.parse(PluginManager.parameters('Lyra_RandomEnemyNames')['pronounsalways']);

//Name init
LyraVultur.RandomEnemyData.parseNamePool = function() {
	var fs = require('fs');
	var gameDir = process.mainModule.filename;
	var filePath = "data/";
	
	for (let fid = 0; fid < LyraVultur.RandomEnemyData.files.length; fid++) {
		filePath = "data/" + LyraVultur.RandomEnemyData.files[fid];
		
		//Debug only
		if (Utils.isOptionValid('test') && LyraVultur.RandomEnemyData.printdebug) {
			console.log("[RandomEnemyData] Read Name File: ", filePath);
		}
		
		xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET",filePath,false);
		xmlhttp.send(null); 
		
		var fileContent = xmlhttp.responseText;

		let result = {name:LyraVultur.RandomEnemyData.files[fid], data:fileContent.split(LyraVultur.RandomEnemyData.seperator)};
		LyraVultur.RandomEnemyData.namepools.push(result);
	}
	
	//Debug only
	if (Utils.isOptionValid('test') && LyraVultur.RandomEnemyData.printdebug) {
		for (let i = 0; i < LyraVultur.RandomEnemyData.namepools.length; i++) {
			console.log("[RandomEnemyData] Result[" + i + "] " + LyraVultur.RandomEnemyData.namepools[i].name + ":");
			console.log(LyraVultur.RandomEnemyData.namepools[i].data);
		}
	}
	
	return;
};
LyraVultur.RandomEnemyData.parseNamePool();

//Pronoun init
LyraVultur.RandomEnemyData.parsePronounPool = function() {
	var fs = require('fs');
	var gameDir = process.mainModule.filename;
	var filePath = "data/";
	
	for (let fid = 0; fid < LyraVultur.RandomEnemyData.pfiles.length; fid++) {
		filePath = "data/" + LyraVultur.RandomEnemyData.pfiles[fid];
		
		//Debug only
		if (Utils.isOptionValid('test') && LyraVultur.RandomEnemyData.printdebug) {
			console.log("[RandomEnemyData] Read Pronoun File: ", filePath);
		}
		
		xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET",filePath,false);
		xmlhttp.send(null); 
		
		var fileContent = xmlhttp.responseText;

		let result = {name:LyraVultur.RandomEnemyData.pfiles[fid], data:fileContent.split(LyraVultur.RandomEnemyData.seperator)};
		LyraVultur.RandomEnemyData.pronounpools.push(result);
	}
	
	//Debug only
	if (Utils.isOptionValid('test') && LyraVultur.RandomEnemyData.printdebug) {
		for (let i = 0; i < LyraVultur.RandomEnemyData.pronounpools.length; i++) {
			console.log("[RandomEnemyData] Result[" + i + "] " + LyraVultur.RandomEnemyData.pronounpools[i].name + ":");
			console.log(LyraVultur.RandomEnemyData.pronounpools[i].data);
		}
	}
	
	return;
};
LyraVultur.RandomEnemyData.parsePronounPool();

//Get random from pool
LyraVultur.RandomEnemyData.getRandomName = function(file) {
	if (file.trim() == "any") {
		let f = Math.floor(Math.random() * LyraVultur.RandomEnemyData.namepools.length);
		return LyraVultur.RandomEnemyData.namepools[f].data[Math.floor(Math.random() * LyraVultur.RandomEnemyData.namepools[f].data.length)].trim();
	}
	
	let i = LyraVultur.RandomEnemyData.namepools.findIndex(x => x.name === file);
	return LyraVultur.RandomEnemyData.namepools[i].data[Math.floor(Math.random() * LyraVultur.RandomEnemyData.namepools[i].data.length)].trim();
}

LyraVultur.RandomEnemyData.getRandomPronounSet = function(file) {
	if (file.trim() == "any") {
		let f = Math.floor(Math.random() * LyraVultur.RandomEnemyData.pronounpools.length);
		return LyraVultur.RandomEnemyData.pronounpools[f].data[Math.floor(Math.random() * LyraVultur.RandomEnemyData.pronounpools[f].data.length)].trim();
	}
	
	let i = LyraVultur.RandomEnemyData.pronounpools.findIndex(x => x.name === file);
	return LyraVultur.RandomEnemyData.pronounpools[i].data[Math.floor(Math.random() * LyraVultur.RandomEnemyData.pronounpools[i].data.length)].trim();
}

//Overrides
LyraVultur.RandomEnemyData.GameEnemySetup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function (enemyId, x, y) {
   LyraVultur.RandomEnemyData.GameEnemySetup.call(this, enemyId, x, y);
   //console.log($dataEnemies[enemyId].meta);
   this.randnamefile = $dataEnemies[enemyId].meta.NamePool || false;
   this.randnounfile = $dataEnemies[enemyId].meta.PronounPool || false;
   this.nodefaultname = $dataEnemies[enemyId].meta.NoDefaultName || false;
};

LyraVultur.RandomEnemyData.GameEnemyoriginalName = Game_Enemy.prototype.originalName;
Game_Enemy.prototype.originalName = function() {
	//console.log(this.enemy().meta.NamePool);
    if (this.customname) {
		if (LyraVultur.RandomEnemyData.pronounsalways == true) {
			return this.customname.trim() + this.customnoun;
		}
		else {
			return this.customname.trim();
		}
	}
	else {
		return this.enemy().name;
	}
};

LyraVultur.RandomEnemyData.WindowBattleEnemydrawItem = Window_BattleEnemy.prototype.drawItem;
Window_BattleEnemy.prototype.drawItem = function(index) {
    this.resetTextColor();
	
	let finalname = "";
	//console.log(this._enemies[index]);
	if (this._enemies[index].randnamefile != false) {
		finalname = this._enemies[index].customname.trim();
	}
	else {
		finalname = this._enemies[index].name();
	}
	
	if (this._enemies[index].randnounfile != false) {
		finalname = finalname + this._enemies[index].customnoun;
	}
	
    const name = finalname;
    const rect = this.itemLineRect(index);
    this.drawText(name, rect.x, rect.y, rect.width);
};

LyraVultur.RandomEnemyData.GameTroopMakeUniqueNames = Game_Troop.prototype.makeUniqueNames;
//Replace with our own
Game_Troop.prototype.makeUniqueNames = function() {
    const table = this.letterTable();
    for (const enemy of this.members()) {
		if (enemy.originalName() && enemy.originalName().startsWith("Random")) {
			//ignore prototype enemies
			break;
		}
		
        if (enemy.isAlive() && enemy.isLetterEmpty()) {
            var name = enemy.originalName();
			
			if (enemy.nodefaultname) {
				name = "";
			}
			
			if (enemy.randnamefile != false) {
				//console.log(enemy);
				name = name + ' ' + LyraVultur.RandomEnemyData.getRandomName(enemy.randnamefile.trim());
				//console.log(enemy);
			}
			
			if (enemy.randnounfile != false) {
				enemy.customnoun = " (" + LyraVultur.RandomEnemyData.getRandomPronounSet(enemy.randnounfile.trim()) + ')';
			}
			
            const n = this._namesCount[name] || 0;
            enemy.setLetter(table[n % table.length]);
			this._namesCount[name] = n + 1;
			enemy.customname = name;
        }
    }
	
	//console.log(this);
    this.updatePluralFlags();
};

/* Game_Troop.prototype.makeUniqueNames = function() {
    const table = this.letterTable();
    for (const enemy of this.members()) {
        if (enemy.isAlive() && enemy.isLetterEmpty()) {
            const name = enemy.originalName();
            const n = this._namesCount[name] || 0;
            enemy.setLetter(table[n % table.length]);
            this._namesCount[name] = n + 1;
        }
    }
    this.updatePluralFlags();
}; */