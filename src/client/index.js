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
    debugger;
    const mediaRecorder = new MediaRecorder(sourceStream);
    debugger;
    const data = [];

    mediaRecorder.ondataavailable = e => e.data.size && data.push(e.data);
    mediaRecorder.start();
    mediaRecorder.onstop = () => process(data);

    // Passthrough
    source.connect(audioCtx.destination);
  });
}


function process(data) {
    const blob = new Blob(data);

    convertToArrayBuffer(blob)
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(play);
}

function convertToArrayBuffer(blob) {
    const url = URL.createObjectURL(blob);

    return fetch(url).then(response => {
        return response.arrayBuffer();
    });
}
