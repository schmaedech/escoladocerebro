var unmute = true;
var hwol_audioErr = null;
var hwol_audioLevelup = null;
var hwol_audioOkay = null;
var hwol_audioGo = null;
var hwol_audioLow = null;

loadAudio();


function loadAudio() {
    hwol_audioErr = new Howl({
        urls: ['audio/err.ogg'],
        autoplay: false,
        loop: false,
        volume: 0.5,
        onend: function() {

        },
        onplay: function() {

        }
    });
    hwol_audioLevelup = new Howl({
        urls: ['audio/levelup.ogg'],
        autoplay: false,
        loop: false,
        volume: 0.5,
        onend: function() {

        }
    });
    hwol_audioOkay = new Howl({
        urls: ['audio/okay.ogg'],
        autoplay: false,
        loop: false,
        volume: 0.5,
        onend: function() {
        }
    });
    hwol_audioGo = new Howl({
        urls: ['audio/go.ogg'],
        autoplay: false,
        loop: false,
        volume: 0.5,
        onend: function() {
        }
    });
    hwol_audioLow = new Howl({
        urls: ['audio/low.ogg'],
        autoplay: false,
        loop: false,
        volume: 0.5,
        onend: function() {

        }
    });
}
function audioErr() {
    if (unmute) {
        hwol_audioErr.play();
    }
}
function audioLevelup() {
    if (unmute) {
        hwol_audioLevelup.play();
    }
}
function audioOkay() {
    if (unmute) {
        hwol_audioOkay.play();
    }
}
function audioGo() {
    if (unmute) {
        hwol_audioGo.play();
    }
}
function audioLow() {
    if (unmute) {
        hwol_audioLow.play();
    }
}