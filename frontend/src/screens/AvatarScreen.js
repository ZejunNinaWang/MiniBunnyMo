import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { saveAvatar } from '../actions/userActions';



const getOverlayValues = landmarks => {
  const nose = landmarks.getNose()
  const jawline = landmarks.getJawOutline()

  const jawLeft = jawline[0]
  const jawRight = jawline.splice(-1)[0]
  const adjacent = jawRight.x - jawLeft.x
  const opposite = jawRight.y - jawLeft.y
  const jawLength = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2))

  // const angle = Math.round(Math.tan(opposite / adjacent) * 100)
  const angle = Math.atan2(opposite, adjacent) * (180 / Math.PI)
  const width = jawLength * 2.2

  return {
    width,
    angle,
    leftOffset: jawLeft.x - width * 0.27,
    topOffset: nose[0].y - width * 0.47,
  }
}

function AvatarScreen(props) {
  
  const videoRef = useRef();
  const btnTakePhotoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false); 
  const [isWebCamOn, setIsWebCamOn] = useState(false);
  const intervalRef = useRef();
  const [ctx, setCtx] = useState();
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  const userRegister = useSelector(state => state.userSignin);
  const {loading, userInfo, error} = userRegister;
  
  const userAvatarSave = useSelector(state => state.userAvatarSave);
  const {success: userAvatarSaveSuccess} = userAvatarSave;

  const dispatch = useDispatch();

  const loadModels = async () => {
    await Promise.all([
      // faceapi.nets.tinyFaceDetector.loadFromUri(path.join(__dirname, '/../../models')),
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
  
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(() =>{
      console.log("face api models loaded")
      setModelsLoaded(true)
    }).catch(error => {
      console.error(error)
    })
  }
  
  useEffect(() => { 
      let isMounted = true;  // note this flag denote mount status
      //if not registered or signed in, redirect to register page
      if(!userInfo || !userInfo.name){
        props.history.push('register');
      }
      if(userAvatarSaveSuccess){
        props.history.push("/");
      }

      if(isMounted) loadModels();
      
      return () => {
        isMounted = false; // use effect cleanup to set flag false, if unmounted
        
      };
  }, [userAvatarSaveSuccess]);

  useEffect(() => { 
    
    return () => {
      console.log("unmount");
      //stop detecting face 
      videoRef.current.removeEventListener('play', detectFace);
      //clear setInterval for face detection
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      
    };
}, []);

  

  const takePhoto = () => {
    setPhotoTaken(true)

    //stop detecting face 
    videoRef.current.removeEventListener('play', detectFace);
    //clear setInterval for face detection
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    const photoCanvas = document.getElementById("canvas-photo");
    const ratio = videoRef.current.videoWidth/videoRef.current.videoHeight;
    const w = videoRef.current.offsetWidth
    const h = parseInt(w/ratio,10)
    //create image from current video frame
    //render the image on top of video component
    ctx.fillRect(0,0,w,h);
    ctx.drawImage(videoRef.current,0,0,w,h);
    
    //draw masks on the screenshot
    const videoLi = document.getElementById("video-li");
    for(var i = 0; i < videoLi.childNodes.length; i++){
      if(videoLi.childNodes[i].nodeName === "IMG"){
        const image = videoLi.childNodes[i]

        const bodyRect = document.body.getBoundingClientRect()
        const videoLiRect = videoLi.getBoundingClientRect()
        const offsetLeft = videoLiRect.left - bodyRect.left
        const offsetTop = videoLiRect.top - bodyRect.top

        const left = parseFloat(videoLi.childNodes[i].style.left.split('p')[0]) - offsetLeft;
        const top = parseFloat(videoLi.childNodes[i].style.top.split('p')[0]) - offsetTop;
        const rotation = parseFloat(videoLi.childNodes[i].style.transform.split("(")[1].split("d")[0]);
        const rad = rotation * Math.PI/180
        const width = videoLi.childNodes[i].offsetWidth

        let x = left + width/2
        let y = top + width/2.0

        ctx.translate(x,y)
        ctx.rotate(rad)
        
        ctx.drawImage(videoLi.childNodes[i], -1*width/2 ,-1*width/2 ,width ,width)

        ctx.rotate(-rad)
        ctx.translate(-x,-y)

        videoLi.childNodes[i].remove()
      }
    }
    
    //hide/stop video :
    videoRef.current.srcObject.getTracks().forEach(function(track) {
      track.stop();
    });

    setTimeout(()=>{
      for(var i = 0; i < videoLi.childNodes.length; i++){
        if(videoLi.childNodes[i].nodeName === "IMG"){
          videoLi.childNodes[i].remove()
        }
      }
    }, 200)

    savePhoto(photoCanvas);

  }




  //hook up web cam with video element
  const startVideo = async () => {
    await navigator.mediaDevices.getUserMedia(
      { video: {} },
    ).then((stream => {
      videoRef.current.srcObject = stream;
      setIsWebCamOn(true);
      videoRef.current.addEventListener('play', detectFace)
    })).catch((err) => {
      console.log(err);
    });
  }

  const detectFace = () => {
    if(!intervalRef.current){
      const canvas = faceapi.createCanvasFromMedia(videoRef.current)
      canvas.setAttribute("id", "canvas");
      const videoLi = document.getElementById("video-li");
      videoLi.insertBefore(canvas, videoLi.childNodes[0])
  
      let ratio = videoRef.current.videoWidth/videoRef.current.videoHeight;
      let w = videoRef.current.offsetWidth
      let h = parseInt(w/ratio,10)
  
      let displaySize = { width: w, height: h }
      faceapi.matchDimensions(canvas, displaySize)
  
      //prepare to take photo
      const photoCanvas = faceapi.createCanvasFromMedia(videoRef.current)
      photoCanvas.setAttribute("id", "canvas-photo");
      videoLi.insertBefore(photoCanvas,videoLi.childNodes[0])
      faceapi.matchDimensions(photoCanvas, displaySize)
      setCtx(photoCanvas.getContext('2d'));
      
      //track face in video
      const intervalId = setInterval(async () => {
        console.log("detecting");
        if(videoRef && videoRef.current){
          const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
          if(!detection) return
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    
          //remove previous image components in videoLi, leave only canvas and video in videoLi
          for(var i = 0; i < videoLi.childNodes.length; i++){
            if(videoLi.childNodes[i].nodeName === "IMG"){
              videoLi.removeChild(videoLi.childNodes[i])
            }
          }
    
          //draw mask 
          const scale = videoRef.current.offsetWidth / videoRef.current.videoWidth
            const overlayValues = getOverlayValues(detection.landmarks)
    
            const overlay = document.createElement("img")
            overlay.src = '/masks/1.PNG'
            overlay.alt = "mask overlay."
            const avatarUpload = document.getElementById("avatar-upload")
            const left = videoLi.offsetLeft + overlayValues.leftOffset * scale
            const top = videoLi.offsetTop + overlayValues.topOffset * scale
            overlay.style.cssText = `
              position: absolute;
              left: ${left}px;
              top: ${top}px;
              width: ${overlayValues.width * scale}px;
              transform: rotate(${overlayValues.angle}deg);
            `
            videoLi.insertBefore(overlay, videoLi.childNodes[0]);
        }
        
      }, 100)
      intervalRef.current = intervalId;
      console.log("intervalId is ", intervalId)
      console.log("faceDetectIntervalId is ", intervalRef.current)
    }
    
  }


  //Allows to download and set as profile
  const savePhoto = (canvas) => {
    //Pop up download window 
    // let downloadLink = document.createElement('a');
    // downloadLink.setAttribute('download', 'CanvasAsImage.png');
    // let dataURL = canvas.toDataURL('image/png');
    // let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    // downloadLink.setAttribute('href', url);
    // downloadLink.click();

    let dataURL = canvas.toDataURL('image/png');
    setPhotoUrl(dataURL)
  }

  const retake = () => {
    //hide/discard image
    setPhotoUrl(null)
    const canvas = document.getElementById("canvas");
    const photoCanvas = document.getElementById("canvas-photo");
    canvas.remove();
    photoCanvas.remove();
    startVideo()
    setPhotoTaken(false)


  }

  const setAsProfile = (e) => {
    //upload image to server with respective user
    const bodyFormData = new FormData();
    fetch(photoUrl)
    .then(res => res.blob())
    .then(blob => {
      const file = new File([blob], 'avatar.png', blob)
      bodyFormData.append('image', file); 
      // setUploading(true);
      axios.post('/api/uploads/avatars', bodyFormData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      }).then(response => {
          dispatch(saveAvatar(response.data.file.filename));
      }).catch(err => {
          console.log(err);
      });
    }).catch(err => {
      console.log(err)
    })

    
  }

  return (
    <div className="avatar content-margined">
      <ul id="avatar-upload" className="avatar-upload">
        <li id="video-li">
        <video id="video" className="video" ref={videoRef} autoPlay muted></video>
        </li>
        <li className="button-selfie-li">
        <button 
          style={{display: !photoTaken? '':'none'}}
          disabled={!modelsLoaded} 
          onClick={isWebCamOn?takePhoto:startVideo} 
          className="button selfie"
          ref={btnTakePhotoRef}>
          {isWebCamOn?"Take Photo":"Turn on Camera"}
        </button>
        <button
         style={{display: photoTaken? '':'none'}}
         className="button"
         onClick={retake}>
           Retake
        </button>
        <button
         style={{display: photoTaken? '':'none'}}
         className="button"
         onClick={setAsProfile}>
           Set As Profile
        </button>


        </li>
        
      </ul>

      <div className="avatar-generated">
        <div className="avatar-image">
          {/* <img  src={"../api/image/"+product.image} /> */}
        </div>
      </div>
      
    </div>
  );
}
export default AvatarScreen;