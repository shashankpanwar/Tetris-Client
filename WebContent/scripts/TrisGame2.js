//------------------------------------
// Constants
//------------------------------------

var inGameSecond = false;

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
// TrisGame.js -------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// ------------------------------------
// Constants
// ------------------------------------
var EXTENSION_NAME = "tris";
var BOARD_SIZE = 300;
var BOARD_BORDER = 8;
var PIECE_SIZE = 36;
var FPS = 40;

// ------------------------------------
// Vars
// ------------------------------------
var initedSecond = false;
var canvasSecond;
var stageSecond;
var boardSecond;
var squaresSecond = [];

var p1NameContSecond;
var p2NameContSecond;

var statusTFSecond;

var disablerSecond;
var currentPopUpSecond;

var gameStartedSecond = false;
var iAmSpectatorSecond = false;

var whoseTurnSecond;
var player1IdSecond;
var player2IdSecond;
var player1NameSecond;
var player2NameSecond;

/**
 * Initialize the game
 */
function initGameSecond()
{
	 console.log("#$#$#$#$#$#$#$#$  initGameSecond() @#@#@#@#@#@#@#@#");
	if (initedSecond == false)
	{
		initedSecond = true;

		// Stage
		canvasSecond = document.getElementById("gameContainer2");
		stageSecond = new createjs.Stage(canvasSecond);
		stageSecond.mouseEventsEnabled = true;

		// Ticker
		createjs.Ticker.setFPS(FPS);

		// Board
		buildGameUISecond();
	}

	createjs.Ticker.addListener(tickSecond);

	gameStartedSecond = false;


	resetGameBoardSecond();

	// Setup my properties
	iAmSpectatorSecond = (sfs.mySelf.getPlayerId(sfs.lastJoinedRoom) == -1);

	// Show "wait" message
	var message = "Waiting for player " + ((sfs.mySelf.getPlayerId(sfs.lastJoinedRoom) == 1) ? "2" : "1")

	if (iAmSpectatorSecond == false)
		showGamePopUpSecond("wait", message);

	// Tell extension I'm ready to play
	sfs.send(new SFS2X.ExtensionRequest("ready", null, sfs.lastJoinedRoom) )
}

/**
 * Add game's elements to the canvas
 */
function buildGameUISecond()
{
	// --------------------------
	// Board
	// --------------------------
	boardSecond = new createjs.Container();

	// Background
	var boardBG = new createjs.Shape();
		boardBG.graphics.beginFill("#FFFFFF");
		boardBG.graphics.drawRect(0, 0, BOARD_SIZE, BOARD_SIZE);
		boardBG.width = boardBG.height = BOARD_SIZE;
		boardBG.cache(0, 0, boardBG.width, boardBG.height);

	boardSecond.addChild(boardBG);

	// Squares
	// We use BitmapAnimation for the pieces as we aren't going to add childs to
	// them
	var pieceSS = new createjs.SpriteSheet({
											images:["images/ballSS.png"],
											frames: {
													regX: 0,
													regY: 0,
													height: 36,
													width: 36,
													count: 3,
												}
										   });
	
	var pieceShadow = new createjs.Shadow("#666666", 2, 3, 5);
	var sqSize = (BOARD_SIZE - (BOARD_BORDER * 4)) / 3;
	
	for (var i = 0; i < 9; i++)
	{
		var square = new createjs.Container();
		
		square.x = i % 3 * (sqSize + BOARD_BORDER) + BOARD_BORDER;
		square.y = Math.floor(i / 3) * (sqSize + BOARD_BORDER) + BOARD_BORDER;

		var sqBG = new createjs.Shape();
			sqBG.graphics.beginFill("#F1F0DA");
			sqBG.graphics.drawRect(0, 0, sqSize, sqSize);

		// Piece
		// 0 - no piece
		// 1 - green piece
		// 2 - red piece
		square.ball = new createjs.BitmapAnimation(pieceSS);
		square.ball.gotoAndStop(0);
		square.ball.width = square.ball.height = PIECE_SIZE;
		square.ball.x = sqSize / 2 - square.ball.width / 2;
		square.ball.y = sqSize / 2 - square.ball.height / 2;
		square.ball.shadow = pieceShadow;

		square.id = squaresSecond.length;
		squaresSecond.push(square);

		square.addChild(sqBG);
		square.addChild(square.ball);
		boardSecond.addChild(square);
	}

	boardSecond.rotation = -8;
	boardSecond.width = boardSecond.height = BOARD_SIZE;
	boardSecond.x = canvasSecond.width / 2 - boardSecond.width / 2;
	boardSecond.y = 150;
	stageSecond.addChild(boardSecond);

	// --------------------------
	// Player Names
	// --------------------------
	p1NameContSecond = new createjs.Container();

	// Background
	var pBG = new createjs.Shape();
		pBG.graphics.setStrokeStyle(5);
		pBG.graphics.beginStroke("#FFFFFF");
		pBG.graphics.beginFill("#F0F0F0");
		pBG.width = 150; pBG.height = 25;
		pBG.graphics.drawRect(0, 0, pBG.width, pBG.height);
		pBG.cache(-2.5, -2.5, pBG.width + 5, pBG.height + 5);
	p1NameContSecond.addChild(pBG);

	// TextField
	p1NameContSecond.name = new createjs.Text("", "bold 14px Verdana", "#000000");
	p1NameContSecond.name.textAlign = "center";
	p1NameContSecond.name.x = (pBG.width - 5) / 2;
	p1NameContSecond.name.y = 2.5;
	p1NameContSecond.addChild(p1NameContSecond.name);

	// Piece
	var p1BallBmp = new createjs.Bitmap("images/ballSS.png");
		p1BallBmp.sourceRect = new createjs.Rectangle(36, 0, 36, 36);
		p1BallBmp.x = pBG.width + 6.5;
		p1BallBmp.y = 1.5;
		p1BallBmp.scaleX = p1BallBmp.scaleY = 0.65;
	p1NameContSecond.addChild(p1BallBmp);

	p1NameContSecond.x = 15;
	p1NameContSecond.y = 25;
	stageSecond.addChild(p1NameContSecond);

	// --------------------------

	p2NameContSecond = new createjs.Container();

	// Background
	var p2BG = pBG.clone();
		p2BG.x = -2.5 + 31;
		p2BG.y = -2.5;
	p2NameContSecond.addChild(p2BG);

	// TextField
	p2NameContSecond.name = p1NameContSecond.name.clone();
	p2NameContSecond.name.x = p1NameContSecond.name.x + 31;
	p2NameContSecond.addChild(p2NameContSecond.name);

	// Piece
	var p2BallBmp = p1BallBmp.clone();
		p2BallBmp.sourceRect = new createjs.Rectangle(72, 0, 36, 36);
		p2BallBmp.x = 0;
	p2NameContSecond.addChild(p2BallBmp);

	p2NameContSecond.x = 382;
	p2NameContSecond.y = p1NameContSecond.y;
	stageSecond.addChild(p2NameContSecond);

	// --------------------------
	// Status TextField
	// --------------------------
	statusTFSecond = new createjs.Text("", "bold 14px Verdana", "#000000");
	statusTFSecond.textAlign = "center";
	statusTFSecond.x = 289;
	statusTFSecond.y = 70;
	stageSecond.addChild(statusTFSecond);

	// --------------------------
	// Disabler
	// --------------------------
	disablerSecond = new createjs.Shape();
		disablerSecond.graphics.beginFill("#000000");
		disablerSecond.graphics.drawRect(0, 0, canvasSecond.width, canvasSecond.height);
		disablerSecond.alpha = 0.5;
		disablerSecond.visible = false;
	stageSecond.addChild(disablerSecond);
}

/**
 * Update the canvas
 */
function tickSecond()
{
    stageSecond.update();
}

/**
 * Destroy the game instance
 */
function destroyGameSecond()
{
	sfs.removeEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponseSecond);
	sfs.removeEventListener(SFS2X.SFSEvent.SPECTATOR_TO_PLAYER, onSpectatorToPlayerSecond);

	// Remove PopUp
	removeGamePopUpSecond();
}

/**
 * Start the game
 */
function startGameSecond(params)
{
	console.log("############ startGame Second  ###############");
	whoseTurnSecond = params.get("t");
	console.log("WhoseTurn second - "+whoseTurn);
	player1IdSecond = params.get("p1i");
	player2IdSecond = params.get("p2i");
	player1NameSecond = params.get("p1n");
	player2NameSecond = params.get("p2n");
	lastJoinSecond = sfs.lastJoinedRoom;  //added
	// Reset the game board
	resetGameBoardSecond();

	// Remove the "waiting for other player..." popup
	removeGamePopUpSecond();

	p1NameContSecond.name.text = player1NameSecond;
	p2NameContSecond.name.text = player2NameSecond;

	setTurnSecond();
	enableBoardSecond(true);

	gameStartedSecond = true;
}

/**
 * Set the "Player's turn" status message
 */
function setTurnSecond()
{
	if(iAmSpectatorSecond == false){
		statusTFSecond.text = (sfs.mySelf.getPlayerId(lastJoinSecond) == whoseTurnSecond) ? "It's your turn" : "It's your opponent's turn";  // sfs.lastJoinedRoom
	}else{
		statusTFSecond.text = "It's " + this["player" + whoseTurnSecond + "Name"] + " turn";
	}
}

/**
 * Clear the game board
 */
function resetGameBoardSecond()
{
	for (var i = 0; i<9; i++){
		squaresSecond[i].ball.gotoAndStop(0);
	}
}

/**
 * Enable board click
 */
function enableBoardSecond(enable)
{
	console.log("##### SECOND enableBoardSecond sfs.mySelf.Name "+sfs.mySelf.Name + "  lastJoinSecond- "+lastJoinSecond + "   whoseTurn- "+whoseTurn+ "  sfs.mySelf.getPlayerId(lastJoinSecond)- "+sfs.mySelf.getPlayerId(lastJoinSecond));
	if(iAmSpectatorSecond == false && sfs.mySelf.getPlayerId(lastJoinSecond) == whoseTurnSecond)  //  sfs.lastJoinedRoom
	{
		for(var i = 0; i<9; i++){
			var square = squaresSecond[i];

			if(square.ball.currentFrame == 0)
			{
				if(enable)
					square.onClick = makeMoveSecond;
				else
					square.onClick = null;
			}
		}
	}
}

/**
 * On board click, send move to other players
 */
function makeMoveSecond(evt)
{
	var square = evt.target;
	square.ball.gotoAndStop(sfs.mySelf.getPlayerId(lastJoinSecond));  //  sfs.lastJoinedRoom
	square.onClick = null;
	console.log(" make move second - "+lastJoinSecond + " sfs.mySelf.getPlayerId(lastJoinSecond) - "+sfs.mySelf.getPlayerId(lastJoinSecond));
	enableBoardSecond(false);

	var x = square.id % 3 + 1;
	var y = Math.floor(square.id / 3) + 1;

	var obj = new SFS2X.SFSObject();
	obj.putInt("x", x);
	obj.putInt("y", y);

	sfs.send( new SFS2X.ExtensionRequest("move", obj, lastJoinSecond) )  //  sfs.lastJoinedRoom
}

/**
 * Handle the opponent move
 */
function moveReceivedSecond(params)
{
	var movingPlayer = params.get("t");
	whoseTurnSecond = (movingPlayer == 1) ? 2 : 1;
//	lastJoinSecond = sfs.lastJoinedRoom;
	if(movingPlayer != sfs.mySelf.getPlayerId(lastJoinSecond))  //sfs.lastJoinedRoom
	{
		console.log("Second movingPlayer - "+movingPlayer +" and whoseTurnSecond- "+whoseTurnSecond);
		var square = squaresSecond[(params.get("y") - 1) * 3 + (params.get("x") - 1)];
		square.ball.gotoAndStop(movingPlayer);
	}

	setTurnSecond();
	enableBoardSecond(true);
}

/**
 * Declare game winner
 */
function showWinnerSecond(cmd, params)
{
	gameStartedSecond = false;
	statusTFSecond.text = "";
	var message = "";

	if (cmd == "win")
	{
		if (iAmSpectatorSecond == true)
		{
			var pName = this["player" + params.get("w") + "Name"];
			message = pName + " is the WINNER with stakes " +params.get("stake") ;
		}
		else
		{
			if (sfs.mySelf.getPlayerId(lastJoinSecond) == params.get("w"))  // sfs.lastJoinedRoom
			{
				// I WON! In the next match, it will be my turn first
				message = "You are the WINNER! `Stake is " +params.get("stake")+"`" ;
			}
			else
			{
				// I've LOST! Next match I will be the second to move
				message = "Sorry, you've LOST!"
			}
		}
	}
	else if (cmd == "tie")
	{
		message = "It's a TIE!"
	}

	// Show "winner" message
	if (iAmSpectatorSecond == true)
	{
		showGamePopUpSecond("endSpec", message);
	}
	else
	{
		showGamePopUpSecond("end", message);
	}
}

/**
 * Restart the game
 */
function restartGameSecond()
{
	removeGamePopUpSecond();

	sfs.send( new SFS2X.ExtensionRequest("restart", null,lastJoinSecond) )  //   sfs.lastJoinedRoom
}

/**
 * One of the players left the game
 */
function userLeftSecond()
{
	gameStartedSecond = false;
	statusTFSecond.text = "";
	var message = "";

	// Show "wait" message
	if(iAmSpectatorSecond == false){
		message = "Your opponent left the game" + "<br/><br/>" + "Waiting for a new player";
		showGamePopUpSecond("wait", message);
	}else{
		message = "A player left the game" + "<br/><br/>" + "Press the Join button to play"
		showGamePopUpSecond("waitSpec", message);
	}
}

/**
 * Spectator receives board update. If match isn't started yet, a message is
 * displayed and he can click the join button
 */
function setSpectatorBoardSecond(params)
{
	removeGamePopUpSecond();

	whoseTurnSecond = params.get("t");
	player1IdSecond = params.get("p1i");
	player2IdSecond = params.get("p2i");
	player1NameSecond = params.get("p1n");
	player2NameSecond = params.get("p2n");

	gameStartedSecond = params.get("status");

	p1NameContSecond.name.text = player1NameSecond;
	p2NameContSecond.name.text = player2NameSecond;

	if (gameStartedSecond == true)
		setTurnSecond();

	var boardData = params.get("board");
	
	for (var y = 0; y < boardData.size(); y++)
	{
		var boardRow = boardData.get(y);
		
		for (var x = 0; x < boardRow.length; x++)
		{
			var square = squaresSecond[y * 3 + x];
			square.ball.gotoAndStop(boardRow[x]);
		}
	}

	if (gameStartedSecond == false)
	{
		var message = "Waiting for game to start" + "<br/><br/>" + "Press the Join button to play";
		showGamePopUpSecond("waitSpec", message);
	}
}

/**
 * If a spectator enters the game room and the match isn't started yet, he can
 * click the join button
 */
function spectatorJoinGameSecond()
{
	sfs.send( new SFS2X.SpectatorToPlayerRequest() );
}

// ------------------------------------
// Game Popup
// ------------------------------------
/**
 * Show the Game PopUp
 */
function showGamePopUpSecond(id, message)
{
	if(currentPopUpSecond != undefined)
		removeGamePopUpSecond();

	disablerSecond.visible = true;

	currentPopUpSecond = $("#"+id+"GameWin2");

	currentPopUpSecond.jqxWindow("open");
	currentPopUpSecond.jqxWindow("move", (canvasSecond.width/2) - (currentPopUpSecond.jqxWindow("width") / 2) + canvasSecond.offsetLeft, (canvasSecond.height/2) - (currentPopUpSecond.jqxWindow("height") / 2) + canvasSecond.offsetTop);
	currentPopUpSecond.children(".content").children("#firstRow").children("#message").html(message);
}

/**
 * Hide the Game PopUp
 */
function removeGamePopUpSecond()
{
	if(currentPopUpSecond != undefined){
		disablerSecond.visible = false;

		currentPopUpSecond.jqxWindow("close");
		currentPopUpSecond = undefined;
	}
}

// ------------------------------------
// SFS EVENT HANDLERS
// ------------------------------------

function onExtensionResponseSecond(evt)
{
//	var params = evt.params; // SFSObject
//	var cmd = evt.cmd;
//
//	console.log("> Second Received Extension Response: " + cmd);
//
//	switch(cmd)
//	{
//		case "start":
//			startGameSecond(params);
//			break;
//		case "stop":
//			userLeftSecond();
//			break;
//		case "move":
//			moveReceivedSecond(params);
//			break;
//		case "specStatus":
//			setSpectatorBoardSecond(params);
//			break;
//		case "win":
//		case "tie":
//			showWinnerSecond(cmd, params);
//			break;
//	}
}

function onSpectatorToPlayerSecond(evt)
{
	var updatedUser = evt.user;

	if(updatedUser.isItMe)
	{
		iAmSpectatorSecond = false;

		// Show "wait" message
		removeGamePopUpSecond()
		var message = "Waiting for player " + ((sfs.mySelf.getPlayerId(sfs.lastJoinedRoom) == 1) ? "2" : "1")
		showGamePopUpSecond("wait", message)
	}
}
