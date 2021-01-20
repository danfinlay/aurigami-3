console.log('registering')
const AudioContext = window.AudioContext || window.webkitAudioContext;

document.addEventListener('DOMContentLoaded',() => {
  console.log('loaded');
  const newConvoButton = document.querySelector('button.newConvo');
  console.dir(newConvoButton);
  newConvoButton.addEventListener('click', newConvo);

});

function newConvo () {
  console.log(`Let's talk!`);
  navigator.mediaDevices.getUserMedia({audio: true})
  .then(function(stream) {
    console.log(stream);
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);

    // Passthrough
    source.connect(audioCtx.destination);
  });
}

function gotAudio(stream) {
  peerConnection.addStream(stream.createWorkerProcessor(new Worker("effect.js")));
}


