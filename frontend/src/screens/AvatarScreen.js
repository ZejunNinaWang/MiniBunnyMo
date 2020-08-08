import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { saveAvatar } from '../actions/userActions';
import RegisterSteps from '../components/RegisterSteps';
import { USER_AVATAR_SAVE_RESET } from '../constants/userConstants';



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
  const ctxRef = useRef();
  const photoTakenRef = useRef();
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
      if(userAvatarSaveSuccess){
        dispatch({type: USER_AVATAR_SAVE_RESET});
        props.history.push("/");
      }
      return () => {
      };
  }, [userAvatarSave]);

  useEffect(() => { 
    let isMounted = true;  // note this flag denote mount status
    //if not registered or signed in, redirect to register page
    if(!userInfo || !userInfo.name){
      props.history.push('register');
    }

    console.log("userInfo.avatar is ", userInfo.avatar)

    if(isMounted) {
      loadModels();
      photoTakenRef.current = false;
    }
    
    return () => {
      console.log("setting isMounted to false")
      isMounted = false; // use effect cleanup to set flag false, if unmounted

      console.log("unmount");
      //stop detecting face 
      videoRef.current.removeEventListener('play', detectFace);
      //clear setInterval for face detection
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      
    };
}, []);

  

  const takePhoto = () => {
    photoTakenRef.current = true;
    console.log("A photoTaken is ", photoTakenRef.current)

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
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, ctx.width, ctx.height)
    console.log("drawing video")
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

        const left = parseFloat(image.style.left.split('p')[0]) - offsetLeft;
        const top = parseFloat(image.style.top.split('p')[0]) - offsetTop;
        const rotation = parseFloat(image.style.transform.split("(")[1].split("d")[0]);
        const rad = rotation * Math.PI/180
        const width = image.offsetWidth

        let x = left + width/2
        let y = top + width/2.0

        ctx.translate(x,y)
        ctx.rotate(rad)
        
        console.log("drawing mask")
        ctx.drawImage(image, -1*width/2 ,-1*width/2 ,width ,width)

        ctx.rotate(-rad)
        ctx.translate(-x,-y)

        image.remove()
      }
    }
    


    setTimeout(()=>{
      for(var i = 0; i < videoLi.childNodes.length; i++){
        if(videoLi.childNodes[i].nodeName === "IMG"){
          videoLi.childNodes[i].remove()
        }
      }
      const canvas = document.getElementById("canvas")
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    }, 200)

    savePhoto(photoCanvas);
    //hide/stop video :
    videoRef.current.srcObject.getTracks().forEach(function(track) {
      track.stop();
    });

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
  
      let displaySize = { width: w, height: h };
      faceapi.matchDimensions(canvas, displaySize)
  
      //prepare to take photo
      const photoCanvas = faceapi.createCanvasFromMedia(videoRef.current)
      photoCanvas.setAttribute("id", "canvas-photo");
      videoLi.insertBefore(photoCanvas,videoLi.childNodes[0])
      faceapi.matchDimensions(photoCanvas, displaySize)
      ctxRef.current = photoCanvas.getContext('2d');
      
      //track face in video
      const intervalId = setInterval(async () => {
        if(videoRef && videoRef.current && photoTakenRef.current !== true){
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
          if(videoRef.current){
            const scale = videoRef.current.offsetWidth / videoRef.current.videoWidth
            const overlayValues = getOverlayValues(detection.landmarks)
    
            const overlay = document.createElement("img")
            overlay.src = '../api/image/a492986734b1bf8b3999753af44d50ac.PNG'
            overlay.alt = "mask overlay"
            const avatarUpload = document.getElementById("avatar-upload")
            const Left = videoLi.offsetLeft + overlayValues.leftOffset * scale
            const Top = videoLi.offsetTop + overlayValues.topOffset * scale
            overlay.style.cssText = `
              position: absolute;
              left: ${Left}px;
              top: ${Top}px;
              width: ${overlayValues.width * scale}px;
              transform: rotate(${overlayValues.angle}deg);
              visibility: hidden;
            `
              videoLi.insertBefore(overlay, videoLi.childNodes[0]);
              const bodyRect = document.body.getBoundingClientRect()
              const videoLiRect = videoLi.getBoundingClientRect()
              const offsetLeft = videoLiRect.left - bodyRect.left
              const offsetTop = videoLiRect.top - bodyRect.top
  
              const left = parseFloat(overlay.style.left.split('p')[0]) - offsetLeft;
              const top = parseFloat(overlay.style.top.split('p')[0]) - offsetTop;
              const rotation = parseFloat(overlay.style.transform.split("(")[1].split("d")[0]);
              const rad = rotation * Math.PI/180
              const width = overlay.offsetWidth
  
              let x = left + width/2
              let y = top + width/2.0
  
              const ctx = canvas.getContext('2d');
  
              ctx.translate(x,y)
              ctx.rotate(rad)
              ctx.drawImage(overlay, -1*width/2 ,-1*width/2 ,width ,width)
  
              ctx.rotate(-rad)
              ctx.translate(-x,-y)
          }
          

        }
        
      }, 100)
      intervalRef.current = intervalId;
    }
    
  }

  const savePhoto = (canvas) => {
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
    photoTakenRef.current = false;


  }

  const setAsProfile = (e) => {
    //upload image to server with respective user
    const bodyFormData = new FormData();
    fetch(photoUrl)
    .then(res => res.blob())
    .then(blob => {
      const file = new File([blob], 'avatar.png', blob)
      bodyFormData.append('image', file); 
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

  const selectFromPC = (e) => {
    console.log("select from pc");
    const file = e.target.files[0]; //access the single file

    const bodyFormData = new FormData();
    bodyFormData.append('image', file); //so we can send ajax request 
    axios.post('/api/uploads/avatars', bodyFormData, {
      headers: {
          'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
        dispatch(saveAvatar(response.data.file.filename));
    }).catch(err => {
        console.log(err);
    });
  }

  const skip = () => {
    // props.history.push("/");
    window.location.href = "/";
  }


  return (
    <div>
      <RegisterSteps step1></RegisterSteps>


      <div className="avatar content-margined">
        <ul id="avatar-upload" className="avatar-upload">
          <li id="video-li">
          <video id="video" className="video" ref={videoRef} autoPlay muted></video>
          </li>
          <li className="button-selfie-li">
            <div style={{display: !photoTakenRef.current? '':'none'}}>
              <label 
              className="avatar-file-upload"
              style={{display: !isWebCamOn? '':'none'}}
              onChange={selectFromPC}>
              Select from PC
              <input className="AvatarInput" type="file" onChange={selectFromPC}></input>
              </label>

              <button 
              disabled={!modelsLoaded} 
              onClick={isWebCamOn?takePhoto:startVideo} 
              className="button selfie"
              ref={btnTakePhotoRef}>
              {isWebCamOn?"Take Photo":"Turn on Camera"}
            </button>

            </div>

            <div style={{display: photoTakenRef.current? '':'none'}}>
              <button
              className="button"
              onClick={retake}>
                Retake
              </button>
              <button
              className="button"
              onClick={setAsProfile}>
                Set As Profile
              </button>
            </div>
          </li>
          <li className="skip-li">
            <div className="skip-div">
              <button className="button secondary skip" onClick={skip}>
                Skip
              </button>
            </div>
          </li>
          
        </ul>

        
      </div>

    </div>
    
  )
  
}
export default AvatarScreen;