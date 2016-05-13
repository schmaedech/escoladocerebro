
var body;
var html;

var background;

var gameContainer;
var gameDisplay;

var btPrint;
var ckDrawMode;
var btDrawOver;
var txtDrawOver;

var levelDifficulty;

var _points =
        [
            [0.00, 0.00],
            [1.00, 0.00],
            [0.25, 0.25],
            [0.00, 0.50],
            [0.50, 0.50],
            [0.25, 0.75],
            [0.75, 0.75],
            [0.00, 1.00],
            [0.50, 1.00],
            [1.00, 1.00],
        ];

var _pieces =
        [
            [0, 1, 4],
            [0, 2, 3],
            [2, 4, 5, 3],
            [3, 8, 7],
            [4, 5, 6],
            [5, 6, 9, 8],
            [1, 4, 9]
        ]

var levels =
        [
            {"levelId": 0, "width": 259, "height": 276, "centerX": 129.5, "centerY": 138, "pieces": [{"pieceId": 3, "rotation": 180, "x": 52.5, "y": 26}, {"pieceId": 4, "rotation": 0, "x": 18.5, "y": -62}, {"pieceId": 5, "rotation": 0, "x": 35.75, "y": -25.75}, {"pieceId": 0, "rotation": 180, "x": 17, "y": 25.5}, {"pieceId": 2, "rotation": 0, "x": -16.5, "y": -78}, {"pieceId": 1, "rotation": 180, "x": -69.5, "y": -43}, {"pieceId": 6, "rotation": 180, "x": -17, "y": -9.5}], "top": 80, "left": 80, "points": [[-17, -114], [87, -9], [87, 61], [-53, 61], [-53, -9], [-88, -43]]},
            {"levelId": 1, "width": 294, "height": 275, "centerX": 147, "centerY": 137.5, "pieces": [{"pieceId": 2, "rotation": 0, "x": -68, "y": -77.5}, {"pieceId": 4, "rotation": 0, "x": -34, "y": -61.5}, {"pieceId": 5, "rotation": 0, "x": -16.75, "y": -26.25}, {"pieceId": 6, "rotation": 270, "x": 34.5, "y": 25}, {"pieceId": 1, "rotation": 0, "x": 17, "y": 61.5}, {"pieceId": 3, "rotation": 270, "x": -34, "y": 60.5}, {"pieceId": 0, "rotation": 270, "x": -34.5, "y": 25}], "top": 80, "left": 60, "points": [[-69, -112], [34, -11], [106, -11], [1, 95], [-70, 95], [-70, -44], [-103, -77]]},
            {"levelId": 2, "width": 285, "height": 276, "centerX": 142.5, "centerY": 138, "pieces": [{"pieceId": 4, "rotation": 90, "x": -22.5, "y": -10}, {"pieceId": 5, "rotation": 90, "x": -56.25, "y": 9.25}, {"pieceId": 0, "rotation": 180, "x": -5, "y": 25.5}, {"pieceId": 3, "rotation": 0, "x": -4.5, "y": -78}, {"pieceId": 1, "rotation": 90, "x": -4.5, "y": -26}, {"pieceId": 6, "rotation": 0, "x": 30, "y": -9.5}, {"pieceId": 2, "rotation": 0, "x": 29.5, "y": -78}], "top": 80, "left": 60, "points": [[28, -113], [64, -78], [64, 61], [-75, 61], [-75, -9], [-40, -42], [-40, -113], [-6, -79]]},
            {"levelId": 3, "width": 251.5, "height": 313, "centerX": 125.75, "centerY": 156.5, "pieces": [{"pieceId": 4, "rotation": 180, "x": -47.75, "y": 77.5}, {"pieceId": 3, "rotation": 0, "x": -47.75, "y": 26.5}, {"pieceId": 2, "rotation": 0, "x": -13.75, "y": 96.5}, {"pieceId": 1, "rotation": 180, "x": 3.25, "y": 61.5}, {"pieceId": 5, "rotation": 90, "x": 39.5, "y": 42.75}, {"pieceId": 0, "rotation": 0, "x": -13.25, "y": 25}, {"pieceId": 6, "rotation": 90, "x": -12.25, "y": -44}], "top": 20, "left": 100, "points": [[-84, -9], [-13, -80], [57, -9], [57, 60], [-13, 132], [-84, 60]]},
            {"levelId": 4, "width": 267, "height": 318, "centerX": 133.5, "centerY": 159, "pieces": [{"pieceId": 5, "rotation": 0, "x": -47.25, "y": -72.75}, {"pieceId": 1, "rotation": 90, "x": -31.5, "y": -39}, {"pieceId": 0, "rotation": 180, "x": 4, "y": 46.5}, {"pieceId": 2, "rotation": 0, "x": -30.5, "y": 13}, {"pieceId": 3, "rotation": 90, "x": 73.5, "y": -57}, {"pieceId": 4, "rotation": 90, "x": 56.5, "y": 11}, {"pieceId": 6, "rotation": 0, "x": 3, "y": -22.5}], "top": 60, "left": 60, "points": [[-102, -90], [-30, -90], [2, -58], [37, -90], [107, -90], [40, -23], [73, 10], [39, 46], [73, 81], [-67, 81], [-33, 46], [-66, 10], [-33, -23]]},
            {"levelId": 5, "width": 295, "height": 276, "centerX": 147.5, "centerY": 138, "pieces": [{"pieceId": 3, "rotation": 270, "x": -0.5, "y": -71}, {"pieceId": 6, "rotation": 90, "x": 35, "y": 25.5}, {"pieceId": 0, "rotation": 135, "x": -11, "y": -12.5}, {"pieceId": 4, "rotation": 270, "x": -51.5, "y": 26}, {"pieceId": 1, "rotation": 0, "x": -87.5, "y": -43}, {"pieceId": 5, "rotation": 90, "x": -51.25, "y": -25.75}, {"pieceId": 2, "rotation": 0, "x": -68.5, "y": -78}], "top": 80, "left": 40, "points": [[-106, -7], [-106, -77], [-70, -112], [-35, -78], [-35, -40], [33, -106], [33, -38], [62, -38], [36, -9], [105, 61], [-36, 61], [-70, 27], [-70, -42]]},
            {"levelId": 6, "width": 293, "height": 285.5, "centerX": 146.5, "centerY": 142.75, "pieces": [{"pieceId": 1, "rotation": 90, "x": -0.5, "y": -46.75}, {"pieceId": 2, "rotation": 0, "x": 34.5, "y": 39.25}, {"pieceId": 5, "rotation": 0, "x": -16.25, "y": 56.5}, {"pieceId": 6, "rotation": 180, "x": -34, "y": -30.25}, {"pieceId": 0, "rotation": 90, "x": 34, "y": -30.25}, {"pieceId": 4, "rotation": 90, "x": 18.5, "y": 4.25}, {"pieceId": 3, "rotation": 270, "x": -33.5, "y": 4.25}], "top": 60, "left": 60, "points": [[-70, -100], [-35, -65], [32, -65], [67, -100], [67, 39], [32, 74], [-35, 74], [-70, 39]]},
            {"levelId": 7, "width": 319, "height": 312, "centerX": 159.5, "centerY": 156, "pieces": [{"pieceId": 4, "rotation": 180, "x": 99.5, "y": 96}, {"pieceId": 1, "rotation": 270, "x": -99.5, "y": 27}, {"pieceId": 5, "rotation": 0, "x": 55.75, "y": 61.25}, {"pieceId": 3, "rotation": 315, "x": -45.5, "y": 44}, {"pieceId": 6, "rotation": 90, "x": 3, "y": 8.5}, {"pieceId": 2, "rotation": 0, "x": 37.5, "y": -96}, {"pieceId": 0, "rotation": 0, "x": 37, "y": -27.5}], "top": 40, "left": 20, "points": [[-35, -63], [35, -63], [2, -95], [35, -128], [69, -95], [35, -63], [105, -63], [37, 8], [107, 78], [134, 78], [98, 114], [65, 78], [37, 78], [3, 45], [-46, 94], [-95, 45], [-136, 45], [-100, 10], [-67, 42], [2, -26]]},
            {"levelId": 8, "width": 310, "height": 250.5, "centerX": 155, "centerY": 125.25, "pieces": [{"pieceId": 2, "rotation": 0, "x": -95, "y": -12.25}, {"pieceId": 1, "rotation": 180, "x": -79, "y": 22.75}, {"pieceId": 3, "rotation": 0, "x": -26, "y": 21.75}, {"pieceId": 5, "rotation": 0, "x": 26.25, "y": 39}, {"pieceId": 4, "rotation": 180, "x": 78, "y": 38.75}, {"pieceId": 0, "rotation": 0, "x": -26.5, "y": -12.75}, {"pieceId": 6, "rotation": 90, "x": 42.5, "y": -12.75}], "top": 80, "left": 40, "points": [[-131, -13], [-96, -49], [42, -49], [111, 20], [77, 56], [-63, 56]]},
            {"levelId": 9, "width": 324.5, "height": 292, "centerX": 162.25, "centerY": 146, "pieces": [{"pieceId": 3, "rotation": 135, "x": -24.25, "y": 0}, {"pieceId": 0, "rotation": 135, "x": -49.75, "y": 23.5}, {"pieceId": 2, "rotation": 0, "x": 23.75, "y": -34}, {"pieceId": 6, "rotation": 0, "x": 23.25, "y": 33.5}, {"pieceId": 5, "rotation": 90, "x": 76, "y": -15.75}, {"pieceId": 1, "rotation": 0, "x": 74.75, "y": -67}, {"pieceId": 4, "rotation": 180, "x": 92.75, "y": -86}], "top": 40, "left": 20, "points": [[-76, -1], [-26, -50], [-11, -35], [23, -69], [55, -35], [55, -104], [127, -104], [92, -68], [92, 2], [58, 37], [58, 104], [-11, 36], [-76, 104]]},
            {"levelId": 10, "width": 421, "height": 234, "centerX": 210.5, "centerY": 117, "pieces": [{"pieceId": 1, "rotation": 135, "x": 85.5, "y": 57}, {"pieceId": 2, "rotation": 45, "x": 1.5, "y": 46}, {"pieceId": 6, "rotation": 135, "x": 98, "y": -4.5}, {"pieceId": 3, "rotation": 135, "x": 25.5, "y": 21}, {"pieceId": 5, "rotation": 135, "x": -24.25, "y": -3.75}, {"pieceId": 4, "rotation": 135, "x": -85.5, "y": 57}, {"pieceId": 0, "rotation": 135, "x": -98, "y": -4.5}], "top": 80, "left": -20, "points": [[-124, -30], [122, -30], [122, 70], [72, 70], [72, 21], [25, 21], [25, 70], [-24, 70], [-24, 21], [-74, 21], [-74, 70], [-124, 70]]},
            {"levelId": 11, "width": 340.5, "height": 352.5, "centerX": 170.25, "centerY": 176.25, "pieces": [{"pieceId": 1, "rotation": 180, "x": -99.25, "y": -37.25}, {"pieceId": 5, "rotation": 180, "x": 84, "y": 90}, {"pieceId": 3, "rotation": 135, "x": 17.75, "y": 107.75}, {"pieceId": 2, "rotation": 0, "x": -17.25, "y": 58.75}, {"pieceId": 6, "rotation": 135, "x": -7.75, "y": -15.75}, {"pieceId": 4, "rotation": 135, "x": -93.25, "y": -101.25}, {"pieceId": 0, "rotation": 45, "x": -57.75, "y": -63.75}], "top": 40, "left": 30, "points": [[-132, -89], [-83, -140], [15, -41], [15, 58], [30, 71], [100, 71], [135, 107], [-33, 107], [-19, 93], [-53, 58], [-19, 24], [-82, -39], [-82, -4], [-118, -38], [-82, -71], [-82, -89]]}
        ]

var pieces;
var level;
var draggingPiece;

var colors = [ ['#c33','#a66'], ['#3c3','#6a6'], ['#33c','#66a'], ['#cc3','#aa6'], ['#c3c','#a6a'], ['#3cc','#6aa']];

var ticksPerSecond = 20;

var tangramWidth = 140;
var tangramHeight = 140;
var canvasMargin = 10;

var numFixedPieces;

var stats = {};

$(function ()
{
    body = $('body');
    html = $('html');

    gameDisplay = $('#game');
    var background = $('#background');
    BackgroundUtil.SetBackgroundImage(background, 'game_background');

    //btPrint = $('#btPrint');
    //btPrint.click(onBtPrintClick);

    //ckDrawMode = $('#ckDrawMode');
    //ckDrawMode.change(onCkDrawModeChange);

    //btDrawOver = $('#btDrawOver');
    //btDrawOver.click(onBtDrawOverClick);

    //txtDrawOver = $('#txtDrawOver');

    showHelpScreen();
});

function showHelpScreen()
{
    var gameHelp = $('#game-help');
    BackgroundUtil.SetBackgroundImage(gameHelp, 'help_background');
    //gameHelp.css('background-image','url("assets/help_background.png")');

    var btPlay = $('<div></div>');
    btPlay.css('position', 'absolute');
    btPlay.attr('id', 'btPlay');
    btPlay.css('cursor', 'pointer');
    btPlay.left(195);
    btPlay.top(262);
    btPlay.width(138);
    btPlay.height(41);
    gameHelp.append(btPlay);
    BackgroundUtil.SetBackgroundImage(btPlay, 'play');
    //btPlay.css('background-image','url("assets/play.png")');

    var btPlayClicked = false;
    btPlay.on('mouseup', function ()
    {
        if (btPlayClicked)
            return;
        btPlayClicked = true;

        showDifficultyScreen();
        gameHelp.animate({opacity: 0}, 500, function () {
            gameHelp.remove();
        });
    });
}

function showDifficultyScreen()
{
    var gameDifficulty = $('#game-difficulty');
    BackgroundUtil.SetBackgroundImage(gameDifficulty, 'difficulty_background');
    //gameDifficulty.css('background-image','url("assets/difficulty_background.png")');

    var btEasy = $('<div></div>');
    btEasy.css('position', 'absolute');
    btEasy.attr('id', 'btEasy');
    btEasy.css('cursor', 'pointer');
    btEasy.left(50);
    btEasy.top(40);
    btEasy.width(140);
    btEasy.height(43);
    gameDifficulty.append(btEasy);
    //btEasy.css('background-image','url("assets/easy.png")');
    BackgroundUtil.SetBackgroundImage(btEasy, 'easy');

    var btDifficultyClicked = false;
    btEasy.on('mouseup', function ()
    {
        if (btDifficultyClicked)
            return;
        btDifficultyClicked = true;

        playLevelId(0);
        gameDifficulty.animate({opacity: 0}, 500, function () {
            gameDifficulty.remove();
        });
    });

    var btMedium = $('<div></div>');
    btMedium.css('position', 'absolute');
    btMedium.attr('id', 'btMedium');
    btMedium.css('cursor', 'pointer');
    btMedium.left(200);
    btMedium.top(40);
    btMedium.width(140);
    btMedium.height(43);
    gameDifficulty.append(btMedium);
    //btMedium.css('background-image','url("assets/medium.png")');
    BackgroundUtil.SetBackgroundImage(btMedium, 'medium');

    var btDifficultyClicked = false;
    btMedium.on('mouseup', function ()
    {
        if (btDifficultyClicked)
            return;
        btDifficultyClicked = true;

        playLevelId(1);
        gameDifficulty.animate({opacity: 0}, 500, function () {
            gameDifficulty.remove();
        });
    });

    var btHard = $('<div></div>');
    btHard.css('position', 'absolute');
    btHard.attr('id', 'btHard');
    btHard.css('cursor', 'pointer');
    btHard.left(350);
    btHard.top(40);
    btHard.width(140);
    btHard.height(43);
    gameDifficulty.append(btHard);
    //btHard.css('background-image','url("assets/hard.png")');
    BackgroundUtil.SetBackgroundImage(btHard, 'hard');

    var btDifficultyClicked = false;
    btHard.on('mouseup', function ()
    {
        if (btDifficultyClicked)
            return;
        btDifficultyClicked = true;

        playLevelId(2);
        gameDifficulty.animate({opacity: 0}, 500, function () {
            gameDifficulty.remove();
        });
    });
}

function playLevelId(difficulty)
{
    if (difficulty == 0)
        levelId = Math.floor(0 + Math.random() * 4);
    else if (difficulty == 1)
        levelId = Math.floor(4 + Math.random() * 4);
    else if (difficulty >= 2)
        levelId = Math.floor(8 + Math.random() * 4);

    levelDifficulty = difficulty;

    initializeGame(levelId);
    showGame();
}
/*
 function onBtPrintClick()
 {
 var minX = null;
 var maxX = null;
 var minY = null;
 var maxY = null;
 
 for(var i = 0; i < pieces.length; i++)
 {
 var piece = pieces[i];
 var _minX = parseInt(piece.display.css('left').replace('px',''));
 var _minY = parseInt(piece.display.css('top').replace('px',''));
 
 var _maxX = _minX + piece.canvasSize;
 var _maxY = _minY + piece.canvasSize;
 
 if(minX == null || _minX < minX) minX = _minX;
 if(maxX == null || _maxX > maxX) maxX = _maxX;
 if(minY == null || _minY < minY) minY = _minY;
 if(maxY == null || _maxY > maxY) maxY = _maxY;
 }
 
 var width = maxX - minX;
 var height = maxY - minY;
 var cx = width/2;
 var cy = height/2;
 
 var level = 
 {
 levelId: 0,
 width: width,
 height: height,
 centerX: cx,
 centerY: cy,
 pieces: []
 };
 
 for(var i = 0; i < pieces.length; i++)
 {
 var piece = pieces[i];
 var x = parseInt(piece.display.css('left').replace('px','')) + piece.canvasSize/2;
 var y = parseInt(piece.display.css('top').replace('px','')) + piece.canvasSize/2;
 level.pieces.push(
 {
 pieceId: piece.id,
 rotation: piece.rotation,
 x: (x - cx - minX),
 y: (y - cy - minY)
 });
 }
 
 level.points = [];
 
 console.log(JSON.stringify(level));
 }
 
 var _drawingMode = false;
 var _drawingPoints = null; 
 var _drawingCanvas;
 
 function onBtDrawOverClick()
 {
 if(_drawingCanvas)
 {
 _drawingCanvas.remove();
 _drawingCanvas = null;
 }		
 
 _drawingCanvas = $('<canvas></canvas>');
 _drawingCanvas.css('position','absolute');
 _drawingCanvas.css('z-index','5000');
 body.append(_drawingCanvas);
 
 var canvasWidth = 527;
 var canvasHeight = 342;
 
 _drawingCanvas[0].width = canvasWidth;
 _drawingCanvas[0].height = canvasHeight;
 
 var context = _drawingCanvas[0].getContext('2d');
 context.clearRect (0, 0, canvasWidth, canvasHeight);
 
 context.beginPath();
 
 context.moveTo(_drawingPoints[0][0], _drawingPoints[0][1]);
 for(var j = 0; j < _drawingPoints.length; j++)
 {
 var k = (j+1) % _drawingPoints.length;
 context.lineTo(_drawingPoints[k][0], _drawingPoints[k][1]);
 }
 
 context.closePath();
 context.lineWidth = 1;
 context.fillStyle = '#ccc';
 context.fill();
 context.strokeStyle = '#f00';
 context.stroke(); 
 }
 
 function onCkDrawModeChange(e)
 {
 _drawingMode = (ckDrawMode.prop('checked'));
 if(_drawingMode)
 {
 _drawingPoints = [];
 txtDrawOver.val(JSON.stringify(_drawingPoints));
 
 gameDisplay.on('mousedown', onDrawPointClick);
 
 }
 else
 {
 gameDisplay.off('mousedown', onDrawPointClick);
 }
 }
 
 function onDrawPointClick(e)
 {
 _drawingPoints = JSON.parse(txtDrawOver.val());
 
 var x = e.pageX - parseInt(gameDisplay.css('left').replace('px',''));
 var y = e.pageY - parseInt(gameDisplay.css('top').replace('px',''));
 
 x -= level.centerX;
 y -= level.centerY;
 
 x = Math.floor(x);
 y = Math.floor(y);
 
 _drawingPoints.push([x,y]);
 
 txtDrawOver.val(JSON.stringify(_drawingPoints));
 }
 */

function showGame()
{
    onResize();
    setTimeout(function ()
    {
        gameDisplay.animate({opacity: 1}, 500);
    }, 250);
}

function onResize()
{

}

var _runningTime;
var _isRunning;
var _lastTimerTick;
var _timer;

function initializeGame(levelId)
{
    gameDisplay.empty();
	
    initializePieces();
    initializeLevel(levelId);

    stats =
            {
                initializedTime: new Date().getTime(),
                totalPieces: 0,
                pieceTimes: [],
                log:
                        {
                            acuracia: 0,
                            velocidade: 0,
                            estabilidade: 0
                        }
            }

    _numMoves = 0;
    _runningTime = 0;
    _lastTimerTick = -1;
    _isRunning = true;
    _timer = setInterval(onTimerTick, Math.floor(1000 / ticksPerSecond));

    setNumMoves(_numMoves);
    setRunningTime(_runningTime);
	
	gameDisplay.on('mousemove', onMouseMove);
	
	var btRestart = $('<div></div>');
    btRestart.css('position', 'absolute');
    btRestart.attr('id', 'btRestart');
    btRestart.css('cursor', 'pointer');
    btRestart.css('left', '10px');
    btRestart.css('bottom', '10px');
    btRestart.css('z-index', '9999');
    btRestart.width(140);
    btRestart.height(43);
    gameDisplay.append(btRestart);
    //btEasy.css('background-image','url("assets/easy.png")');
    BackgroundUtil.SetBackgroundImage(btRestart, 'restart');
	
    btRestart.on('mouseup', function ()
    {
		restartLevel();
    });
}

function initializeLevel(levelId)
{
    level = levels[levelId];
	level.centerX += 93/2;
	level.left += 93/2;
		
    drawLevel();
    //oldDrawLevel();
	
	numFixedPieces = (2 - levelDifficulty);
	console.log(numFixedPieces)
	for(var i = 0; i < numFixedPieces; i++)
	{
		var piece;
		do { piece = pieces[Math.floor(Math.random()*pieces.length)]; }
		while(piece.isRightPosition);
		
		piece.isFixed = true;
		
		var lPiece = getLevelPieceById(piece.id);
		
		function getLevelPieceById(pieceId)
		{
			for (var i = 0; i < level.pieces.length; i++)
				if (level.pieces[i].pieceId == pieceId)
					return level.pieces[i];
			return null;
		}
		
		var tx = level.x + lPiece.x + level.centerX - piece.canvasSize / 2;
		var ty = level.y + lPiece.y + level.centerY - piece.canvasSize / 2;
		var tr = lPiece.rotation;
		
		piece.rotation = tr;
		
		piece.display.css({'left': (tx+'px'), 'top': (ty+'px')});
		//var y = parseInt(piece.display.css('top').replace('px', '')) + piece.canvasSize / 2;
		//var rotation = piece.rotation;

		drawPiece(piece);

		piece.isRightPosition = true;
	}
}

function restartLevel()
{
	for(var i = 0; i < pieces.length; i++)
	{
		var piece = pieces[i];
		if(piece.isFixed) continue;
		
		piece.display.css('top', piece.restartPosition.top+'px');
		piece.display.css('left', piece.restartPosition.left+'px');
		piece.rotation = 0;
		drawPiece(piece);
		
		piece.isRightPosition = false;
	}
}

function initializePieces()
{
    pieces = [];
    for (var i = 0; i < _pieces.length; i++)
    {
        var _piece = _pieces[i];

        var minPoint = [1, 1];
        var maxPoint = [0, 0];

        for (var j = 0; j < _piece.length; j++)
        {
            var _point = _points[_piece[j]];

            var x = _point[0];
            var y = _point[1];

            if (x < minPoint[0])
                minPoint[0] = x;
            if (x > maxPoint[0])
                maxPoint[0] = x;

            if (y < minPoint[1])
                minPoint[1] = y;
            if (y > maxPoint[1])
                maxPoint[1] = y;
        }

        var color = getAny(colors);

        var piece =
                {
                    id: i,
                    x: minPoint[0],
                    y: minPoint[1],
                    rotation: 0,
                    display: null,
                    points: [],
                    isRightPosition: false,
                    color: color
                };

        var canvas = $('<canvas></canvas>');
        gameDisplay.append(canvas);
        canvas.addClass('piece');
        canvas.css('z-index', (1000 + i));

        var canvasWidth = ((maxPoint[0] - minPoint[0]) * tangramWidth) + canvasMargin;
        var canvasHeight = ((maxPoint[1] - minPoint[1]) * tangramHeight) + canvasMargin;
        var canvasSize = Math.max(canvasWidth, canvasHeight) * 1.5;

        var dx = (canvasSize - canvasWidth) / 2;
        var dy = (canvasSize - canvasHeight) / 2;

        canvas[0].width = canvasSize;
        canvas[0].height = canvasSize;
        piece.canvasSize = canvasSize;

        var left = ((minPoint[0] * tangramWidth) - canvasMargin / 2) - dx + 63;
        var top = ((minPoint[1] * tangramHeight) - canvasMargin / 2) - dy + 29;
        canvas.css('left', left + 'px');
        canvas.css('top', top + 'px');

        for (var p = 0; p < _piece.length; p++)
        {
            var _point = _points[_piece[p]];
            var x = (((_point[0] - minPoint[0]) * tangramWidth + canvasMargin / 2) + dx) - canvasSize / 2;
            var y = (((_point[1] - minPoint[1]) * tangramHeight + canvasMargin / 2) + dy) - canvasSize / 2;
            piece.points[p] = {x: x, y: y};
        }

        piece.display = canvas;
        piece.canvas = canvas[0];
        canvas.data('piece', piece);
        gameDisplay.append(canvas);

        canvas.on('mousedown', onPieceMouseDown);
        canvas.on('dblclick', onPieceDoubleClick);
		
		pieces.push(piece);
		
		piece.restartPosition = 
		{
			left: left,
			top: top,
		}

        drawPiece(piece);

        function getAny(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
    }	
}

function drawLevel()
{
    var canvas = $('<canvas></canvas>');
    gameDisplay.append(canvas);
    canvas.addClass('level');

    var canvasWidth = level.width;
    var canvasHeight = level.height;

    canvas[0].width = canvasWidth;
    canvas[0].height = canvasHeight;

    var left = level.left;
    var top = level.top;
    canvas.css('left', left + 'px');
    canvas.css('top', top + 'px');

    level.display = canvas;
    level.x = left;
    level.y = top;

    var context = canvas[0].getContext('2d');
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    var cx = level.centerX;
    var cy = level.centerY;

    var points = level.points;

    //for(var i = 0; i < points.length; i++)
    //{ points[i][0] -= 20; points[i][1] -= 40; }

    //console.log(JSON.stringify(points));	

    context.beginPath();

    context.moveTo(cx + points[0][0], cy + points[0][1]);
    for (var j = 0; j < points.length; j++)
    {
        var k = (j + 1) % points.length;
        var point = points[k];
        context.lineTo(cx + point[0], cy + point[1]);
    }

    context.closePath();
    context.lineWidth = 1;
    context.fillStyle = '#384574';
    context.fill();
    context.strokeStyle = '#384574';
    context.stroke();
}
/*
 function oldDrawLevel()
 {
 var canvas = $('<canvas></canvas>');
 gameDisplay.append(canvas);            
 canvas.addClass('level');
 
 var canvasWidth = level.width;
 var canvasHeight = level.height;
 
 canvas[0].width = canvasWidth;
 canvas[0].height = canvasHeight;
 
 var left = 40;
 var top = 40;
 canvas.css('left', left+'px');
 canvas.css('top', top+'px');
 
 level.display = canvas;
 level.x = left;
 level.y = top;
 
 var context = canvas[0].getContext('2d');
 context.clearRect (0, 0, canvasWidth, canvasHeight);
 
 var cx = level.centerX;
 var cy = level.centerY;
 
 for(var i = 0; i < level.pieces.length; i++)
 {		
 var lPiece = level.pieces[i];
 var piece = getPieceById(lPiece.pieceId);		
 var x = lPiece.x;
 var y = lPiece.y;
 var rotation = lPiece.rotation;
 
 var points = getRotatedPoints(piece, rotation);	
 
 console.log({x:x, y:y});
 
 context.beginPath();
 
 context.moveTo(cx + x + points[0].x, cy + y + points[0].y);
 for(var j = 0; j < points.length; j++)
 {
 var k = (j+1) % points.length;
 var point = points[k];
 context.lineTo(cx + x + point.x, cy + y + point.y);
 }
 
 context.closePath();
 context.lineWidth = 1;
 context.fillStyle = '#999';
 context.fill();
 context.strokeStyle = '#999';
 context.stroke(); 
 }	
 }
 */

function getRotatedPoints(piece, rotation)
{
    var points = [];

    var sin = Math.sin(rotation * Math.PI / 180);
    var cos = Math.cos(rotation * Math.PI / 180);

    for (var i = 0; i < piece.points.length; i++)
    {
        var point = piece.points[i];
        var newPoint =
                {
                    x: (cos * point.x - sin * point.y),
                    y: (cos * point.y + sin * point.x)
                };
        points.push(newPoint);
    }

    return points;
}

function drawPiece(piece)
{
    var pieceDisplay = piece.display;
    var canvas = piece.canvas;

    var points = getRotatedPoints(piece, piece.rotation);

    piece.rPoints = points;

    var context = canvas.getContext('2d');
    context.clearRect(0, 0, piece.canvasSize, piece.canvasSize);
    context.beginPath();

    var c = piece.canvasSize / 2;

    context.moveTo(c + points[0].x, c + points[0].y);
    for (var j = 0; j < points.length; j++)
    {
        var k = (j + 1) % points.length;
        var point = points[k];
        context.lineTo(c + point.x, c + point.y);
    }

    context.closePath();
    //context.lineWidth = 3;
    context.fillStyle = piece.color[piece.isMouseOver ? 1 : 0];
    context.fill();
    //context.strokeStyle = 'blue';
    //context.stroke();    

    /*
     context.fillStyle = "white";
     context.font = "bold 12px Arial";
     context.fillText("p"+piece.id, c - 20, c);
     */
}

function getPieceById(pieceId)
{
    for (var i = 0; i < pieces.length; i++)
        if (pieces[i].id == pieceId)
            return pieces[i];
    return null;
}

function getPieceUnderPoint(px, py)
{
    var piece = null;
    for (var i = 0; i < pieces.length; i++)
    {
        var piece = pieces[i];
        var pieceDisplay = piece.display;

        var offset =
                {
                    left: parseInt(gameDisplay.css('left').replace('px', '')) + parseInt(pieceDisplay.css('left').replace('px', '')) + piece.canvasSize / 2,
                    top: parseInt(gameDisplay.css('top').replace('px', '')) + parseInt(pieceDisplay.css('top').replace('px', '')) + piece.canvasSize / 2
                };

        var pieceX = px - offset.left;
        var pieceY = py - offset.top;

        var inside = pointInPoly({x: pieceX, y: pieceY}, piece.rPoints);
        if (inside)
            return piece;
    }

    return null;

    function sign(p1, p2, p3)
    {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }

    function pointInPoly(p, v)
    {
        var b = [];

        for (var i = 0; i < v.length; i++)
        {
            var j = (i + 1) % v.length;
            b[i] = (sign(p, v[i], v[j]) < 0);
        }

        var result = true;
        for (var i = 0; i < v.length - 1; i++)
        {
            var j = (i + 1);
            result = result && b[i] == b[j];
        }

        return result;
    }
}

function onPieceDoubleClick(e)
{
    var piece = getPieceUnderPoint(e.pageX, e.pageY);
    if (!piece)
        return;

    rotatePiece(piece);
}

function rotatePiece(piece)
{
    if (piece.isRightPosition)
        return;

    if (piece.isRotating)
        return;

    var pieceDisplay = piece.display;

    piece.isRotating = true;

    var deltaRotation = 45;
    var targetRotation = (piece.rotation + deltaRotation);
    targetRotation = (360 + targetRotation) % 360;

    var rotationObj = $({value: 0});
    rotationObj.animate({value: deltaRotation}, {step: step, complete: complete});
    function step()
    {
        var rotation = rotationObj[0].value;

        pieceDisplay.css(
                {
                    '-ms-transform': 'rotate(' + rotation + 'deg)',
                    '-webkit-transform': 'rotate(' + rotation + 'deg)',
                    'transform': 'rotate(' + rotation + 'deg)'
                });

    }
    function complete()
    {
        step();

        pieceDisplay.css(
                {
                    '-ms-transform': '',
                    '-webkit-transform': '',
                    'transform': ''
                });

        piece.rotation = targetRotation;
        drawPiece(piece);

        piece.isRotating = false;

        verifyGameComplete(piece);

    }
}

var mouseUpTimeout;
var rotateTimeout;
function onPieceMouseDown(e)
{
    var piece = getPieceUnderPoint(e.pageX, e.pageY);
    if (!piece)
        return;
    var pieceDisplay = piece.display;

    if (piece.isRightPosition)
        return;
		
    rotateTimeout = setTimeout(function () {
        rotatePiece(piece);
    }, 1000);

    var index = pieces.indexOf(piece);
    pieces.splice(index, 1);
    pieces.splice(0, 0, piece);
    for (var i = 0; i < pieces.length; i++)
        pieces[i].display.css('z-index', 1000 + (pieces.length - i));

    html.on('mousemove', onMouseMove);
    html.on('mouseup', onMouseUp);

    var lastX = e.pageX;
    var lastY = e.pageY;

    function onMouseMove(e)
    {
        var offset = gameDisplay.offset();
        var clientX = e.pageX - offset.left;
        var clientY = e.pageY - offset.top;

        if (clientX <= 0 || clientX >= 527 || clientY <= 0 || clientY >= 348)
            return;

        clearTimeout(rotateTimeout);

        var x = parseFloat(pieceDisplay.css('left').replace('px', ''));
        var y = parseFloat(pieceDisplay.css('top').replace('px', ''));

        x += (e.pageX - lastX);
        y += (e.pageY - lastY);

        pieceDisplay.css('left', x + 'px');
        pieceDisplay.css('top', y + 'px');

        piece.x = x + canvasMargin / 2;
        piece.y = y + canvasMargin / 2;

        lastX = e.pageX;
        lastY = e.pageY;
    }

	draggingPiece = piece;
	
    function onMouseUp(e)
    {
        clearTimeout(rotateTimeout);
		
		draggingPiece = null;
		
        html.off('mousemove', onMouseMove);
        html.off('mouseup', onMouseUp);

        if (mouseUpTimeout)
            clearTimeout(mouseUpTimeout);

        mouseUpTimeout = setTimeout(function ()
        {
            mouseUpTimeout = 0;

            _numMoves++;
            setNumMoves(_numMoves);
        }, 300);

        verifyGameComplete(piece);
    }
}

function onMouseMove(e)
{
	if(draggingPiece) return;

	var piece = getPieceUnderPoint(e.pageX, e.pageY);
	
	var overPiece = null;
	for (var i = 0; i < pieces.length; i++)
	{
		var p = pieces[i];
		if(p.isMouseOver)
			overPiece = p;
	}
	
	if(piece == overPiece) return;
	
	if(overPiece)
	{
		overPiece.isMouseOver = false;
		drawPiece(overPiece);
	}
	
	if(piece && !piece.isRightPosition)
	{
		piece.isMouseOver = true;
		drawPiece(piece);
	}
}

function verifyGameComplete(piece)
{
    var lPiece = getLevelPieceById(piece.id);

    if (!lPiece)
        return;



    var x = parseInt(piece.display.css('left').replace('px', '')) + piece.canvasSize / 2;
    var y = parseInt(piece.display.css('top').replace('px', '')) + piece.canvasSize / 2;
    var rotation = piece.rotation;



    // 0 (0) <=> 6 (270)
    // 1 (0) <=> 4 (90)
    var _correlationRules = {};
    _correlationRules[0] = {pieceId: 6, rotation: +270};
    _correlationRules[1] = {pieceId: 4, rotation: +90};
    _correlationRules[6] = {pieceId: 0, rotation: -270};
    _correlationRules[4] = {pieceId: 1, rotation: -90};

    var tx = level.x + lPiece.x + level.centerX;
    var ty = level.y + lPiece.y + level.centerY;
    var tr = lPiece.rotation;
    var distance = Math.sqrt(Math.pow(x - tx, 2) + Math.pow(y - ty, 2));

	console.log(distance)
	
    var cond1 = (rotation == tr && distance < 10);
    var cond2 = false;

    var rule = null;
    if (_correlationRules[piece.id])
    {
        rule = _correlationRules[piece.id];
        var lPiece2 = getLevelPieceById(rule.pieceId);

        var tx2 = level.x + lPiece2.x + level.centerX;
        var ty2 = level.y + lPiece2.y + level.centerY;
        var tr2 = (360 + lPiece2.rotation - rule.rotation) % 360;
        var distance2 = Math.sqrt(Math.pow(x - tx2, 2) + Math.pow(y - ty2, 2));

        rule.tx = tx2;
        rule.ty = ty2;
        rule.tr = tr2;
        rule.distance = distance2;

        cond2 = (rotation == tr2 && distance2 < 10)
    }

    if (cond1 || cond2)
    {
        piece.isRightPosition = true;
        piece.x = (cond1) ? tx : rule.tx;
        piece.y = (cond1) ? ty : rule.ty;

        var left = (piece.x - piece.canvasSize / 2);
        var top = (piece.y - piece.canvasSize / 2);

        piece.display.animate({left: left, top: top}, 500);

        stats.totalPieces++;

        var timeNow = new Date().getTime();
        var pieceTime = timeNow;
        if (stats.pieceTimes.length > 0)
            pieceTime -= stats.pieceTimes[stats.pieceTimes.length - 1];
        stats.pieceTimes.push(pieceTime);

        var gameTime = (timeNow - stats.initializedTime) / 1000;
        stats.log.acuracia = (stats.totalPieces / (7-numFixedPieces));
        stats.log.velocidade = (stats.totalPieces / gameTime);
        stats.log.estabilidade = (1 / desvpad(stats.pieceTimes));

        function avg(data)
        {
            if (!data || data.length == 0)
                return 0;

            var sum = 0;
            for (var i = 0; i < data.length; i++)
                sum += data[i];
            return sum / data.length;
        }

        function desvpad(data)
        {
            if (!data || data.length <= 1)
                return 0;

            var a = avg(data);
            var sum = 0;
            for (var i = 0; i < data.length; i++)
                sum += Math.pow((data[i] - a), 2);

            sum = (sum / (data.length - 1));
            sum = Math.sqrt(sum);

            return sum;
        }
    }

    var isComplete = true;
    for (var i = 0; i < pieces.length; i++)
    {
        if (!pieces[i].isRightPosition)
        {
            isComplete = false;
            break;
        }
    }

    if (isComplete)
    {
        //alert('Game Complete!');

        stats.log.time = _runningTime;
        stats.log.success = true;
        stats.log.level = levelDifficulty;

        var dMult = [40, 60, 100];
        stats.log.pontuacao = ((stats.log.acuracia + stats.log.velocidade + stats.log.estabilidade) / 3) * dMult[levelDifficulty];

        stats.log['memoria'] = stats.log.pontuacao * 2;
        stats.log['visuo_espacial'] = stats.log.pontuacao * 3;
        stats.log['resolucao_problemas'] = stats.log.pontuacao * 5;
        stats.log['psico_motora'] = stats.log.pontuacao * 1;
        stats.log['logico_matematica'] = stats.log.pontuacao * 3;
        stats.log['linguagem'] = stats.log.pontuacao * 1;
        stats.log['tentativas'] = stats.totalPieces;
        stats.log['acertos'] = stats.pieceTimes.length;
        sendLog();
    }

    function getLevelPieceById(pieceId)
    {
        for (var i = 0; i < level.pieces.length; i++)
            if (level.pieces[i].pieceId == pieceId)
                return level.pieces[i];
        return null;
    }
}

function onTimerTick()
{
    var currentTimerTick = new Date().getTime();

    if (_lastTimerTick > -1)
    {
        if (_isRunning)
        {
            var dt = currentTimerTick - _lastTimerTick;
            _runningTime += dt;
            updateGame(dt);
        }
    }
    _lastTimerTick = currentTimerTick;
}

function updateGame(dt)
{
    setRunningTime(_runningTime);
}

function setRunningTime(value)
{
    var timeText = '';

    var millis = value % 1000;
    var seconds = Math.floor(value / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);

    minutes -= hours * 60;
    seconds -= minutes * 60;

    if (hours > 0)
    {
        hours = hours + '';
        minutes = minutes + '';
        seconds = seconds + '';
        while (hours.length < 1)
            hours = '0' + hours;
        while (minutes.length < 2)
            minutes = '0' + minutes;
        while (seconds.length < 2)
            seconds = '0' + seconds;
        timeText = hours + ':' + minutes + ':' + seconds;
    }
    else if (minutes > 0)
    {
        minutes = minutes + '';
        seconds = seconds + '';
        millis = millis + '';
        while (minutes.length < 1)
            minutes = '0' + minutes;
        while (seconds.length < 2)
            seconds = '0' + seconds;
        while (millis.length < 1)
            millis = '0' + millis;
        millis = millis.substring(0, 1);
        timeText = minutes + ':' + seconds + '.' + millis;
    }
    else if (seconds > 9)
    {
        seconds = seconds + '';
        millis = millis + '';
        while (seconds.length < 1)
            seconds = '0' + seconds;
        while (millis.length < 2)
            millis = '0' + millis;
        millis = millis.substring(0, 2);
        timeText = seconds + '.' + millis;
    }
    else
    {
        seconds = seconds + '';
        millis = millis + '';
        while (seconds.length < 1)
            seconds = '0' + seconds;
        while (millis.length < 3)
            millis = '0' + millis;
        timeText = seconds + '.' + millis;
    }

    try {
        window.parent.setStat('runningTime', timeText);
    }
    catch (e) {
    }

    //console.log('runningTime -> ' + timeText);
}

function setNumMoves(value)
{
    try {
        window.parent.setStat('numMoves', value);
    }
    catch (e) {
    }

    //console.log('numMoves -> ' + value);
}

function sendLog()
{
    if (stats.log.time.toFixed)
        stats.log.time = stats.log.time.toFixed(2);

    if (stats.log.acuracia.toFixed)
        stats.log.acuracia = stats.log.acuracia.toFixed(2);
    if (stats.log.velocidade.toFixed)
        stats.log.velocidade = stats.log.velocidade.toFixed(2);
    if (stats.log.estabilidade.toFixed)
        stats.log.estabilidade = stats.log.estabilidade.toFixed(2);
    stats.log.gameId = "tangran";
    stats.log.timestamp = (new Date()).getTime();

    //console.log(stats.log);
    try {
        window.parent.saveLogObject(stats.log);
    }
    catch (e) {
    }
}
    