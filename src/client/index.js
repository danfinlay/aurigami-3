const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
let controller = {};

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

    const recorder = createRecorder({ stream });

  });
}

function createRecorder ({ chunkSize, stream } = { chunkSize: 5000 }) {
  const source = audioCtx.createMediaStreamSource(stream);
  let mediaRecorder = new MediaRecorder(sourceStream);
  const data = [];

  mediaRecorder.ondataavailable = (event) => {
    event.data.size && data.push(event.data);
  }
  mediaRecorder.start(chunkSize);
  mediaRecorder.onstop = () => process(data);
  source.connect(audioCtx.destination);

  return {
    stop: () => {
      mediaRecorder.stop();
    },

    async *[Symbol.asyncIterator]() {
      // First clear the backlog
      data.forEach((blob) => {
        yield blob;
      });

      while (mediaRecorder.state === 'recording') {
        yield new Promise((res) => {
          mediaRecorder.ondataavailable = event => res(event.data);
        })
      }
    }
  }
}

function process(data, ctx) {
    const blob = new Blob(data);

    convertToArrayBuffer(blob)
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then((buff) => play(buff, ctx));
}

function convertToArrayBuffer(blob) {
    const url = URL.createObjectURL(blob);

    return fetch(url).then(response => {
        return response.arrayBuffer();
    });
}

function play(audioBuffer) {
    const sourceNode = audioCtx.createBufferSource();

    sourceNode.buffer = audioBuffer;
    sourceNode.detune.value = -300;

    sourceNode.connect(audioContext.destination);
    sourceNode.start();
}
