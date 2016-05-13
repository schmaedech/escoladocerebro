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

function BreakoutGame()
{
    BreakoutGame.instance = this;

    this.container = $('#game-container');
    this.level = null;

    this.bricks = null;
    this.items = null;
    this.balls = null;
    this.bar = null;

    this.allowBarMove = false;

    this.content = $('<div id="breakoutGame" style="position:relative; width:100%; height:100%; overflow:hiddem;"></div>');

    //$(this.content).resize(this.onResize);
}

BreakoutGame.prototype.setNumMoves = function (value)
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

BreakoutGame.prototype.setRunningTime = function (value)
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
}

BreakoutGame.prototype.startTimer = function (callback, interval)
{
    var instance = BreakoutGame.instance;

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

BreakoutGame.prototype.stopTimer = function ()
{
    var instance = BreakoutGame.instance;
    instance.isRunning = false;
}

BreakoutGame.prototype.onTimerTick = function (delta)
{
    var instance = BreakoutGame.instance;

    instance.runningTime += delta;
    instance.setRunningTime(instance.runningTime);

    instance.updateBalls();
}
/*
 BreakoutGame.prototype.onResize = function()
 {
 var instance = BreakoutGame.instance;
 
 instance.brickWidth = $(instance.content).width() / (instance.numColumns);
 instance.brickHeight = ($(instance.content).height() * 0.4) / (instance.numRows);
 instance.bricksMargin = ($(instance.content).width() - (instance.brickWidth * instance.numColumns))/2;
 
 for(var i = 0; i < instance.numRows; i++)
 {
 for(var j = 0; j < instance.numColumns; j++)
 {
 var brick = instance.bricks[i][j];
 if(brick)
 {
 var brickDisplay = brick.display;
 
 $(brickDisplay).left(instance.bricksMargin + (j * instance.brickWidth) );
 $(brickDisplay).top(instance.bricksMargin + (i * instance.brickHeight) );
 $(brickDisplay).width(instance.brickWidth);
 $(brickDisplay).height(instance.brickHeight);
 }
 }
 }
 
 if(this.items)
 {
 for(var i = 0; i < instance.items.length; i++)
 {
 var item = instance.items[i];
 var itemDisplay = item.display;
 
 $(itemDisplay).left(item.column * instance.brickWidth + (instance.brickWidth - instance.brickHeight) / 2);
 $(itemDisplay).top(item.row * instance.brickHeight);
 $(itemDisplay).width(instance.brickHeight);
 $(itemDisplay).height(instance.brickHeight);
 }
 }
 
 var barDisplay = instance.bar.display;
 
 var barWidth = (150/800) * $(instance.content).width();
 var barHeight = (40/600) * $(instance.content).height();
 var barTop = $(instance.content).height() * 0.95 - barHeight/2;
 var barLeft = $(instance.content).width()*instance.bar.x - barWidth/2;
 
 $(barDisplay).left( barLeft );
 $(barDisplay).top( barTop );
 $(barDisplay).width( barWidth );
 $(barDisplay).height( barHeight );
 
 }
 */
BreakoutGame.prototype.initializeGrid = function (numRows, numColumns)
{
    if (!this.content || !$(this.content).parent())
        return;

    this.numRows = numRows;
    this.numColumns = numColumns;

    var level = this.level;

    this.brickWidth = ($(this.content).width()) / (this.numColumns);
    this.brickHeight = ($(this.content).height() * 0.4) / (this.numRows);
    this.bricksMargin = ($(this.content).width() - (this.brickWidth * this.numColumns)) / 2;

    this.bricks = new Array();

    for (var i = 0; i < numRows; i++)
    {
        for (var j = 0; j < numColumns; j++)
        {
            var brickType = level.brickTypes[level.tileMap[i][j]];
            if (brickType)
            {
                var brickStyle = 'position:absolute;';
                var brickId = 'brick_' + i + '_' + j;

                var brickDisplay = $('<div id="' + brickId + '" style="' + brickStyle + '"></div>');
                BackgroundUtil.SetBackgroundImage(brickDisplay, brickType.source);

                var brickLeft = this.bricksMargin + (j * this.brickWidth);
                var brickTop = this.bricksMargin + (i * this.brickHeight);

                $(brickDisplay).left(brickLeft);
                $(brickDisplay).top(brickTop);
                $(brickDisplay).width(this.brickWidth);
                $(brickDisplay).height(this.brickHeight);

                this.bricks.push({id: brickId, row: i, column: j, type: brickType, display: brickDisplay, x: brickLeft, y: brickTop, width: this.brickWidth, height: this.brickHeight});
                $(this.content).append(brickDisplay);
            }
        }
    }
};

BreakoutGame.prototype.setBrickType = function (brick, type)
{
    var brickDisplay = brick.display;
    BackgroundUtil.SetBackgroundImage(brickDisplay, type.source);
    brick.type = type;
}

BreakoutGame.prototype.initializeLevel = function (level)
{
    this.level = level;
    var objects = level.objects;

    var numRows = level.tileMap.length;
    var numColumns = level.tileMap[0].length;

    BackgroundUtil.SetBackgroundImage(this.container, 'screen_background');

    $(this.board).empty();


    this.setNumMoves(0);
    this.setRunningTime(0);
    this.isRunning = false;

    this.initializeGrid(numRows, numColumns);

    this.initializeBar();

    this.initializeBalls();

}

BreakoutGame.prototype.initializeBar = function ()
{
    if (!this.content || !$(this.content).parent())
        return;

    this.bar =
            {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                display: null
            };

    var barStyle = 'position:absolute;';

    var barDisplay = $('<div id="bar" style="' + barStyle + '"></div>');
    BackgroundUtil.SetBackgroundImage(barDisplay, 'bar');

    var barWidth = (150 / 800) * $(this.content).width();
    var barHeight = (40 / 600) * $(this.content).height();
    var barTop = $(this.content).height() * 0.95 - barHeight / 2;
    var barLeft = ($(this.content).width() - barWidth) / 2;

    $(barDisplay).left(barLeft);
    $(barDisplay).top(barTop);
    $(barDisplay).width(barWidth);
    $(barDisplay).height(barHeight);

    this.bar.x = barLeft;
    this.bar.y = barTop;
    this.bar.width = barWidth;
    this.bar.height = barHeight;

    this.bar.display = barDisplay;
    $(this.content).append(barDisplay);

    $('body').on('mousedown', this.onPointerDown);
    $('body').on('mousemove', this.onPointerMove);
}

BreakoutGame.prototype.initializeBalls = function ()
{
    if (!this.content || !$(this.content).parent())
        return;

    this.balls = new Array();

    var barDisplay = this.bar.display;

    var ballX = $(barDisplay).left() + $(barDisplay).width() / 2;
    var ballY = $(barDisplay).top();

    this.addBall({x: ballX, y: ballY});
    this.addBall({speed: 20});
}

BreakoutGame.prototype.addBall = function (params)
{
    var barDisplay = this.bar.display;

    var x = params ? params.x : undefined;
    var y = params ? params.y : undefined;
    var vSpeed = params ? params.vSpeed : undefined;
    var hSpeed = params ? params.hSpeed : undefined;
    var speed = params ? params.speed : undefined;

    if (x == undefined)
        x = $(this.content).width() / 2;
    if (y == undefined)
        y = 0;

    if (vSpeed == undefined)
        vSpeed = 1;
    if (hSpeed == undefined)
        hSpeed = 0;
    if (speed == undefined)
        speed = 10;

    var ball =
            {
                speed: speed,
                vSpeed: vSpeed,
                hSpeed: hSpeed,
                x: 0,
                y: 0,
                display: null
            };

    ball.vSpeed *= speed;
    ball.hSpeed *= speed;

    var ballStyle = 'position:absolute;';
    var ballDisplay = $('<div id="ball" style="' + ballStyle + '"></div>');
    BackgroundUtil.SetBackgroundImage(ballDisplay, 'ball');

    var ballSize = this.brickHeight * 0.8;
    var ballTop = y - ballSize / 2;
    var ballLeft = x - ballSize / 2;

    ball.x = ballLeft;
    ball.y = ballTop;
    ball.width = ballSize;
    ball.height = ballSize;

    $(ballDisplay).left(ballLeft);
    $(ballDisplay).top(ballTop);
    $(ballDisplay).width(ballSize);
    $(ballDisplay).height(ballSize);

    ball.display = ballDisplay;
    $(this.content).append(ballDisplay);
    this.balls.push(ball);

    return ball;
}

BreakoutGame.prototype.onPointerDown = function (e)
{
    var instance = BreakoutGame.instance;

    if (!instance.allowBarMove)
    {
        instance.totalNumMoves = 0;
        instance.redundantNumMoves = 0;
        instance.setNumMoves(0);
        instance.setRunningTime(0);
        instance.isRunning = false;
        instance.clickIntervals = [];
        instance.lastClickTime = 0;
        instance.totalHitCount = 0;

        instance.allowBarMove = true;



        $('body').off('mousedown', instance.onPointerDown);
        $('body').on('mousedown', instance.onPointerMove);

        instance.numMoves = 1;
        instance.setNumMoves(instance.numMoves);

        instance.totalNumMoves = 1;
        instance.hitCount = 0;

        if (!instance.isRunning)
            instance.startTimer(instance.onTimerTick, 20);

        var ball = instance.balls[0];
        var ballDisplay = ball.display;

        var dX = e.pageX - ($(ballDisplay).left() + $(ballDisplay).width() / 2);
        var dY = (e.pageY - ($(ballDisplay).top() + $(ballDisplay).height() / 2)) * -1;

        var angle = Math.atan2(dY, dX);

        ball.vSpeed = -1 * Math.sin(angle) * ball.speed;
        ball.hSpeed = Math.cos(angle) * ball.speed;

        console.log('angle:' + (angle * 180 / Math.PI) + ', sin:' + ball.vSpeed + ', cos:' + ball.hSpeed);

        instance.onPointerMove(e);
    }


}

BreakoutGame.prototype.onPointerMove = function (e)
{
    var instance = BreakoutGame.instance;

    if (!instance.allowBarMove)
        return;

    var barDisplay = instance.bar.display;

    var minLeft = 0;
    var maxLeft = $(instance.content).width() - $(barDisplay).width();

    var barLeft = Math.min(Math.max(minLeft, e.pageX - $(barDisplay).width() / 2), maxLeft);

    $(barDisplay).left(barLeft);
    instance.bar.x = barLeft;
}

BreakoutGame.prototype.updateBalls = function (e)
{
    var instance = BreakoutGame.instance;

    var barDisplay = instance.bar.display;
    var barMinX = instance.bar.x;//$(barDisplay).left();
    var barMaxX = barMinX + instance.bar.width;//barMinX + $(barDisplay).width();
    var barY = instance.bar.y//$(barDisplay).top();

    var ballsToRemove = new Array();

    for (var i = 0; i < instance.balls.length; i++)
    {
        var ball = instance.balls[i];
        var ballDisplay = ball.display;

        var ballSize = $(ballDisplay).width();

        var dX = ballSize * 20 / 1000 * ball.hSpeed;
        var dY = ballSize * 20 / 1000 * ball.vSpeed;

        ball.x += dX;
        ball.y += dY;

        var ballLeft = ball.x;
        var ballTop = ball.y;

        $(ballDisplay).left(ballLeft);
        $(ballDisplay).top(ballTop);

        if (ball.y > $(instance.content).height())
            ballsToRemove.push(ball);

        var ballCenterX = (ball.x + ball.width / 2);
        var ballCenterY = (ball.y + ball.height / 2);
        var hit = false;

        if (ball.vSpeed > 0)
        {
            if (ball.y + ball.height >= barY && ball.y < barY)
            {
                var barXOffset = ballCenterX - (instance.bar.x + instance.bar.width / 2);
                barXOffset = barXOffset / (instance.bar.width / 2);

                if (Math.abs(barXOffset) <= 1)
                {
                    var angle = Math.acos(barXOffset);

                    ball.vSpeed = -1 * Math.sin(angle) * ball.speed;
                    ball.hSpeed = Math.cos(angle) * ball.speed;

                    instance.numMoves += 1;
                    instance.setNumMoves(instance.numMoves);

                    if (instance.hitCount == 0)
                        instance.redundantNumMoves++;
                    instance.hitCount = 0;

                    instance.totalNumMoves++;

                    if (instance.lastClickTime > 0)
                        instance.clickIntervals.push(instance.runningTime - instance.lastClickTime);
                    instance.lastClickTime = instance.runningTime;

                    hit = true;
                }
            }
            if (!hit)
            {
                for (var b = 0; b < instance.bricks.length; b++)
                {
                    var brick = instance.bricks[b];

                    var brickY = brick.y;
                    hit = (ballCenterX >= brick.x && ballCenterX <= (brick.x + brick.width) && (ball.y + ball.height >= brickY && ball.y < brickY));
                    if (hit)
                    {
                        ball.vSpeed *= -1;
                        ball.y = (brickY - ball.height - 1);

                        instance.onBallHitBrick(ball, brick);
                        break;
                    }
                }
            }
        }
        else if (ball.vSpeed < 0)
        {
            if (ball.y < 0)
            {
                ball.vSpeed *= -1;
                hit = true;
            }

            if (!hit)
            {
                for (var b = 0; b < instance.bricks.length; b++)
                {
                    var brick = instance.bricks[b];

                    var brickY = (brick.y + brick.height);
                    hit = (ballCenterX >= brick.x && ballCenterX <= (brick.x + brick.width) && (ball.y <= brickY && ball.y + ball.height > brickY))
                    if (hit)
                    {
                        ball.vSpeed *= -1;
                        ball.y = (brickY + 1);

                        instance.onBallHitBrick(ball, brick);
                        break;
                    }
                }
            }
        }

        if (ball.hSpeed > 0)
        {
            if (ball.x + ball.width > $(instance.content).width())
            {
                ball.hSpeed *= -1;
                hit = true;
            }

            if (!hit)
            {
                for (var b = 0; b < instance.bricks.length; b++)
                {
                    var brick = instance.bricks[b];

                    var brickX = brick.x;
                    hit = (ballCenterY >= brick.y && ballCenterY <= (brick.y + brick.height) && (ball.x + ball.width >= brickX && ball.x < brickX));
                    if (hit)
                    {
                        ball.hSpeed *= -1;
                        ball.x = (brickX - ball.width - 1);

                        instance.onBallHitBrick(ball, brick);
                        break;
                    }
                }
            }
        }
        else if (ball.hSpeed < 0)
        {
            if (ball.x < 0)
            {
                ball.hSpeed *= -1;
                hit = true;
            }

            if (!hit)
            {
                for (var b = 0; b < instance.bricks.length; b++)
                {
                    var brick = instance.bricks[b];

                    var brickX = (brick.x + brick.width);
                    hit = (ballCenterY >= brick.y && ballCenterY <= (brick.y + brick.height) && (ball.x <= brickX && ball.x + ball.width > brickX))
                    if (hit)
                    {
                        ball.hSpeed *= -1;
                        ball.x = (brickX + 1);

                        instance.onBallHitBrick(ball, brick);
                        break;
                    }
                }
            }
        }
    }

    for (var i = 0; i < ballsToRemove.length; i++)
    {
        var ball = ballsToRemove[i];

        var ballDisplay = ball.display;
        $(ballDisplay).remove();

        var ballIndex = instance.balls.indexOf(ball);
        instance.balls.splice(ballIndex, 1);
    }

    instance.verifyGameComplete();
}

BreakoutGame.prototype.onBallHitBrick = function (ball, brick)
{
    var instance = BreakoutGame.instance;

    instance.hitCount++;
    instance.totalHitCount++;

    if (brick.type.id == 'f')
    {
        instance.setBrickType(brick, instance.level.brickTypes['e']);
    }
    else if (brick.type.id == 'e')
    {
        instance.setBrickType(brick, instance.level.brickTypes['d']);
    }
    else if (brick.type.id == 'd')
    {
        instance.setBrickType(brick, instance.level.brickTypes['c']);
    }
    else if (brick.type.id == 'c')
    {
        instance.setBrickType(brick, instance.level.brickTypes['b']);
    }
    else if (brick.type.id == 'b')
    {
        instance.setBrickType(brick, instance.level.brickTypes['a']);
    }
    else
    {
        var brickIndex = instance.bricks.indexOf(brick);
        instance.bricks.splice(brickIndex, 1);

        var brickDisplay = brick.display;

        $(brickDisplay).animate({opacity: 0}, 200, onAnimateComplete);
        function onAnimateComplete()
        {
            $(brickDisplay).remove();
            instance.verifyGameComplete();
        }
    }
}

BreakoutGame.prototype.verifyGameComplete = function ()
{
    var instance = BreakoutGame.instance;
    var gameComplete = (instance.bricks.length == 0) || (instance.balls.length == 0)

    if (gameComplete)
    {
        instance.allowBarMove = false;
        instance.stopTimer();

        var barDisplay = instance.bar.display;

        var top = $(instance.content).height() + instance.bar.height;



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
                    velocidade: (instance.totalHitCount / (instance.runningTime / 1000)),
                    estabilidade: (1 / (dp)),
                    time: instance.runningTime,
                    success: (instance.bricks.length == 0),
                    level: this.level.difficulty
                }

        var dMult = [40, 60, 100];
        logObject.pontuacao = ((logObject.acuracia + logObject.velocidade + logObject.estabilidade) / 3) * dMult[this.level.difficulty];
        logObject.gameId = "breakout";
        logObject.timestamp = (new Date()).getTime();
        logObject['memoria'] = logObject.pontuacao * 1;
        logObject['visuo_espacial'] = logObject.pontuacao * 4;
        logObject['resolucao_problemas'] = logObject.pontuacao * 1;
        logObject['psico_motora'] = logObject.pontuacao * 5;
        logObject['logico_matematica'] = logObject.pontuacao * 1;
        logObject['linguagem'] = logObject.pontuacao * 1;
        logObject['tentativas'] = instance.numMoves;
        logObject['acertos'] = instance.clickIntervals.length;
        //alert(JSON.stringify(logObject, null, 4));

        $(barDisplay).animate({top: top + 'px', opacity: 0}, 200, onAnimateComplete);
        function onAnimateComplete()
        {
            $(barDisplay).remove();
            try {
                window.parent.saveLogObject(logObject);
            }
            catch (e) {
            }
        }
    }

    return gameComplete;
}

BreakoutGame.prototype.finalizeGame = function ()
{
    var instance = BreakoutGame.instance;

    instance.isRunning = false;
    instance.allowBarMove = false;
}

var BackgroundUtil = {};

BackgroundUtil.SetBackgroundImage = function (element, sourceName)
{
    //console.log(sourceName+' -> '+B64Assets[sourceName])
    console.log('SetBackgroundImage -> ' + sourceName);
    $(element).css('background-image', 'url(\'' + 'assets/' + sourceName + '.png' + '\')');
    //$(element).css('background-image', 'url(\''+'data:image/png;base64,'+B64Assets[sourceName]+'\')');
    $(element).css('background-size', '100% 100%');
}