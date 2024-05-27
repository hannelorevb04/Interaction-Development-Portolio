const classifier = ml5.imageClassifier('MobileNet', modelLoaded);
const classifyBtn = document.getElementById('classify-btn');
const classifyResults = document.getElementById('classify-results');
const capturedPhoto = document.getElementById('captured-photo'); // Element geselecteerd voor de getrokken foto
let webcam;

async function modelLoaded() {
  console.log('Yay, the model has loaded!');
  document.querySelector(".container h1").innerText = "Richt de camera op een object en druk op de knop 'Neem foto' ";
  webcam = await navigator.mediaDevices.getUserMedia({ video: true });
  document.getElementById('webcam').srcObject = webcam;
  document.getElementById('webcam').style.transform = 'scale(-1, 1)'; // Spiegel de video horizontaal
}

classifyBtn.addEventListener('click', async function () {
  if (webcam) {
    const video = document.getElementById('webcam');
    const img = document.createElement('canvas');
    const ctx = img.getContext('2d');
    img.width = video.videoWidth;
    img.height = video.videoHeight;

    // Spiegel de context van de canvas
    ctx.translate(video.videoWidth, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    classifier.classify(img, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(results);
      classifyResults.innerHTML = '';
      for (let result of results) {
        console.log(result);
        if (result.confidence >= 0.1) {
          classifyResults.innerHTML += `<h2>${result.label}</h2>`;
        }
      }
      if (classifyResults.innerHTML === '') {
        classifyResults.innerHTML = `<h2>No result found</h2>`;
      }
    });

    // Toon de getrokken foto
    const photoImg = document.createElement('img');
    photoImg.src = img.toDataURL(); // Zet de canvas om naar een data-URL
    capturedPhoto.innerHTML = ''; // Leeg het element voordat we een nieuwe foto toevoegen
    capturedPhoto.appendChild(photoImg); // Voeg de foto toe aan de container
  }
});
