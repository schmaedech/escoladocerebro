$(document).ready(function ($) {
    var nRows = 1;
    var nColumns = 4;
    var nTest = 0;
    var nTestPeaces = 20;
    var nFadeTime = 2000;
    var nClicks = 0;
    var nTimeInterval = null;
    var nLevel = 1;
    var nPoints = [];
    var peacesA = [];
    var peacesB = [];
    var peacesC = [];
    var nPlay = true;
    var nStartTime = new Date();
    var nLastClickTime = new Date();
    var nClickIntervals = [];
    var bugs = false;
    var finished = false;

    function gameStart() {
        $("#points").text(nPoints.length);
        $("#state").text(nLevel);
        for (var i = 0; i < nTestPeaces; i++) {
            peacesA.push({"value": ("peaces_" + i), "state": false, "response": ("response_" + i)});
        }

        peacesB = [
            {"value": "bixos-02,bixos-03,bixos-14,pecas-45", "response": "bixos-07,pecas-04,pecas-05,pecas-17"},
            {"value": "pecas-04,pecas-08,pecas-44,pecas-45", "response": "pecas-01,pecas-05,pecas-27,pecas-07"},
            {"value": "bixos-12,bixos-03,bixos-06,pecas-45", "response": "bixos-05,pecas-18,pecas-25,pecas-03"},
            {"value": "bixos-15,bixos-11,bixos-13,pecas-45", "response": "bixos-08,bixos-03,bixos-10,bixos-09"},
            {"value": "bixos-02,bixos-03,bixos-05,pecas-45", "response": "bixos-10,bixos-09,bixos-08,bixos-07"},
            {"value": "pecas-08,pecas-04,pecas-07,pecas-45", "response": "pecas-44,bixos-11,pecas-33,pecas-27"},
            {"value": "pecas-05,pecas-18,pecas-19,pecas-45", "response": "pecas-20,pecas-35,pecas-21,pecas-31"},
            {"value": "pecas-09,pecas-10,pecas-11,pecas-45", "response": "pecas-12,pecas-42,pecas-41,pecas-36"},
            {"value": "pecas-32,pecas-22,pecas-38,pecas-45", "response": "pecas-06,pecas-40,pecas-17,pecas-26"},
            {"value": "pecas-17,pecas-13,pecas-16,pecas-45", "response": "pecas-37,pecas-33,pecas-22,pecas-27"},
            {"value": "pecas-14,pecas-09,pecas-41,pecas-45", "response": "pecas-31,pecas-02,pecas-13,pecas-17"},
            {"value": "pecas-42,pecas-41,pecas-36,pecas-45", "response": "pecas-09,pecas-02,bixos-11,pecas-26"},
            {"value": "pecas-27,bixos-14,pecas-01,pecas-45", "response": "pecas-44,pecas-30,bixos-09,pecas-18"},
            {"value": "pecas-18,pecas-20,pecas-35,pecas-45", "response": "pecas-34,bixos-13,pecas-21,pecas-10"},
            {"value": "pecas-38,pecas-40,pecas-39,pecas-45", "response": "bixos-05,bixos-02,bixos-03,bixos-04"},
            {"value": "pecas-17,pecas-10,pecas-38,pecas-45", "response": "pecas-25,pecas-05,pecas-40,bixos-06"},
            {"value": "pecas-14,pecas-15,pecas-29,pecas-45", "response": "pecas-30,pecas-28,pecas-34,pecas-03"},
            {"value": "pecas-02,bixos-15,pecas-01,pecas-45", "response": "pecas-43,pecas-23,pecas-24,pecas-25"},
            {"value": "bixos-02,bixos-12,bixos-14,pecas-45", "response": "bixos-10,bixos-06,bixos-13,bixos-03"},
            {"value": "bixos-04,bixos-01,bixos-11,pecas-45", "response": "bixos-07,pecas-07,pecas-05,pecas-01"}
        ];
        peacesC = [
            {"value": "p1", "state": false, "response": "bixos-04,bixos-02,bixos-03,bixos-01"},
            {"value": "p2", "state": false, "response": "bixos-02,bixos-01,bixos-03,bixos-04"},
            {"value": "p3", "state": false, "response": "bixos-01,bixos-02,bixos-10,bixos-04"}, 
            {"value": "p11", "state": false, "response": "bixos-01,bixos-02,bixos-03,bixos-04"},
            {"value": "p12", "state": false, "response": "bixos-03,bixos-05,bixos-06,bixos-12"},
            {"value": "p13", "state": false, "response": "bixos-07,bixos-02,bixos-03,bixos-04"},
            {"value": "p14", "state": false, "response": "bixos-04,bixos-01,bixos-07,bixos-14"},
            {"value": "p15", "state": false, "response": "bixos-04,bixos-11,bixos-07,bixos-14"},
            {"value": "p16", "state": false, "response": "bixos-05,bixos-11,bixos-07,bixos-01"},
            {"value": "p17", "state": false, "response": "bixos-06,bixos-01,bixos-03,bixos-08"}
        ];
        console.log("PECAS A:" + JSON.stringify(peacesA))
        console.log("PECAS B:" + JSON.stringify(peacesB))
        console.log("PECAS C:" + JSON.stringify(peacesC))
        if (bugs) {

        } else {
//            peacesA.sort(function () {
//                return .5 - Math.random();
//            });
//            peacesB.sort(function () {
//                return .5 - Math.random();
//            });
//            peacesC.sort(function () {
//                return .5 - Math.random();
//            });
        }

        //  clone_peaces = peacesA.slice();
        //   clone_peaces = peacesA.slice();
        console.log("PECAS A MISTURADAS:" + JSON.stringify(peacesA))
        console.log("PECAS B MISTURADAS:" + JSON.stringify(peacesB))
        console.log("PECAS C MISTURADAS:" + JSON.stringify(peacesC))
    }
    function gamePscicotest() {

        $(".stage").fadeIn();
        var board = [];
        var pecalogo = [];
        var pecaresponse = [];
        var pecapier = [];
        var pierresponse = [];

        var nBreak = (nColumns - 1);

        if (nTest < nTestPeaces) {
            pecalogo = peacesA[nTest].value.split("_");

            $(".peaces-logo").html("");
            $(".peaces-logo").append('<button type="button" data-toggle="button" id="cur_' + peacesA[nTest].value + '" class="btn btn-primary peaces-unique ">   <img src="../../img/pattern_3/ts' + pecalogo[1] + '.png" </img></button></div>');
        }

        if (nTest >= nTestPeaces && nTest < nTestPeaces * 2) {

            pecalogo = peacesB[nTest - nTestPeaces].value.split(",");
            pecaresponse = peacesB[nTest - nTestPeaces].response.split(",");
            $(".peaces-logo").html('');
            $(".peaces-logo").append('<div class="row center-block">');
            $(".peaces-logo").append('<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"><button type="button" data-toggle="button"  " class="btn btn-primary ">   <img src="../../img/pattern_4/' + pecalogo[0] + '.png" </img></button></div></div> ');
            $(".peaces-logo").append('<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"><button type="button" data-toggle="button"  " class="btn btn-primary ">   <img src="../../img/pattern_4/' + pecalogo[1] + '.png" </img></button></div></div> ');
            $(".peaces-logo").append('<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"><button type="button" data-toggle="button"  " class="btn btn-primary ">   <img src="../../img/pattern_4/' + pecalogo[2] + '.png" </img></button></div></div> ');
            $(".peaces-logo").append('<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"><button type="button" data-toggle="button"  " class="btn btn-primary ">   <img src="../../img/pattern_4/' + pecalogo[3] + '.png" </img></button></div></div> ');
            $(".peaces-logo").append("</div>");

        }

        if (nTest >= nTestPeaces * 2) {

            pecapier = peacesC[nTest - nTestPeaces * 2].value;
            pierresponse = peacesC[nTest - nTestPeaces * 2].response.split(",");
            $(".peaces-logo").html("");
            $(".peaces-logo").append('<button type="button" data-toggle="button" id="cur_' + peacesC[nTest - nTestPeaces * 2].value + '" class="btn btn-primary peaces-pier ">   <img src="../../img/pattern_5/' + pecapier + '.png" </img></button></div>');
        }

        $("#state").text(nLevel);
        //$(".peaces-logo").append("<h4> Escolha uma imagem abaixo </h4>");

        for (var i = 0; i < 4; i++) {
            board.push(i + 1);
        }
        if (bugs) {
            console.log(JSON.stringify(board))
        } else {
            board.sort(function () {
                 return .5 - Math.random();
            });
        }
        var gamePage = "<div class=\"layout board-problems\" id=\"layout\">";

        $.each(board, function (i) {
            var str = board[i];

            if ((i % nColumns) == 0) {
                gamePage += '<div class="row center-block">';
            }
            gamePage += '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">';
            if (nTest < nTestPeaces) {
                gamePage += '<button type="button" data-toggle="button" class="btn btn-primary btn-board">' + str + '<img src="../../img/pattern_3/ts' + pecalogo[1] + '_' + str + '.png" </img></button></div>';

            }

            if (nTest >= nTestPeaces && nTest < nTestPeaces * 2) {
                gamePage += '<button type="button" data-toggle="button" class="btn btn-primary btn-board">' + str + '<img src="../../img/pattern_4/' + pecaresponse[i] + '.png" </img></button></div>';

            }

            if (nTest >= nTestPeaces * 2) {
                gamePage += '<button type="button" data-toggle="button" class="btn btn-primary btn-board">' + str + '<img src="../../img/pattern_5/' + pierresponse[i] + '.png" </img></button></div>';

            }
            if ((i % nColumns) == nBreak) {
                gamePage += "</div> ";
            }

        });
        gamePage += " </div>";
        $("#board").html(gamePage);


        $(".btn-board").on("click", function (e) {
            nTest++;
            nClicks++;
            $(this).prop('disabled', true);
            nClickIntervals.push(new Date() - nLastClickTime);
            nLastClickTime = new Date();
            if ($(this).text() === "1") {
                nPoints.push($(this).text());
                $("#points").text(nPoints.length);
            }
            $(".total_points").text(nPoints.length);
            $(".total_clicks").text(nClicks);
            if (nTest === nTestPeaces) {

                nPlay = false;
                $("#test_model_2").show();
                gameStop();
            }
            if (nTest === nTestPeaces * 2) {

                nPlay = false;
                $("#test_model_3").show();
                gameStop();
            }

            if (nTest === (nTestPeaces * 2 + 10)) {
                $("#teste_model_3_title").addClass("hidden");
                $("#test_model_end").show();
                nPlay = false;
                gameStop();
                finished = true;
                onAnimateComplete();
                return true;
            }

            console.log("nTest" + nTest);
            console.log("total_points " + nPoints.length);
            console.log("total_clicks " + nClicks);
            console.log("$(this).text() " + $(this).text());
            $(".stage").fadeOut(nFadeTime, function () {
                gamePscicotest();
            });

        });
        $("#board").addClass("jumbotron");
        $("#peaces-logo").addClass("jumbotron");

    }
    function gameStop() {
        console.log("stop");
        clearInterval(nTimeInterval);
        $("#board").hide();
        $("#peaces-logo").hide();
        ///$(".peaces-logo").html("Fim do Teste");
    }

    function gamePlayerOkayDude() {
        $("#board").show();
        $("#peaces-logo").show();
        $(".teste_model").hide();
        $("#points").text(nPoints.length);
        $("#state").text(nLevel);
        //nClicks++;
        nClickIntervals.push(new Date() - nLastClickTime);
        nLastClickTime = new Date();
        gamePscicotest();
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
        logObject.gameId = "problems";
        logObject.timestamp = (new Date()).getTime();
        logObject['memoria'] = logObject.pontuacao * 1;
        logObject['visuo_espacial'] = logObject.pontuacao * 1;
        logObject['resolucao_problemas'] = logObject.pontuacao * 1;
        logObject['psico_motora'] = logObject.pontuacao * 1;
        logObject['logico_matematica'] = logObject.pontuacao * 1;
        logObject['linguagem'] = logObject.pontuacao * 1;
        logObject['tentativas'] = nPoints.length;
        logObject['acertos'] = nClicks;
        var tr;
        var text = "Parabéns! Seu tempo foi de:  " + duration + "";

        clearTimeout(tr);
        tr = setTimeout(function () {
            console.log(text);
        }, nFadeTime);

        try {
            window.parent.saveLogObject(logObject);
        }
        catch (e) {
            $.getJSON("https://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(logObject)})
                    .done(function (rjson) {
                        if (rjson !== null) {
                            var obj = JSON.parse(rjson);
                            console.log("Ranking OFF atualizado, jogue novamente!");
                            console.log(obj)
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
        $(".board").hide();
        $(".hello").hide();
        $("#test_model_1").show();
        $("#navbar-T ul").removeClass("hidden");
        nStartTime = new Date();
        nLastClickTime = new Date();
        gameStart();
        setTimeout(gameTime, 1000);
    });
    $("#test_model_1 button").on("click", function () {
        nLevel = 1;
        gamePlayerOkayDude();
    });
    $("#test_model_2 button").on("click", function () {
        nLevel = 2;
        gamePlayerOkayDude();
    });
    $("#test_model_3 button").on("click", function () {
          $("#teste_model_3_title").removeClass("hidden");
        nLevel = 3;
        gamePlayerOkayDude();
    });
    $(".btn-toggle .btn").on("click", function () {
        $(".btn-toggle .btn").toggleClass("active")
        if ($(this).text() == "TESTE") {
            alert("MODO TESTE: primeira escolha sempre correta")
            bugs = true;
        } else {
            alert("MODO APLICAÇÃO: vá em frente")
            bugs = false;
        }
    });
    $(".teste_model").hide();
    $(".board").hide();
    $(".hello").hide();
    $("#test_model_1").show();
    $("#navbar-T ul").removeClass("hidden");
    nStartTime = new Date();
    nLastClickTime = new Date();
    gameStart();
    setTimeout(gameTime, 1000);
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