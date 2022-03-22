//=============================================================================
// Lyra_PartyPronouns.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0] Calls a scene to enter name, pronouns, etc for actors.
@author Lyra Vultur
@url http://www.koutacles.com.au/
 
License
MIT
<https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE>

@param maxcharsname
@text Name Character Limit
@type number
@default 12
@desc Limit names to this many characters or less.

@param maxcharsnick
@text Nickname Character Limit
@type number
@default 14
@desc Limit nicknames to this many characters or less.

@param maxcharsnoun
@text Pronoun Character Limit
@type number
@default 10
@desc Limit pronouns to this many characters or less.

@param maxcharsvar
@text Variable Character Limit
@type number
@default 16
@desc Limit variable entry to this many characters or less.

@param showdebug
@text Show Debug Info
@type boolean
@default true
@desc Will print debug info into the console. Playtest mode only.

@param defaultpronouns
@text Default Pronouns
@type struct<PronounSet>[]
@default []
@desc The default pronouns for each actor.

@param namekeyboard
@text Add Keyboard Support
@type boolean
@default true
@desc Allows basic keyboard typing during NameInput. Disable if using another plugin that does the same.

@param showinputframes
@text Show Window Frames
@type boolean
@default true
@desc If off will hide window frames in the NameInput scene.

@param showinputbacks
@text Show Window Backgrounds
@type boolean
@default true
@desc If off will hide window backgrounds in the NameInput scene.

@param showinputhelp
@text Show Button Help Window
@type boolean
@default true
@desc If off will hide the button help in the NameInput scene.

@param showinputface
@text Show Actor Face
@type boolean
@default true
@desc If off will hide actor face in the NameInput scene.

@command InputSceneSettings
@text Change Input Scene Settings
@desc Change how the NameInput scene looks.
	@arg useface
    @text Show Face
    @type boolean
    @desc Show the actor's face?
    @default true
	
	@arg usehelp
    @text Show Help
    @type boolean
    @desc Show the button help window?
    @default true
	
	@arg usebacks
    @text Show Backgrounds
    @type boolean
    @desc Show the window backgrounds?
    @default true
	
	@arg useframes
    @text Show Frames
    @type boolean
    @desc Show the window frames?
    @default true
	
	@arg canbeblank
    @text Allow Blank
    @type boolean
    @desc Can the entry be blank?
    @default false
	
@command InputSceneDescription
@text Change Input Scene Hint
@desc Shows some text to let the player know what to type.
	@arg desc
	@text Description
	@type text
	@desc Enter some text to use to help the player, or blank for none.

@command ShowPronounEntry
@text Show Pronoun Entry
@desc Calls scenes repeatedly to let the user change a character's entire pronoun set. Excludes the booleans.

    @arg actor
    @text Actor ID
    @type actor
    @desc The actor to use. None for party leader.
    @default 1
	
    @arg msgsub
    @text Hint Message (Subject)
    @type text
    @desc The hint text to use for the Subject.
	
	@arg msgobj
    @text Hint Message (Object)
    @type text
    @desc The hint text to use for the Object.
	
	@arg msgposd
    @text Hint Message (Dependent)
    @type text
    @desc The hint text to use for the Dependent Possessive.
	
	@arg msgposi
    @text Hint Message (Independent)
    @type text
    @desc The hint text to use for the Independent Possessive.
	
	@arg msgrfx
    @text Hint Message (Reflexive)
    @type text
    @desc The hint text to use for the Reflexive.
	
@command ShowSinglePronounEntry
@text Show Single Pronoun Entry
@desc Calls a scene that lets the user change a singular pronoun.

    @arg actor
    @text Actor ID
    @type actor
    @desc The actor to use. None for party leader.
    @default 1
	
	@arg noun
    @text To Change
    @type select
	@option subject
	@option object
	@option possessiveD
	@option possessiveI
	@option reflexive
    @desc What are we changing?
    @default subject

@command SetActorPluralVerbUsage
@text Set Actor's Plural Verb Usage
@desc Sets whether an actor wants plural verbs.

    @arg actor
    @text Actor ID
    @type actor
    @desc The actor to use. None for party leader.
    @default 1
	
	@arg sforverbs
    @text Use Plural for Verbs
    @type boolean
    @desc Use the plural form for verbs? 
 eg "They live in the woods" vs "She lives in the woods"
    @default false
	
@command SetActorLinkingVerb
@text Set Actor's Linking Verb
@desc Sets what linking verb an actor wants.

    @arg actor
    @text Actor ID
    @type actor
    @desc The actor to use. None for party leader.
    @default 1
	
	@arg linkingverb
    @text Linking Verb
    @type select
	@option are
	@option is
    @desc Link sentences with "is" or "are"? 
 eg "They are in love" vs "He is in love"
    @default are
	
@command SetActorLinkingVerbPast
@text Set Actor's Past Tense Linking Verb
@desc Sets what past-tense linking verb an actor wants.

    @arg actor
    @text Actor ID
    @type actor
    @desc The actor to use. None for party leader.
    @default 1
	
	@arg linkingverbpast
    @text Linking Verb (Past Tense)
    @type select
	@option was
	@option were
    @desc Link past-tense sentences with "was" or "were"? 
 eg "They were in love" vs "He was in love"
    @default were

@command SetActorPronouns
@text Set Actor's Pronouns
@desc Sets an actor's pronouns directly.

    @arg actor
    @text Actor ID
    @type actor
    @desc The actor to use. None for party leader.
    @default 1
	
	@arg subject
    @text Subject
    @type text
    @desc eg they/he/she 
 eg "They like to talk about steam trains"
    @default they
	
	@arg object
    @text Object
    @type text
    @desc eg them/him/her 
 eg "Who stole the cookie?" "It was him"
    @default them
	
	@arg possessiveD
    @text Possessive Dependent
    @type text
    @desc eg their/his/her 
 eg "This is their mug"
    @default they
	
	@arg possessiveI
    @text Possessive Independent
    @type text
    @desc eg theirs/his/hers 
 eg "Who does this mug belong to?" "It's theirs"
    @default they
	
	@arg reflexive
    @text Reflexive
    @type text
    @desc eg themself/himself/herself 
 eg "She doesn't trust herself"
    @default they
	
	@arg sforverbs
    @text Use Plural for Verbs
    @type boolean
    @desc Use the plural form for verbs? 
 eg "They live in the woods" vs "She lives in the woods"
    @default false
	
	@arg linkingverb
    @text Linking Verb
    @type select
	@option are
	@option is
    @desc Link sentences with "is" or "are"? 
 eg "They are in love" vs "He is in love"
    @default are
	
	@arg linkingverbpast
    @text Linking Verb (Past Tense)
    @type select
	@option was
	@option were
    @desc Link past-tense sentences with "was" or "were"? 
 eg "They were in love" vs "He was in love"
    @default were
	
@command ShowNameEntry
@text Show Name Entry
@desc Calls a scene that lets the user change a character's name.

    @arg actor
    @text Actor ID
    @type actor
    @desc The actor to use. None for party leader.
    @default 1
	
@command ShowNicknameEntry
@text Show Nickname Entry
@desc Calls a scene that lets the user change a character's nickname/title.

    @arg actor
    @text Actor ID
    @type actor
    @desc The actor to use. None for party leader.
    @default 1
	
@command ShowVariableEntry
@text Show Variable Entry
@desc Calls a scene that lets the user enter data into a variable.

    @arg varid
    @text Variable
    @type variable
    @desc The variable to save data to.
    @default 1
	
@command SetCharLimitName
@text Set Name Character Limit
@desc Sets the max number of characters for name entry.

    @arg max
    @text Max
    @type number
    @desc Max characters to allow?
    @default 12
	
@command SetCharLimitNick
@text Set Nickname Character Limit
@desc Sets the max number of characters for nickname entry.

    @arg max
    @text Max
    @type number
    @desc Max characters to allow?
    @default 14
	
@command SetCharLimitNoun
@text Set Pronoun Character Limit
@desc Sets the max number of characters for pronoun entry.

    @arg max
    @text Max
    @type number
    @desc Max characters to allow?
    @default 10
	
@command SetCharLimitVar
@text Set Variable Character Limit
@desc Sets the max number of characters for variable entry.

    @arg max
    @text Max
    @type number
    @desc Max characters to allow?
    @default 16

@help 
This lets you change the appearance of the Name_Input scene, and also use it 
to enter name, pronouns, nickname, or data into variables!
Use plugin commands to easily set everything up and call the scene.
If you select 0/None as the party member, then it will use the current party 
leader.
The scene is a modified version of the change name scene and thus should
support controller input.

CAUTION: If you are already using a plugin that adds keyboard support to the
change name screen (such as VisuMZ_0_CoreEngine), make sure you disable the
basic keyboard support in this plugin or you will get rather broken results!

You can use text codes to add the correct pronouns into the middle of 
dialog. They are case sensitive.
\sub[x]
\Sub[x]
\SUB[x]
Inserts actor x's subject pronoun. If x is 0, will use the party leader.
If you use a capital S then it will also start with a capital letter.
If you use all capitals then it will also be in all capitals.

\obj[x]
\Obj[x]
\OBJ[x]
Inserts actor x's object pronoun. If x is 0, will use the party leader.
If you use a capital O then it will also start with a capital letter.
If you use all capitals then it will also be in all capitals.

\pod[x]
\Pod[x]
\POD[x]
Inserts actor x's dependent possessive pronoun. 
If x is 0, will use the party leader.
If you use a capital P then it will also start with a capital letter.
If you use all capitals then it will also be in all capitals.

\poi[x]
\Poi[x]
\POI[x]
Inserts actor x's independent possessive pronoun. 
If x is 0, will use the party leader.
If you use a capital P then it will also start with a capital letter.
If you use all capitals then it will also be in all capitals.

\rfx[x]
\Rfx[x]
\RFX[x]
Inserts actor x's reflexive pronoun. If x is 0, will use the party leader.
If you use a capital R then it will also start with a capital letter.
If you use all capitals then it will also be in all capitals.

\isa[x]
\Isa[x]
\ISA[x]
Inserts actor x's linking verb (is\are). 
If x is 0, will use the party leader.
If you use a capital I then it will also start with a capital letter.
If you use all capitals then it will also be in all capitals.

\was[x]
\Was[x]
\WAS[x]
Inserts actor x's past-tense linking verb (was\were). 
If x is 0, will use the party leader.
If you use a capital W then it will also start with a capital letter.
If you use all capitals then it will also be in all capitals.

\s?[x]
\S?[x]
Inserts a single lowercase s if actor x has plural verb form on, nothing 
otherwise. If x is 0, will use the party leader.
Will be a capital S if you use a capital.

Since English is a complicated mess, sometimes you need to check if an actor
needs plural verb forms. To do this in a Conditional Branch choose Script
and copy-paste this line of code:
LyraVultur.PartyPronouns.needsPluralVerbs(x);
Make sure you change x to an actor id, or use 0 for the party leader.

MIT License - credit to "LyraVultur".
https://github.com/LyraVultur/RPGMakerPlugins/blob/main/LICENSE

Free for commercial and non-commercial use.
*/

/*~struct~PronounSet:
 * @param actorID
 * @type actor
 * @default 1
 * @desc The actor these pronouns belong to
 *
 * @param subject
 * @text Subject
 * @type text
 * @desc eg they/he/she 
 eg "They like to talk about steam trains"
 * @default they
 *
 * @param object
 * @text Object
 * @type text
 * @desc eg them/him/her 
 eg "Who stole the cookie?" "It was him"
 * @default them
 *
 * @param possessiveD
 * @text Dependent Possessive
 * @type text
 * @desc eg their/his/her 
 eg "This is their mug"
 * @default their
 *
 * @param possessiveI
 * @text Independent Possessive
 * @type text
 * @desc eg theirs/his/hers 
 eg "Who does this mug belong to?" "It's theirs"
 * @default theirs
 *
 * @param reflexive
 * @text Reflexive
 * @type text
 * @desc eg themself/himself/herself 
 eg "She doesn't trust herself"
 * @default themself
 *
 * @param sforverbs
 * @text Use Plural for Verbs
 * @type boolean
 * @desc Use the plural form for verbs? 
 eg "They live in the woods" vs "She lives in the woods"
 * @default false
 *
 * @param linkingverb
 * @text Linking Verb
 * @type select
 * @option are
 * @option is
 * @desc Link sentences with "is" or "are"? 
 eg "They are in love" vs "He is in love"
 * @default are
 *
 * @param linkingverbpast
 * @text Linking Verb (Past Tense)
 * @type select
 * @option was
 * @option were
 * @desc Link (past tense) sentences with "was" or "were"?
 eg "They were in love" vs "He was in love"
 * @default were
 */
 
var Imported = Imported || {};
Imported.Lyra_PartyPronouns = true;

var LyraVultur = LyraVultur || {};
LyraVultur.PartyPronouns = LyraVultur.PartyPronouns || {};

LyraVultur.PartyPronouns.printdebug = {};
LyraVultur.PartyPronouns.printdebug = JSON.parse(PluginManager.parameters('Lyra_PartyPronouns')['showdebug']);

LyraVultur.PartyPronouns.showinputface = true;
LyraVultur.PartyPronouns.showinputface = JSON.parse(PluginManager.parameters('Lyra_PartyPronouns')['showinputface']);
LyraVultur.PartyPronouns.showinputframes = true;
LyraVultur.PartyPronouns.showinputframes = JSON.parse(PluginManager.parameters('Lyra_PartyPronouns')['showinputframes']);
LyraVultur.PartyPronouns.showinputbacks = true;
LyraVultur.PartyPronouns.showinputbacks = JSON.parse(PluginManager.parameters('Lyra_PartyPronouns')['showinputbacks']);
LyraVultur.PartyPronouns.showinputhelp = true;
LyraVultur.PartyPronouns.showinputhelp = JSON.parse(PluginManager.parameters('Lyra_PartyPronouns')['showinputhelp']);

LyraVultur.PartyPronouns.allowblank = false;

LyraVultur.PartyPronouns.sceneQueue = new Array();
LyraVultur.PartyPronouns.sceneHintQueue = new Array();

LyraVultur.PartyPronouns.keyboard = {};
LyraVultur.PartyPronouns.keyboard = JSON.parse(PluginManager.parameters('Lyra_PartyPronouns')['namekeyboard']);
//LyraVultur.PartyPronouns.keyMapper = new Array();
LyraVultur.PartyPronouns.lastKeyCode = 0;
LyraVultur.PartyPronouns.shiftKey = false;
LyraVultur.PartyPronouns.outputTo = "";
LyraVultur.PartyPronouns.defaulttext = "";
LyraVultur.PartyPronouns.inputdescription = "";

LyraVultur.PartyPronouns.maxcharsname = Number(PluginManager.parameters('Lyra_PartyPronouns')['maxcharsname']);
LyraVultur.PartyPronouns.maxcharsnick = Number(PluginManager.parameters('Lyra_PartyPronouns')['maxcharsnick']);
LyraVultur.PartyPronouns.maxcharsnoun = Number(PluginManager.parameters('Lyra_PartyPronouns')['maxcharsnoun']);
LyraVultur.PartyPronouns.maxcharsvar = Number(PluginManager.parameters('Lyra_PartyPronouns')['maxcharsvar']);

LyraVultur.PartyPronouns.defaults = {};
LyraVultur.PartyPronouns.parseddefaults = new Array();
LyraVultur.PartyPronouns.defaults = JSON.parse(PluginManager.parameters('Lyra_PartyPronouns')['defaultpronouns']);

//Keyboard support init (if enabled)
/* LyraVultur.PartyPronouns.extendKeySupport = function() {
	if (LyraVultur.PartyPronouns.keyboard) {
		LyraVultur.PartyPronouns.keyMapper[32] = "pp_space";
		LyraVultur.PartyPronouns.keyMapper[8] = "pp_backspace";
		
		LyraVultur.PartyPronouns.keyMapper[48] = "pp_0";
		LyraVultur.PartyPronouns.keyMapper[49] = "pp_1";
		LyraVultur.PartyPronouns.keyMapper[50] = "pp_2";
		LyraVultur.PartyPronouns.keyMapper[51] = "pp_3";
		LyraVultur.PartyPronouns.keyMapper[52] = "pp_4";
		LyraVultur.PartyPronouns.keyMapper[53] = "pp_5";
		LyraVultur.PartyPronouns.keyMapper[54] = "pp_6";
		LyraVultur.PartyPronouns.keyMapper[55] = "pp_7";
		LyraVultur.PartyPronouns.keyMapper[56] = "pp_8";
		LyraVultur.PartyPronouns.keyMapper[57] = "pp_9";
		
		for (let i = 0; i < 26; i++) {
			LyraVultur.PartyPronouns.keyMapper[65 + i] = "pp_" + String.fromCharCode(65 + i);
		}
		
		if (Utils.isOptionValid('test') && LyraVultur.PartyPronouns.printdebug) {
			console.log("[PartyPronouns] Modified Input.keymapper:");
			console.log(Input.keyMapper);
		}
	}
	else {
		if (Utils.isOptionValid('test') && LyraVultur.PartyPronouns.printdebug) {
			console.log("[PartyPronouns] Didn't modify Input.keymapper:");
			console.log(Input.keyMapper);
		}
	}
}
LyraVultur.PartyPronouns.extendKeySupport(); */

//Extract arrays
LyraVultur.PartyPronouns.parseDefaultPronouns = function() {
	var input = LyraVultur.PartyPronouns.defaults;
	//var data = [];
	
	input.forEach((data) => {
		let result = JSON.parse(data);
		LyraVultur.PartyPronouns.parseddefaults.push(result);
	});
	
	//console.log(LyraVultur.PartyPronouns.defaults);
	if (Utils.isOptionValid('test') && LyraVultur.PartyPronouns.printdebug) {
		console.log("[PartyPronouns] Default pronouns:");
		console.log(LyraVultur.PartyPronouns.parseddefaults);
	}
	
	return;
};
LyraVultur.PartyPronouns.parseDefaultPronouns();

//==========Command binds
PluginManager.registerCommand('Lyra_PartyPronouns', 'ShowPronounEntry', args => {
	const arg0 = JSON.parse(args.actor);
	const arg1 = String(args.msgobj);
	const arg2 = String(args.msgsub);
	const arg3 = String(args.msgposd);
	const arg4 = String(args.msgposi);
	const arg5 = String(args.msgrfx);
	
	LyraVultur.PartyPronouns.sceneHintQueue = [arg2, arg1, arg3, arg4, arg5];
	
	LyraVultur.PartyPronouns.showPronounScene(arg0, "all")
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'ShowSinglePronounEntry', args => {
	const arg0 = JSON.parse(args.actor);
	const arg1 = String(args.noun);
	
	const actor = arg0 >= 1 ? $gameActors.actor(arg0) : $gameParty.leader();
	switch (arg1) {
		case "subject":
		LyraVultur.PartyPronouns.defaulttext = actor.getPronounSubject();
		break;
		
		case "object":
		LyraVultur.PartyPronouns.defaulttext = actor.getPronounObject();
		break;
		
		case "possessiveD":
		LyraVultur.PartyPronouns.defaulttext = actor.getPronounPossessiveD();
		break;
		
		case "possessiveI":
		LyraVultur.PartyPronouns.defaulttext = actor.getPronounPossessiveI();
		break;
		
		case "reflexive":
		LyraVultur.PartyPronouns.defaulttext = actor.getPronounReflexive();
		break;
	}
	
	LyraVultur.PartyPronouns.showPronounScene(arg0, arg1)
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'ShowNameEntry', args => {
	const arg0 = Number(args.actor);
	
	LyraVultur.PartyPronouns.defaulttext = "";
	LyraVultur.PartyPronouns.showNameScene(arg0, LyraVultur.PartyPronouns.showinputface, LyraVultur.PartyPronouns.maxcharsname)
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'ShowNicknameEntry', args => {
	const arg0 = Number(args.actor);
	
	const actor = arg0 >= 1 ? $gameActors.actor(arg0) : $gameParty.leader();
	LyraVultur.PartyPronouns.defaulttext = actor._nickname;
	LyraVultur.PartyPronouns.outputTo = "nickname";
	LyraVultur.PartyPronouns.showNameScene(arg0, LyraVultur.PartyPronouns.showinputface, LyraVultur.PartyPronouns.maxcharsname)
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'ShowVariableEntry', args => {
	const arg0 = Number(args.varid);
	
	let finalvar = arg0;
	finalvar = Math.max(0, finalvar);
	LyraVultur.PartyPronouns.varWriteTo = finalvar;
	
	LyraVultur.PartyPronouns.defaulttext = $gameVariables.value(finalvar);
	LyraVultur.PartyPronouns.outputTo = "variable";
	LyraVultur.PartyPronouns.showNameScene(0, LyraVultur.PartyPronouns.showinputface, LyraVultur.PartyPronouns.maxcharsvar)
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'SetActorPronouns', args => {
	const arg0 = Number(args.actor);
	const arg1 = String(args.subject);
	const arg2 = String(args.object);
	const arg3 = String(args.possessiveD);
	const arg4 = String(args.possessiveI);
	const arg5 = String(args.reflexive);
	const arg6 = Boolean(args.sforverbs);
	const arg7 = String(args.linkingverb);
	const arg8 = String(args.linkingverbpast);
	
	LyraVultur.PartyPronouns.setAllPronouns(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8)
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'SetActorPluralVerbUsage', args => {
	const arg0 = JSON.parse(args.actor);
	const arg1 = JSON.parse(args.sforverbs);
	
	const actor = arg0 >= 1 ? $gameActors.actor(arg0) : $gameParty.leader();
	actor.setPronounVerbS(arg1);
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'SetActorLinkingVerb', args => {
	const arg0 = JSON.parse(args.actor);
	const arg1 = String(args.linkingverb);
	
	const actor = arg0 >= 1 ? $gameActors.actor(arg0) : $gameParty.leader();
	actor.setPronounVerbLink(arg1);
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'SetActorLinkingVerbPast', args => {
	const arg0 = JSON.parse(args.actor);
	const arg1 = String(args.linkingverbpast);
	
	const actor = arg0 >= 1 ? $gameActors.actor(arg0) : $gameParty.leader();
	actor.setPronounVerbLinkPast(arg1);
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'InputSceneSettings', args => {
	const arg0 = JSON.parse(args.useface);
	const arg1 = JSON.parse(args.usehelp);
	const arg2 = JSON.parse(args.usebacks);
	const arg3 = JSON.parse(args.useframes);
	const arg4 = JSON.parse(args.canbeblank);
	
	LyraVultur.PartyPronouns.showinputface = arg0;
	LyraVultur.PartyPronouns.showinputhelp = arg1;
	LyraVultur.PartyPronouns.showinputbacks = arg2;
	LyraVultur.PartyPronouns.showinputframes = arg3;
	LyraVultur.PartyPronouns.allowblank = arg4;
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'InputSceneDescription', args => {
	const arg0 = String(args.desc);
	
	LyraVultur.PartyPronouns.inputdescription = arg0;
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'SetCharLimitName', args => {
	const arg0 = Number(args.max);
	LyraVultur.PartyPronouns.maxcharsname = Math.max(1, arg0);
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'SetCharLimitNick', args => {
	const arg0 = Number(args.max);
	LyraVultur.PartyPronouns.maxcharsnick = Math.max(1, arg0);
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'SetCharLimitNoun', args => {
	const arg0 = Number(args.max);
	LyraVultur.PartyPronouns.maxcharsnoun = Math.max(1, arg0);
});

PluginManager.registerCommand('Lyra_PartyPronouns', 'SetCharLimitVar', args => {
	const arg0 = Number(args.max);
	LyraVultur.PartyPronouns.maxcharsvar = Math.max(1, arg0);
});

//==========General
LyraVultur.PartyPronouns.showPronounScene = function(actid, output) {
	const actor = actid >= 1 ? $gameActors.actor(actid) : $gameParty.leader();
	
	if (output != "all") {
		LyraVultur.PartyPronouns.outputTo = output;
		SceneManager.push(Scene_Name);
		SceneManager.prepareNextScene(actor._actorId, LyraVultur.PartyPronouns.maxcharsnoun);
	}
	else {
		LyraVultur.PartyPronouns.sceneQueue = ["object", "possessiveD", "possessiveI", "reflexive"];
		
		LyraVultur.PartyPronouns.outputTo = "subject";
		LyraVultur.PartyPronouns.defaulttext = actor.getPronounSubject();
		LyraVultur.PartyPronouns.inputdescription = LyraVultur.PartyPronouns.sceneHintQueue.shift();
		SceneManager.push(Scene_Name);
		SceneManager.prepareNextScene(actor._actorId, LyraVultur.PartyPronouns.maxcharsnoun);
	}
}

LyraVultur.PartyPronouns.showNameScene = function(actid, face, maxchars, border, backs) {
	const actor = actid >= 1 ? $gameActors.actor(actid) : $gameParty.leader();
	
	SceneManager.push(Scene_Name);
	SceneManager.prepareNextScene(actor._actorId, maxchars);
}

LyraVultur.PartyPronouns.showVariableScene = function(actid, output) {
	const actor = actid >= 1 ? $gameActors.actor(actid) : $gameParty.leader();
	
	LyraVultur.PartyPronouns.outputTo = output;
	SceneManager.push(Scene_Name);
	SceneManager.prepareNextScene(actor._actorId, maxchars);
}

LyraVultur.PartyPronouns.setAllPronouns = function(actid, sub, obj, pod, poi, rfx, sv, lv, lvp) { 
	const actor = actid >= 1 ? $gameActors.actor(actid) : $gameParty.leader();
	
	actor.setPronounSubject(sub);
	actor.setPronounObject(obj);
	actor.setPronounPossessiveD(pod);
	actor.setPronounPossessiveI(poi);
	actor.setPronounReflexive(rfx);
	actor.setPronounVerbS(sv);
	actor.setPronounVerbLink(lv);
	actor.setPronounVerbLinkPast(lvp);
}

LyraVultur.PartyPronouns.needsPluralVerbs = function(actid) { 
	const actor = actid >= 1 ? $gameActors.actor(actid) : $gameParty.leader();
	
	return actor.getPronounVerbS();
}

//==========Game_Actor stuff
Game_Actor.prototype.setupRoot = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actid) {
	this._pnSubject = "";
	this._pnObject = "";
	this._pnPossessiveD = "";
	this._pnPossessiveI = "";
	this._pnReflexive = "";
	this._pnVerbS = false;
	this._pnVerbLink = "";
	this._pnVerbLinkPast = "";
	
	this.setupRoot(actid);
	
	var lookfor = this._actorId;
	var index = LyraVultur.PartyPronouns.parseddefaults.findIndex(obj => {
		return Number(obj.actorID) === Number(lookfor);
	});
	
	if (LyraVultur.PartyPronouns.parseddefaults.length > 0 && index > -1) {
		if (Utils.isOptionValid('test') && LyraVultur.PartyPronouns.printdebug) {
			console.log(this._name + " loaded default pronouns.");
		}
		
		this._pnSubject = LyraVultur.PartyPronouns.parseddefaults[index].subject;
		this._pnObject = LyraVultur.PartyPronouns.parseddefaults[index].object;
		this._pnPossessiveD = LyraVultur.PartyPronouns.parseddefaults[index].possessiveD;
		this._pnPossessiveI = LyraVultur.PartyPronouns.parseddefaults[index].possessiveI;
		this._pnReflexive = LyraVultur.PartyPronouns.parseddefaults[index].reflexive;
		this._pnVerbS = LyraVultur.PartyPronouns.parseddefaults[index].sforverbs;
		this._pnVerbLink = LyraVultur.PartyPronouns.parseddefaults[index].linkingverb;
		this._pnVerbLinkPast = LyraVultur.PartyPronouns.parseddefaults[index].linkingverbpast;
	}
	else {
		if (Utils.isOptionValid('test') && LyraVultur.PartyPronouns.printdebug) {
			console.log(this._name + " failed to load default pronouns!");
		}
	}
}

//Game_Actor Subject
Game_Actor.prototype.setPronounSubject = function(text) {
	this._pnSubject = text.trim().toLowerCase();
}

Game_Actor.prototype.getPronounSubject = function(caps) {
	return caps ? this._pnSubject.charAt(0).toUpperCase() + this._pnSubject.substr(1) : this._pnSubject;
}

//Game_Actor Object
Game_Actor.prototype.setPronounObject = function(text) {
	this._pnObject = text.trim().toLowerCase();
}

Game_Actor.prototype.getPronounObject = function(caps) {
	return caps ? this._pnObject.charAt(0).toUpperCase() + this._pnObject.substr(1) : this._pnObject;
}

//Game_Actor Possessive D
Game_Actor.prototype.setPronounPossessiveD = function(text) {
	this._pnPossessiveD = text.trim().toLowerCase();
}

Game_Actor.prototype.getPronounPossessiveD = function(caps) {
	return caps ? this._pnPossessiveD.charAt(0).toUpperCase() + this._pnPossessiveD.substr(1) : this._pnPossessiveD;
}

//Game_Actor Possessive I
Game_Actor.prototype.setPronounPossessiveI = function(text) {
	this._pnPossessiveI = text.trim().toLowerCase();
}

Game_Actor.prototype.getPronounPossessiveI = function(caps) {
	return caps ? this._pnPossessiveI.charAt(0).toUpperCase() + this._pnPossessiveI.substr(1) : this._pnPossessiveI;
}

//Game_Actor Reflexive
Game_Actor.prototype.setPronounReflexive = function(text) {
	this._pnReflexive = text.trim().toLowerCase();
}

Game_Actor.prototype.getPronounReflexive = function(caps) {
	return caps ? this._pnReflexive.charAt(0).toUpperCase() + this._pnReflexive.substr(1) : this._pnReflexive;
}

//Game_Actor VerbS
Game_Actor.prototype.setPronounVerbS = function(text) {
	this._pnVerbS = text;
}

Game_Actor.prototype.getPronounVerbS = function() {
	return this._pnVerbS === true ? "s" : "";
}

//Game_Actor Verb Link
Game_Actor.prototype.setPronounVerbLink = function(text) {
	this._pnVerbLink = text.trim().toLowerCase();
}

Game_Actor.prototype.getPronounVerbLink = function(caps) {
	return caps ? this._pnVerbLink.charAt(0).toUpperCase() + this._pnVerbLink.substr(1) : this._pnVerbLink;
}

//Game_Actor Verb Link Past Tense
Game_Actor.prototype.setPronounVerbLinkPast = function(text) {
	this._pnVerbLinkPast = text.trim().toLowerCase();
}

Game_Actor.prototype.getPronounVerbLinkPast = function(caps) {
	return caps ? this._pnVerbLinkPast.charAt(0).toUpperCase() + this._pnVerbLinkPast.substr(1) : this._pnVerbLinkPast;
}

//==========Scene_Name overrides
//Scene_Name now handles 0 as party leader!
Scene_Name.prototype.prepareRoot = Scene_Name.prototype.prepare;
Scene_Name.prototype.prepare = function(actorId, maxLength) {
	const actor = actorId >= 1 ? $gameActors.actor(actorId) : $gameParty.leader();
	
	this._useFace = LyraVultur.PartyPronouns.showinputface;
	this._showFrames = LyraVultur.PartyPronouns.showinputframes;
	this._showWindowBacks = LyraVultur.PartyPronouns.showinputbacks;
	this._showHelp = LyraVultur.PartyPronouns.showinputhelp;
	
	Scene_Name.prototype.prepareRoot(actor._actorId, maxLength);
};

//Make sure we add our new properties
Scene_Name.prototype.initializeRoot = Scene_Name.prototype.initialize;
Scene_Name.prototype.initialize = function() {
	this._useFace = true;
	this._showHelp = true;
	this._showFrames = true;
	this._showWindowBacks = true;
	
    Scene_Name.prototype.initializeRoot();
};

Scene_Name.prototype.createEditWindowRoot = Scene_Name.prototype.createEditWindow;
Scene_Name.prototype.createEditWindow = function() {
    const rect = this.editWindowRect();
    this._editWindow = new Window_NameEdit(rect);
    this._editWindow.setup(this._actor, this._maxLength, this._useFace, this._showFrames);
    this.addWindow(this._editWindow);
};

//Catch if we are in pronoun mode and handle it
Scene_Name.prototype.onInputOkRoot = Scene_Name.prototype.onInputOk;
Scene_Name.prototype.onInputOk = function() {
	if (LyraVultur.PartyPronouns.outputTo !== "") {
		switch (LyraVultur.PartyPronouns.outputTo) {
			case "object":
			this._actor.setPronounObject(this._editWindow.name());
			break;
			
			case "subject":
			this._actor.setPronounSubject(this._editWindow.name());
			break;
			
			case "possessiveI":
			this._actor.setPronounPossessiveI(this._editWindow.name());
			break;
			
			case "possessiveD":
			this._actor.setPronounPossessiveD(this._editWindow.name());
			break;
			
			case "reflexive":
			this._actor.setPronounReflexive(this._editWindow.name());
			break;
			
			case "verbs":
			this._actor.setPronounVerbS(this._editWindow.name());
			break;
			
			case "join":
			this._actor.setPronounVerbLink(this._editWindow.name());
			break;
			
			case "joinpast":
			this._actor.setPronounVerbLinkPast(this._editWindow.name());
			break;
			
			case "nickname":
			this._actor.setNickname(this._editWindow.name());
			break;
			
			case "variable":
			$gameVariables.setValue(LyraVultur.PartyPronouns.varWriteTo, this._editWindow.name());
			break;
			
			default:
			if (Utils.isOptionValid('test') && LyraVultur.PartyPronouns.printdebug) {
				console.log("Output to: " + LyraVultur.PartyPronouns.outputTo);
				console.log("[PartyPronouns] didn't understand mode, doing default");
			}
			this._actor.setName(this._editWindow.name());
		}
		
		LyraVultur.PartyPronouns.outputTo = "";
		
		if (LyraVultur.PartyPronouns.sceneQueue.length > 0) {	
			LyraVultur.PartyPronouns.outputTo = LyraVultur.PartyPronouns.sceneQueue.shift();
			LyraVultur.PartyPronouns.inputdescription = LyraVultur.PartyPronouns.sceneHintQueue.shift();
			this._inputWindow._page = 0;
			this._inputWindow._index = 0;
			
			switch (LyraVultur.PartyPronouns.outputTo) {
				case "object":
				this._editWindow._name = this._actor.getPronounObject();
				break;
				
				case "subject":
				this._editWindow._name = this._actor.getPronounSubject();
				break;
				
				case "possessiveI":
				this._editWindow._name = this._actor.getPronounPossessiveI();
				break;
				
				case "possessiveD":
				this._editWindow._name = this._actor.getPronounPossessiveD();
				break;
				
				case "reflexive":
				this._editWindow._name = this._actor.getPronounReflexive();
				break;
			}
			
			this._editWindow._index = this._editWindow._name.length;
			this._editWindow._defaultName = this._editWindow._name;
			
			this._inputWindow.updateCursor();
			this._editWindow.refresh();
			this._inputWindow.refresh();
			
			if (Utils.isOptionValid('test') && LyraVultur.PartyPronouns.printdebug) {
				console.log("[PartyPronouns] Queued inputs:");
				console.log(LyraVultur.PartyPronouns.sceneQueue);
			}
		}
		else {
			LyraVultur.PartyPronouns.defaulttext = "";
			this.popScene();
		}
	}
	else {
		//default behaviour
		if (Utils.isOptionValid('test') && LyraVultur.PartyPronouns.printdebug) {
			console.log(LyraVultur.PartyPronouns.outputTo);
			console.log("[PartyPronouns] input mode was undefined! ignoring..");
		}
		this.onInputOkRoot();
	}
};

Scene_Name.prototype.createInputWindowRoot = Scene_Name.prototype.createInputWindow;
Scene_Name.prototype.createInputWindow = function() {
    this.createInputWindowRoot();
	//this._inputWindow._backSprite = null;
	//console.log(this._inputWindow);
	this._inputWindow.frameVisible = this._showFrames;
	
	//console.log(this);
};

Scene_Name.prototype.startRoot = Scene_Name.prototype.start;
Scene_Name.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._editWindow.refresh();
	
	this._buttonAssistWindow.frameVisible = this._showFrames;
	this._buttonAssistWindow._openness = this._showHelp ? 255 : 0;
	let trans = this._showWindowBacks ? 255 : 0;
	this._inputWindow.opacity = trans;
	this._editWindow.opacity = trans;
	this._buttonAssistWindow.opacity = trans;
};

//==========Window_NameInput handling
Window_NameInput.prototype.processHandlingRoot = Window_NameInput.prototype.processHandling;
Window_NameInput.prototype.processHandling = function() {
	if (LyraVultur.PartyPronouns.keyboard == true) {
		let keyid = LyraVultur.PartyPronouns.lastKeyCode;
		
		if (this.isOpen() && this.active) {
			if (Input.isTriggered("tab")) {
				this.processJump();
				//console.log(Input._currentState);
			}
			/* if (Input.isTriggered("pp_backspace")) {
				this.processBack();
			} */
			if (Input.isTriggered("ok") && (keyid < 65 || keyid > 90) && keyid != 32) {
				this.processOk();
			}
			
			//console.log(keyid);
			
			if (keyid == 8) {
				this.processBack();
				LyraVultur.PartyPronouns.lastKeyCode = 0;
			}
			
			//space
			if (keyid == 32) {
				if (this._editWindow.add(" ")) {
					this.playOkSound();
				} else {
					this.playBuzzerSound();
				}
				
				LyraVultur.PartyPronouns.lastKeyCode = 0;
			}
			
			//alphabet
			if (keyid >= 65 && keyid <= 90) {
				let alpha = String.fromCharCode(keyid);
				if (LyraVultur.PartyPronouns.shiftKey == false) {
					alpha = alpha.toLowerCase();
				}
				
				if (this._editWindow.add(alpha)) {
					this.playOkSound();
				} else {
					this.playBuzzerSound();
				}
				
				LyraVultur.PartyPronouns.lastKeyCode = 0;
			}
			
			//numbers
			if (keyid >= 48 && keyid <= 57) {
				let alpha = String.fromCharCode(keyid);
				if (LyraVultur.PartyPronouns.shiftKey == true) {
					switch (keyid) {
						case 49:
							alpha = "!";
						break;
						case 50:
							alpha = "@";
						break;
						case 51:
							alpha = "#";
						break;
						case 52:
							alpha = "$";
						break;
						case 53:
							alpha = "%";
						break;
						case 54:
							alpha = "^";
						break;
						case 55:
							alpha = "&";
						break;
						case 56:
							alpha = "*";
						break;
						case 57:
							alpha = "(";
						break;
						default:
							alpha = ")";
					}
				}
				
				if (this._editWindow.add(alpha)) {
					this.playOkSound();
				} else {
					this.playBuzzerSound();
				}
				
				LyraVultur.PartyPronouns.lastKeyCode = 0;
			}
		}
	}
	else {
		this.processHandlingRoot();
	}
};

Window_NameInput.prototype.cursorPagedownRoot = Window_NameInput.prototype.cursorPagedown;
Window_NameInput.prototype.cursorPagedown = function() {
	if (LyraVultur.PartyPronouns.keyboard == true) {
		if (LyraVultur.PartyPronouns.lastKeyCode == 34 || 13) {
			this._page = (this._page + 1) % this.table().length;
			this.refresh();
		}
	}
	else {
		this.cursorPagedownRoot();
	}
};

Window_NameInput.prototype.cursorPageupRoot = Window_NameInput.prototype.cursorPageup;
Window_NameInput.prototype.cursorPageup = function() {
	if (LyraVultur.PartyPronouns.keyboard == true) {
		if (LyraVultur.PartyPronouns.lastKeyCode == 33 || 13) {
			this._page = (this._page + this.table().length - 1) % this.table().length;
			this.refresh();
		}
	}
	else {
		this.cursorPageupRoot();
	}
};

Window_NameInput.prototype.onNameOkRoot = Window_NameInput.prototype.onNameOk;
Window_NameInput.prototype.onNameOk = function() {
    if (this._editWindow.name() === "" && LyraVultur.PartyPronouns.allowblank == false) {
        if (this._editWindow.restoreDefault()) {
            this.playOkSound();
        } else {
            this.playBuzzerSound();
        }
    } else {
        this.playOkSound();
        this.callOkHandler();
    }
};

//==========Window_NameEdit overrides
Window_NameEdit.prototype.faceWidthRoot = Window_NameEdit.prototype.faceWidth;
Window_NameEdit.prototype.faceWidth = function() {
    return this._useFace ? 144 : 0;
};

Window_NameEdit.prototype.initializeRoot = Window_NameEdit.prototype.initialize;
Window_NameEdit.prototype.initialize = function(rect) {
	if (LyraVultur.PartyPronouns.keyboard) {
		Window_StatusBase.prototype.initialize.call(this, rect);
		this._actor = null;
		this._maxLength = 0;
		this._name = "";
		this._index = 0;
		this._defaultName = 0;
		this._useFace = true;
		this.deactivate();
	}
	else {
		Window_NameEdit.prototype.initializeRoot(rect);
	}
};

Window_NameEdit.prototype.setupRoot = Window_NameEdit.prototype.setup;
Window_NameEdit.prototype.setup = function(actor, maxLength, face, showframes) {
    //Window_NameEdit.prototype.setupRoot(actor, maxLength);
	
	this._actor = actor;
    this._maxLength = maxLength;
	if (LyraVultur.PartyPronouns.defaulttext == "" && LyraVultur.PartyPronouns.outputTo != "nickname") {
		this._name = actor.name().slice(0, this._maxLength);
	}
	else {
		this._name = LyraVultur.PartyPronouns.defaulttext.slice(0, this._maxLength);
	}
    this._index = this._name.length;
    this._defaultName = this._name;
    ImageManager.loadFace(actor.faceName());
	
	this._useFace = face;
	this.frameVisible = showframes;
};

Window_NameEdit.prototype.refreshRoot = Window_NameEdit.prototype.refresh;
Window_NameEdit.prototype.refresh = function() {
	this.contents.clear();
	if (this._useFace) {
		this.drawActorFace(this._actor, 0, 0);
	}
	this.drawDesc(LyraVultur.PartyPronouns.inputdescription);
	for (let i = 0; i < this._maxLength; i++) {
		this.drawUnderline(i);
	}
	for (let j = 0; j < this._name.length; j++) {
		this.drawChar(j);
	}
	const rect = this.itemRect(this._index);
	this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};

Window_NameEdit.prototype.drawDesc = function(text) {
    this.resetTextColor();
	let horz = Math.floor(this._width / 2) - (this.contents.measureTextWidth(text) / 2);
	let vert = Math.floor(this.lineHeight() / 2);
    this.drawText(text, horz, vert, 'center');
};

//==========Input catching
Input._onKeyDownRoot = Input._onKeyDown;
Input._onKeyDown = function(event) {
	if (LyraVultur.PartyPronouns.keyboard == true) {
		if (this._shouldPreventDefault(event.keyCode)) {
			event.preventDefault();
		}
		if (event.keyCode === 144) {
			// Numlock
			this.clear();
		}
		const buttonName = this.keyMapper[event.keyCode];
		if (buttonName) {
			this._currentState[buttonName] = true;
		}
		
		LyraVultur.PartyPronouns.shiftKey = event.shiftKey;
		LyraVultur.PartyPronouns.lastKeyCode = event.keyCode;
	}
	else {
		Input._onKeyDownRoot(event);
	}
};

Input._onKeyUpRoot = Input._onKeyUp;
Input._onKeyUp = function(event) {
    const buttonName = this.keyMapper[event.keyCode];
    if (buttonName) {
        this._currentState[buttonName] = false;
    }
	
	LyraVultur.PartyPronouns.shiftKey = event.shiftKey;
	//LyraVultur.PartyPronouns.lastKeyCode = event.keyCode;
};

//==========Escape codes
Window_Base.prototype.convertEscapeCharactersRoot = Window_Base.prototype.convertEscapeCharacters;
Window_Base.prototype.convertEscapeCharacters = function(text) {
	let newtext = text;
	
	//sub[n]
	newtext = newtext.replace(/\\(?:sub)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounSubject(parseInt(p1), false)
    );
	
	//Sub[n]
	newtext = newtext.replace(/\\(?:Sub)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounSubject(parseInt(p1), true)
    );
	
	//SUB[n]
	newtext = newtext.replace(/\\(?:SUB)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounSubject(parseInt(p1), false).toUpperCase()
    );
	
	//obj[n]
	newtext = newtext.replace(/\\(?:obj)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounObject(parseInt(p1), false)
    );
	
	//Obj[n]
	newtext = newtext.replace(/\\(?:Obj)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounObject(parseInt(p1), true)
    );
	
	//OBJ[n]
	newtext = newtext.replace(/\\(?:OBJ)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounObject(parseInt(p1), false).toUpperCase()
    );
	
	//pod[n]
	newtext = newtext.replace(/\\(?:pod)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounPossessiveDependent(parseInt(p1), false)
    );
	
	//Pod[n]
	newtext = newtext.replace(/\\(?:Pod)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounPossessiveDependent(parseInt(p1), true)
    );
	
	//POD[n]
	newtext = newtext.replace(/\\(?:POD)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounPossessiveDependent(parseInt(p1), false).toUpperCase()
    );
	
	//poi[n]
	newtext = newtext.replace(/\\(?:poi)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounPossessiveIndependent(parseInt(p1), false)
    );
	
	//Poi[n]
	newtext = newtext.replace(/\\(?:Poi)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounPossessiveIndependent(parseInt(p1), true)
    );
	
	//POI[n]
	newtext = newtext.replace(/\\(?:POI)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounPossessiveIndependent(parseInt(p1), false).toUpperCase()
    );
	
	//rfx[n]
	newtext = newtext.replace(/\\(?:rfx)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounReflexive(parseInt(p1), false)
    );
	
	//Rfx[n]
	newtext = newtext.replace(/\\(?:Rfx)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounReflexive(parseInt(p1), true)
    );
	
	//RFX[n]
	newtext = newtext.replace(/\\(?:RFX)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounReflexive(parseInt(p1), false).toUpperCase()
    );
	
	//s?[n]
	newtext = newtext.replace(/\\(?:s\?)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounPluralS(parseInt(p1))
    );
	
	//S?[n]
	newtext = newtext.replace(/\\(?:S\?)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounPluralS(parseInt(p1)).toUpperCase()
    );
	
	//isa[n]
	newtext = newtext.replace(/\\(?:isa)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounLinkingVerb(parseInt(p1), false)
    );
	
	//Isa[n]
	newtext = newtext.replace(/\\(?:Isa)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounLinkingVerb(parseInt(p1), true)
    );
	
	//ISA[n]
	newtext = newtext.replace(/\\(?:ISA)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounLinkingVerb(parseInt(p1), false).toUpperCase()
    );
	
	//was[n]
	newtext = newtext.replace(/\\(?:was)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounLinkingVerbPast(parseInt(p1), false)
    );
	
	//Was[n]
	newtext = newtext.replace(/\\(?:Was)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounLinkingVerbPast(parseInt(p1), true)
    );
	
	//WAS[n]
	newtext = newtext.replace(/\\(?:WAS)\[(\d+)\]/g, (_, p1) =>
        LyraVultur.PartyPronouns.getPronounLinkingVerbPast(parseInt(p1), false).toUpperCase()
    );
	
	//do base escape codes
	return this.convertEscapeCharactersRoot(newtext);
};

LyraVultur.PartyPronouns.getPronounSubject = function(n, caps) {
    const actor = n >= 1 ? $gameActors.actor(n) : $gameParty.leader();
	return actor.getPronounSubject(caps);
};

LyraVultur.PartyPronouns.getPronounObject = function(n, caps) {
    const actor = n >= 1 ? $gameActors.actor(n) : $gameParty.leader();
	return actor.getPronounObject(caps);
};

LyraVultur.PartyPronouns.getPronounPossessiveDependent = function(n, caps) {
    const actor = n >= 1 ? $gameActors.actor(n) : $gameParty.leader();
	return actor.getPronounPossessiveD(caps);
};

LyraVultur.PartyPronouns.getPronounPossessiveIndependent = function(n, caps) {
    const actor = n >= 1 ? $gameActors.actor(n) : $gameParty.leader();
	return actor.getPronounPossessiveI(caps);
};

LyraVultur.PartyPronouns.getPronounReflexive = function(n, caps) {
    const actor = n >= 1 ? $gameActors.actor(n) : $gameParty.leader();
	return actor.getPronounReflexive(caps);
};

LyraVultur.PartyPronouns.getPronounPluralS = function(n) {
    const actor = n >= 1 ? $gameActors.actor(n) : $gameParty.leader();
    return actor.getPronounVerbS();
};

LyraVultur.PartyPronouns.getPronounLinkingVerb = function(n, caps) {
    const actor = n >= 1 ? $gameActors.actor(n) : $gameParty.leader();
	return actor.getPronounVerbLink(caps);
};

LyraVultur.PartyPronouns.getPronounLinkingVerbPast = function(n, caps) {
    const actor = n >= 1 ? $gameActors.actor(n) : $gameParty.leader();
	return actor.getPronounVerbLinkPast(caps);
};