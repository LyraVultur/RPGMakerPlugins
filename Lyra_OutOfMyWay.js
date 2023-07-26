//=============================================================================
// Lyra_OutOfMyWay.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.21] Lets you tag events that can push past the player.
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

@param ce_swap
@text Common Event On Swap
@type number
@default 0
@desc Will call a common event on swap if not 0.

@param ce_push
@text Common Event On Push
@type number
@default 0
@desc Will call a common event on pushes if not 0.

@param ce_shove
@text Common Event On Shove
@type number
@default 0
@desc Will call a common event on shoves if not 0.

@param safemode
@text Safe Swap
@type boolean
@default true
@desc If true player will not be swapped into a space with any events other than the swapper, even ones with Through ON.

@param safemodepush
@text Safe Push
@type boolean
@default false
@desc If true player will not be pushed into a space with any events, even ones with Through ON.

@param safemodeshove
@text Safe Shove
@type boolean
@default false
@desc If true player will not be shoved into a space with any events, even ones with Through ON.

@help 
This lets you tag events to be able to politely swap places with the
player, or tag ones that rudely shove the player away.

Add one of these tags to an event's note box:
<swapPlayer>
<pushPlayer>
<shovePlayer>
<movePlayer>
<rudeMovePlayer>

Swap will make the player and event swap places, letting the event
carry on with their route.
Push will force the player to walk 1 step forward, so will only let
the event carry on if the player is facing away from the event.
Shove will force the player to face the same way as the event then
walk 1 step forward. The event will only get stuck if the player is
forced into a wall.
Move will attempt to swap, but if it cannot it will push. If it cannot 
push, it will shove.
RudeMove will attempt to push, and if it cannot it will shove. It will
never swap.

Add as many or as few of these tags to an event's note box, in addition
to one of the tags above:
<mustFace>
Will require the event to be facing the player in order to do anything.
<politeMove>
Will not swap or shove if the player is facing the event. Push already
acts like this.
<dashOnly>
Will only activate if the player is dashing and the NPC wants to enter
their space.
<walkOnly>
Will only activate if the player is not dashing and the NPC wants to 
enter their space.

<dashPlyForce>
Will activate normally or when the player runs into them, allowing the 
player to pass by if swap is used.
<dashPlyPass>
Will not activate if the player is dashing but will also not block
collisions, letting the player move through them.

If you want different effects if the player is dashing, you can check in 
the common event if the player was dashing with $gamePlayer.isDashing() 
inside a Conditional Branch.

MIT License - credit to "LyraVultur".
https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE

Free for commercial and non-commercial use.
*/
 
var Imported = Imported || {};
Imported.Lyra_OutOfMyWay = true;

var LyraVultur = LyraVultur || {};
LyraVultur.OutOfMyWay = LyraVultur.OutOfMyWay || {};

LyraVultur.OutOfMyWay.printdebug = {};
LyraVultur.OutOfMyWay.printdebug = JSON.parse(PluginManager.parameters('Lyra_OutOfMyWay')['showdebug']);

LyraVultur.OutOfMyWay.ce_swap = {};
LyraVultur.OutOfMyWay.ce_swap = Number(PluginManager.parameters('Lyra_OutOfMyWay')['ce_swap']);

LyraVultur.OutOfMyWay.ce_push = {};
LyraVultur.OutOfMyWay.ce_push = Number(PluginManager.parameters('Lyra_OutOfMyWay')['ce_push']);

LyraVultur.OutOfMyWay.ce_shove = {};
LyraVultur.OutOfMyWay.ce_shove = Number(PluginManager.parameters('Lyra_OutOfMyWay')['ce_shove']);

LyraVultur.OutOfMyWay.safemode = {};
LyraVultur.OutOfMyWay.safemode = Boolean(PluginManager.parameters('Lyra_OutOfMyWay')['safemode']);

LyraVultur.OutOfMyWay.safemodepush = {};
LyraVultur.OutOfMyWay.safemodepush = Boolean(PluginManager.parameters('Lyra_OutOfMyWay')['safemodepush']);

LyraVultur.OutOfMyWay.safemodeshove = {};
LyraVultur.OutOfMyWay.safemodeshove = Boolean(PluginManager.parameters('Lyra_OutOfMyWay')['safemodeshove']);

LyraVultur.OutOfMyWay.LastFrameDash = false;

LyraVultur.OutOfMyWay.SafeModeCheck = function(x, y) {
	//console.log("Events: " + $gameMap.eventsXy(x, y).length);
	
	if (!LyraVultur.OutOfMyWay.safemode) {
		return true;
	}
	
	if ($gameMap.eventsXy(x, y).length > 1) {
		if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
			console.log("safe mode prevented a swap!");
		}
		
		return false;
	}
	
	return true;
};

LyraVultur.OutOfMyWay.SafeModeCheckPush = function(x, y) {
	//console.log("Events: " + $gameMap.eventsXy(x, y).length);
	
	if (!LyraVultur.OutOfMyWay.safemodepush) {
		return true;
	}
	
	if ($gameMap.eventsXy(x, y).length > 1) {
		if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
			console.log("safe mode prevented a push!");
		}
		
		return false;
	}
	
	return true;
};

LyraVultur.OutOfMyWay.SafeModeCheckShove = function(x, y) {
	//console.log("Events: " + $gameMap.eventsXy(x, y).length);
	
	if (!LyraVultur.OutOfMyWay.safemodeshove) {
		return true;
	}
	
	if ($gameMap.eventsXy(x, y).length > 1) {
		if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
			console.log("safe mode prevented a shove!");
		}
		
		return false;
	}
	
	return true;
};

LyraVultur.OutOfMyWay.IsPlayerFacing = function(x, y) {
	let toface = LyraVultur.OutOfMyWay.DirToFaceTile(x, y);
	
	if (toface == $gamePlayer._direction) {
		return true;
	}
	
	return false;
}

LyraVultur.OutOfMyWay.PoliteCheck = function(x, y, b) {
	if (b) {
		return !LyraVultur.OutOfMyWay.IsPlayerFacing(x, y)
	}
	
	return true;
}

LyraVultur.OutOfMyWay.DirToFaceTile = function(x, y) {
	let d = $gamePlayer._direction;
	let px = $gamePlayer._x;
	let py = $gamePlayer._y;
	
	//same y, tile is to the right
	if (x > px && y == py) {
		return 6;
	}
	
	//same y, tile is to the left
	if (x < px && y == py) {
		return 4;
	}
	
	//same x, tile is below
	if (x == px && y > py) {
		return 2;
	}
	
	//same x, tile is above
	if (x == px && y < py) {
		return 8;
	}
	
	return d;
};

LyraVultur.OutOfMyWay.DoSwap = function(x, y, x2, y2) {
	if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
		console.log("swapped player");
	}
	
	if (LyraVultur.OutOfMyWay.ce_swap > 0) {
		$gameTemp.reserveCommonEvent(LyraVultur.OutOfMyWay.ce_swap);
	}
	$gamePlayer._direction = LyraVultur.OutOfMyWay.DirToFaceTile(x, y);
	$gamePlayer.forceMoveForward();
};

LyraVultur.OutOfMyWay.DoPush = function(x, y, x2, y2) {
	if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
		console.log("pushed player");
	}
	
	if (LyraVultur.OutOfMyWay.ce_push > 0) {
		$gameTemp.reserveCommonEvent(LyraVultur.OutOfMyWay.ce_push);
	}
	$gamePlayer.forceMoveForward();
};

LyraVultur.OutOfMyWay.DoShove = function(x, y, x2, y2, d) {
	if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
		console.log("shoved player");
	}
	
	if (LyraVultur.OutOfMyWay.ce_shove > 0) {
		$gameTemp.reserveCommonEvent(LyraVultur.OutOfMyWay.ce_shove);
	}
	$gamePlayer._direction = d;
	$gamePlayer.forceMoveForward();
};

Game_CharacterBase.prototype.isSwapDashValid = function() {
	if (this._eventId) {
		if ($gameMap.event(this._eventId).event().meta.dashOnly) {
			return $gamePlayer.isDashing();
		}
		
		return true;
	}
	
	return false;
};

Game_CharacterBase.prototype.isSwapWalkValid = function() {
	if (this._eventId) {
		if ($gameMap.event(this._eventId).event().meta.walkOnly) {
			return !$gamePlayer.isDashing();
		}
		
		return true;
	}
	
	return false;
};

Game_CharacterBase.prototype.isDashPlayerForceSwapValid = function() {
	if (this._eventId) {
		if ($gameMap.event(this._eventId).event().meta.dashPlyForce) {
			//console.log(LyraVultur.OutOfMyWay.LastFrameDash);
			return LyraVultur.OutOfMyWay.LastFrameDash;
		}
		
		return false;
	}
	
	return false;
};

/* LyraVultur.OutOfMyWay.IsCloseEnough = function(x, y, x2, y2) {
	let dx = Math.abs(x - x2);
	let dy = Math.abs(y - y2);

	if (x == x2 && dy == 1) {
		if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
			console.log("close test: x=" + x + " y=" + y + " x2=" + x2 + " y2=" + y2 + " dist: " + dx + "/" + dy + " PASS");
		}
		return true;
	}
	
	if (y == y2 && dx == 1) {
		if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
			console.log("close test: x=" + x + " y=" + y + " x2=" + x2 + " y2=" + y2 + " dist: " + dx + "/" + dy + " PASS");
		}
		return true;
	}
	
	if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
		console.log("close test: x=" + x + " y=" + y + " x2=" + x2 + " y2=" + y2 + " dist: " + dx + "/" + dy + " FAIL");
	}
	
	return false;
}; */

LyraVultur.OutOfMyWay.IsCloseEnoughToPly = function(event, mustface) {
	let close = false;
	let debugdir = "";
	
	if (event.pos($gamePlayer._x, $gamePlayer._y + 1)) {
		if (!mustface) {
			close = true;
		}
		else {
			debugdir = "1 below";
			if (event._direction == 8) {
				close = true;
			}
		}
	}
	
	if (event.pos($gamePlayer._x, $gamePlayer._y - 1)) {
		if (!mustface) {
			close = true;
		}
		else {
			debugdir = "1 above";
			if (event._direction == 2) {
				close = true;
			}
		}
	}
	
	if (event.pos($gamePlayer._x + 1, $gamePlayer._y)) {
		if (!mustface) {
			close = true;
		}
		else {
			debugdir = "1 to the right";
			if (event._direction == 4) {
				close = true;
			}
		}
	}
	
	if (event.pos($gamePlayer._x - 1, $gamePlayer._y)) {
		if (!mustface) {
			close = true;
		}
		else {
			debugdir = "1 to the left";
			if (event._direction == 6) {
				close = true;
			}
		}
	}
	
	if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
		if (mustface) {
			console.log(event._characterName + " close check: " + close + " dir: " + event._direction + " wasat: " + debugdir);
		}
		else {
			console.log(event._characterName + " close check: " + close);
		}
	}
	
	return close;
};

//==========Game_CharacterBase stuff
Game_CharacterBase.prototype.canPassRoot = Game_CharacterBase.prototype.canPass;
Game_CharacterBase.prototype.canPass = function(x, y, d) {
    const x2 = $gameMap.roundXWithDirection(x, d);
    const y2 = $gameMap.roundYWithDirection(y, d);
	let pass = true;
	let donecheck = false;
	
	let swapsuccess = false;
	let pushsuccess = false;
	let shovesuccess = false;
	
	let playerdashforcetrigger = false;
	
	const px2 = $gameMap.roundXWithDirection($gamePlayer._x, $gamePlayer._direction);
    const py2 = $gameMap.roundYWithDirection($gamePlayer._y, $gamePlayer._direction);
	
	const sx2 = $gameMap.roundXWithDirection($gamePlayer._x, d);
    const sy2 = $gameMap.roundYWithDirection($gamePlayer._y, d);
	
	let hitcheckchar = this;
	
	//map tile exists?
	if (!donecheck) {
		if (!$gameMap.isValid(x2, y2)) {
			pass = false;
			donecheck = true;
		}
	}
	
	//player through on?
	if (!donecheck) {
		if (this.isThrough() || this.isDebugThrough()) {
			pass = true;
			donecheck = true;
		}
	}
	
	//map tile passable?
	if (!donecheck) {
		if (!this.isMapPassable(x, y, d)) {
			pass = false;
			donecheck = true;
		}
	}
	
	//player dash force
	if (!donecheck) {
		if (LyraVultur.OutOfMyWay.LastFrameDash && this instanceof Game_Player && this.isCollidedWithCharacters(x2, y2)) {
			hitcheck = $gameMap.eventsXyNt(x2, y2);
			
			if (hitcheck?.length > 0) {
				hitcheckchar = hitcheck[0];
				const metadata = $gameMap.event(hitcheckchar._eventId).event().meta;
				
				if (metadata.dashPlyForce) {
					playerdashforcetrigger = true;
				}
				
				if (metadata.dashPlyPass) {
					pass = true;
					donecheck = true;
				}
				
				if (!donecheck) {
					pass = false;
				}
				
				if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
					console.log($gameMap.event(hitcheck[0]._eventId).event().meta);
				}
			}
		}
	}
	
	//major checks
	if (!donecheck) {
		if (hitcheckchar.isCollidedWithCharacters(x2, y2) || (!hitcheckchar.isMoving() && playerdashforcetrigger)) {
			//make sure that we are an npc and not the player, and that we are close enough
			if (hitcheckchar._eventId && hitcheckchar.isSwapDashValid() && hitcheckchar.isSwapWalkValid() && LyraVultur.OutOfMyWay.IsCloseEnoughToPly(hitcheckchar, $gameMap.event(hitcheckchar._eventId).event().meta.mustFace)) {
				if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
					console.log(hitcheckchar._characterName + " event pos: " + hitcheckchar._x + "/" + hitcheckchar._y + " ply pos:" + $gamePlayer._x + "/" + $gamePlayer._y);
				}
				//<swapPlayer>
				if ($gameMap.event(hitcheckchar._eventId).event().meta.swapPlayer && (!$gamePlayer.isMoving() || playerdashforcetrigger) && LyraVultur.OutOfMyWay.PoliteCheck(x, y, $gameMap.event(hitcheckchar._eventId).event().meta.politeMove)) {
					//make sure it is the player that is in the way and not an npc
					if (($gamePlayer.pos(x2, y2) || playerdashforcetrigger) && LyraVultur.OutOfMyWay.SafeModeCheck($gameMap.event(hitcheckchar._eventId)._x, $gameMap.event(hitcheckchar._eventId)._y)) {
						if (playerdashforcetrigger) {
							hitcheckchar.moveTowardPlayer();
						}
						
						LyraVultur.OutOfMyWay.DoSwap(x, y, x2, y2);
						
						pass = true;
						donecheck = true;
					}
				}
				
				//<pushPlayer>
				if ($gameMap.event(hitcheckchar._eventId).event().meta.pushPlayer && (!$gamePlayer.isMoving() || playerdashforcetrigger)) {
					//make sure it is the player that is in the way and not an npc
					if ($gamePlayer.pos(x2, y2) && !playerdashforcetrigger && LyraVultur.OutOfMyWay.SafeModeCheckPush(px2, py2)) {
						if ($gamePlayer.canPassRoot($gamePlayer.x, $gamePlayer.y, $gamePlayer._direction)) {
							LyraVultur.OutOfMyWay.DoPush(x, y, x2, y2);
							
							pass = true;
							donecheck = true;
						}
						else {
							if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
								console.log(hitcheckchar._characterName + " had no room to push!");
							}
						}
					}
				}
				
				//<shovePlayer>
				if ($gameMap.event(hitcheckchar._eventId).event().meta.shovePlayer && (playerdashforcetrigger || !$gamePlayer.isMoving()) && LyraVultur.OutOfMyWay.PoliteCheck(x, y, $gameMap.event(hitcheckchar._eventId).event().meta.politeMove)) {
					//make sure it is the player that is in the way and not an npc
					if (($gamePlayer.pos(x2, y2) || playerdashforcetrigger) && LyraVultur.OutOfMyWay.SafeModeCheckShove(sx2, sy2)) {
						if ($gamePlayer.canPassRoot($gamePlayer.x, $gamePlayer.y, hitcheckchar.direction()) || (playerdashforcetrigger && $gamePlayer.canPassRoot($gamePlayer.x, $gamePlayer.y, $gamePlayer.reverseDir(d)))) {
							if (playerdashforcetrigger) {
								//hitcheckchar.turnTowardPlayer();
								//$gamePlayer.setPosition($gamePlayer._x, $gamePlayer._y);
								
								LyraVultur.OutOfMyWay.DoShove(x, y, x2, y2, hitcheckchar.reverseDir(d));
								$gamePlayer.setPosition($gamePlayer._x, $gamePlayer._y);
							}
							else {
								LyraVultur.OutOfMyWay.DoShove(x, y, x2, y2, d);
							}
							
							pass = true;
							donecheck = true;
						}
						else {
							if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
								console.log(hitcheckchar._characterName + " had no room to shove!");
							}
						}
					}
				}
				
				//<movePlayer>
				if (($gameMap.event(hitcheckchar._eventId).event().meta.movePlayer || $gameMap.event(hitcheckchar._eventId).event().meta.rudeMovePlayer) && (!$gamePlayer.isMoving() || playerdashforcetrigger)) {
					//make sure it is the player that is in the way and not an npc
					if (!swapsuccess && !pushsuccess && !shovesuccess) {
						if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
							console.log(hitcheckchar._characterName + " trying to smart move player..");
						}
					}
					
					if (($gamePlayer.pos(x2, y2) || playerdashforcetrigger) && !$gameMap.event(hitcheckchar._eventId).event().meta.rudeMovePlayer && LyraVultur.OutOfMyWay.SafeModeCheck($gameMap.event(hitcheckchar._eventId)._x, $gameMap.event(hitcheckchar._eventId)._y)) {
						LyraVultur.OutOfMyWay.DoSwap(x, y, x2, y2);
						
						swapsuccess = true;
						pass = true;
						donecheck = true;
					}
					
					if ($gamePlayer.pos(x2, y2) && !swapsuccess && $gamePlayer.canPassRoot($gamePlayer.x, $gamePlayer.y, $gamePlayer._direction)) {
						LyraVultur.OutOfMyWay.DoPush(x, y, x2, y2);
						
						pushsuccess = true;
						pass = true;
						donecheck = true;
					}
					
					if ($gamePlayer.pos(x2, y2) && !swapsuccess && !pushsuccess && $gamePlayer.canPassRoot($gamePlayer.x, $gamePlayer.y, d)) {
						LyraVultur.OutOfMyWay.DoShove(x, y, x2, y2, d);
						
						shovesuccess = true;
						pass = true;
						donecheck = true;
					}
					
					if (!swapsuccess && !pushsuccess && !shovesuccess) {
						if (Utils.isOptionValid('test') && LyraVultur.OutOfMyWay.printdebug) {
							console.log(hitcheckchar._characterName + " couldn't smart move player");
						}
					}
				}
				
				//no tag, normal behaviour
				if (!donecheck) {
					pass = false;
					donecheck = true;
				}
			}
			else {
				console.log("ply couldnt walk");
				pass = false;
				donecheck = true;
			}
		}
		else if (playerdashforcetrigger) {
			pass = false;
			console.log("is this meant to happen?");
		}
	}
	
	LyraVultur.OutOfMyWay.LastFrameDash = false;
	
	//if we are the player and we're trying to dash past
	if ($gamePlayer.isDashing() && this instanceof Game_Player) {
		LyraVultur.OutOfMyWay.LastFrameDash = true;
	}

	return pass;
};