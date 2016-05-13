$(document).ready(function ($) {
    var nRows = 8;
    var nColumns = 10;
    var nTest = 0;
    var nClicks = 0;
    var nTimeInterval = null;
    var nTimeToStart = 0;
    var nTimeToTest = 22000;
    var nLevel = 1;
    var nPoints = [];
    var nPeaces = [];
    var nPlay = true;
    var nStartTime = new Date();
    var nLastClickTime = new Date();
    var nClickIntervals = [];
    var finished = false;
    var peaces = [{"value": "19"}, {"value": "18"}, {"value": "21"}, {"value": "11"}, {"value": "5"}, {"value": "3|13"}, {"value": "1|10"}, {"value": "17|6"}, {"value": "4|21"}, {"value": "14|11"}, {"value": "10|17|1"}, {"value": "0|3|15"}, {"value": "2|12|16"}, {"value": "1|10|11"}, {"value": "2|5|8"}];
    var board = [{value: "0|1|2|19|3|4|5|6|7|19|8|9|10|11|12|13|14|15|16|19|17|18|20|21|4|2|0|17|6|21|15|14|7|20|18|19|10|9|7|6|5|4|3|2|1|19|12|13|17|4|8|2|19|3|4|6|10|0|20|3|13|19|15|15|21|20|18|12|11|19|0|2|5|8|11|14|17|19|20|19"}, {value: "20|3|7|9|18|20|13|0|12|3|15|9|16|18|0|8|12|3|13|18|19|13|15|18|8|5|20|7|19|9|16|18|12|19|3|3|8|9|0|5|13|10|18|10|16|0|5|8|18|10|0|19|9|20|5|18|16|3|12|7|8|13|5|0|19|3|10|20|5|12|3|8|18|19|20|15|18|3|12|20"}, {value: "21|13|15|20|7|9|7|16|8|21|18|9|0|5|3|16|21|13|0|8|20|16|8|21|5|7|15|3|18|21|9|12|13|15|0|3|5|20|15|8|3|18|12|21|4|16|8|3|15|5|12|9|3|18|16|21|13|5|9|3|4|21|18|7|4|12|0|5|15|21|16|18|9|12|7|5|21|18|9|0"}, {value: "7|12|11|3|8|3|16|15|7|9|7|12|13|2|11|12|3|4|9|8|20|1|15|2|0|16|13|1|9|4|11|20|8|2|20|14|13|14|1|0|2|20|4|3|14|21|11|9|1|2|0|4|18|15|3|19|21|11|14|2|20|11|15|2|9|3|14|16|13|11|11|1|3|2|4|3|11|11|16|13"}, {value: "9|15|8|5|4|5|16|0|12|2|9|1|0|16|15|8|5|3|2|12|5|13|1|9|2|16|5|1|13|16|3|12|15|0|1|2|9|5|13|8|15|4|14|12|15|19|13|8|2|5|1|14|9|16|15|0|2|8|5|4|3|1|0|8|9|12|5|14|15|20|4|8|5|2|16|0|4|9|8|20"}, {value: "7|9|12|0|14|16|3|1|12|10|15|13|1|14|16|3|2|14|8|16|12|16|13|12|8|16|3|15|14|7|14|0|2|9|16|2|13|1|12|10|16|14|13|5|15|6|0|4|2|12|1|13|14|10|7|2|15|3|16|7|4|10|2|12|1|14|16|12|7|0|5|6|15|12|14|2|1|15|7|3"}, {value: "1|2|9|14|1|7|16|9|2|0|4|12|5|6|1|14|12|0|7|0|4|21|1|14|0|5|9|6|9|4|7|12|21|14|9|5|7|15|10|6|0|4|14|10|21|7|14|9|16|15|9|5|8|10|21|4|12|3|6|9|12|5|7|14|4|15|10|5|16|2|0|7|6|1|4|0|4|10|7|9"}, {value: "15|9|3|17|1|12|6|20|15|14|17|2|1|16|14|9|2|9|3|15|6|20|1|9|3|2|14|15|21|17|14|4|0|21|1|2|20|6|16|3|9|12|4|14|17|1|9|20|0|3|14|16|12|6|2|4|9|1|16|14|2|6|3|17|20|21|1|0|14|9|4|3|0|1|16|12|3|14|15|2"}, {value: "3|4|2|12|21|1|16|21|9|2|4|3|9|0|15|1|0|16|9|9|3|20|16|0|6|8|3|12|1|17|2|8|20|15|16|12|4|21|2|1|3|15|6|4|16|20|15|1|2|12|3|4|6|2|20|0|17|21|1|9|17|3|12|6|2|1|0|2|12|6|16|9|0|20|15|1|0|9|16|21"}, {value: "1|0|12|2|15|14|1|9|14|11|3|12|5|21|7|12|2|9|1|15|12|2|3|9|15|14|7|8|9|5|7|12|1|14|3|10|11|7|12|8|0|1|15|5|11|1|9|3|14|7|9|10|8|2|15|5|12|11|16|3|10|1|0|16|15|7|0|5|15|3|11|12|7|0|5|1|2|16|3|12"}, {value: "4|21|6|0|9|1|2|18|10|3|19|13|21|0|6|4|18|19|1|3|13|4|10|2|21|6|4|5|18|13|1|3|6|21|17|5|18|4|2|13|9|19|21|5|7|4|3|19|21|4|18|2|17|1|19|5|0|3|6|19|4|21|6|0|2|12|19|18|0|6|17|3|0|2|18|10|6|15|18|0"}, {value: "13|9|3|19|1|2|0|5|4|1|7|2|4|8|15|5|9|6|0|6|4|18|1|19|2|7|13|9|8|19|21|11|0|5|1|13|4|2|3|6|7|8|4|12|11|15|0|18|5|13|12|9|6|11|7|8|13|2|3|5|12|18|21|7|4|8|9|6|1|13|15|21|5|9|2|7|1|4|6|13"}, {value: "18|21|7|1|12|4|19|6|7|3|13|16|11|9|13|21|19|4|1|12|6|21|0|3|19|13|21|18|4|11|7|6|19|1|4|13|19|7|2|11|3|21|18|12|19|1|4|6|21|17|2|15|13|13|4|12|11|19|18|1|13|6|0|3|15|13|18|16|11|19|4|2|15|13|7|6|13|1|16|4"}, {value: "2|10|3|0|18|19|1|18|0|19|10|5|4|2|0|3|1|6|13|9|18|4|13|21|10|6|4|19|2|13|18|3|13|0|5|18|21|5|13|2|0|6|19|13|3|11|9|7|5|19|4|2|18|9|3|1|21|5|0|6|9|18|13|2|4|6|19|4|18|21|11|9|18|2|4|3|1|6|19|11"}, {value: "6|13|18|0|3|21|2|13|9|21|6|0|3|5|13|4|18|9|19|0|6|9|3|7|21|12|4|14|2|3|21|7|19|6|13|8|21|14|18|7|12|13|21|3|8|18|4|19|0|13|6|2|18|19|8|12|13|9|14|19|4|9|0|3|21|2|13|5|21|0|12|18|0|19|21|0|6|2|3|9"}];


    function gamePscicotest() {
        $(".stage").fadeIn(2000);
        nPeaces = [];

        var str = board[nTest].value;
        var res = str.split("|");
        var nBreak = (nColumns - 1);
        var gamePage = "<div class=\"layout board-attention\" id=\"layout\">";
        $.each(res, function (i) {

            if ((i % nColumns) == 0) {
                gamePage += '<div class="row center-block">';
            }
            gamePage += '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 center-block">';
            gamePage += '<button type="button" data-toggle="button"  class="btn btn-primary btn-board ">' + res[i] + '<img src="../../img/pattern_1/ts' + res[i] + '.png" </img></button></div>';

            if ((i % nColumns) == nBreak) {
                gamePage += "</div> ";
            }

        });
        gamePage += " </div>";


        var strp = peaces[nTest].value;
        var resp = strp.split("|");
        $(".peaces-logo").html("");
        $.each(resp, function (i) {
           
            if (nLevel == 1) { 
                $(".peaces-logo").append('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><button type="button" data-toggle="button" id="cur_' + resp[i] + '" class="btn btn-primary col-xs-5 col-sm-5 col-md-5 col-lg-5 center-block">   <img src="../../img/pattern_1/ts' + resp[i] + '.png" </img></button></div></div> ');
            }
            if (nLevel == 2) {
                $(".peaces-logo").append('<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><button type="button" data-toggle="button" id="cur_' + resp[i] + '" class="btn btn-primary col-xs-5 col-sm-5 col-md-5 col-lg-5 center-block">   <img src="../../img/pattern_1/ts' + resp[i] + '.png" </img></button></div></div> ');
            }
            if (nLevel == 3) {
                $(".peaces-logo").append('<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><button type="button" data-toggle="button" id="cur_' + resp[i] + '" class="btn btn-primary col-xs-4 col-sm-4 col-md-4 col-lg-4 center-block">   <img src="../../img/pattern_1/ts' + resp[i] + '.png" </img></button></div></div> ');
            }
        });

        $("#board").html(gamePage);
        $(".btn-board").on("click", function (e) {
            nClicks++;
            $(this).prop('disabled', true);
            nClickIntervals.push(new Date() - nLastClickTime);
            nLastClickTime = new Date();

            if (nLevel == 1) {
                if (strp == $(this).text()) {
                    nPoints.push($(this).text());
                    $("#points").text(nPoints.length);
                }
            }
            if (nLevel == 2) {
                if ((resp[0] == $(this).text()) || (resp[1] == $(this).text())) {
                    nPoints.push($(this).text());
                    $("#points").text(nPoints.length);
                }
            }
            if (nLevel == 3) {
                if ((resp[0] == $(this).text()) || (resp[1] == $(this).text()) || (resp[2] == $(this).text())) {
                    nPoints.push($(this).text());
                    $("#points").text(nPoints.length);
                }
            }
            $(".total_points").text(nPoints.length);
            $(".total_clicks").text(nClicks);
            console.log("nPoints.length " + nPoints.length)
            console.log("nClicks " + nClicks)
        });
        $("#board").addClass("jumbotron");
        $("#peaces-logo").addClass("jumbotron");
        nTest++;
        console.log("gamePscicotest nTest" + nTest)
    }
    function gameStop() {
        console.log("stop");
        clearInterval(nTimeInterval);
        $("#board").hide();

        $(".peaces-logo").html("");
    }
    function gameStart() {
        $("#board").show();
        $(".teste_model").hide();
        $("#points").text(nPoints.length);
        $("#state").text(nLevel);
        gameRunner();
        nTimeInterval = setInterval(function () {
            $(".stage").fadeOut();
            gameRunner();
        }, nTimeToTest);
    }
    function gameRunner() {

        if (nTest == 5 && nLevel < 2) {
            gameStop();
            $("#test_model_2").show();
            nLevel = 2;

            return true;
        }
        if (nTest == 10 && nLevel < 3) {
            gameStop();
            $("#test_model_3").show();
            nLevel = 3;
            //setTimeout(gameStart, nTimeToStart);
            return true;
        }
        if (nTest == 15) {
            nTest++;
            gameStop();
            $("#test_model_end").show();
            nPlay = false;
            finished = true;
            $(".peaces-logo").html("Fim do Teste");
            onAnimateComplete();
            return true;
        }
        if (nTest < 15) {
            gamePscicotest();

        }

    }
    function gameTime() {

        var endTime = new Date();

        var timeDiff = endTime - nStartTime;

        if (nPlay) {
            $("#time").text(millisecondsToTime(timeDiff));
            $(".total_times").text(millisecondsToTime(timeDiff));

            setTimeout(gameTime, 1000);
        }
        // $('.progress-bar').css('width', 100*( seconds/30)+'%').attr('aria-valuenow', 100*(seconds/30));
    }
    function onAnimateComplete() {
        var avgInterval = 0;
        var duration = new Date() - nStartTime;
        for (var i = 0; i < nClickIntervals.length; i++) {
            avgInterval += nClickIntervals[i];
        }
        avgInterval = avgInterval / nClickIntervals.length;

        var dp = 0;
        for (var i = 0; i < nClickIntervals.length; i++) {
            dp += Math.pow(nClickIntervals[i] - avgInterval, 2);
        }
        dp = Math.pow(dp / nClickIntervals.length - 1, 0.5);

        var logObject = {
            acuracia: ((nRows * nColumns) / (nPoints.length - 1)),
            velocidade: ((nRows * nColumns) / (duration / 1000)),
            estabilidade: (1 / (dp)),
            time: duration,
            success: true,
            level: nLevel
        };

        var dMult = [40, 60, 100];
        logObject.pontuacao = ((logObject.acuracia + logObject.velocidade + logObject.estabilidade) / 3) * dMult[nLevel];
        logObject.gameId = "attention";
        logObject.timestamp = (new Date()).getTime();
        logObject['memoria'] = logObject.pontuacao * 1;
        logObject['visuo_espacial'] = logObject.pontuacao * 1;
        logObject['resolucao_problemas'] = logObject.pontuacao * 1;
        logObject['psico_motora'] = logObject.pontuacao * 1;
        logObject['logico_matematica'] = logObject.pontuacao * 1;
        logObject['linguagem'] = logObject.pontuacao * 1;
        logObject['tentativas'] = nClicks;
        logObject['acertos'] = nPoints.length;

        var tr;
        var text = "Parabéns! Seu tempo foi de:  " + duration + "";

        clearTimeout(tr);
        tr = setTimeout(function () {
            console.log(text)
        }, 2000);

        try {

            window.parent.saveLogObject(logObject);
            //window.parent.close(logObject);
        }
        catch (e) {
            $.getJSON("https://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(logObject)})
                    .done(function (rjson) {
                        if (rjson !== null) {
                            var obj = JSON.parse(rjson);
                            console.log("Ranking OFF atualizado, jogue novamente!");

                        } else {
                            return false;
                        }
                    })
                    .fail(function (jqxhr, textStatus, error) {
                        console.log("Você parece estar off-line!");

                        return false;
                    });

        }
    }
    function millisecondsToTime(milli) {
        var milliseconds = milli % 1000;
        var seconds = Math.floor((milli / 1000) % 60);
        var minutes = Math.floor((milli / (60 * 1000)) % 60);
        return minutes + ":" + seconds;
    }
    $("#btn_start_test").on("click", function () {

        $(".hello").hide();
        // $("#test_model_1").show();
        $("#navbar-T ul").removeClass("hidden");
        nStartTime = new Date();
        nLastClickTime = new Date();
        setTimeout(gameStart, nTimeToStart);
        setTimeout(gameTime, 1000);
    });
    $(".btn_start_test").on("click", function () {
        setTimeout(gameStart, nTimeToStart);
    });

    $(".btn-toggle .btn").on("click", function () {
        $(".btn-toggle .btn").toggleClass("active")
        if ($(this).text() == "TESTE") {
            alert("MODO TESTE: passando as atividades rapidinho")
            nTimeToStart = 3000;
            nTimeToTest = 3000;
            bugs = true;
        } else {
            alert("MODO APLICAÇÃO: vá em frente, 30s para instrução e 10s para resposta")
            nTimeToStart = 10;
            nTimeToTest = 20000;
            bugs = false;
        }
    });
    $(".teste_model").hide();

    $("#sair").on("click", function () {
        try {
            window.parent.close = true;
            if (finished) {
                window.parent.closeModal();
            } else {
                onAnimateComplete();
            }
        }
        catch (e) {
            console.log(e);
        }

    });

});