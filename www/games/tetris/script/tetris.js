
var c0;
var c1;

var body;

var background;

var gameContainer;
var gameDisplay;

var gameUi;

var rotateButton;
var downButton;
var leftButton;
var rightButton;

var cells;

var piece;
// piece = { row, column, blocks: [ [0,0], [-1,0], [1,0], [0,-1] ], color: '#f00' }
// piece is a block collection

var columns;
// column[0] = [ block0, block1, block2 ]; column[1] = [ block0, block1 ]; ... column[n] = [ ... ]
// columns is a block collection

var colors = ['#c33', '#3c3', '#33c', '#cc3', '#c3c', '#3cc'];

var pieceTemplates =
        [
            [[-1, 0], [0, 0], [1, 0], [2, 0]],
            [[-1, 0], [0, 0], [1, 0], [0, -1]],
            [[-1, 0], [0, 0], [0, 1], [1, 1]],
            [[0, 0], [0, 1], [1, 0], [1, 1]],
            [[-1, 0], [0, 0], [1, 0], [1, 1]],
        ]

var numRows = 24;
var numColumns = 10;
var ticksPerSecond = 20;

var vSpeed = 2;
var hSpeed = 4;

var blockWidth;
var blockHeight;

var stats = {};

$(function ()
{
    body = $('body');

    c0 = $('#c0');
    c1 = $('#c1');

    background = $('#background');
    BackgroundUtil.SetBackgroundImage(background, 'game_background');

    gameDisplay = $('#game');

    showHelpScreen();
});

function showHelpScreen()
{
    var gameHelp = $('#game-help');
    //gameHelp.css('background-image','url("assets/help_background.png")');
    BackgroundUtil.SetBackgroundImage(gameHelp, 'help_background');

    var btPlay = $('<div></div>');
    btPlay.css('position', 'absolute');
    btPlay.attr('id', 'btPlay');
    btPlay.css('cursor', 'pointer');
    btPlay.left(360);
    btPlay.top(290);
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

var levelDifficulty = 0;

function playLevelId(difficulty)
{
    /*
     if(difficulty == 0)
     levelId = Math.floor( 0 + Math.random() * 4 );
     else if(difficulty == 1)
     levelId = Math.floor( 4 + Math.random() * 6 );
     else if(difficulty >= 2)
     levelId = Math.floor( 10 + Math.random() * 4 );
     
     level = JSON.parse(JSON.stringify(levels[levelId]));
     level.difficulty = difficulty;
     game.initializeLevel(level);
     */

    body.on('keydown', _onKeyDown);
    body.on('keydown', onKeyDown);
    body.on('keyup', _onKeyUp);
    body.on('keyup', onKeyUp);

    levelDifficulty = difficulty;

    initializeGame();

    initializeOnScreenButtons();

    showGame();
}

function showGame()
{
    setSize();
    setTimeout(function ()
    {
        gameDisplay.animate({opacity: 1}, 500);
    }, 250);
}

function setSize()
{
    var ratio = numColumns / numRows;

    var backgroundWidth = background.width();
    var backgroundHeight = background.height();
    var backgroundRatio = (backgroundWidth / backgroundHeight);

    var width = 144;
    var height = 342;

    gameDisplay.width(width);
    gameDisplay.height(height);


    blockHeight = height / numRows;
    blockWidth = width / numColumns;

    for (var i = 0; i < numRows; i++)
    {
        var y = (i * blockHeight);
        for (var j = 0; j < numColumns; j++)
        {
            var cell = cells[i][j];
            var cellDisplay = cell.display;

            var x = (j * blockWidth);

            cellDisplay.css('left', (x + 'px'));
            cellDisplay.css('top', (y + 'px'));

            cellDisplay.height(blockHeight);
            cellDisplay.width(blockWidth);
        }
    }
}

var _numMoves;
var _runningTime;
var _isRunning;
var _lastTimerTick;
var _timer;

var baseRow;

function initializeGame()
{
    gameDisplay.empty();

    baseRow = (levelDifficulty * 4);

    cells = [];
    for (var i = 0; i < numRows; i++)
    {
        cells[i] = [];
        for (var j = 0; j < numColumns; j++)
        {
            var cell =
                    {
                        row: i,
                        column: j,
                        display: null,
                    }

            var cellDisplay = $('<div></div>');

            cellDisplay.attr('class', (i < baseRow) ? 'inactive-cell' : 'cell');
            cell.display = cellDisplay;

            cells[i][j] = cell;

            gameDisplay.append(cellDisplay);
        }
    }

    columns = [];
    for (var i = 0; i < numColumns; i++)
        columns.push([]);

    stats =
            {
                initializedTime: new Date().getTime(),
                totalBlocks: 0,
                removedBlocks: 0,
                totalPieces: 0,
                pieceSpawnTime: 0,
                pieceTimes: [],
                log:
                        {
                            acuracia: 0,
                            velocidade: 0,
                            estabilidade: 0
                        }
            }

    if (piece)
        removePiece();
    addPiece();

    _numMoves = 0;
    _runningTime = 0;
    _lastTimerTick = -1;
    _isRunning = true;
    _timer = setInterval(onTimerTick, Math.floor(1000 / ticksPerSecond));


    setNumMoves(_numMoves);
    setRunningTime(_runningTime);
}

function initializeOnScreenButtons()
{
    //$(element).css('background-image', 'url(\''+'data:image/png;base64,'+B64Assets[sourceName]+'\')');
    //$(element).css('background-size', '100% 100%');

    gameUi = $('#game-ui');

    rotateButton = $('<div style="position:absolute; background-image: url(\'rotate_button.png\');"></div>');
    rotateButton.css({'width': '114px', 'height': '114px', 'left': '25px', 'top': '125px'});
    gameUi.append(rotateButton);
    rotateButton.on('mousedown', function () {
        rotatePiece();
    });

    downButton = $('<div style="position:absolute; background-image: url(\'down_button.png\');"></div>');
    downButton.css({'width': '114px', 'height': '114px', 'left': '388px', 'top': '125px'});
    gameUi.append(downButton);
    downButton.mousedown(function (e) {
        _onKeyDown({keyCode: KEY_DOWN})
    });
    body.mouseup(function (e) {
        _onKeyUp({keyCode: KEY_DOWN})
    });

    leftButton = $('<div style="position:absolute; background-image: url(\'left_button.png\');"></div>');
    leftButton.css({'width': '114px', 'height': '114px', 'left': '25px', 'top': '229px'});
    gameUi.append(leftButton);
    leftButton.mousedown(function (e) {
        _onKeyDown({keyCode: KEY_LEFT})
    });
    body.mouseup(function (e) {
        _onKeyUp({keyCode: KEY_LEFT})
    });

    rightButton = $('<div style="position:absolute; background-image: url(\'right_button.png\');"></div>');
    rightButton.css({'width': '114px', 'height': '114px', 'left': '388px', 'top': '229px'});
    gameUi.append(rightButton);
    rightButton.mousedown(function (e) {
        _onKeyDown({keyCode: KEY_RIGHT})
    });
    body.mouseup(function (e) {
        _onKeyUp({keyCode: KEY_RIGHT})
    });
}

function finalizeGame()
{
    _isRunning = false;

    //  alert('Game Finalized!');

    stats.log.time = _runningTime;
    stats.log.success = false;
    stats.log.level = levelDifficulty;

    var dMult = [40, 60, 100];
    stats.log.pontuacao = ((stats.log.acuracia + stats.log.velocidade + stats.log.estabilidade) / 3) * dMult[levelDifficulty];

    stats.log['memoria'] = stats.log.pontuacao * 2;
    stats.log['visuo_espacial'] = stats.log.pontuacao * 3;
    stats.log['resolucao_problemas'] = stats.log.pontuacao * 5;
    stats.log['psico_motora'] = stats.log.pontuacao * 1;
    stats.log['logico_matematica'] = stats.log.pontuacao * 3;
    stats.log['linguagem'] = stats.log.pontuacao * 1;
    stats.log['tentativas'] = stats.totalBlocks;
    stats.log['acertos'] = stats.removedBlocks;
    sendLog();
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
            setRunningTime(_runningTime);
            updateGame(dt);
        }
    }
    _lastTimerTick = currentTimerTick;
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

var KEY_SPACE = 32;
var KEY_ENTER = 13;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var _pressedKeys = [];
function _onKeyDown(e) {
    if (_pressedKeys.indexOf(e.keyCode) == -1)
        _pressedKeys.push(e.keyCode);
}
function _onKeyUp(e) {
    var index = _pressedKeys.indexOf(e.keyCode);
    if (index > -1)
        _pressedKeys.splice(index, 1);
}
function isKeyPressed(key) {
    return _pressedKeys.indexOf(key) > -1;
}

function onKeyDown(e)
{
    if (e.keyCode == KEY_SPACE || e.keyCode == KEY_UP)
    {
        rotatePiece();
    }
}

function onKeyUp(e)
{
}

var _totalDr = 0;

var _lastMove = -1;

function updateGame(dt)
{
    if (isKeyPressed(KEY_LEFT))
    {
        if (((_lastMove == -1 || (_runningTime - _lastMove) > 100)) && canMove(-1))
        {
            _lastMove = _runningTime;
            piece.column--;
        }
    }

    if (isKeyPressed(KEY_RIGHT))
    {
        if (((_lastMove == -1 || (_runningTime - _lastMove) > 100)) && canMove(1))
        {
            _lastMove = _runningTime;
            piece.column++;
        }
    }

    if (isKeyPressed(KEY_DOWN))
        piece.fastV = true;

    var row = piece.row;
    var column = piece.column;

    var baseSpeed = (levelDifficulty + 2);
    var dr = (piece.fastV ? (2 * baseSpeed) : baseSpeed) * (vSpeed / ticksPerSecond);

    row += dr;
    _totalDr += dr;

    if (_totalDr > 1)
    {
        row = Math.floor(row);
        piece.fastV = false;
        _totalDr = 0;

        var stop = tryStopPiece();
        if (stop)
        {
            _totalDr = 0;
            while (tryRemoveRows())
                ;
            return;
        }

        if (!_isRunning)
            return;

        //if(!stop && piece.nextDirection)
        //    piece.direction = piece.nextDirection;
        //piece.nextDirection = null;
    }

    piece.row = row;
    piece.column = column;

    updatePiece();
}

function rotatePiece(rotation)
{
    if (piece.template == 3)
        rotation = 0;

    if (rotation == undefined)
        rotation = (360 + piece.rotation + 90) % 360;
    piece.rotation = rotation;

    var sin = Math.sin(rotation * Math.PI / 180);
    var cos = Math.cos(rotation * Math.PI / 180);

    for (var i = 0; i < piece.blocks.length; i++)
    {
        var block = piece.blocks[i];
        block.rdx = (cos * block.dx - sin * block.dy);
        block.rdy = (cos * block.dy + sin * block.dx);

        var c = Math.round(block.rdx + piece.column);
        if (c < 0)
            piece.column += (0 - c);
        else if (c > numColumns - 1)
            piece.column -= (c - (numColumns - 1));
    }
}

function updatePiece()
{
    for (var i = 0; i < piece.blocks.length; i++)
    {
        var block = piece.blocks[i];
        var blockDisplay = block.display;

        blockDisplay.width(blockWidth);
        blockDisplay.height(blockHeight);

        var x = (piece.column + block.rdx) * blockWidth;
        var y = (piece.row + block.rdy) * blockHeight;

        blockDisplay.css('top', y + 'px');
        blockDisplay.css('left', x + 'px');
    }
}

var _nextPiece;
var _nextPieceDisplay;

function generateNextPiece()
{
    _nextPiece = getAny(pieceTemplates);
    //console.log('next-piece -> '+_nextPiece);

    if (!_nextPieceDisplay)
    {
        _nextPieceDisplay = $('<div style="position:absolute;"></div>');
        body.append(_nextPieceDisplay);
        _nextPieceDisplay.css('top', '50px');
        _nextPieceDisplay.css('left', '50px');
    }

    _nextPieceDisplay.empty();

    for (var i = 0; i < _nextPiece.length; i++)
    {
        var block = _nextPiece[i];

        var blockDisplay = $('<div><div>');
        blockDisplay.attr('class', 'block');
        blockDisplay.css('background-color', '#eee');
        blockDisplay.width(blockWidth);
        blockDisplay.height(blockHeight);
        _nextPieceDisplay.append(blockDisplay);

        blockDisplay.css('top', (block[1] * blockHeight) + 'px');
        blockDisplay.css('left', (block[0] * blockWidth) + 'px');
    }
}

function addPiece()
{
    if (piece)
        return;

    var color = getAny(colors);
    var template = _nextPiece || getAny(pieceTemplates);

    generateNextPiece();

    piece =
            {
                row: baseRow,
                column: 4,
                blocks: [],
                color: color,
                template: pieceTemplates.indexOf(template)
            }

    for (var i = 0; i < template.length; i++)
    {
        var block =
                {
                    dx: template[i][0],
                    dy: template[i][1],
                    display: null
                }

        var blockDisplay = $('<div><div>');
        blockDisplay.attr('class', 'block');
        blockDisplay.css('background-color', color);
        blockDisplay.width(blockWidth);
        blockDisplay.height(blockHeight);
        gameDisplay.append(blockDisplay);

        block.display = blockDisplay;

        piece.blocks.push(block);
    }

    var r = Math.floor(Math.random() * 4);
    rotatePiece(r * 90);

    stats.totalBlocks += piece.blocks.length;
    stats.totalPieces++;
    stats.pieceSpawnTime = new Date().getTime();


}
function getAny(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function stopPiece()
{
    if (!piece)
        return;

    piece.row = Math.round(piece.row);
    piece.column = Math.round(piece.column);
    updatePiece();

    var maxR = 0;

    for (var i = 0; i < piece.blocks.length; i++)
    {
        var block = piece.blocks[i];
        var c = Math.round(block.rdx + piece.column);
        var r = (numRows - 1) - Math.round(block.rdy + piece.row);
        columns[c][r] = block;

        if (r > maxR)
            maxR = r;
    }

    if (maxR + 2 >= (numRows - baseRow))
    {
        finalizeGame();
        return;
    }

    piece = null;

    var timeNow = new Date().getTime();
    var pieceTime = (timeNow - stats.pieceSpawnTime);
    stats.pieceTimes.push(pieceTime);

    var gameTime = (timeNow - stats.initializedTime) / 1000;
    stats.log.velocidade = (stats.totalPieces / gameTime);
    stats.log.estabilidade = (1 / desvpad(stats.pieceTimes));

    //printLog();
    _numMoves++;
    setNumMoves(_numMoves);

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

function removePiece()
{
    if (!piece)
        return;

    for (var i = 0; i < piece.blocks.length; i++)
        piece.blocks[i].display.remove();
    piece = null;
}

function tryStopPiece()
{
    var stop = false;

    for (var i = 0; i < piece.blocks.length; i++)
    {
        var block = piece.blocks[i];
        var c = Math.round(block.rdx + piece.column);
        var r = (numRows - 1) - Math.round(block.rdy + piece.row);

        if (r == 0 || columns[c][r - 1])
        {
            stop = true;
            break;
        }
    }

    if (stop)
    {
        stopPiece();
        addPiece();
    }

    return stop;
}

function canMove(dc)
{
    var move = true;

    for (var i = 0; i < piece.blocks.length; i++)
    {
        var block = piece.blocks[i];
        var c = Math.round(block.rdx + piece.column) + dc;
        var r = (numRows - 1) - Math.round(block.rdy + piece.row);

        if (c < 0 || c > numColumns - 1 || columns[c][r] || columns[c][r - 1])
        {
            move = false;
            break;
        }
    }

    return move;
}

function tryRemoveRows()
{
    var count;

    var result = false;

    for (var i = 0; i < numRows; i++)
    {
        count = 0;
        for (var j = 0; j < numColumns; j++)
        {
            if (columns[j][i])
                count++;
        }

        if (count == numColumns)
        {
            for (var j = 0; j < numColumns; j++)
            {
                var block = columns[j][i];
                var blockDisplay = block.display;
                blockDisplay.remove();

                columns[j].splice(i, 1);
                for (var k = i; k < columns[j].length; k++)
                {
                    block = columns[j][k];
                    if (block)
                    {
                        blockDisplay = block.display;
                        var top = (numRows - k - 1) * blockHeight;
                        blockDisplay.css('top', top + 'px')
                    }
                }
            }

            stats.removedBlocks += count;
            stats.log.acuracia = (stats.removedBlocks / stats.totalBlocks);
            //printLog();

            result = true;
        }
        //else if(count == 0)
        //break;
    }

    return result;
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

    stats.log.gameId = "tetris";
    stats.log.timestamp = (new Date()).getTime();
    //console.log(stats.log);
    try {
        window.parent.saveLogObject(stats.log);
    }
    catch (e) {
    }
}
 