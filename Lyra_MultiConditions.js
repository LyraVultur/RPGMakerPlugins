//=============================================================================
// Lyra_MultiConditions.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.1] Manages complicated boolean conditions to simplify NPC pages.
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

@param userconditions
@text Conditions
@type struct<ConditionSet>[]
@desc The list of conditions.

@param ignoremode
@text Global Ignore
@type boolean
@default false
@desc If true, ignores all multiconditions (they return true). Can be changed 
in-game with a plugin command.

@command IgnoreMultiConditions
@text Set Global Ignore Mode
@desc Lets you turn checking multiconditions on or off globally.

    @arg ignore
    @text Global Ignore
    @type boolean
    @desc If true, ignores all multiconditions (they return true).
    @default false

@help 
This lets you setup pre-defined conditions for pages that can be much more 
complex than what RPG Maker would usually allow. Once you've defined some, 
simply add a comment to an event's page:
<multicond id>
Replace id with the name that you gave the condition.
Note that for the page to be displayed, all the page's regular conditions AND  
this plugin's multi-conditions need to be true!

If Global Ignore mode is set to true (can be changed by plugin command), then ALL
multiconditions will always return true. Can be useful for complex setups.

As well as testing against set numbers, variables, javascript, and switches, you 
can also check what the current time is. Very useful for making time-sensitive 
events and NPCs! Note that this requires the current hour and mins (for instance, 
from the Community Lighting plugin) to be at a variable the plugin can read.

MIT License - credit to "LyraVultur".
https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE

Free for commercial and non-commercial use.
*/

/*~struct~ConditionSet:
 * @param conditionID
 * @text Condition Set Name
 * @type text
 * @desc The unique identifier for this condition set. Case insensitive.
 *
 * @param usercond
 * @text Conditions
 * @type struct<MultiCondition>
 * @desc The conditions to evaluate.
 */
 /*~struct~VariableTest:
 * @param varid
 * @text (A) Variable ID
 * @type variable
 * @desc The game variable to check.
 *
 * @param varsign
 * @text Comparison Type
 * @type select
 * @option A is more than B
 * @value >
 * @option A is less than B
 * @value <
 * @option A is equal to B
 * @value ==
 * @option A is not equal to B
 * @value !=
 * @option A is in range of B and C (inclusive)
 * @value <>
 * @option A is not in range of B and C (inclusive)
 * @value ><
 * @desc What are we testing the variable for?
 *
 * @param varcomp
 * @text (B) Comparison Number
 * @type number
 * @desc The number to check the variable against.
 *
 * @param usevarinstead
 * @text Use Comparison Variable for B?
 * @type boolean
 * @default false
 * @desc If true, use another variable as the B value instead of a fixed number.
 *
 * @param varidb
 * @text (B) Comparison Variable
 * @type variable
 * @desc The variable to check the first variable against.
 * @param varcompc
 *
 * @param varcompc
 * @text (C) Comparison Number
 * @type number
 * @desc The number to check the variable against. Used only for the in range checks.
 *
 * @param usevarinsteadc
 * @text Use Comparison Variable for C?
 * @type boolean
 * @default false
 * @desc If true, use another variable as the C value instead of a fixed number.
 *
 * @param varidc
 * @text (C) Comparison Variable
 * @type variable
 * @desc The variable to check the first variable against.
 */
 /*~struct~TimeTest:
 * @param hourid
 * @text Current Hour
 * @type variable
 * @desc The game variable to use as the current hour.
 *
 * @param minsid
 * @text Current Minutes
 * @type variable
 * @desc The game variable to use as the current minutes.
 *
 * @param checkhour1
 * @text Check Hour (Minimum)
 * @type number
 * @min 0
 * @max 23
 * @default 6
 * @desc What hour to check? (24 hour time)
 *
 * @param checkmins1
 * @text Check Minutes (Minimum)
 * @type number
 * @min 0
 * @max 59
 * @default 0
 * @desc What mins to check?
 *
 * @param checkhour2
 * @text Check Hour (Maximum)
 * @type number
 * @min 0
 * @max 23
 * @default 18
 * @desc What hour to check? (24 hour time)
 *
 * @param checkmins2
 * @text Check Minutes (Maximum)
 * @type number
 * @min 0
 * @max 59
 * @default 0
 * @desc What mins to check?
 */
 /*~struct~MultiCondition:
 * @param jscond
 * @text Javascript
 * @type text
 * @desc The javascript condition to evaluate (true or false). Ignored if empty.
 *
 * @param swcond
 * @text Switches
 * @type switch[]
 * @desc The game switches to evaluate. Ignored if empty.
 *
 * @param vrcond
 * @text Variables
 * @type struct<VariableTest>[]
 * @desc The game variables to evaluate. Ignored if empty.
 *
 * @param timecond
 * @text Time
 * @type struct<TimeTest>[]
 * @desc The time conditions to evaluate. Ignored if empty.
 */
 
var Imported = Imported || {};
Imported.Lyra_MultiConditions = true;

var LyraVultur = LyraVultur || {};
LyraVultur.MultiConditions = LyraVultur.MultiConditions || {};

LyraVultur.MultiConditions.printdebug = {};
LyraVultur.MultiConditions.printdebug = JSON.parse(PluginManager.parameters('Lyra_MultiConditions')['showdebug']);

LyraVultur.MultiConditions.conditions = new Map();
LyraVultur.MultiConditions.rawconditions = JSON.parse(PluginManager.parameters('Lyra_MultiConditions')['userconditions']);

LyraVultur.MultiConditions.ignoremode = JSON.parse(PluginManager.parameters('Lyra_MultiConditions')['ignoremode']);
//console.log("ignoremode: " + LyraVultur.MultiConditions.ignoremode);

//==========Extract arrays
LyraVultur.MultiConditions.parseConditionsData = function(input) {
	input.forEach((data) => {
		let result = JSON.parse(data);
		LyraVultur.MultiConditions.conditions.set(result.conditionID, result);
	});
	
	if (Utils.isOptionValid('test') && LyraVultur.MultiConditions.printdebug) {
		console.log("[MultiConditions] Raw Condition Data:");
		console.log(LyraVultur.MultiConditions.conditions);
	}
	
	return;
};
LyraVultur.MultiConditions.parseConditionsData(LyraVultur.MultiConditions.rawconditions);

LyraVultur.MultiConditions.parseUserConditions = function() {
	let db = Boolean(Utils.isOptionValid('test') && LyraVultur.MultiConditions.printdebug);
	
	LyraVultur.MultiConditions.conditions.forEach((obj, key) => {
		if (db) console.log(key + "'s raw data:");
		let rawconds = JSON.parse(obj.usercond);
		if (db) console.log(rawconds);

		if (rawconds.jscond != "") {
			let js = "";
			js = String(rawconds.jscond);
			
			if (db) console.log(js);
			
			obj.js = js;
		}
		else {
			if (db) console.log("no js");
		}
		
		if (rawconds.swcond != "") {
			let sw = [];
			let swtemp = JSON.parse(rawconds.swcond);
			 
			swtemp.forEach((data) => {
				let result = JSON.parse(data);
				sw.push(result);
			});	
			 
			if (db) console.log(sw);
			 
			obj.sw = sw;
		}
		else {
			if (db) console.log("no sw");
		}
		
		if (rawconds.vrcond != "") {
			let vr = [];
			let vrtemp = JSON.parse(rawconds.vrcond);
			
			vrtemp.forEach((data) => {
				let result = JSON.parse(data);
				vr.push(result);
			});	
			
			if (db) console.log(vr);
			
			obj.vr = vr;
			
			vr.forEach((data) => {
				data.varcomp = Number(data.varcomp);
				data.varid = Number(data.varid);
				data.usevarinstead = Boolean(data.usevarinstead);
				data.varidb = Number(data.varidb);
				data.varcompc = Number(data.varcompc);
				data.usevarinsteadc = Boolean(data.usevarinsteadc);
				data.varidc = Number(data.varidc);
			});	
		}
		else {
			if (db) console.log("no vr");
		}
		
		if (rawconds.timecond != "") {
			let clock = [];
			let vrtemp = JSON.parse(rawconds.timecond);
			
			vrtemp.forEach((data) => {
				let result = JSON.parse(data);
				clock.push(result);
			});	
			
			if (db) console.log(clock);
			
			obj.clock = clock;
			
			clock.forEach((data) => {
				data.hourid = Number(data.hourid);
				data.minsid = Number(data.minsid);
				data.checkhour1 = Number(data.checkhour1);
				data.checkmins1 = Number(data.checkmins1);
				data.checkhour2 = Number(data.checkhour2);
				data.checkmins2 = Number(data.checkmins2);
			});	
		}
		else {
			if (db) console.log("no clock");
		}
	});
	
	if (db) {
		console.log("[MultiConditions] User Conditions:");
		console.log(LyraVultur.MultiConditions.conditions);
	}
	
	return;
};
LyraVultur.MultiConditions.parseUserConditions();

//==========Command binds
PluginManager.registerCommand('Lyra_MultiConditions', 'IgnoreMultiConditions', args => {
	const arg0 = JSON.parse(args.desc);
	
	LyraVultur.MultiConditions.setIgnoreMode(arg0);
});

//==========Main
LyraVultur.MultiConditions.setIgnoreMode = function(ignore) {
	LyraVultur.MultiConditions.ignoremode = ignore;
};

LyraVultur.MultiConditions.meetsConditionsRoot = Game_Event.prototype.meetsConditions;
Game_Event.prototype.meetsConditions = function(page) {
	let baseresult = LyraVultur.MultiConditions.meetsConditionsRoot.call(this, page);
	
	if (baseresult === true) {
		if (LyraVultur.MultiConditions.ignoremode === true) {
			return true;
		}
		
		return this.meetsMultiConditions(page);
	}
	
	return baseresult;
};

Game_Event.prototype.meetsMultiConditions = function(page) {
	let result = true;
	let db = Boolean(Utils.isOptionValid('test') && LyraVultur.MultiConditions.printdebug);
	
	if (!page.metaMatchArray) return result;
	
	page.metaMatchArray.forEach(check => {
		const c = LyraVultur.MultiConditions.conditions.get(check);
		
		if (c?.js) {
			if (db) console.log("has js");
			let pass = Function('return (' + c.js + ')')();
			if (pass === false) result = false;
		}
		
		if (c?.sw) {
			if (db) console.log("has sw");
			for (let s = 0; s < c.sw.length; s++) {
				if (db) console.log("switch " + c.sw[s] + " is " + $gameSwitches.value(c.sw[s]));
				
				if ($gameSwitches.value(c.sw[s]) === false) {
					result = false;
					break;
				}
			}
		}
		
		if (c?.vr) {
			if (db) console.log("has vr");
			for (let v = 0; v < c.vr.length; v++) {
				const va = $gameVariables.value(c.vr[v].varid);
				
				let vb = c.vr[v].varcomp;
				if (c.vr[v].usevarinstead === true) {
					vb = $gameVariables.value(c.vr[v].varidb);
				}
				
				let vc = c.vr[v].varcompc;
				if (c.vr[v].usevarinsteadc === true) {
					vc = $gameVariables.value(c.vr[v].varidc);
				}
				let cisbigger = (vc >= vb);
				
				let varresult = false;
				
				switch (c.vr[v].varsign) {
					case ">":
						if (va >= vb) {
							varresult = true;
						}
					break;
					
					case "<":
						if (va <= vb) {
							varresult = true;
						}
					break;
					
					case "==":
						if (va == vb) {
							varresult = true;
						}
					break;
					
					case "!=":
						if (va != vb) {
							varresult = true;
						}
					break;
					
					case "<>":
						if (cisbigger) {
							if (va >= vb && va <= vc) {
								varresult = true;
							}
						}
						else {
							if (va >= vc && va <= vb) {
								varresult = true;
							}
						}
					break;
					
					case "><":
						if (cisbigger) {
							if (va <= vb || va >= vc) {
								varresult = true;
							}
						}
						else {
							if (va <= vc || va >= vb) {
								varresult = true;
							}
						}
					break;
					
					default:
						if (db) console.log("malformed varsign: " + c.vr[v].varsign);
				}
				result = !varresult;
				
				if (result === false) {
					break;
				}
			}
		}
		
		if (c?.clock) {
			if (db) console.log("has clock");
			for (let v = 0; v < c.clock.length; v++) {
				const curhour = $gameVariables.value(c.clock[v].hourid);
				const curmins = $gameVariables.value(c.clock[v].minsid);
				const hour1 = c.clock[v].checkhour1;
				const mins1 = c.clock[v].checkmins1;
				const hour2 = c.clock[v].checkhour2;
				const mins2 = c.clock[v].checkmins2;
				
				var h =  new Date("1989-03-19 " + curhour + ":" + curmins);
				var d1 = new Date("1989-03-19 " + hour1 + ":" + mins1);
				var d2 = new Date("1989-03-19 " + hour2 + ":" + mins2);
				
				if (h >= d1 && h <= d2) {
					//result = true;
				}
				else {
					result = false;
				}
				
				if (result === false) {
					break;
				}
			}
		}
	});
	
	return result;
};

LyraVultur.MultiConditions.extractPageConditionMetadata = function(object) {
	if (object.events?.length > 1) {
		for (let m = 1; m < object.events.length; m++) {
			if (object.events[m]?.pages) {
				for (let i = 0; i < object.events[m].pages.length; i++) {
					object.events[m].pages[i].metaMatchArray = [];
					for (let match = 0; match < object.events[m].pages.length; match++) {
						//let curpage = object.events[m].pages[i];
						let cmd = object.events[m].pages[i].list[match];
						if (cmd?.code === 108 || cmd?.code === 408) {
							cmd.parameters[0].match(/<multicond\s*(.+)>/i) ? object.events[m].pages[i].metaMatchArray.push(String(RegExp.$1)) : false;
						}
						//let matches = curpage?.list?.[match]?.parameters[0].match(/<multicond\s*(.+)>/i);
						//matches ? curpage.metaMatchArray.push(matches[1]) : false;
					}
				}
			}
		}
	}
};

LyraVultur.MultiConditions.DataManageronLoadRoot = DataManager.onLoad;
DataManager.onLoad = function(object) {
	LyraVultur.MultiConditions.DataManageronLoadRoot.call(this, object);
	
    if (this.isMapObject(object)) {
        LyraVultur.MultiConditions.extractPageConditionMetadata(object);
    }
};