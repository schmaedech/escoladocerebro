var close = false;
function setStat(key, value) {
    var display = $('.stat_' + key + '_display');
    if (display.length > 0)
        display.html(value);//display.text(parseFloat(value).toFixed(0));

} 
function closeModal() {
     location.reload(true);
 }
function playAgain(sample, message) {
   
    $("#baloon-header-logger .baloon-label").text("Você fez " + Math.round(sample.pontuacao || 0) + " pontos em " + Math.round(sample.time / 1000) + " segundos. " + message);
    $("#baloon-header-logger").removeClass("hidden");
    $("#game_again").on("click", function () {
        $("#baloon-header-logger").toggleClass("hidden");
        document.getElementById(sample.gameId).src = "games/" + sample.gameId + "/" + sample.gameId + ".html";
    });
     
     if(close)
         location.reload(true);
     
    console.log(message);

}
function syncData(sample) {
    var measurements = JSON.parse(localStorage.getItem('org.escoladocerebro.measurements')) || [];
    console.log("Sincronizando..." + measurements.length + " dados.");
    var sampleWalker = 0;
    var sampleLength = measurements.length;
    $.each(measurements, function (key, value) {
        var lastSample = JSON.parse(value);
        $.getJSON("https://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(lastSample)})
                .done(function (json) {
                    if (json !== null) {
                        sampleWalker++;
                        if (sampleLength === sampleWalker) {
                            var measurements = [];
                            localStorage.setItem('org.escoladocerebro.measurements', JSON.stringify(measurements));
                            playAgain(sample, "Seus dados da jogada foram salvos!");
                            return true;
                        }
                        console.log("Sincronizando..." + sampleWalker + " dados.");
                    } else {
                        playAgain(sample, "Aconteceu algum bug ao enviar os dados!");
                        return false;
                    }
                })
                .fail(function (jqxhr, textStatus, error) {
                    playAgain(sample, "Você parece estar off-line!");
                    return false;
                });
    });
}
function saveLogObject(sample) {
    var user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
    sample.playerId = user.playerId;
    sample.adminId = user.adminId;
    sample.fullname = user.fullname;
    
    localStorage.setItem("org.escoladocerebro.sample", JSON.stringify(sample));
    var measurements = JSON.parse(localStorage.getItem('org.escoladocerebro.measurements')) || [];
    measurements.push(JSON.stringify(sample));
    localStorage.setItem('org.escoladocerebro.measurements', JSON.stringify(measurements));
    
    var sync = syncData(sample);

}
