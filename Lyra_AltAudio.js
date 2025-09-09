//=============================================================================
// Lyra_AltAudio.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.2] Change the entire soundtrack to alternate ones easily.
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

@param alts
@text Alternate Music Subfolders
@type text[]
@desc Add any folders to be used by the plugin here. They can be selected later by ID or by name.

@param affectbgm
@text Affect BGMs?
@type boolean
@default true
@desc If on, will cause any BGMs to be affected by the alternate subfolder settings.

@param affectme
@text Affect MEs?
@type boolean
@default false
@desc If on, will cause any MEs to be affected by the alternate subfolder settings.

@param affectbgs
@text Affect BGSs?
@type boolean
@default false
@desc If on, will cause any BGSs to be affected by the alternate subfolder settings.

@param affectse
@text Affect SE?
@type boolean
@default false
@desc If on, will cause any SEs to be affected by the alternate subfolder settings.

@param affectstaticse
@text Affect Static SE?
@type boolean
@default false
@desc If on, will cause any static SEs (menu cursor, menu cancel, etc) to be affected by the alternate subfolder settings.

@param autoreplaymap
@text Auto Replay Map Music
@type boolean
@default false
@desc If on, will cause the map's music to reload when the subfolder changes.

@param autoreplaytitle
@text Auto Replay Title Music
@type boolean
@default false
@desc If on, will cause the title screen's music to reload when the subfolder changes.

@command ChangeSubById
@text Change Subfolder (ID)
@desc Change which folder id music is getting chosen from, as per the plugin settings. 0 for the default.
    @arg id
    @text ID
    @type number
	@min 0
    @default 0

@command ChangeSubByIdNext
@text Next Subfolder (ID)
@desc Cycles to the next subfolder in ID order. Wraps around if at the end.

@command ChangeSubByIdPrev
@text Previous Subfolder (ID)
@desc Cycles to the previous subfolder in ID order. Wraps around if at the start.

@command ChangeSubByIdRandom
@text Random Subfolder
@desc Changes to a random subfolder.

@command ChangeSubByName
@text Change Subfolder (Name)
@desc Change which folder music is getting chosen from. The folder must be defined in the plugins settings. Blank for default.
    @arg name
    @text Name
    @type text

@command ChangeAffected
@text Change Affected
@desc Change what audio types are affected by the plugin.
    @arg type
    @text Type
    @type combo
	@option BGM
	@option ME
	@option BGS
	@option SE

	@arg state
	@text Affected?
	@type boolean

@help 
This plugin allows you to swap the background music used throughout your 
whole game to a different one with ease. Simply add some folder(s) to 
your bgm folder in your game directory. Inside these folders, make sure 
that you have a set of audio files with the SAME NAME as everything in 
the main bgm folder. Then when you change what folder to get music from, 
it will all work seamlessly.

Make sure to define the folders the plugin can use in the settings!

You can also set it to apply to MEs, BGSs, and SE in a similar way.
As before, make a folder with files with the same name as the main ones 
in the me, bgs, or se folder.

MIT License - credit to "LyraVultur".
https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE

Free for commercial and non-commercial use.
*/
 
var Imported = Imported || {};
Imported.Lyra_AltAudio = true;

var LyraVultur = LyraVultur || {};
LyraVultur.AltAudio = LyraVultur.AltAudio || {};

LyraVultur.AltAudio.printdebug = {};
LyraVultur.AltAudio.printdebug = JSON.parse(PluginManager.parameters('Lyra_AltAudio')['showdebug']) && Utils.isOptionValid('test');

LyraVultur.AltAudio.affectbgm = false;
LyraVultur.AltAudio.affectbgm = Boolean(PluginManager.parameters('Lyra_AltAudio')['affectbgm']);
LyraVultur.AltAudio.affectbgs = false;
LyraVultur.AltAudio.affectbgs = Boolean(PluginManager.parameters('Lyra_AltAudio')['affectbgs']);
LyraVultur.AltAudio.affectme = false;
LyraVultur.AltAudio.affectme = Boolean(PluginManager.parameters('Lyra_AltAudio')['affectme']);
LyraVultur.AltAudio.affectse = false;
LyraVultur.AltAudio.affectse = Boolean(PluginManager.parameters('Lyra_AltAudio')['affectse']);
LyraVultur.AltAudio.affectstaticse = false;
LyraVultur.AltAudio.affectstaticse = Boolean(PluginManager.parameters('Lyra_AltAudio')['affectstaticse']);

LyraVultur.AltAudio.autoreplaymap = false;
LyraVultur.AltAudio.autoreplaymap = Boolean(PluginManager.parameters('Lyra_AltAudio')['autoreplaymap']);
LyraVultur.AltAudio.autoreplaytitle = false;
LyraVultur.AltAudio.autoreplaytitle = Boolean(PluginManager.parameters('Lyra_AltAudio')['autoreplaytitle']);

LyraVultur.AltAudio.alts = [];
LyraVultur.AltAudio.alts = JSON.parse(PluginManager.parameters('Lyra_AltAudio')['alts']);

LyraVultur.AltAudio.curpath = null;
LyraVultur.AltAudio.curid = 0;
LyraVultur.AltAudio.lastid = 0;

LyraVultur.AltAudio.enabled = true;

//==========Init
LyraVultur.AltAudio.Initialise = function() {
	if (LyraVultur.AltAudio.alts.length > 0) {
		//LyraVultur.AltAudio.alts = JSON.parse(LyraVultur.AltAudio.alts);
	}
	else if (LyraVultur.AltAudio.printdebug) {
		console.log("[AltAudio] there's no alternate folders defined!");
	}

	if (LyraVultur.AltAudio.printdebug) {
		console.log("[AltAudio] enabled");
	}
};
LyraVultur.AltAudio.Initialise();

//==========Helper Functions and Command binds
/*LyraVultur.AltAudio.Scene_Title_start = Scene_Title.prototype.start;
Scene_Title.prototype.start = function() {
	LyraVultur.AltAudio.bgmTitle = $dataSystem.titleBgm;
    LyraVultur.AltAudio.Scene_Title_start.call(this);
};*/

LyraVultur.AltAudio.Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
	if ($dataMap) {
		$dataMap.autoplayBgmName = $dataMap.bgm.name;
	}
    LyraVultur.AltAudio.Scene_Map_start.call(this);
};

LyraVultur.AltAudio.SetAlt = function(id) {
	//if (LyraVultur.AltAudio.lastid != LyraVultur.AltAudio.curid) {
		LyraVultur.AltAudio.lastid = LyraVultur.AltAudio.curid;
	//}
	LyraVultur.AltAudio.curid = id;
	if (id == 0) {
		LyraVultur.AltAudio.curpath = null;
	}
	else {
		LyraVultur.AltAudio.curpath = LyraVultur.AltAudio.alts[id - 1];
	}

	SoundManager.preloadImportantSounds();

	if (LyraVultur.AltAudio.affectbgm) {
		if (LyraVultur.AltAudio.autoreplaymap && SceneManager?._scene instanceof Scene_Map) {
			//$gameMap.autoplay();
			if ($dataMap?.autoplayBgm) {
				$dataMap.bgm.name = $dataMap.autoplayBgmName;
				AudioManager.playBgm($dataMap.bgm);
			}
		}

		if (LyraVultur.AltAudio.autoreplaymap && SceneManager?._scene instanceof Scene_Options && !SceneManager.isPreviousScene(Scene_Title)) {
			if ($dataMap?.autoplayBgm) {
				$dataMap.bgm.name = $dataMap.autoplayBgmName;
				AudioManager.playBgm($dataMap.bgm);
			}
		}

		if (LyraVultur.AltAudio.autoreplaytitle && (SceneManager?._scene instanceof Scene_Title || SceneManager.isPreviousScene(Scene_Title))) {
			//console.log("title mus: " + $dataSystem.titleBgm.name);
			//$dataSystem.titleBgm.name = LyraVultur.AltAudio.bgmTitle.name;
			AudioManager.playBgm($dataSystem.titleBgm);
		}
	}

	if (LyraVultur.AltAudio.printdebug) {
		console.log("[AltAudio] current path now: \"" + LyraVultur.AltAudio.curpath + "\"");
	}
};

LyraVultur.AltAudio.GetPath = function(trail = true) {
	if (LyraVultur.AltAudio.curpath == null) {
		return "";
	}

	if (trail) {
		return LyraVultur.AltAudio.curpath + "/";
	}

	return LyraVultur.AltAudio.curpath;
};

PluginManager.registerCommand('Lyra_AltAudio', 'ChangeSubById', args => {
	const arg0 = JSON.parse(args.id);

	if (LyraVultur.AltAudio.alts.length == 0) {
		return;
	}

	if (arg0 > LyraVultur.AltAudio.alts.length) {
		throw new Error("[AltAudio] ChangeSubById tried to call an id that doesn't exist! (" + arg0 + ")");
	}

	LyraVultur.AltAudio.SetAlt(arg0);
});

PluginManager.registerCommand('Lyra_AltAudio', 'ChangeSubByIdNext', args => {
	if (LyraVultur.AltAudio.alts.length == 0) {
		return;
	}

	LyraVultur.AltAudio.curid++;
	if (LyraVultur.AltAudio.curid > LyraVultur.AltAudio.alts.length) {
		LyraVultur.AltAudio.SetAlt(0);
	}
	else {
		LyraVultur.AltAudio.SetAlt(LyraVultur.AltAudio.curid);
	}
});

PluginManager.registerCommand('Lyra_AltAudio', 'ChangeSubByIdPrev', args => {
	if (LyraVultur.AltAudio.alts.length == 0) {
		return;
	}

	LyraVultur.AltAudio.curid--;
	if (LyraVultur.AltAudio.curid < 0) {
		LyraVultur.AltAudio.SetAlt(LyraVultur.AltAudio.alts.length);
	}
	else {
		LyraVultur.AltAudio.SetAlt(LyraVultur.AltAudio.curid);
	}
});

PluginManager.registerCommand('Lyra_AltAudio', 'ChangeSubByIdRandom', args => {
	if (LyraVultur.AltAudio.alts.length <= 1) {
		return;
	}

	const rand = Math.floor(Math.random() * LyraVultur.AltAudio.alts.length);
	LyraVultur.AltAudio.SetAlt(rand);
});

PluginManager.registerCommand('Lyra_AltAudio', 'ChangeSubByName', args => {
	const arg0 = String(args.name);

	if (LyraVultur.AltAudio.alts.length == 0) {
		return;
	}

	const item = LyraVultur.AltAudio.alts.indexOf(arg0);

	if (item != -1) {
		LyraVultur.AltAudio.SetAlt(item + 1);
	}
	else {
		throw new Error("[AltAudio] ChangeSubByName tried to call an id that doesn't exist! (" + arg0 + ")");
	}
});

PluginManager.registerCommand('Lyra_AltAudio', 'ChangeAffected', args => {
	const arg0 = String(args.type);
	const arg1 = JSON.parse(args.state);
	//console.log(args.state);
	//console.log(arg1);

	switch(arg0) {
		case "BGM":
			LyraVultur.AltAudio.affectbgm = arg1;
			break;
		case "BGS":
			LyraVultur.AltAudio.affectbgs = arg1;
			break;
		case "ME":
			LyraVultur.AltAudio.affectme = arg1;
			break;
		case "SE":
			LyraVultur.AltAudio.affectse = arg1;
			break;
		default:
			throw new Error("[AltAudio] ChangeAffected didn't understand the type " + arg0);
	}
});

//==========Main
//todo: add the alternative sounds as n + 30 in the array, so we can keep the original loadSystemSound function unscathed
SoundManager.loadSystemSound = function(n) {
    if ($dataSystem) {
		let altdata = {...$dataSystem.sounds[n]};
		const origname = altdata.name;
		altdata.name = LyraVultur.AltAudio.GetPath() + origname;
		altdata.altered = true;

		if (!LyraVultur.AltAudio.CheckExists("se/", altdata.name)) {
			altdata.name = origname;
		}

        AudioManager.loadStaticSe(altdata);
    }
};

//For some reason calling play from the command interpreter just appends the name when called repeatedly instead of making a new object?
/*Game_Interpreter.prototype.command241 = function(params) {
	if (params[0]?.altered) {
		if (LyraVultur.AltAudio.printdebug) {
			console.log("[AltAudio] trying to pass in a BGM that is already altered! attempting to fix..");
		}
		let bgm = params[0];
		for (let i = 0; i < LyraVultur.AltAudio.alts.length; i++) {
			bgm.name = bgm.name.replaceAll(LyraVultur.AltAudio.alts[i] + "/", "");
		}
		AudioManager.playBgm(bgm);
	}
	else {
		AudioManager.playBgm(params[0]);
	}
    
    return true;
};

Game_Interpreter.prototype.command245 = function(params) {
	if (params[0]?.altered) {
		if (LyraVultur.AltAudio.printdebug) {
			console.log("[AltAudio] trying to pass in a BGS that is altered! attempting to fix..");
		}
		let bgs = params[0];
		for (let i = 0; i < LyraVultur.AltAudio.alts.length; i++) {
			bgs.name = bgs.name.replaceAll(LyraVultur.AltAudio.alts[i] + "/", "");
		}
		AudioManager.playBgs(bgs);
	}
	else {
		AudioManager.playBgs(params[0]);
	}

    return true;
};

Game_Interpreter.prototype.command249 = function(params) {
	if (params[0]?.altered) {
		if (LyraVultur.AltAudio.printdebug) {
			console.log("[AltAudio] trying to pass in a ME that is altered! attempting to fix..");
		}
		let me = params[0];
		for (let i = 0; i < LyraVultur.AltAudio.alts.length; i++) {
			me.name = me.name.replaceAll(LyraVultur.AltAudio.alts[i] + "/", "");
		}
		AudioManager.playMe(me);
	}
	else {
		AudioManager.playMe(params[0]);
	}

    return true;
};

Game_Interpreter.prototype.command250 = function(params) {
	if (params[0]?.altered) {
		if (LyraVultur.AltAudio.printdebug) {
			console.log("[AltAudio] trying to pass in an SE that is altered! attempting to fix..");
		}
		let se = params[0];
		for (let i = 0; i < LyraVultur.AltAudio.alts.length; i++) {
			se.name = se.name.replaceAll(LyraVultur.AltAudio.alts[i] + "/", "");
		}
		AudioManager.playSe(se);
	}
	else {
		AudioManager.playSe(params[0]);
	}

    return true;
};*/

//If the file doesn't exist in the subfolder, check for one in the root. Otherwise, throw the normal load error
LyraVultur.AltAudio.CheckExists = function(folder, name) {
	let ext = AudioManager.audioFileExt();
	if (Utils.hasEncryptedAudio()) {
		ext = ext + "_";
	}
    const url = AudioManager._path + folder + Utils.encodeURI(name) + ext;

	const fs = require('fs');
	if (fs.existsSync(url)) {
		return true;
	} 
	else {
		if (LyraVultur.AltAudio.printdebug) {
			console.log("[AltAudio] Couldn't find file " + url + "! Attempting to load root version..");
		}
		return false;
	}
};

//Actual play overrides
LyraVultur.AltAudio.AudioManager_playBgm = AudioManager.playBgm;
AudioManager.playBgm = function(bgm, pos) {
	let altdata = {...bgm};
	if (LyraVultur.AltAudio.curpath != null && bgm?.name != "" && LyraVultur.AltAudio.affectbgm) {
		const origname = bgm.name;
		altdata.name = LyraVultur.AltAudio.GetPath() + origname;
		altdata.altered = true;

		if (!LyraVultur.AltAudio.CheckExists("bgm/", altdata.name)) {
			altdata.name = origname;
		}

		if (LyraVultur.AltAudio.lastid != LyraVultur.AltAudio.curid) {
			//console.log("last (" + LyraVultur.AltAudio.lastid + ") wasnt cur (" + LyraVultur.AltAudio.curid + ")");
			//LyraVultur.AltAudio.lastid = LyraVultur.AltAudio.curid;
		}
	}

	LyraVultur.AltAudio.AudioManager_playBgm.call(this, altdata, pos);
};

LyraVultur.AltAudio.AudioManager_playMe = AudioManager.playMe;
AudioManager.playMe = function(me) {
	let altdata = {...me};
	if (LyraVultur.AltAudio.curpath != null && me?.name != "" && LyraVultur.AltAudio.affectme) {
		const origname = me.name;
		altdata.name = LyraVultur.AltAudio.GetPath() + origname;
		altdata.altered = true;

		if (!LyraVultur.AltAudio.CheckExists("me/", altdata.name)) {
			altdata.name = origname;
		}
	}

	LyraVultur.AltAudio.AudioManager_playMe.call(this, altdata);
};

LyraVultur.AltAudio.AudioManager_playBgs = AudioManager.playBgs;
AudioManager.playBgs = function(bgs, pos) {
	let altdata = {...bgs};
	if (LyraVultur.AltAudio.curpath != null && bgs?.name != "" && LyraVultur.AltAudio.affectbgs) {
		const origname = bgs.name;
		altdata.name = LyraVultur.AltAudio.GetPath() + origname;
		altdata.altered = true;

		if (!LyraVultur.AltAudio.CheckExists("bgs/", altdata.name)) {
			altdatabgs.name = origname;
		}
	}

	LyraVultur.AltAudio.AudioManager_playBgs.call(this, altdata, pos);
};

LyraVultur.AltAudio.AudioManager_playSe = AudioManager.playSe;
AudioManager.playSe = function(se) {
	let altdata = {...se};
	if (LyraVultur.AltAudio.curpath != null && se?.name != "" && LyraVultur.AltAudio.affectse) {
		const origname = se.name;
		altdata.name = LyraVultur.AltAudio.GetPath() + origname;
		altdata.altered = true;

		if (!LyraVultur.AltAudio.CheckExists("se/", altdata.name)) {
			altdata.name = origname;
		}
	}

	LyraVultur.AltAudio.AudioManager_playSe.call(this, altdata);
};

LyraVultur.AltAudio.AudioManager_playStaticSe = AudioManager.playStaticSe;
AudioManager.playStaticSe = function(se) {
	let altdata = {...se};
	if (LyraVultur.AltAudio.curpath != null && se?.name != "" && LyraVultur.AltAudio.affectstaticse) {
		const origname = se.name;
		if (!altdata.name.startsWith(LyraVultur.AltAudio.GetPath())) {
			altdata.name = LyraVultur.AltAudio.GetPath() + origname;
		}
		altdata.altered = true;

		if (!LyraVultur.AltAudio.CheckExists("se/", altdata.name)) {
			altdata.name = origname;
		}
	}

	LyraVultur.AltAudio.AudioManager_playStaticSe.call(this, altdata);
};