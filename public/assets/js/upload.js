
var cloud_name='dn24716of',
  upload_preset="ml_default",
  video_camera,
  canvas,
  cloudinary_photo,
  streaming = false,
  width = 320,
  height = 0,
  start_camera_button,
  take_picture_button,
  clear_picture_button,
  upload_button,
  upload_response;

function init() {
  console.log("init");
  cloud_name = document.getElementById("cloud_name");
  upload_preset = document.getElementById("upload_preset");
  video_camera = document.getElementById("video_camera");
  canvas = document.getElementById("canvas");
  cloudinary_photo = document.getElementById("cloudinary_photo");
  start_camera_button = document.getElementById("start_camera_button");
  take_picture_button = document.getElementById("take_picture_button");
  clear_picture_button = document.getElementById("clear_picture_button");
  upload_button = document.getElementById("upload_button");
  upload_response = document.getElementById("upload_response");

  start_camera_button.addEventListener("click", startCamera);
  take_picture_button.addEventListener("click", takePhoto);
  clear_picture_button.addEventListener("click", clearPhotos);
  upload_button.addEventListener("click", uploadPhoto);
}

function startCamera(ev) {
  console.log("startCamera");
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(function (stream) {
      video_camera.srcObject = stream;
      video_camera.play();
      ev.srcElement.disabled = true;
      take_picture_button.disabled = false;
      clear_picture_button.disabled = false;
    })
    .catch(function (err) {
      console.log("An error occurred: " + err);
    });

  video_camera.addEventListener(
    "canplay",
    (ev) => {
      if (!streaming) {
        height = 640;

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
    //    if (isNaN(height)) {
    //      height = 640;
   //     }

        video_camera.setAttribute("width", 640);
        video_camera.setAttribute("height", 480);

        canvas.setAttribute("width", 640);
        canvas.setAttribute("height", 480);

        streaming = true;
      }
    },
    false
  );
}

function clearPhotos() {
  var context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, 640, 480);

  var data = canvas.toDataURL("image/png");
  cloudinary_photo.setAttribute("src", data);
  upload_button.disabled = true;
}

function takePhoto() {
  var context = canvas.getContext("2d");
  console.log("taking phto");
  width=640;
  height=480;
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video_camera, 0, 0, 640, 480);
    upload_button.disabled = false;
  } else {
    clearPhotos();
  }
}

function areAllFieldsValid() {
  return cloud_name.value !== "" && upload_preset.value !== "";
}

function uploadPhoto() {
    cloud_name='dn24716of';
    upload_preset="ml_default";
  canvas.toBlob((blob) => {
    var formdata = new FormData();
    formdata.append("file", blob);
    formdata.append("upload_preset", upload_preset);
    formdata.append("cloud_name", cloud_name);
    console.log('name of cloud',cloud_name);
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.cloudinary.com/v1_1/" + cloud_name + "/image/upload",
      false
    );
        console.log(" Uploaded")
    xhr.onload = function () {
      let response = JSON.parse(this.response);
      cloudinary_photo.setAttribute("src", response.secure_url);

      console.log("ssss",response.secure_url);
      imageUrl=response.secure_url;
    
      //upload_response.value += this.responseText + "\n";
      axios.post('https://prs-portal.herokuapp.com/user/upload', {
        imageUrl
      });
      
    res=  axios.post('https://prs-flask1.herokuapp.com/',{ imageUrl});
    };

    xhr.send(formdata);
  });
}

window.onload = init();
