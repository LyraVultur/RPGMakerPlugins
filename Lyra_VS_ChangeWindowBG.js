//=============================================================================
// Lyra_VS_ChangeWindowBG.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0] Lets you add/change menu scene background images.
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

@param windowbgdefaults
@text Default Backgrounds

@param default_Scene_Menu
@text Scene_Menu
@parent windowbgdefaults
@type struct<windowbgsettings>

@param default_Scene_Item
@text Scene_Item
@parent windowbgdefaults
@type struct<windowbgsettings>

@param default_Scene_Skill
@text Scene_Skill
@parent windowbgdefaults
@type struct<windowbgsettings>

@param default_Scene_Equip
@text Scene_Equip
@parent windowbgdefaults
@type struct<windowbgsettings>

@param default_Scene_Status
@text Scene_Status
@parent windowbgdefaults
@type struct<windowbgsettings>

@param default_Scene_Options
@text Scene_Options
@parent windowbgdefaults
@type struct<windowbgsettings>

@param default_Scene_Save
@text Scene_Save
@parent windowbgdefaults
@type struct<windowbgsettings>

@param default_Scene_Load
@text Scene_Load
@parent windowbgdefaults
@type struct<windowbgsettings>

@param default_Scene_GameEnd
@text Scene_GameEnd
@parent windowbgdefaults
@type struct<windowbgsettings>

@param default_Scene_Shop
@text Scene_Shop
@parent windowbgdefaults
@type struct<windowbgsettings>

@param default_Scene_Name
@text Scene_Name
@parent windowbgdefaults
@type struct<windowbgsettings>

@param default_Scene_Unlisted
@text Scene_Unlisted
@parent windowbgdefaults
@type struct<windowbgsettings>

@command ChangeImages
@text Change Scene Images
@desc Sets the background images.

    @arg scenetype
    @text Scene
    @type select
    @desc Choose a scene..
    @option Scene_Menu
	@option Scene_Item
	@option Scene_Skill
	@option Scene_Equip
	@option Scene_Status
	@option Scene_Options
	@option Scene_Save
	@option Scene_Load
	@option Scene_GameEnd
	@option Scene_Shop
	@option Scene_Name
	@option Scene_Unlisted
	
    @arg bgopacity
    @text Snapshot Opacity
    @type number
	@max 255
	@min -1
    @desc How see-through the image of the map is. -1 to keep it the same.
    @default 192
	
	@arg bgimg1
    @text Background 1
    @type file
	@dir img/titles1/
    @desc Filename for the bottom image. Blank for none.
	
	@arg bgimg2
    @text Background 2
    @type file
	@dir img/titles2/
    @desc Filename for the upper image. Blank for none.

@help 
Will work with or without VisuMZ_0_CoreEngine or VisuMZ_1_MainMenuCore.

The VisuStella code is obfuscated so the best I can do is make an 
open-source replacement. I recommend going into VisuMZ_0_CoreEngine > 
Menu Background Settings and setting all the images to blank if 
you had any set already.

Then, use the Change Scene Images plugin command from this plugin whenever 
you want to set the images and that info will stay with that save game.

You can set the defaults for a new game in the plugins settings to the right.

There's no guarantee that the images you change to will exist at 
runtime in a built application. So if you build your game for release, 
make sure to check the img/titles folders have all the image you wish 
to switch to.

MIT License - credit to "LyraVultur".
https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE

Free for commercial and non-commercial use.
*/

/*~struct~windowbgsettings:
 * @param bgopacity
 * @type number
 * @min -1
 * @max 255
 * @default -1
 * @desc How see-through the image of the map is. -1 to keep it the same.
 *
 * @param bgimg1
 * @text Background 1
 * @type file
 * @dir img/titles1/
 * @desc Filename for the bottom image. Blank for none.
	
 * @param bgimg2
 * @text Background 2
 * @type file
 * @dir img/titles2/
 * @desc Filename for the upper image. Blank for none.
 */

var Imported = Imported || {};
Imported.Lyra_VS_ChangeWindowBG = true;

var LyraVultur = LyraVultur || {};
LyraVultur.VS_ChangeWindowBG = LyraVultur.VS_ChangeWindowBG || {};

LyraVultur.VS_ChangeWindowBG.printdebug = {};
LyraVultur.VS_ChangeWindowBG.printdebug = JSON.parse(PluginManager.parameters('Lyra_VS_ChangeWindowBG')['showdebug']) && Utils.isOptionValid('test');

LyraVultur.VS_ChangeWindowBG.savedata = new Map();
LyraVultur.VS_ChangeWindowBG.tempbmp = new Bitmap();
LyraVultur.VS_ChangeWindowBG.tempbmp2 = new Bitmap();

//==========Init
LyraVultur.VS_ChangeWindowBG.Initialise = function() {
	if (Imported.VisuMZ_0_CoreEngine === true) {
		if (LyraVultur.VS_ChangeWindowBG.printdebug) {
			console.log("[VS_ChangeWindowBG] VisuMZ_0_CoreEngine found :)");
		}
	}
	else {
		//throw new Error("[VS_ChangeWindowBG] VisuMZ_0_CoreEngine not found!");
	}
	
	const blank = {bgopacity: -1, bgimg1: "", bgimg2: ""};
	
	const scenes = new Array("Scene_Menu", "Scene_Item", "Scene_Skill", "Scene_Equip", "Scene_Status", "Scene_Options", "Scene_Save", "Scene_Load", "Scene_GameEnd", "Scene_Shop", "Scene_Name", "Scene_Unlisted");
	for (const e of scenes) {
		if (!!PluginManager.parameters('Lyra_VS_ChangeWindowBG')["default_" + e]) {
			LyraVultur.VS_ChangeWindowBG.savedata.set(e, JSON.parse(PluginManager.parameters('Lyra_VS_ChangeWindowBG')["default_" + e]) || blank);
		}
		else {
			LyraVultur.VS_ChangeWindowBG.savedata.set(e, blank);
		}
	}
};
LyraVultur.VS_ChangeWindowBG.Initialise();

//==========Command binds
PluginManager.registerCommand('Lyra_VS_ChangeWindowBG', 'ChangeImages', args => {
	const arg_scene = String(args.scenetype);
	const arg_opacity = JSON.parse(args.bgopacity);
	const arg_img1 = String(args.bgimg1);
	const arg_img2 = String(args.bgimg2);
	
	if (LyraVultur.VS_ChangeWindowBG.savedata.has(arg_scene)) {
		if (LyraVultur.VS_ChangeWindowBG.printdebug) {
			console.log("[VS_ChangeWindowBG]", "updating..", "found a match in savedata:", arg_scene);
			console.log("[VS_ChangeWindowBG]", arg_scene, arg_opacity, arg_img1, arg_img2);
		}
		
		LyraVultur.VS_ChangeWindowBG.savedata.set(arg_scene, {bgopacity: arg_opacity, bgimg1: arg_img1, bgimg2: arg_img2});
	}
});

//==========Save/Load
LyraVultur.VS_ChangeWindowBG.DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    let contents = LyraVultur.VS_ChangeWindowBG.DataManager_makeSaveContents.call(this);
 
    data = Array.from(LyraVultur.VS_ChangeWindowBG.savedata.entries());
	
	if (!contents.lyra) {
		contents.lyra = {};
	}
    contents.lyra.VS_ChangeWindowBG = data;
	console.log(contents);
	
    return contents;
};

LyraVultur.VS_ChangeWindowBG.DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    LyraVultur.VS_ChangeWindowBG.DataManager_extractSaveContents.call(this, contents);
 
	if (contents?.lyra?.VS_ChangeWindowBG) {
		let data = new Map(contents.lyra.VS_ChangeWindowBG);
		LyraVultur.VS_ChangeWindowBG.savedata = data;
	}
	else {
		LyraVultur.VS_ChangeWindowBG.Initialise();
	}
};

//==========Main
LyraVultur.VS_ChangeWindowBG.SceneManageronSceneStart = SceneManager.onSceneStart;
SceneManager.onSceneStart = function() {
    LyraVultur.VS_ChangeWindowBG.SceneManageronSceneStart.call(this);
	
	const sname = this._scene.constructor.name;
 
	if (LyraVultur.VS_ChangeWindowBG.savedata.has(sname)) {
		LyraVultur.VS_ChangeWindowBG.CreateCustomBackground(sname);
	}
	else if (this._scene instanceof Scene_MenuBase) {
		LyraVultur.VS_ChangeWindowBG.CreateCustomBackground("Scene_Unlisted");
	}
};

LyraVultur.VS_ChangeWindowBG.CreateCustomBackground = function(sname) {
	const hasbg1 = LyraVultur.VS_ChangeWindowBG.savedata.get(sname).bgimg1 !== "";
	const hasbg2 = LyraVultur.VS_ChangeWindowBG.savedata.get(sname).bgimg2 !== "";
	const hasany = hasbg1 || hasbg2;

	if (hasany) {
		if (LyraVultur.VS_ChangeWindowBG.printdebug) {
			console.log("[VS_ChangeWindowBG]", "loading..", "found a match in savedata:", sname);
		}
		
		if (hasbg2) {
			LyraVultur.VS_ChangeWindowBG.tempbmp2 = ImageManager.loadBitmap("img/titles2/", LyraVultur.VS_ChangeWindowBG.savedata.get(sname).bgimg2);
			LyraVultur.VS_ChangeWindowBG.tempbmp2.addLoadListener(bmp => 
				LyraVultur.VS_ChangeWindowBG.ApplyCustomBackground(sname, 2)
			);
		}

		if (hasbg1) {
			LyraVultur.VS_ChangeWindowBG.tempbmp = ImageManager.loadBitmap("img/titles1/", LyraVultur.VS_ChangeWindowBG.savedata.get(sname).bgimg1);
			LyraVultur.VS_ChangeWindowBG.tempbmp.addLoadListener(bmp => 
				LyraVultur.VS_ChangeWindowBG.ApplyCustomBackground(sname, 1)
			);
		}
	}
	else {
		if (LyraVultur.VS_ChangeWindowBG.printdebug) {
			console.log("[VS_ChangeWindowBG]", "skipping..", "matched but blank in savedata:", sname);
		}
	}
};

LyraVultur.VS_ChangeWindowBG.ApplyCustomBackground = function(sname, layer) {
	let insertpoint = 1;
	
	//VisuMZ_1_MainMenuCore compatability
	if (Imported.VisuMZ_1_MainMenuCore) {
		for (let i = 0; i < SceneManager._scene.children.length; i++) {
			if (SceneManager._scene.children[i] instanceof Sprite_MenuBackgroundActor) {
				insertpoint = Math.max(1, i - layer);
				break;
			}
		}
	}
	
	let result = new Sprite();
	
	if (layer == 1) {
		result.bitmap = LyraVultur.VS_ChangeWindowBG.tempbmp;
	}
	else if (layer == 2) {
		result.bitmap = LyraVultur.VS_ChangeWindowBG.tempbmp2;
	}
	else {
		throw new Error("[VS_ChangeWindowBG] Unknown layer number " + String(layer));
	}
	
	//console.log(result);
	
	if (LyraVultur.VS_ChangeWindowBG.savedata.get(sname).bgopacity == -1) {
		if (LyraVultur.VS_ChangeWindowBG.printdebug) {
			console.log("[VS_ChangeWindowBG]", sname, "matched opacity:", SceneManager._scene.getBackgroundOpacity());
		}
	}
	else {
		SceneManager._scene.children[0].opacity = LyraVultur.VS_ChangeWindowBG.savedata.get(sname).bgopacity;
	}
	
	SceneManager._scene.addChildAt(result, insertpoint);
};