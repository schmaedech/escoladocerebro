(function ($)
{
    $.fn.left = function (value)
    {
        if (value != undefined)
        {
            this.css('left', value);
            return this;
        }
        else
            return parseInt(this.css('left').replace('px', ''));
    };

    $.fn.top = function (value)
    {
        if (value != undefined)
        {
            this.css('top', value);
            return this;
        }
        else
            return parseInt(this.css('top').replace('px', ''));
    };
}
(jQuery));

function RushHourGame()
{
    RushHourGame.instance = this;

    this.container = $('#game-container');
    this.level = null;

    this.cells = null;
    this.objects = null;
    this.pieces = null;
    this.allowPieceMove = false;
    this.targetPosition = null;
    this.mainPiece = null;

    this.content = $('<div id="rushHourGame" style="position:relative; width:100%; height:100%; overflow:hiddem;"></div>');

    this.boardContent = $('<div id="boardContent" style="position:absolute;"></div>');
    $(this.content).append(this.boardContent);
}

RushHourGame.prototype.setNumMoves = function (value)
{
    if (value == undefined)
        return this.numMoves;

    this.numMoves = value;

    try {
        window.parent.setStat('numMoves', value);
    }
    catch (e) {
    }

    $(this.spanNumMoves).text(value);
}

RushHourGame.prototype.setRunningTime = function (value)
{
    if (value == undefined)
        return this.runningTime;

    this.runningTime = value;

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

    $(this.spanRunningTime).text(timeText);
}

RushHourGame.prototype.startTimer = function (callback, interval)
{
    var instance = RushHourGame.instance;

    if (interval == undefined || isNaN(interval) || interval <= 20)
        interval = 20;

    if (!callback)
        return;

    instance.isRunning = true;

    var lastTimerTick = new Date().getTime();

    _tick();

    function _tick()
    {
        if (!instance.isRunning)
            return;

        var currentTimerTick = new Date().getTime();

        callback.call(null, currentTimerTick - lastTimerTick);

        lastTimerTick = currentTimerTick;

        setTimeout(_tick, interval);
    }
}

RushHourGame.prototype.stopTimer = function ()
{
    var instance = RushHourGame.instance;
    instance.isRunning = false;
}

RushHourGame.prototype.onTimerTick = function (delta)
{
    var instance = RushHourGame.instance;

    instance.runningTime += delta;
    instance.setRunningTime(instance.runningTime);
}

RushHourGame.prototype.initializeGrid = function (numRows, numColumns, tileBackgroundSource)
{
    if (!this.boardContent || !$(this.boardContent).parent())
        return;

    this.numRows = numRows;
    this.numColumns = numColumns;
    this.tileBackgroundSource = tileBackgroundSource;

    this.cellWidth = $(this.content).width() / (this.numColumns);
    this.cellHeight = $(this.content).height() / (this.numRows);

    $(this.boardContent).left(0);
    $(this.boardContent).top(0);

    this.cells = new Array(numRows);

    for (var i = 0; i < numRows; i++)
    {
        this.cells[i] = new Array(numColumns);
        for (var j = 0; j < numColumns; j++)
        {
            var cellStyle = 'position:absolute; ';
            var cellId = 'cell_' + i + '_' + j;

            var cellDisplay = $('<div id="' + cellId + '" style="' + cellStyle + '"></div>');
            if (tileBackgroundSource)
                BackgroundUtil.SetBackgroundImage(cellDisplay, tileBackgroundSource);
            $(cellDisplay).left(j * this.cellWidth);
            $(cellDisplay).top(i * this.cellHeight);
            $(cellDisplay).width(this.cellWidth);
            $(cellDisplay).height(this.cellHeight);

            this.cells[i][j] = {id: cellId, row: i, column: j, display: cellDisplay, free: true};
            $(this.boardContent).append(cellDisplay);
            console.log(i + ',' + j + ' c:' + this.boardContent);
        }
    }
};

RushHourGame.prototype.initializeLevel = function (level)
{
    this.level = level;

    var numRows = level.length;
    var numColumns = level[0].length;
    var tileBackgroundSource = level.tileBackgroundSource;

    BackgroundUtil.SetBackgroundImage(this.container, 'screen_background');

    $(this.boardContent).empty();
    //BackgroundUtil.SetBackgroundImage(this.content, 'board_background');

    this.initializeGrid(numRows, numColumns, tileBackgroundSource);

    var tilesToSkip = new Array();
    function skipTile(tile)
    {
        for (var i = 0; i < tilesToSkip.length; i++)
        {
            if (tilesToSkip[i].row == tile.row && tilesToSkip[i].column == tile.column)
            {
                tilesToSkip.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    var objectId = 0;

    this.objects = new Array();
    for (var i = 0; i < numRows; i++)
    {
        for (var j = 0; j < numColumns; j++)
        {
            if (skipTile({row: i, column: j}))
                continue;

            var tileValue = level[i][j];
            if (tileValue == ' ' || tileValue == '_' || tileValue == '-')
                continue;

            console.log('i:' + i + ', j:' + j + ', value:' + tileValue);

            var object =
                    {
                        id: 'object' + this.objects.length,
                        source: '',
                        direction: null,
                        length: 1,
                        row: i,
                        column: j,
                        isMain: false
                    }

            if ((j + 1) < numColumns && level[i][j + 1] == tileValue)
                object.direction = 'hor';
            else if ((i + 1) < numRows && level[i + 1][j] == tileValue)
                object.direction = 'vert';
            else
                object.direction = 'hor';

            var newTileValue;
            var hDelta = (object.direction == 'hor') ? 1 : 0;
            var vDelta = (object.direction == 'vert') ? 1 : 0;
            do
            {
                newTileValue = null;

                if ((i + vDelta) < numRows && (j + hDelta) < numColumns)
                    newTileValue = level[i + vDelta][j + hDelta];

                if (newTileValue == tileValue)
                {
                    tilesToSkip.push({row: i + vDelta, column: j + hDelta});
                    object.length++;
                }
                else
                    break;

                if (hDelta > 0)
                    hDelta++;
                if (vDelta > 0)
                    vDelta++;
            }
            while (newTileValue == tileValue);

            if (object.length == 1)
            {
                this.mainPiece = object.id;
                this.targetPosition = {row: object.row, column: 5};
                object.isMain = true;
                object.direction = 'hor';
                object.source = 'joaninha_left';
            }
            else
            {
                var sources = ['tronco', 'pedra', 'folha'];
                var source = sources[Math.floor(Math.random() * sources.length * 10) % sources.length];
                object.source = source + '_' + object.length + object.direction.charAt(0);
            }

            this.objects.push(object);
        }
    }

    this.initializePieces();
}

RushHourGame.prototype.initializePieces = function ()
{
    if (!this.boardContent || !$(this.boardContent).parent())
        return;

    this.pieces = new Array();

    for (var i = 0; i < this.objects.length; i++)
    {
        var object = this.objects[i];

        var piece =
                {
                    id: ('piece_' + object.id),
                    object: object,
                    direction: object.direction,
                    row: object.row,
                    column: object.column,
                    width: (object.direction == 'hor') ? object.length : 1,
                    height: (object.direction == 'vert') ? object.length : 1,
                    display: null
                };

        var colors = ['fff', '#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#000'];
        var c = Math.floor(Math.random() * colors.length);
        var color = colors[c];
        var source = piece.object.source;
        var pieceStyle = 'position:absolute; cursor: all-scroll;';
        piece.dynamicSource = (source.indexOf('_left') > -1 || source.indexOf('_right') > -1 && source.indexOf('_up') > -1 || source.indexOf('_down') > -1);

        var pieceDisplay = $('<div id="' + piece.id + '" style="' + pieceStyle + '"></div>');
        BackgroundUtil.SetBackgroundImage(pieceDisplay, source);
        $(pieceDisplay).width(piece.width * this.cellWidth);
        $(pieceDisplay).height(piece.height * this.cellHeight);

        piece.display = pieceDisplay;
        $(pieceDisplay).data('piece', piece);

        this.pieces.push(piece);
        $(this.boardContent).append(pieceDisplay);

        var cell = this.cells[piece.row][piece.column];
        this.setPieceOnCell(piece, cell);

        $(pieceDisplay).on('mousedown', this.onPiecePointerDown);

        if (object.id == this.mainPiece)
            this.mainPiece = piece;
    }

    this.totalNumMoves = 0;
    this.redundantNumMoves = 0;
    this.setNumMoves(0);
    this.setRunningTime(0);
    this.isRunning = false;
    this.clickIntervals = [];
    this.lastClickTime = 0;

    this.allowPieceMove = true;
}

RushHourGame.prototype.setPieceOnCell = function (piece, cell)
{
    var instance = RushHourGame.instance;

    var pieceLength = piece.object.length;

    for (var i = 0; i < pieceLength; i++)
    {
        var r = piece.row + ((piece.direction == 'vert') ? i : 0);
        var c = piece.column + ((piece.direction == 'hor') ? i : 0);
        instance.cells[r][c].free = true;
    }

    if (cell)
    {
        var cellDisplay = cell.display;
        var pieceDisplay = piece.display;

        piece.row = cell.row;
        piece.column = cell.column;

        for (var i = 0; i < pieceLength; i++)
        {
            var r = piece.row + ((piece.direction == 'vert') ? i : 0);
            var c = piece.column + ((piece.direction == 'hor') ? i : 0);
            instance.cells[r][c].free = false;
        }

        $(pieceDisplay).left(piece.column * this.cellWidth);
        $(pieceDisplay).top(piece.row * this.cellHeight);
    }
}

RushHourGame.prototype.verifyGameComplete = function ()
{
    var instance = RushHourGame.instance;
    var gameComplete = (instance.targetPosition.row == instance.mainPiece.row
            && instance.targetPosition.column == instance.mainPiece.column);

    if (gameComplete)
    {
        instance.allowPieceMove = false;
        instance.stopTimer();

        var pieceDisplay = instance.mainPiece.display;

        var left = $(pieceDisplay).left();
        var top = $(pieceDisplay).top();

        var cell0Display = instance.cells[0][0].display;
        var tileSize = $(cell0Display).width();

        if (instance.mainPiece.direction == 'vert')
            top += 2 * tileSize;
        else//(instance.mainPiece.direction == 'hor')
            left += 2 * tileSize;

        var avgInterval = 0;
        for (var i = 0; i < instance.clickIntervals.length; i++)
            avgInterval += instance.clickIntervals[i];
        avgInterval = avgInterval / instance.clickIntervals.length;

        var dp = 0;
        for (var i = 0; i < instance.clickIntervals.length; i++)
            dp += Math.pow(instance.clickIntervals[i] - avgInterval, 2);
        dp = Math.pow(dp / instance.clickIntervals.length - 1, 0.5);

        var logObject =
                {
                    acuracia: ((instance.numMoves - instance.redundantNumMoves) / instance.totalNumMoves),
                    velocidade: (instance.totalNumMoves / (instance.runningTime / 1000)),
                    estabilidade: (1 / (dp)),
                    time: instance.runningTime,
                    success: true,
                    level: this.level.difficulty
                }

        var dMult = [40, 60, 100];
        logObject.pontuacao = ((logObject.acuracia + logObject.velocidade + logObject.estabilidade) / 3) * dMult[this.level.difficulty];
        logObject.gameId = "joaninha";
        logObject.timestamp = (new Date()).getTime();
        logObject['memoria'] = logObject.pontuacao * 2;
        logObject['visuo_espacial'] = logObject.pontuacao * 3;
        logObject['resolucao_problemas'] = logObject.pontuacao * 5;
        logObject['psico_motora'] = logObject.pontuacao * 1;
        logObject['logico_matematica'] = logObject.pontuacao * 3;
        logObject['linguagem'] = logObject.pontuacao * 1;
        logObject['tentativas'] = instance.numMoves;
        logObject['acertos'] = instance.clickIntervals.length;
        //alert(JSON.stringify(logObject, null, 4));

        $(pieceDisplay).animate({left: left + 'px', top: top + 'px', opacity: 0}, 200, onAnimateComplete);
        function onAnimateComplete()
        {
            $(pieceDisplay).remove();
            try {
                window.parent.saveLogObject(logObject);
            }
            catch (e) {
            }
        }

    }

    return gameComplete;
}

RushHourGame.prototype.setPieceDirection = function (piece, direction)
{
    var pieceDisplay = piece.display;

    var source = piece.object.source;

    if (!source || !piece.dynamicSource)
        return;

    if (source.indexOf('_left') > -1)
        source = source.replace('_left', '_' + direction);
    else if (source.indexOf('_right') > -1)
        source = source.replace('_right', '_' + direction);
    else if (source.indexOf('_up') > -1)
        source = source.replace('_up', '_' + direction);
    else if (source.indexOf('_down') > -1)
        source = source.replace('_down', '_' + direction);

    BackgroundUtil.SetBackgroundImage(pieceDisplay, source);
}

RushHourGame.prototype.onPiecePointerDown = function (e)
{
    var instance = RushHourGame.instance;

    if (!instance.allowPieceMove)
        return;

    instance.allowPieceMove = false;

    var piece = $(this).data('piece');
    var pieceDisplay = piece.display;

    var minLeft = 0;
    var maxLeft = $(instance.content).width() - $(this).width();
    var minTop = 0;
    var maxTop = $(instance.content).height() - $(this).height();

    var lastPageX = e.pageX;
    var lastPageY = e.pageY;

    var sourceDirection = '';

    var gameScaleX = $('#game-display').data('scaleX');
    var gameScaleY = $('#game-display').data('scaleY');

    $('body').on('mousemove', onPointerMove);
    $('body').on('mouseup', onPointerUp);

    instance.setPieceOnCell(piece, null);

    var freeTilesBefore = getFreeCells(-1);
    var freeTilesAfter = getFreeCells(1) - (piece.object.length - 1);

    var cell0Display = instance.cells[0][0].display;
    var tileSize = $(cell0Display).width();

    if (piece.direction == 'vert')
    {
        minTop = $(pieceDisplay).top() - freeTilesBefore * tileSize;
        maxTop = $(pieceDisplay).top() + freeTilesAfter * tileSize;
    }
    else//(piece.direction == 'hor')
    {
        minLeft = $(pieceDisplay).left() - freeTilesBefore * tileSize;
        maxLeft = $(pieceDisplay).left() + freeTilesAfter * tileSize;
    }

    function getFreeCells(direction)
    {
        var r;
        var c;
        var freeCell;

        var count = 0;

        r = piece.row;
        c = piece.column;
        do
        {
            r += direction * (piece.direction == 'vert' ? 1 : 0);
            c += direction * (piece.direction == 'hor' ? 1 : 0);

            if (r < 0 || r >= instance.numRows || c < 0 || c >= instance.numColumns)
            {
                freeCell = false;
            }
            else
            {
                freeCell = instance.cells[r][c].free;
                if (freeCell)
                    count++;
            }
        }
        while (freeCell);

        return count;
    }

    function onPointerMove(e)
    {
        var left = $(pieceDisplay).left();
        var top = $(pieceDisplay).top();

        var newSourceDirection = sourceDirection;
        var delta;

        if (piece.direction == 'hor')
        {
            delta = (e.pageX - lastPageX) / gameScaleX;
            left += delta;
            left = Math.min(Math.max(minLeft, left), maxLeft);
            if (delta > 0)
                newSourceDirection = 'left';
            else if (delta < 0)
                newSourceDirection = 'right';
        }

        if (piece.direction == 'vert')
        {
            delta = (e.pageY - lastPageY) / gameScaleY;
            top += delta;
            top = Math.min(Math.max(minTop, top), maxTop);
            if (delta > 0)
                newSourceDirection = 'down';
            else if (delta < 0)
                newSourceDirection = 'up';
        }

        if (newSourceDirection != sourceDirection)
        {
            sourceDirection = newSourceDirection;
            instance.setPieceDirection(piece, sourceDirection);
        }

        $(pieceDisplay).left(left);
        $(pieceDisplay).top(top);

        lastPageX = e.pageX;
        lastPageY = e.pageY;
    }

    function onPointerUp(e)
    {
        $('body').off('mousemove', onPointerMove);
        $('body').off('mouseup', onPointerUp);

        var pieceLeft = $(pieceDisplay).left();
        var pieceTop = $(pieceDisplay).top();

        var minDistance = -1;
        var minCell = null;

        for (var i = 0; i < instance.numRows; i++)
        {
            for (var j = 0; j < instance.numColumns; j++)
            {
                var cell = instance.cells[i][j];
                var cellDisplay = cell.display;

                var cellLeft = $(cellDisplay).left();
                var cellTop = $(cellDisplay).top();

                var distance = Math.sqrt(Math.pow(cellLeft - pieceLeft, 2) + Math.pow(cellTop - pieceTop, 2));
                if (!minCell || distance < minDistance)
                {
                    minDistance = distance;
                    minCell = cell;
                }
            }
        }

        instance.totalNumMoves++;

        if (instance.lastClickTime > 0)
            instance.clickIntervals.push(instance.runningTime - instance.lastClickTime);
        instance.lastClickTime = instance.runningTime;

        if (piece.row != minCell.row || piece.column != minCell.column)
        {
            instance.numMoves += 1;
            instance.setNumMoves(instance.numMoves);

            if (piece.lastRow2 && piece.lastColumn2)
            {
                if (piece.row == piece.lastRow2 && piece.column == piece.lastColumn2)
                    instance.redundantNumMoves += 1;
            }

            piece.lastRow2 = piece.lastRow;
            piece.lastColumn2 = piece.lastColumn;

            piece.lastRow = piece.row;
            piece.lastColumn = piece.column;
        }

        if (!instance.isRunning)
            instance.startTimer(instance.onTimerTick, 20);

        //piece.row = minCell.row;
        //piece.column = minCell.column;

        var left = minCell.column * instance.cellWidth;
        var top = minCell.row * instance.cellHeight;
        pieceDisplay.animate({left: left + 'px', top: top + 'px'}, 200, onAnimateComplete);
        function onAnimateComplete()
        {
            instance.setPieceOnCell(piece, minCell);
            instance.allowPieceMove = true;
            if (piece == instance.mainPiece)
                instance.verifyGameComplete();
        }
    }
}

var BackgroundUtil = {};

BackgroundUtil.SetBackgroundImage = function (element, sourceName)
{
    //console.log(sourceName+' -> '+B64Assets[sourceName])
    //console.log('SetBackgroundImage -> '+sourceName);
    $(element).css('background-image', 'url(\'' + 'assets/' + sourceName + '.png' + '\')');
    //$(element).css('background-image', 'url(\''+'data:image/png;base64,'+B64Assets[sourceName]+'\')');
    $(element).css('background-size', '100% 100%');
}
