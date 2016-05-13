function audioErr() {
    new Howl({
        urls: ['audio/err.wav'],
        autoplay: true,
        loop: false,
        volume: 0.5,
        onend: function() {
             
        },
        onplay: function() {
             
        }
    });
}
function audioLevelup() {
    new Howl({
        urls: ['audio/levelup.wav'],
        autoplay: true,
        loop: false,
        volume: 0.5,
        onend: function() {
           
        }
    });
} 
function audioOkay() {
    new Howl({
        urls: ['audio/okay.wav'],
        autoplay: true,
        loop: false,
        volume: 0.5,
        onend: function() { 
        }
    });
}
function audioGo() {
    new Howl({
        urls: ['audio/go.wav'],
        autoplay: true,
        loop: false,
        volume: 0.5,
        onend: function() { 
        }
    });
}
function audioLow() {
    new Howl({
        urls: ['audio/low.wav'],
        autoplay: true,
        loop: false,
        volume: 0.5,
        onend: function() {
 
        }
    });
}
function audioTecla(index) {
    new Howl({
        urls: ["audio/manthey/track" + (index) + ".wav"],
        autoplay: true,
        loop: false,
        volume: 0.5,
        onend: function() {

            //feedback("você errou, tente novamente!");
        }
    });
} 