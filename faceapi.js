const video = document.getElementById("videoInput");

// Loading Models
Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"), //heavier/accurate version of tiny face detector
]).then(start);

function start() {
  document.body.append("Models Loaded");

  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );

  //video.src = '../videos/speech.mp4'
  console.log("video added");
  recognizeFaces();//function to start face recognition
}

async function recognizeFaces() {
  const labeledDescriptors = await loadLabeledImages();//load people to be identifed
  console.log(labeledDescriptors);
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7);

  video.addEventListener("play", async () => {//starting video playback
    console.log("Playing");
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

      const results = resizedDetections.map((d) => {//people identifed
        return faceMatcher.findBestMatch(d.descriptor);
      });
      results.forEach((result, i) => {//drawing box around face
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
        drawBox.draw(canvas);
      });
    }, 100);
  });
}

function loadLabeledImages() {
  const labels = [// get username from session
    "Black Widow",
    "Captain America",
    "Hawkeye",
    "Jim Rhodes",
    "Tony Stark",
    "Thor",
    "Captain Marvel",
    "Prashant Kumar",
  ];
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`); //fetching image for recognition
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        // console.log(label + i + JSON.stringify(detections))
        descriptions.push(detections.descriptor);
      }
      document.body.append(label + " faces loaded | ");//writing names of people being detected
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}