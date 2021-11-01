//=============================================================================
// Lyra_InstantItems.js
//=============================================================================
//License
//MIT - credit is appreciated but not required
//<https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE>

//To report bugs, PM LyraVultur on the RPG Maker forums.

/*:
@target MZ
@plugindesc [v1.0] If there is only one party member, use items without needing to pick an actor.
@url https://github.com/LyraVultur/RPGMakerPlugins/
@author Lyra Vultur

@param ---Solo Settings---
@default

@param skipusersolo
@text Skip targeting "User"?
@desc Only works when there is one party member.
@type boolean
@parent ---Solo Settings---
@default true

@param skipallysolo
@text Skip targeting "1 Ally"?
@desc Only works when there is one party member.
@type boolean
@parent ---Solo Settings---
@default true

@param ---Party Settings---
@default

@param skipallies
@text Skip targeting "All Allies"?
@desc Works when there is one or more party members.
@type boolean
@parent ---Party Settings---
@default true

@param ---Forced Actor Settings---
@default

@param notsolo
@text Force solo mode?
@desc Forces "1 Ally" item scopes to be used on a certain actor even with more than one party member.
@type boolean
@parent ---Forced Actor Settings---
@default false

@param actorid
@text Force solo target
@desc The actor to use the items on if forcing solo mode is on. Choose None for the party leader.
@type actor
@parent ---Forced Actor Settings---
@default 1

@param skipuser
@text Redirect "User" scope?
@desc Makes items that target "User" also be forced to instead affect the forced solo mode target.
@type boolean
@parent ---Forced Actor Settings---
@default false

@help
If there is only one party member, use items without needing to pick an 
actor. Can also optionally always use items on a certain party member 
even if not solo. Should work with VisuStella stuff if placed under them 
all, but may cause conflicts with other plugins that affect targeting.

No instant battle targeting or Plugin Commands yet, maybe next version?
*/

var Imported = Imported || {};
Imported.Lyra_InstantItems = true;

var LyraVultur = LyraVultur || {};
LyraVultur.InstantItems = LyraVultur.InstantItems || {};

//LyraVultur.InstantItems.Parameters = PluginManager.parameters('Lyra_InstantItems');
LyraVultur.InstantItems.ForceSolo = JSON.parse(PluginManager.parameters('Lyra_InstantItems')['notsolo']);
LyraVultur.InstantItems.SkipUser = JSON.parse(PluginManager.parameters('Lyra_InstantItems')['skipuser']);
LyraVultur.InstantItems.SkipUserSolo = JSON.parse(PluginManager.parameters('Lyra_InstantItems')['skipusersolo']);
LyraVultur.InstantItems.SkipAllySolo = JSON.parse(PluginManager.parameters('Lyra_InstantItems')['skipallysolo']);
LyraVultur.InstantItems.SkipAllAllies = JSON.parse(PluginManager.parameters('Lyra_InstantItems')['skipallies']);
LyraVultur.InstantItems.ForceActorID = JSON.parse(PluginManager.parameters('Lyra_InstantItems')['actorid']);

/*console.log("Force mode: " + LyraVultur.InstantItems.ForceSolo);
console.log("Skip user (force): " + LyraVultur.InstantItems.SkipUser);
console.log("Actor ID (force): " + LyraVultur.InstantItems.ForceActorID);
console.log("\nSkip user (solo): " + LyraVultur.InstantItems.SkipUserSolo);
console.log("Skip ally (solo): " + LyraVultur.InstantItems.SkipAllySolo);
console.log("\nSkip All Allies: " + LyraVultur.InstantItems.SkipAllAllies);*/

//Capture item targeting
LyraVultur.InstantItems.ItemBase_itemTargetActors = Scene_ItemBase.prototype.itemTargetActors;
//Use our own instead
Scene_ItemBase.prototype.itemTargetActors = function() {
	const action = new Game_Action(this.user());
    action.setItemObject(this.item());
	
	/*console.log(action);
	
	console.log("itarg force solo: " + LyraVultur.InstantItems.ForceSolo);
	console.log("itarg force solo id: " + LyraVultur.InstantItems.ForceActorID);
	
	console.log("itarg for friend " + action.isForFriend());
	console.log("itarg for all " + action.isForAll());
	console.log("itarg for self " + action.isForUser());
	
	if (LyraVultur.InstantItems.ForceActorID != 0) {
		console.log("index");
		console.log($gameParty.members()[$gameParty.members().indexOf($gameActors.actor(LyraVultur.InstantItems.ForceActorID))]);
	}
	else {
		console.log("leader");
		console.log($gameParty.leader());
	}*/
	
	//Regular checks
	if (action.isForAll()) {
        return $gameParty.members();
	}
	else if (action.isForUser() && LyraVultur.InstantItems.ForceSolo && LyraVultur.InstantItems.SkipUser) {
		//console.log("itarg USED forced self-scope");
		
		if (LyraVultur.InstantItems.ForceActorID != 0) {
			return [$gameParty.members()[$gameParty.members().indexOf($gameActors.actor(LyraVultur.InstantItems.ForceActorID))]];
		}
		else {
			return [$gameParty.leader()];
		}
	}
    else if (!action.isForFriend()) {
		//console.log("itarg USED not for friend");
        return [];
    }
	//Is party solo?
	else if ($gameParty.members().length == 1) {
		//console.log("itarg USED just one!!!");
		return [$gameParty.members()[0]];
	}
	//Is party not solo, but force it anyway?
	else if (LyraVultur.InstantItems.ForceSolo == true) {
		//console.log("itarg USED more than 1 member, but forced");
		
		if (!action.isForUser()) {
			if (LyraVultur.InstantItems.ForceActorID != 0) {
				return [$gameParty.members()[$gameParty.members().indexOf($gameActors.actor(LyraVultur.InstantItems.ForceActorID))]];
			}
			else {
				return [$gameParty.leader()];
			}
		}
		else {
			//console.log("itarg USED default self, ignored force");
			return [$gameParty.members()[this._actorWindow.index()]];
		}
	}
	//Regular catch-all
    else {
		//console.log("itarg USED default-scope");
        return [$gameParty.members()[this._actorWindow.index()]];
    }
	
	//LyraVultur.InstantItems.ItemBase_itemTargetActors.call(this);
};

//Capture item usage
LyraVultur.InstantItems.ItemBase_determineItem = Scene_ItemBase.prototype.determineItem;
//Use our own instead
Scene_ItemBase.prototype.determineItem = function() {
	const action = new Game_Action(this.user());
    const item = this.item();
    action.setItemObject(item);
	
	//console.log("ditem force solo: " + LyraVultur.InstantItems.ForceSolo);
	//console.log("ditem force solo id: " + LyraVultur.InstantItems.ForceActorID);
	//console.log("ditem party: " + $gameParty.members().length);
	
	$gameParty.setTargetActor($gameParty.leader());
	
	//Skip for all
	if (action.isForAll()) {
		//console.log("ditem chose for all");
		if (LyraVultur.InstantItems.SkipAllAllies) {
			//console.log("ditem USED for all!!!");
			this.useItem();
			this.activateItemWindow();
		}
		else {
			//console.log("ditem USED all default");
			this.showActorWindow();
			this._actorWindow.selectForItem(this.item());
		}
	}
	//Regular checks
    else if (action.isForFriend() && !action.isForUser()) {
		//console.log("ditem chose for friend");
        
		//Is party solo?
		if ($gameParty.members().length == 1) {
			//console.log("ditem USED just one!!!");
			this.useItem();
			this.activateItemWindow();
		}
		//Is party not solo, but force it anyway?
		else if (LyraVultur.InstantItems.ForceSolo == true) {
			//console.log("ditem USED more than 1 member, but forced");
			
			if (LyraVultur.InstantItems.ForceActorID != 0) {
				//console.log($gameActors.actor(LyraVultur.InstantItems.ForceActorID));
				//console.log($gameParty.members().indexOf($gameActors.actor(LyraVultur.InstantItems.ForceActorID)));
				$gameParty.setTargetActor($gameParty.members()[$gameParty.members().indexOf($gameActors.actor(LyraVultur.InstantItems.ForceActorID))]);
			}
			else {
				//console.log("ditem force 0");
				$gameParty.setTargetActor($gameParty.leader());
			}
			
			this.useItem();
			this.activateItemWindow();
		}
		else {
			//console.log("ditem USED for friend");
			this.showActorWindow();
			this._actorWindow.selectForItem(this.item());
		}
	}
	else if (action.isForUser()) {
		//console.log("ditem chose self");
		
		if (LyraVultur.InstantItems.SkipUserSolo && $gameParty.members().length == 1) {
			//console.log("ditem USED solo self skip");
			this.useItem();
			this.activateItemWindow();
		}
		else if (LyraVultur.InstantItems.SkipUser == true && $gameParty.members().length > 1 && LyraVultur.InstantItems.ForceSolo) {
			//console.log("ditem USED forced solo self skip");
			this.useItem();
			this.activateItemWindow();
		}
		else {
			//console.log("ditem USED self default");
			this.showActorWindow();
			this._actorWindow.selectForItem(this.item());
		}
	}
    else {
		//console.log("ditem USED default");
        this.useItem();
        this.activateItemWindow();
    }
	
	//LyraVultur.InstantItems.ItemBase_determineItem.call(this);
};

/*
Original functions from rmmz_scenes.js for posterity
=======================================================
Scene_ItemBase.prototype.itemTargetActors = function() {
    const action = new Game_Action(this.user());
    action.setItemObject(this.item());
	if (!action.isForFriend()) {
        return [];
    } else if (action.isForAll()) {
        return $gameParty.members();
    } else {
        return [$gameParty.members()[this._actorWindow.index()]];
    }
};

Scene_ItemBase.prototype.determineItem = function() {
    const action = new Game_Action(this.user());
    const item = this.item();
    action.setItemObject(item);
	if (action.isForFriend()) {
        this.showActorWindow();
        this._actorWindow.selectForItem(this.item());
    } else {
        this.useItem();
        this.activateItemWindow();
    }
};
*/