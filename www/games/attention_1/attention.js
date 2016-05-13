$(document).ready(function ($) {
    var nRows = 8;
    var nColumns = 10;
    var nTest = 0;
    var nClicks = 0;
    var nTimeInterval = null;
    var nTimeToStart = 0;
    var nTimeToTest = 5000;
    var nLevel = 1;
    var nPoints = [];
    var nPeaces = [];
    var nPlay = true;
    var nStartTime = new Date();
    var nLastClickTime = new Date();
    var nClickIntervals = [];
    var finished = false;
    var peaces = [
        {"value": "0"},
        {"value": "0"},
        {"value": "1|2"},
        {"value": "1|2"},
        {"value": "3|4|5"},
        {"value": "3|4|5"},
        {"value": "6|7|8|9"},
        {"value": "10|11|12|13|14"},
        {"value": "15|16|17|18|19|20"},
        {"value": "1|2|3|4|5|6|7"}
    ];
    var board = [
        {value: "0|1|2|3|4"},
        {value: "0|1|2|3|4"},
        {value: "1|2|3|4|5"},
        {value: "1|2|3|4|5"},
        {value: "3|4|5|6|7|8|9|10"},
        {value: "3|4|5|6|7|8|9|10"},
        {value: "6|7|8|9|10|11|12|13"},
        {value: "10|11|12|13|14|15|16|17|18|19"},
        {value: "15|16|17|18|19|20|21|0|1|2"},
        {value: "1|2|3|4|5|6|7|8|9|10|11|12"}
    ];

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
            $(".peaces-logo").append('<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1"><button type="button" data-toggle="button" id="cur_' + resp[i] + '" class="btn btn-primary col-xs-4 col-sm-4 col-md-4 col-lg-4 center-block">   <img src="../../img/pattern_1/ts' + resp[i] + '.png" </img></button></div></div> ');

//            if (nLevel == 1) { 
//                $(".peaces-logo").append('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><button type="button" data-toggle="button" id="cur_' + resp[i] + '" class="btn btn-primary col-xs-5 col-sm-5 col-md-5 col-lg-5 center-block">   <img src="../../img/pattern_1/ts' + resp[i] + '.png" </img></button></div></div> ');
//            }
//            if (nLevel == 2) {
//                $(".peaces-logo").append('<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><button type="button" data-toggle="button" id="cur_' + resp[i] + '" class="btn btn-primary col-xs-5 col-sm-5 col-md-5 col-lg-5 center-block">   <img src="../../img/pattern_1/ts' + resp[i] + '.png" </img></button></div></div> ');
//            }
//            if (nLevel == 3) {
//                $(".peaces-logo").append('<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><button type="button" data-toggle="button" id="cur_' + resp[i] + '" class="btn btn-primary col-xs-4 col-sm-4 col-md-4 col-lg-4 center-block">   <img src="../../img/pattern_1/ts' + resp[i] + '.png" </img></button></div></div> ');
//            }
        });

        $("#board").html(gamePage);
        $(".btn-board").on("click", function (e) {
            nClicks++;
            $(this).prop('disabled', true);
            nClickIntervals.push(new Date() - nLastClickTime);
            nLastClickTime = new Date();
            var strp = peaces[nTest].value;
            var resp = strp.split("|");
            if (nLevel == 1) {
                $.each(resp, function (i) {
                    console.log(resp[i])
//                    if (resp[i] == $(this).text()) {
//                        nPoints.push($(this).text());
//                        $("#points").text(nPoints.length);
//                    }
                });

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
     
        console.log("gamePscicotest nTest" + nTest)
           nTest++;
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

        if (nTest == peaces.length && nLevel < 2) {
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