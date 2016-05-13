var idname = "ANONIMO";
var iduser = 0;

var moves = 1;
var startTime = 0;
var lastClickTime = 0;

var duration = 0;
var level = 0;
var h = 300;
var nRows = 5;
var nColumns = 5;
var nCells = (nRows * nColumns);
var clickIntervals = [];

var currNum = 0;
var er = 0;
var de = 0;
var ina = 0;
var lx = 0;
var ly = 0;

function onAnimateComplete() {
    var avgInterval = 0;
    for (var i = 0; i < clickIntervals.length; i++) {
        avgInterval += clickIntervals[i];
    }
    avgInterval = avgInterval / clickIntervals.length;

    var dp = 0;
    for (var i = 0; i < clickIntervals.length; i++) {
        dp += Math.pow(clickIntervals[i] - avgInterval, 2);
    }
    dp = Math.pow(dp / clickIntervals.length - 1, 0.5);

    console.log(nCells + " " + (moves - 1));
    var logObject = {
        acuracia: (nCells / (moves - 1)),
        velocidade: (nCells / (duration / 1000)),
        estabilidade: (1 / (dp)),
        time: duration,
        success: true,
        level: level
    };

    var dMult = [40, 60, 100];
    logObject.pontuacao = ((logObject.acuracia + logObject.velocidade + logObject.estabilidade) / 3) * dMult[level];
    logObject.gameId = "looktable";
    logObject.timestamp = (new Date()).getTime();
    logObject['memoria'] = logObject.pontuacao * 4;
    logObject['visuo_espacial'] = logObject.pontuacao * 1;
    logObject['resolucao_problemas'] = logObject.pontuacao * 1;
    logObject['psico_motora'] = logObject.pontuacao * 3;
    logObject['logico_matematica'] = logObject.pontuacao * 1;
    logObject['linguagem'] = logObject.pontuacao * 1;
    logObject['tentativas'] =  moves ;
    logObject['acertos'] =clickIntervals.length;
    var consoleTimeout1;
    var text = "Parabéns! Seu tempo foi de:  " + duration + "";
    $('#console').text(text).addClass('busy');
    clearTimeout(consoleTimeout1);

    consoleTimeout1 = setTimeout(function () {
        $('#console').removeClass('busy');
    }, 2000);

    try {
        window.parent.saveLogObject(logObject);
    }
    catch (e) {
        console.log("ZERO PRA TI");
    }
}

function drawBonus() {
    var w = $('#wrap_menu').width();
    $('#wrap_bonus').html("<canvas id='bonus' width='" + w / 4 + "' height='" + w / 3 + "'></canvas> ");
    $('#bonus').ready(function () {
        var canvas = document.getElementById('bonus');
        var context = canvas.getContext('2d');
        context.rect(0, 0, canvas.width, canvas.height);
        var grd = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        grd.addColorStop(0, '#00CCFF');
        grd.addColorStop(1, '#eee');
        context.fillStyle = grd;
        context.fill();

    });
}

function millisecondsToTime(milli) {
    var milliseconds = milli % 1000;
    var seconds = Math.floor((milli / 1000) % 60);
    var minutes = Math.floor((milli / (60 * 1000)) % 60);
    return minutes + ":" + seconds + "." + milliseconds;
}

function drawProgresse() {
    lastClickTime = startTime = inativeStart = new Date();
    var w = $('#wrap_menu').width() / 2;
    $('#wrap_progresse').html("<canvas id='progresse' width='" + w + "' height='" + w + "'></canvas> ");
    $('#progresse').ready(function () {
        var mainCanvas = document.getElementById('progresse');
        var p3 = 0;
        var circle = new ProgressCircle({
            canvas: mainCanvas,
            centerX: w / 2,
            centerY: w / 2,
            minRadius: w / 3,
            arcWidth: 8,
            gapWidth: 0,
            infoLineLength: Math.PI,
            horizLineLength: Math.PI,
            infoLineBaseAngle: Math.PI,
            infoLineAngleInterval: 0
        });

        circle.addEntry({
            fillColor: '#43e885',
            outlineColor: '#00CCFF',
            progressListener: function () {
                return p3;
            },
            infoListener: function () {
                try {
                    unmute = window.parent.unmute;
                }
                catch (e) {
                    console.log("unmute");
                }
                //console.log(Math.round(p3 * 100));
                var endTime = new Date();
                duration = endTime - startTime;
                try {
                    window.parent.setStat('runningTime', millisecondsToTime(duration));
                }
                catch (e) {
                    console.log("ZERO PRA TI");
                }
                return Math.round(p3 * 100);
            }
        }).start(33);

        setInterval(function () {
            p3 = p3 < 1 ? p3 + 0.002 : 0;
        }, 20);


    });
}

function acertou(theCell) {
    //audioOkay();
    $("#" + theCell).css("background", "#43e885");
    $("#" + theCell).css("color", "#eee");
    if (level === 1) {
        setTimeout(function () {
            $("#" + theCell).css("background", "");
            $("#" + theCell).css("color", "");
        }, 50);

    }
    if (level === 2) {
        setTimeout(function () {
            $("#" + theCell).css("background", "");
            $("#" + theCell).css("color", "");
            startGame();
        }, 50);

    }
    toggleItem('#wrap_bonus_plus');

    if ($('#wrap_vertical_progress').height() > 0) {
        $('#wrap_vertical_progress').animate({height: '-=4%'}, "slow");
    }



}

function errouFeio(theCell) {
    //audioErr();
    $("#" + theCell).css("background", "red");
    $("#" + theCell).css("color", "#eee");

    setTimeout(function () {
        if (level === 0) {
            $("#" + theCell).css("background", "#94bb65");
            $("#" + theCell).css("color", "#eee");
        } else {

            $("#" + theCell).css("background", "");
            $("#" + theCell).css("color", "");
            if (level === 2) {
                startGame();
            }
        }

    }, 50);


    toggleItem('#wrap_bonus_minus');


}

function errou(theCell) {
    //  audioErr();
    $("#" + theCell).css("background", "red");
    $("#" + theCell).css("color", "#eee");
    setTimeout(function () {
        $("#" + theCell).css("background", "");
        $("#" + theCell).css("color", "");
        if (level === 2) {
            startGame();
        }
    }, 50);

    toggleItem('#wrap_bonus_minus');
    if ($('#wrap_vertical_progress').height() < 100) {
        $('#wrap_vertical_progress').animate({height: '+=4%'}, "slow");
    }


}

function resumeLooktable( ) {
    $('#wrap_menu').slideUp('slow', function () {
        $("#wrap_menu").html();
    });

    //  audioLevelup();
    onAnimateComplete();

}

function toggleItem(element) {
    $(element).animate({opacity: '1'}, "slow", function () {
        $(element).animate({opacity: '0'}, "slow");
    });
}

function displayNumbers() {
    var hLinesScale = h / nRows;
    var nMax = (nCells - 1);
    var nBreak = (nColumns - 1);
    var theNumbers = new Array(nCells);
    for (var i = 0; i <= nMax; i++) {
        theNumbers[i] = i;
    }

    for (var j = 0; j <= nMax; j++)
    {
        var tempInteger;
        var newPosition;
        tempInteger = theNumbers[j];
        newPosition = Math.floor(Math.random() * nMax);
        theNumbers[j] = theNumbers[newPosition];
        theNumbers[newPosition] = tempInteger;
    }

    var gamePage = "<div class=\"looktable\" id=\"looktable\"><center><div class=\"layout\" id=\"layout\">";

    for (var k = 0; k <= nMax; k++) {
        var cellNumber;
        if ((k % nColumns) == 0)
            gamePage += "<div class=\"lines\" style=\"height:" + hLinesScale + "px \"> ";
        cellNumber = theNumbers[k];
        if (cellNumber < 10)
            gamePage += "<div class=\"acellbtn\"><span id =\"" + cellNumber + "\">0" + cellNumber + "</span></div>";
        else
            gamePage += "<div class=\"acellbtn\"><span  id =\"" + cellNumber + "\">" + cellNumber + "</span></div>";
        if ((k % nColumns) == nBreak)
            gamePage += "</div> ";
    }
    gamePage += "</center></div>";

    $('.container').html(gamePage);


}

function evalClick(x) {
    clickIntervals.push(new Date() - lastClickTime);
    lastClickTime = new Date();

    try {
        window.parent.setStat('numMoves', moves++);
    }
    catch (e) {
        console.log("evalClick not load");
    }

    theCell = document.getElementById(x);
    if (x == currNum) {
        acertou(x);
        currNum++;
    } else if (x < currNum) {
        errouFeio(x);
    } else {
        errou(x);
    }

    if (currNum == nCells) {
        resumeLooktable( );
    }


}

function playGame() {

    $("html").css("background-image", "url(img/niveis_looktable.png)");
    $('#btPlay').hide();
    $('.clevels').show();
    $('.clevels').css("display", "inline");
    //  audioGo();
}

function chooseLevel(lv) {

    // audioGo();

    level = lv;
    $('.clevels').hide();
    $('#divLevels').hide();
    $("html").css("background-image", "url(img/bg_looktable.png)");
    $("html").css("background-repeat", "no-repeat");

    $('#wrap_menu').css("height", h);
    $('#wrap').css("visibility", "visible");
    drawProgresse();
    startGame();
    if (lv === 2) {
        $(function () {
            setInterval(function () {
                var r = Math.round(Math.random() * 255);
                var g = Math.round(Math.random() * 255);
                var b = Math.round(Math.random() * 255);
                var colors = {
                    // backgroundColor: "rgb("+r+","+g+","+b+")"
                    background: "rgb(" + r + "," + g + "," + b + ")"
                };
                $(".container").css(colors);

            }, 1000);
        });
    }

}

function startGame() {
    displayNumbers();

    $(".acellbtn span").each(function (index) {

        $('#' + $(this).attr('id')).click(function (event, ui) {
            evalClick($(this).attr('id'));
            event.stopPropagation();
        });
    });
    $('.layout').mousemove(function (e) {

        inativeEnd = new Date();
        ina += (inativeEnd.getTime() - inativeStart);
        inativeStart = inativeEnd.getTime();
        var offset = $(this).offset();
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        if (lx != 0 && ly != 0) {
            de += Math.sqrt((Math.pow((x - lx), 2) + Math.pow((y - ly), 2)));
            lx = x;
            ly = y;
        } else {
            lx = x;
            ly = y;
        }


    });

}


