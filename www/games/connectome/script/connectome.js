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


function PipeGame()
{
    PipeGame.instance = this;

    this.contentLeft = $('#game').left();
    this.contentTop = $('#game').top();

    this.container = $('#game-container');
    this.level = null;

    this.cells = null;
    this.objects = null;
    this.pieces = null;
    this.pathCells = null;
    this.allowPieceMove = false;

    this.content = $('<div id="PipeGame" style="position:relative; width:100%; height:100%; overflow:visible;"></div>');

    if (PipeGame.DEBUG)
        $(this.content).css('border', 'solid 2px #00F');
}

PipeGame.DEBUG = false;


PipeGame.prototype.setNumMoves = function (value)
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

PipeGame.prototype.setRunningTime = function (value)
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

PipeGame.prototype.startTimer = function (callback, interval)
{
    var instance = PipeGame.instance;

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

PipeGame.prototype.stopTimer = function ()
{
    var instance = PipeGame.instance;
    instance.isRunning = false;
}

PipeGame.prototype.onTimerTick = function (delta)
{
    var instance = PipeGame.instance;

    instance.runningTime += delta;
    instance.setRunningTime(instance.runningTime);
}

PipeGame.prototype.initializeLevel = function (level)
{
    this.level = level;
    this.objects = level.objects;

    var numRows = level.numRows;
    var numColumns = level.numColumns;

    BackgroundUtil.SetBackgroundImage(this.container, 'screen_background');

    $(this.content).empty();

    this.initializeGrid(numRows, numColumns);

    var difficulty = level.difficulty;

    var pathOk = false;
    while (!pathOk)
    {
        this.initializePath();
        var curveCount = 0;
        for (var i = 0; i < this.pathCells.length; i++)
            if (this.pathCells[i].expectedType.charAt(0) == 'q')
                curveCount++;
        pathOk = (difficulty == 0 && curveCount > 0 && curveCount <= 4)
                || (difficulty == 1 && curveCount > 4 && curveCount <= 8)
                || (difficulty == 2 && curveCount > 8);
    }

    this.initializeObjects();

    this.initializePieces();
}

PipeGame.prototype.initializeGrid = function (numRows, numColumns)
{
    if (!this.content || !$(this.content).parent())
        return;

    this.numRows = numRows;
    this.numColumns = numColumns;

    this.cellWidth = $(this.content).width() / this.numColumns;
    this.cellHeight = $(this.content).height() / this.numRows;

    this.cells = new Array(numRows);

    for (var i = 0; i < numRows; i++)
    {
        this.cells[i] = new Array(numColumns);
        for (var j = 0; j < numColumns; j++)
        {
            var cellStyle = 'position:absolute;';
            var cellId = 'cell_' + i + '_' + j;

            var cellDisplay = $('<div id="' + cellId + '" style="' + cellStyle + '"></div>');
            $(cellDisplay).left(j * this.cellWidth);
            $(cellDisplay).top(i * this.cellHeight);
            $(cellDisplay).width(this.cellWidth);
            $(cellDisplay).height(this.cellHeight);

            if (PipeGame.DEBUG)
                $(cellDisplay).css('background-color', 'rgba(0,0,255,0.3)');

            this.cells[i][j] = {id: cellId, row: i, column: j, display: cellDisplay, free: true};
            $(this.content).append(cellDisplay);
        }
    }
};

PipeGame.prototype.initializePath = function ()
{
    var keyColumns = [0, 1, 3, 4, 6, 7];
    var keyRows = [0, 2, 3, 5];

    var keyPoints;
    var lastLength;

    var numRows = keyRows.length;
    var numColumns = keyColumns.length;

    var minKeyPoints = 6;

    var r;
    var c;
    var neighbors;

    this.pathCells = new Array();

    reset();

    do
    {
        lastLength = keyPoints.length;

        neighbors = getNeighbors(r, c);
        if (validateRowColumn(r, c) && neighbors.length > 0)
        {
            keyPoints.push('r' + r + 'c' + c);

            var n = randInt(0, neighbors.length - 1);
            r = neighbors[n][0];
            c = neighbors[n][1];
        }

        if (keyPoints.length >= minKeyPoints && (c == 0 || c == numColumns - 1))
            keyPoints.push('r' + r + 'c' + c);

        if (lastLength == keyPoints.length)
        {
            console.log('=== RESET ===');
            reset();
        }
    }
    while (keyPoints.length < minKeyPoints || (c != 0 && c != numColumns - 1));

    for (var i = 0; i < keyPoints.length; i++)
        keyPoints[i] = readPoint(i);

    var p0 = keyPoints[0];
    this.startPieceRow = p0.r;
    this.startPieceColumn = p0.c;
    this.startPieceType = 'h';
    this.startPieceSource = (this.startPieceColumn == 0) ? 'master_left' : 'master_right';

    var p1 = keyPoints[keyPoints.length - 1];
    this.finishPieceRow = p1.r;
    this.finishPieceColumn = p1.c;
    this.finishPieceType = 'h';
    this.finishPieceSource = (this.finishPieceColumn == 0) ? 'master_left' : 'master_right';

    for (var i = 1; i < keyPoints.length - 1; i++)
    {
        var prev = keyPoints[i - 1];
        var current = keyPoints[i];
        var next = keyPoints[i + 1];

        var rDelta = Math.abs(current.r - prev.r);
        var cDelta = Math.abs(current.c - prev.c);

        if (Math.abs(rDelta) > 0)
        {
            var minR = Math.min(current.r, prev.r);
            var maxR = Math.max(current.r, prev.r);
            for (var n = minR + 1; n <= maxR - 1; n++)
            {
                var cell = this.cells[n][current.c];
                this.pathCells.push(cell);
                cell.free = false;
                cell.expectedType = 'v';
            }
        }
        else if (Math.abs(cDelta) > 0)
        {
            var minC = Math.min(current.c, prev.c);
            var maxC = Math.max(current.c, prev.c);
            for (var n = minC + 1; n <= maxC - 1; n++)
            {
                var cell = this.cells[current.r][n];
                this.pathCells.push(cell);
                cell.free = false;
                cell.expectedType = 'h';
            }
        }

        //current -> expectedType

        rDelta = next.r - prev.r;
        cDelta = next.c - prev.c;

        var expectedType = 'v';

        if (rDelta == 0 && cDelta != 0)
            expectedType = 'h';
        else if (cDelta == 0 && rDelta != 0)
            expectedType = 'v';
        else if (prev.r == current.r && rDelta > 0)
            expectedType = cDelta > 0 ? 'q1' : 'q2';
        else if (prev.r == current.r && rDelta < 0)
            expectedType = cDelta > 0 ? 'q4' : 'q3';
        else if (prev.c == current.c && cDelta < 0)
            expectedType = rDelta > 0 ? 'q4' : 'q1';
        else if (prev.c == current.c && cDelta > 0)
            expectedType = rDelta > 0 ? 'q3' : 'q2';

        if (expectedType.charAt(0) == 'q')
        {
            if (current.r > 0)
                this.cells[current.r - 1][current.c].notCurve = true;
            if (current.r < numRows - 1)
                this.cells[current.r + 1][current.c].notCurve = true;
            if (current.c > 0)
                this.cells[current.r][current.c - 1].notCurve = true;
            if (current.c < numColumns - 1)
                this.cells[current.r][current.c + 1].notCurve = true;
        }

        var cell = this.cells[current.r][current.c];
        this.pathCells.push(cell);
        cell.free = false;
        cell.expectedType = expectedType;
    }

    function reset()
    {
        r = randInt(0, numRows - 1);
        c = (Math.random() > 0.5) ? 0 : numColumns - 1;
        keyPoints = new Array();
        lastLength = 0;
    }

    function readPoint(i)
    {
        var r = parseInt(keyPoints[i].charAt(1));
        r = keyRows[r];
        var c = parseInt(keyPoints[i].charAt(3));
        c = keyColumns[c];
        return {r: r, c: c};
    }

    function validateRowColumn(r, c)
    {
        if ((c == 0 || c == numColumns - 1) && (keyPoints.length > 0 && keyPoints.length < 6))
            return false;

        if (r < 0 || r > numRows - 1 || c < 0 || c > numColumns - 1)
            return false;

        if (keyPoints.indexOf('r' + r + 'c' + c) > -1)
            return false;

        return true;
    }

    function getNeighbors(r, c)
    {
        var neighbors = new Array();

        if (r > 0 && validateRowColumn(r - 1, c))
            neighbors.push([r - 1, c]);
        if (r < numRows - 1 && validateRowColumn(r + 1, c))
            neighbors.push([r + 1, c]);
        if (c > 0 && validateRowColumn(r, c - 1))
            neighbors.push([r, c - 1]);
        if (c < numColumns - 1 && validateRowColumn(r, c + 1))
            neighbors.push([r, c + 1]);

        return neighbors;
    }

    function randInt(min, max)
    {
        min = Math.floor(min);
        max = Math.floor(max);
        if (max < min)
        {
            var aux = max;
            max = min;
            min = aux;
        }
        var delta = (max - min);

        if (delta == 0)
            return min;
        else if (delta == 1)
            return (Math.random() > 0.5) ? max : min;

        return min + (Math.floor(Math.random() * 5 * delta)) % delta;
    }
}

PipeGame.prototype.initializeObjects = function ()
{
    if (!this.content || !$(this.content).parent())
        return;

    var startPieceStyle = 'position:absolute;';
    var startPieceDisplay = $('<div style="' + startPieceStyle + '"></div>');
    BackgroundUtil.SetBackgroundImage(startPieceDisplay, this.startPieceSource);
    $(startPieceDisplay).width(this.cellWidth);
    $(startPieceDisplay).height(this.cellHeight);
    var startDeltaLeft = 0;//(this.startPieceColumn == 0) ? +9 : -5;
    $(startPieceDisplay).left(this.startPieceColumn * this.cellWidth - startDeltaLeft);
    $(startPieceDisplay).top(this.startPieceRow * this.cellHeight);
    $(this.content).append(startPieceDisplay);
    this.cells[this.startPieceRow][this.startPieceColumn].free = false;

    var finishPieceStyle = 'position:absolute;';
    var finishPieceDisplay = $('<div style="' + finishPieceStyle + '"></div>');
    BackgroundUtil.SetBackgroundImage(finishPieceDisplay, this.finishPieceSource);
    $(finishPieceDisplay).width(this.cellWidth);
    $(finishPieceDisplay).height(this.cellHeight);
    var finishDeltaLeft = 0;//(this.finishPieceColumn == 0) ? +9 : -5;
    $(finishPieceDisplay).left(this.finishPieceColumn * this.cellWidth - finishDeltaLeft);
    $(finishPieceDisplay).top(this.finishPieceRow * this.cellHeight);
    $(this.content).append(finishPieceDisplay);
    this.cells[this.finishPieceRow][this.finishPieceColumn].free = false;

    var numObjects = 0;

    for (var k = 0; k < numObjects; k++)
    {
        var ok = false;
        while (!ok)
        {
            var r0 = Math.floor(Math.random() * this.numRows);
            var c0 = Math.floor(Math.random() * this.numColumns);

            if (this.cells[r0][c0].free)
            {
                var areaRHeight = 1;
                var areaCWidth = 1;

                for (var i = 1; i < 3; i++)
                {
                    if (c0 + i < this.numColumns && this.cells[r0][c0 + i].free)
                        areaCWidth++;
                    else
                        break;
                }

                for (var i = 1; i < 2; i++)
                {
                    var rowOk = true;
                    for (var j = 0; j < areaCWidth; j++)
                    {
                        if (r0 + i >= this.numRows || !this.cells[r0 + i][c0 + j].free)
                        {
                            rowOk = false;
                            break;
                        }
                    }
                    if (rowOk)
                        areaRHeight++;
                }

                ok = (areaCWidth >= 1 && areaRHeight >= 1)
                if (ok)
                {
                    var possibleObjects = new Array();

                    for (var i = 0; i < this.level.objects.length; i++)
                        if (this.level.objects[i].rowHeight <= areaRHeight && this.level.objects[i].columnWidth <= areaCWidth)
                            possibleObjects.push(this.level.objects[i]);

                    console.log('possibleObjects: ' + JSON.stringify(possibleObjects));
                    var object = possibleObjects[Math.floor(Math.random() * possibleObjects.length)];

                    var objectSource = object.source;
                    var objectStyle = 'position:absolute;';
                    var objectDisplay = $('<div style="' + objectStyle + '"></div>');
                    BackgroundUtil.SetBackgroundImage(objectDisplay, objectSource);
                    $(objectDisplay).width(object.columnWidth * this.cellWidth);
                    $(objectDisplay).height(object.rowHeight * this.cellHeight);
                    $(objectDisplay).left(c0 * this.cellWidth);
                    $(objectDisplay).top(r0 * this.cellHeight);
                    $(this.content).append(objectDisplay);

                    for (var i = 0; i < object.rowHeight; i++)
                        for (var j = 0; j < object.columnWidth; j++)
                            this.cells[r0 + i][c0 + j].free = false;
                }

            }

        }
    }
}

PipeGame.prototype.initializePieces = function ()
{
    if (!this.content || !$(this.content).parent())
        return;

    this.pieces = new Array();

    var pieceTypes = new Array();
    for (var type in this.level.pieceSources)
        pieceTypes.push(type);

    // === === BEGIN START-FINISH PIECES === ===

    var cell = this.cells[this.startPieceRow][this.startPieceColumn];
    cell.piece = {type: 'h', row: this.startPieceRow, column: this.startPieceColumn}

    var cell = this.cells[this.finishPieceRow][this.finishPieceColumn];
    cell.piece = {type: 'h', row: this.finishPieceRow, column: this.finishPieceColumn}

    // === === END START-FINISH PIECES === ===

    for (var i = 0; i < this.numRows; i++)
    {
        for (var j = 1; j < this.numColumns - 1; j++)
        {
            var cell = this.cells[i][j];
            //if(cell.expectedType)
            if (cell.free || cell.expectedType)
            {
                var piece =
                        {
                            id: 'piece_' + i + '_' + j,
                            type: null,
                            row: i,
                            column: j,
                            display: null
                        }


                var pieceStyle = 'position:absolute;';
                var pieceDisplay = $('<div id="' + piece.id + '" style="' + pieceStyle + '"></div>');
                $(pieceDisplay).width(this.cellWidth);
                $(pieceDisplay).height(this.cellHeight);
                $(pieceDisplay).left(this.contentLeft + piece.column * this.cellWidth);
                $(pieceDisplay).top(this.contentTop + piece.row * this.cellHeight);

                piece.display = pieceDisplay;
                $(pieceDisplay).data('piece', piece);

                var pieceType;
                if (cell.expectedType)
                {
                    pieceType = cell.expectedType;
                }
                else
                {
                    var types = new Array();
                    for (var t = 0; t < pieceTypes.length; t++)
                    {
                        var type = pieceTypes[t];
                        if (!cell.notCurve || (type != 'h' && type != 'v'))
                            types.push(type);
                    }
                    pieceType = types[Math.floor(Math.random() * types.length)];
                }

                this.setPieceType(piece, pieceType);

                var rot = 1 + (Math.floor(Math.random() * 3));
                for (var r = 0; r < rot; r++)
                    this.rotatePiece(piece);

                piece.initialType = piece.type;

                $(pieceDisplay).on('mouseup', this.onPiecePointerUp);

                this.pieces.push(piece);
                $(this.container).append(pieceDisplay);

                cell.piece = piece;
            }
        }
    }


    this.setNumMoves(0);
    this.setRunningTime(0);
    this.isRunning = false;
    this.clickIntervals = [];
    this.lastClickTime = 0;


    this.allowPieceMove = true;
}

PipeGame.prototype.setPieceType = function (piece, type)
{
    var instance = PipeGame.instance;

    if (!piece || piece.type == type)
        return;

    var source = instance.level.pieceSources[type];
    var pieceDisplay = piece.display;

    piece.type = type;
    BackgroundUtil.SetBackgroundImage(pieceDisplay, source);
}

PipeGame.prototype.rotatePiece = function (piece)
{
    var instance = PipeGame.instance;

    var nextType = '';

    switch (piece.type)
    {
        case 'q1' :
            {
                nextType = 'q4'
            }
            break;
        case 'q4' :
            {
                nextType = 'q3'
            }
            break;
        case 'q3' :
            {
                nextType = 'q2'
            }
            break;
        case 'q2' :
            {
                nextType = 'q1'
            }
            break;
        case 'v' :
            {
                nextType = 'h'
            }
            break;
        case 'h' :
            {
                nextType = 'v'
            }
            break;
    }

    instance.setPieceType(piece, nextType);
}

PipeGame.prototype.verifyGameComplete = function ()
{
    var instance = PipeGame.instance;
    var gameComplete = false;

    var row = instance.startPieceRow;
    var column = instance.startPieceColumn;
    var type = 'h';
    var dir = (instance.startPieceColumn == 0) ? 'r' : 'l';

    var path = [];

    nextTile();

    function nextTile()
    {
        if (row < 0 || row >= instance.numRows)
            return;
        if (column < 0 || column >= instance.numColumns)
            return;

        var cell = instance.cells[row][column];
        var piece = cell.piece;
        var pieceType = piece.type;

        var lastPiece = (path.length > 0) ? path[path.length - 1] : null;

        var finishTile = (row == instance.finishPieceRow && column == instance.finishPieceColumn);
        var directionOk = true;

        if (lastPiece)
        {
            if (dir == 'r' && lastPiece.type != 'h' && lastPiece.type != 'q3' && lastPiece.type != 'q2')
                return;
            if (dir == 'l' && lastPiece.type != 'h' && lastPiece.type != 'q1' && lastPiece.type != 'q4')
                return;
            if (dir == 'd' && lastPiece.type != 'v' && lastPiece.type != 'q1' && lastPiece.type != 'q2')
                return;
            if (dir == 'u' && lastPiece.type != 'v' && lastPiece.type != 'q4' && lastPiece.type != 'q3')
                return;
        }

        path.push(piece);

        switch (pieceType)
        {
            case 'h':
                {
                    if (dir == 'r')
                    {
                        column++;
                    }
                    else if (dir == 'l')
                    {
                        column--;
                    }
                    else
                    {
                        directionOk = false;
                    }
                }
                break;

            case 'v':
                {
                    if (dir == 'd')
                    {
                        row++;
                    }
                    else if (dir == 'u')
                    {
                        row--;
                    }
                    else
                    {
                        directionOk = false;
                    }
                }
                break;

            case 'q1':
                {
                    if (dir == 'r')
                    {
                        dir = 'd';
                        row++;
                    }
                    else if (dir == 'u')
                    {
                        dir = 'l';
                        column--;
                    }
                    else
                    {
                        directionOk = false;
                    }
                }
                break;

            case 'q2':
                {
                    if (dir == 'l')
                    {
                        dir = 'd';
                        row++;
                    }
                    else if (dir == 'u')
                    {
                        dir = 'r';
                        column++;
                    }
                    else
                    {
                        directionOk = false;
                    }
                }
                break;

            case 'q3':
                {
                    if (dir == 'l')
                    {
                        dir = 'u';
                        row--;
                    }
                    else if (dir == 'd')
                    {
                        dir = 'r';
                        column++;
                    }
                    else
                    {
                        directionOk = false;
                    }
                }
                break;

            case 'q4':
                {
                    if (dir == 'r')
                    {
                        dir = 'u';
                        row--;
                    }
                    else if (dir == 'd')
                    {
                        dir = 'l';
                        column--;
                    }
                    else
                    {
                        directionOk = false;
                    }
                }
                break;


        }

        if (directionOk)
        {
            if (finishTile)
                gameComplete = true;
            else
                nextTile();
        }
    }

    if (gameComplete)
    {
        instance.allowPieceMove = false;
        instance.stopTimer();

        var _animateComplete = onAnimateComplete;

        for (var i = 0; i < instance.numRows; i++)
        {
            for (var j = 0; j < instance.numColumns; j++)
            {
                var cell = this.cells[i][j];
                if (cell.piece && path.indexOf(cell.piece) == -1)
                {
                    var pieceDisplay = cell.piece.display;
                    $(pieceDisplay).animate({opacity: 0}, 500, _animateComplete);
                    _animateComplete = null;
                }
            }
        }

        var pathCount = 0;
        var pathExpectedMoves = 0;
        var quadsOrder = ['q1', 'q4', 'q3', 'q2'];
        for (var i = 1; i < path.length - 1; i++)
        {
            var piece = path[i];
            pathCount++;
            if (piece.type != piece.initialType)
            {
                if (piece.type == 'h' || piece.type == 'v')
                    pathExpectedMoves++;
                else
                {
                    var q0 = quadsOrder.indexOf(piece.initialType);
                    var q1 = quadsOrder.indexOf(piece.type);
                    if (q0 > q1)
                        q1 += 4;
                    console.log(piece.initialType + ' -> ' + piece.type + ' = ' + (q1 - q0))
                    pathExpectedMoves += (q1 - q0);
                }
            }
        }

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
                    acuracia: (pathExpectedMoves / instance.numMoves),
                    velocidade: (instance.numMoves / (instance.runningTime / 1000)),
                    estabilidade: (1 / (dp)),
                    time: instance.runningTime,
                    success: true,
                    level: this.level.difficulty
                }

        var dMult = [40, 60, 100];
        logObject.pontuacao = ((logObject.acuracia + logObject.velocidade + logObject.estabilidade) / 3) * dMult[this.level.difficulty];
        logObject.gameId = "connectome";
        logObject.timestamp = (new Date()).getTime();
        logObject['memoria'] = logObject.pontuacao * 1;
        logObject['visuo_espacial'] = logObject.pontuacao * 3;
        logObject['resolucao_problemas'] = logObject.pontuacao * 4;
        logObject['psico_motora'] = logObject.pontuacao * 1;
        logObject['logico_matematica'] = logObject.pontuacao * 3;
        logObject['linguagem'] = logObject.pontuacao * 1;
    //    logObject['tentativas'] = instance.numMoves;
      //  logObject['acertos'] = instance.clickIntervals.length ;
        //alert(JSON.stringify(logObject, null, 4));

        function onAnimateComplete()
        {
            try {
                window.parent.saveLogObject(logObject);
            }
            catch (e) {
            }
        }
    }

    return gameComplete;
}

PipeGame.prototype.onPiecePointerUp = function (e)
{
    var instance = PipeGame.instance;

    if (!instance.allowPieceMove)
        return;

    var piece = $(this).data('piece');
    instance.numMoves += 1;
    instance.setNumMoves(instance.numMoves);

    if (instance.lastClickTime > 0)
        instance.clickIntervals.push(instance.runningTime - instance.lastClickTime);
    instance.lastClickTime = instance.runningTime;
    console.log(instance.lastClickTime);
    instance.rotatePiece(piece);
    var complete = instance.verifyGameComplete();

    if (!complete)
    {
        if (!instance.isRunning)
            instance.startTimer(instance.onTimerTick, 20);
    }
}

var BackgroundUtil = {};

BackgroundUtil.SetBackgroundImage = function (element, sourceName)
{
    //console.log(sourceName+' -> '+B64Assets[sourceName])
    //console.log('SetBackgroundImage -> '+sourceName);
    $(element).css('background-image', 'url(\'' + 'assets/' + sourceName + '.png' + '\')');
    var base = "data:image/png;base64,"
    //  $(element).css('background-image', 'url(  B64Assets[sourceName]  )');
    $(element).css('background-size', '100% 100%');
}

