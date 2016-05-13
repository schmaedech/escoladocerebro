$(document).ready(function ($) {
    var nRows = 1;
    var nColumns = 6;
    var nTest = 0;
    var nTestPeaces = 22;
    var nClicks = 0;
    var nTimeInterval = null;
    var nLevel = 1;
    var nPoints = [];
    var peaces = [];
    var clone_peaces = [];
    var nPlay = true;
    var nStartTime = new Date();
    var nLastClickTime = new Date();
    var nClickIntervals = [];
    var bugs = false;
    var finished = false;

    function gamePscicotest() {
        nTest++;

        var board = [];
        board.push(peaces[nTest - 1]);
        board.push(peaces[nTest]);
        var p = peaces[nTest].value.split("_");
        $(".peaces-logo").html("");
        $(".peaces-logo").append('<button type="button" data-toggle="button" id="cur_' + peaces[nTest].value + '" class="btn btn-primary ">   <img src="../../img/pattern_2/ts' + p[1] + '.png" </img></button></div>');

        clone_peaces.splice(0, 1);
        // clone_peaces.splice(0, 1);
        var sub_clone_peaces = clone_peaces.slice();
        for (var i = 0; i < 4; i++) {
            var tmp = Math.floor((Math.random() * (sub_clone_peaces.length - 1)) + 0);
            board.push(sub_clone_peaces[tmp]);
            sub_clone_peaces.splice(tmp, 1);

        }
        if (bugs) {

        } else {
            board.sort(function () {
                return .5 - Math.random();
            });
        }

        clone_peaces.push(peaces[nTest - 1]);
        // clone_peaces.push(peaces[nTest]);
        //  log(JSON.stringify(board))
        // log(JSON.stringify(clone_peaces))
        // log(JSON.stringify(sub_clone_peaces))
        var nBreak = (nColumns - 1);
        var gamePage = "<div class=\"layout board-memory\" id=\"layout\">";
        $.each(board, function (i) {
            var str = board[i].value;
            var res = str.split("_");

            if ((i % nColumns) == 0) {
                gamePage += '<div class="row center-block">';
            }
            gamePage += '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 center-block">';
            gamePage += '<button type="button" data-toggle="button"   class="btn btn-primary btn-board btn-board-memory">' + res[1] + '<img src="../../img/pattern_2/ts' + res[1] + '.png" </img></button></div>';

            if ((i % nColumns) == nBreak) {
                gamePage += "</div> ";
            }

        });
        gamePage += " </div>";
        $("#board").html(gamePage);
        $(".btn-board").on("click", function (e) {
            var p = peaces[nTest - 1].value.split("_");
            nClicks++;
            $(this).prop('disabled', true);
            nClickIntervals.push(new Date() - nLastClickTime);
            nLastClickTime = new Date();
            if (p[1] == $(this).text()) {
                nPoints.push($(this).text());
                $("#points").text(nPoints.length);
            }

            $(".total_points").text(nPoints.length);
            $(".total_clicks").text(nClicks);
            console.log("total_points " + nPoints.length)
            console.log("total_clicks " + nClicks)
            console.log("$(this).text() " + $(this).text())
            console.log("peaces[nTest - 1] " + p[1])

            if (nTest === nTestPeaces - 1) {
                gameStop();
                $("#test_model_end").show();
                nPlay = false;
                finished = true;
                onAnimateComplete();
                return true;
            }
            gamePscicotest();
        });
        $("#board").addClass("jumbotron");
        $("#peaces-logo").addClass("jumbotron");
        console.log("gamePscicotest nTest" + nTest)
    }
    function gameStop() {
        console.log("stop");
        clearInterval(nTimeInterval);
        $("#board").hide();
        $(".peaces-logo").html("Fim do Teste");
    }
    function gameStart() {
        $("#points").text(nPoints.length);
        $("#state").text(nLevel);
        for (var i = 0; i < nTestPeaces; i++) {
            peaces.push({"value": ("peaces_" + i), "state": false});
        }
        console.log("PECAS:" + JSON.stringify(peaces))
        peaces.sort(function () {
            return .5 - Math.random();
        });
        console.log("PECAS MISTURADAS:" + JSON.stringify(peaces))
        clone_peaces = peaces.slice();
        //log(JSON.stringify(peaces))

        gamePscicotest();
    }
    function gamePlayerOkayDude() {
        $("#board").show();
        $(".teste_model").hide();
        $("#points").text(nPoints.length);
        $("#state").text(nLevel);

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
        logObject.gameId = "memory";
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