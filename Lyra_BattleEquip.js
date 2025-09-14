//=============================================================================
// Lyra_BattleEquip.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0] Lets you change equipment mid-battle.
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


@command ShowEquipWindows
@text Change Equipment
@desc Shows the change equipment windows for the current battler.

@command ShowEquipWindowsID
@text Change Equipment (Actor ID)
@desc Shows the change equipment windows for a specific battler.
	@arg id
	@text Actor
	@type actor

@help 
A simple implementation of changing equipment mid-battle. Presently only 
happens on the user's turn, so depending on the battle system may have 
unintended effects.
Tested with VisuMZ's BattleCore and didn't notice any incompatability.

Simply make a skill or item that targets One Ally or the User. Then give 
it the notetag <OpenBattleEquip> and give it a test! When used, it will 
open up a copy of the Equip screen, but pause the battle. Once you're 
done editing equipment, cancel out and the battle will resume.

There are also some Plugin Commands that can open the Battle Equip 
Window, these are for using in VisuMZ's Action Sequences and may crash 
if run outside of battle.

MIT License - credit to "LyraVultur".
https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE

Free for commercial and non-commercial use.
*/
 
var Imported = Imported || {};
Imported.Lyra_BattleEquip = true;

var LyraVultur = LyraVultur || {};
LyraVultur.BattleEquip = LyraVultur.BattleEquip || {};
LyraVultur.BattleEquip.enabled = true;

LyraVultur.BattleEquip.printdebug = {};
LyraVultur.BattleEquip.printdebug = JSON.parse(PluginManager.parameters('Lyra_BattleEquip')['showdebug']) && Utils.isOptionValid('test');

LyraVultur.BattleEquip.user = {};
LyraVultur.BattleEquip.win = {};
LyraVultur.BattleEquip.winactive = false;

//==========Init
LyraVultur.BattleEquip.Initialise = function() {
	if (this.printdebug) {
		console.log("[BattleEquip] enabled");
	}
};
LyraVultur.BattleEquip.Initialise();

//==========Main
LyraVultur.BattleEquip.showWindow = function(actor) {
    if (!!actor) {
        LyraVultur.BattleEquip.user = actor;
    }
    else {
        LyraVultur.BattleEquip.user = BattleManager.actor();
    }
    LyraVultur.BattleEquip.win.deactivate();
    LyraVultur.BattleEquip.win._commandWindow.activate();
    LyraVultur.BattleEquip.win.updateActor();
    LyraVultur.BattleEquip.win.open();
    LyraVultur.BattleEquip.win.refreshActor();
    LyraVultur.BattleEquip.winactive = true;
    LyraVultur.BattleEquip.win._statusWindow.refresh();
    LyraVultur.BattleEquip.win._slotWindow.refresh();
    LyraVultur.BattleEquip.win.update();
};

//==========Custom Window Class
function Window_BattleEquip() {
    this.initialize(...arguments);
}

Window_BattleEquip.prototype = Object.create(Window_Scrollable.prototype);
Window_BattleEquip.prototype.constructor = Window_BattleEquip;

Window_BattleEquip.prototype.initialize = function(rect) {
    Window_Scrollable.prototype.initialize.call(this, rect);

	this._helpWindow = {};
    this._statusWindow = {};
    this._commandWindow = {};
    this._slotWindow = {};
    this._itemWindow = {};

    this._actor = $gameParty.leader();

	this.createHelpWindow();
    this.createStatusWindow();
    this.createCommandWindow();
    this.createSlotWindow();
    this.createItemWindow();
    this.refreshActor();

    LyraVultur.BattleEquip.winactive = false;
    this.deactivate();
    this.close();

    /*this.loadWindowskin();
    this.checkRectObject(rect);
    this.move(rect.x, rect.y, rect.width, rect.height);
    this.updatePadding();
    this.updateBackOpacity();
    this.updateTone();
    this.createContents();
    this._opening = false;
    this._closing = false;
    this._dimmerSprite = null;*/
};

Window_BattleEquip.prototype.createHelpWindow = function() {
	const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    //this._helpWindow.hide();
    //this.addWindow(this._helpWindow);
	this.addChild(this._helpWindow);
};

Window_BattleEquip.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = this.helpAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.helpAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};

Window_BattleEquip.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_EquipStatus(rect);
    this.addChild(this._statusWindow);
};

Window_BattleEquip.prototype.statusWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = this.statusWidth();
    const wh = this.mainAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};

Window_BattleEquip.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_EquipCommand(rect);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler("equip", this.commandEquip.bind(this));
    this._commandWindow.setHandler("optimize", this.commandOptimize.bind(this));
    this._commandWindow.setHandler("clear", this.commandClear.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this._commandWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._commandWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addChild(this._commandWindow);
    this._commandWindow.deactivate();
};

Window_BattleEquip.prototype.commandWindowRect = function() {
    const wx = this.statusWidth();
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth - this.statusWidth();
    const wh = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
};

Window_BattleEquip.prototype.createSlotWindow = function() {
    const rect = this.slotWindowRect();
    this._slotWindow = new Window_EquipSlot(rect);
    this._slotWindow.setHelpWindow(this._helpWindow);
    this._slotWindow.setStatusWindow(this._statusWindow);
    this._slotWindow.setHandler("ok", this.onSlotOk.bind(this));
    this._slotWindow.setHandler("cancel", this.onSlotCancel.bind(this));
    this.addChild(this._slotWindow);
};

Window_BattleEquip.prototype.slotWindowRect = function() {
    const commandWindowRect = this.commandWindowRect();
    const wx = this.statusWidth();
    const wy = commandWindowRect.y + commandWindowRect.height;
    const ww = Graphics.boxWidth - this.statusWidth();
    const wh = this.mainAreaHeight() - commandWindowRect.height;
    return new Rectangle(wx, wy, ww, wh);
};

Window_BattleEquip.prototype.createItemWindow = function() {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_EquipItem(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setStatusWindow(this._statusWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this._itemWindow.hide();
    this._slotWindow.setItemWindow(this._itemWindow);
    this.addChild(this._itemWindow);
};

Window_BattleEquip.prototype.itemWindowRect = function() {
    return this.slotWindowRect();
};

Window_BattleEquip.prototype.updateChildren = function() {
    this._helpWindow.update();
    this._statusWindow.update();
    this._commandWindow.update();
    this._slotWindow.update();
    this._itemWindow.update();
}

Window_BattleEquip.prototype.update = function() {
    Window_Scrollable.prototype.update.call(this);
    this.updateTone();
    this.updateOpen();
    this.updateClose();
    this.updateBackgroundDimmer();

    this.updateChildren();
};

Window_BattleEquip.prototype.helpAreaTop = function() {
    if (this.isBottomHelpMode()) {
        return this.mainAreaBottom();
    } else if (this.isBottomButtonMode()) {
        return 0;
    } else {
        return this.buttonAreaBottom();
    }
};

Window_BattleEquip.prototype.isBottomButtonMode = function() {
    return false;
};

Window_BattleEquip.prototype.isBottomHelpMode = function() {
    return true;
};

Window_BattleEquip.prototype.helpAreaBottom = function() {
    return this.helpAreaTop() + this.helpAreaHeight();
};

Window_BattleEquip.prototype.helpAreaHeight = function() {
    return this.calcWindowHeight(2, false);
};

Window_BattleEquip.prototype.mainAreaTop = function() {
    if (!this.isBottomHelpMode()) {
        return this.helpAreaBottom();
    } else if (this.isBottomButtonMode()) {
        return 0;
    } else {
        return this.buttonAreaBottom();
    }
};

Window_BattleEquip.prototype.executeEquipChange = function() {
    const actor = this.actor();
    const slotId = this._slotWindow.index();
    const item = this._itemWindow.item();
    actor.changeEquip(slotId, item);
};

Window_BattleEquip.prototype.onItemOk = function() {
    SoundManager.playEquip();
    this.executeEquipChange();
    this.hideItemWindow();
    this._slotWindow.refresh();
    this._itemWindow.refresh();
    this._statusWindow.refresh();
};

Window_BattleEquip.prototype.onItemCancel = function() {
    this.hideItemWindow();
};

Window_BattleEquip.prototype.mainAreaBottom = function() {
    return this.mainAreaTop() + this.mainAreaHeight();
};

Window_BattleEquip.prototype.mainAreaHeight = function() {
    return Graphics.boxHeight - this.buttonAreaHeight() - this.helpAreaHeight();
};

Window_BattleEquip.prototype.buttonAreaTop = function() {
    if (this.isBottomButtonMode()) {
        return Graphics.boxHeight - this.buttonAreaHeight();
    } else {
        return 0;
    }
};

Window_BattleEquip.prototype.buttonAreaBottom = function() {
    return this.buttonAreaTop() + this.buttonAreaHeight();
};

Window_BattleEquip.prototype.buttonAreaHeight = function() {
    //return 52;
    return SceneManager._scene.buttonAreaHeight();
};

Window_BattleEquip.prototype.calcWindowHeight = function(numLines, selectable) {
    if (selectable) {
        return Window_Selectable.prototype.fittingHeight(numLines);
    } else {
        return Window_Base.prototype.fittingHeight(numLines);
    }
};

Window_BattleEquip.prototype.statusWidth = function() {
    return 312;
};

Window_BattleEquip.prototype.hideItemWindow = function() {
    this._slotWindow.show();
    this._slotWindow.activate();
    this._itemWindow.hide();
    this._itemWindow.deselect();
};

Window_BattleEquip.prototype.onSlotOk = function() {
    this._slotWindow.hide();
    this._itemWindow.show();
    this._itemWindow.activate();
    this._itemWindow.select(0);
};

Window_BattleEquip.prototype.onSlotCancel = function() {
    this._slotWindow.deselect();
    this._commandWindow.activate();
};

Window_BattleEquip.prototype.commandEquip = function() {
    this._slotWindow.activate();
    this._slotWindow.select(0);
};

Window_BattleEquip.prototype.commandOptimize = function() {
    SoundManager.playEquip();
    this.actor().optimizeEquipments();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._commandWindow.activate();
};

Window_BattleEquip.prototype.commandClear = function() {
    SoundManager.playEquip();
    this.actor().clearEquipments();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._commandWindow.activate();
};

Window_BattleEquip.prototype.popScene = function() {
    LyraVultur.BattleEquip.winactive = false;
    LyraVultur.BattleEquip.win._commandWindow.deactivate();
    LyraVultur.BattleEquip.win.close();
    //SceneManager.pop();
};

Window_BattleEquip.prototype.nextActor = function() {
    $gameParty.makeMenuActorNext();
    this.updateActor();
    this.onActorChange();
};

Window_BattleEquip.prototype.previousActor = function() {
    $gameParty.makeMenuActorPrevious();
    this.updateActor();
    this.onActorChange();
};

Window_BattleEquip.prototype.onActorChange = function() {
    SoundManager.playCursor();
};

Window_BattleEquip.prototype.updateActor = function() {
    this._actor = LyraVultur.BattleEquip.user;
};

Window_BattleEquip.prototype.actor = function() {
    return this._actor;
};

Window_BattleEquip.prototype.refreshActor = function() {
    const actor = this.actor();
    this._statusWindow.setActor(actor);
    this._slotWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};

//==========Function Overrides
LyraVultur.BattleEquip.Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    LyraVultur.BattleEquip.Scene_Battle_createAllWindows.call(this);
    let rect = new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
	LyraVultur.BattleEquip.win = new Window_BattleEquip(rect);
	this.addWindow(LyraVultur.BattleEquip.win);
};

LyraVultur.BattleEquip.BattleManager_isBusy = BattleManager.isBusy;
BattleManager.isBusy = function() {
    return LyraVultur.BattleEquip.winactive || LyraVultur.BattleEquip.BattleManager_isBusy.call(this);
};

LyraVultur.BattleEquip.origGame_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
	if (this._item) {
		let exdata = [];
		if (this._item._dataClass == "skill") {
			exdata = $dataSkills[this._item._itemId].note;
		}
		else if (this._item._dataClass == "item") {
			exdata = $dataItems[this._item._itemId].note;
		}

        if (exdata.contains("<OpenBattleEquip>")) {
            let openequip = false;
            if (this.isForOpponent()) {
                if (LyraVultur.BattleEquip.printdebug) {
                    console.log("[BattleEquip] <OpenBattleEquip> notetag doesn't support targeting enemies!");
                }
            }
            else if (this.needsSelection()) {
                if (this.isForOne()) {
                    LyraVultur.BattleEquip.user = $gameParty.battleMembers()[this._targetIndex];
                    openequip = true;
                }
                else {
                    if (LyraVultur.BattleEquip.printdebug) {
                        console.log("[BattleEquip] <OpenBattleEquip> notetag doesn't support targeting multiple allies!");
                    }
                }
            }
            else {
                if (this.isForUser()) {
                    //no selection and for user, is User scope
                    LyraVultur.BattleEquip.user = this.subject();
                    openequip = true;
                }
                if (!this.isForOne()) {
                    if (LyraVultur.BattleEquip.printdebug) {
                        console.log("[BattleEquip] <OpenBattleEquip> notetag doesn't support targeting multiple allies!");
                    }
                }
            }

            if (openequip) {
		        LyraVultur.BattleEquip.showWindow(LyraVultur.BattleEquip.user);
            }
        }
	}

    LyraVultur.BattleEquip.origGame_Action_apply.call(this, target);
};

//==========Command Binds
PluginManager.registerCommand('Lyra_BattleEquip', 'ShowEquipWindows', args => {
	LyraVultur.BattleEquip.showWindow(BattleManager.actor());
});

PluginManager.registerCommand('Lyra_BattleEquip', 'ShowEquipWindowsID', args => {
	const actor = $dataActors(Number(args.id));
    LyraVultur.BattleEquip.showWindow(actor);
});