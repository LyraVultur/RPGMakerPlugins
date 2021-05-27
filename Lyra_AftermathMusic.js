//=============================================================================
// Lyra_AftermathMusic.js
//=============================================================================

/*:
 * @plugindesc [v1.0] Prevents the stopping of BGM after battle.
 * @author Lyra Vultur
 * @target MZ
 *
 * @help Prevents the stopping of BGM after battle.
 * Might add evals for custom music in the future.
 */

BattleManager.processVictory = function() {
    $gameParty.removeBattleStates();
    $gameParty.performVictory();
    this.playVictoryMe();
    //$gameMap._interpreter.setWaitMode('message');
    this.makeRewards();
    this.displayVictoryMessage();
    this.displayRewards();
    this.gainRewards();
    this.endBattle(0);
	//this.replayBgmAndBgs();
};

BattleManager.updateBattleEnd = function() {
    if (this.isBattleTest()) {
        AudioManager.stopBgm();
        SceneManager.exit();
    } else if (!this._escaped && $gameParty.isAllDead()) {
        if (this._canLose) {
            $gameParty.reviveBattleMembers();
            SceneManager.pop();
			this.replayBgmAndBgs();
        } else {
            SceneManager.goto(Scene_Gameover);
        }
    } else {
        SceneManager.pop();
		this.replayBgmAndBgs();
    }
    this._phase = null;
};