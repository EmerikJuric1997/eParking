import React, { useEffect, useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import './CameraPage.css'

const App = () => {
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);
  const [licensePlates, setLicensePlates] = useState([]);

  // Start video stream for a given camera
  const startVideoStream = async (videoRef, deviceId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined },
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  // Capture image from video stream
  const captureImage = (videoRef, canvasRef) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  };

  // Process image with Tesseract.js
  const processImage = async (imageDataUrl) => {
    try {
      const { data: { text } } = await Tesseract.recognize(imageDataUrl, 'eng');
      const licensePlate = text.trim();
      if (licensePlate) {
        setLicensePlates((prev) => [...prev, licensePlate]);
      }
    } catch (error) {
      console.error('Error processing image with Tesseract:', error);
    }
  };

  useEffect(() => {
    const initializeCameras = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length > 0) startVideoStream(videoRef1, videoDevices[0].deviceId);
      if (videoDevices.length > 1) startVideoStream(videoRef2, videoDevices[1].deviceId);
    };

    initializeCameras();

    const interval = setInterval(() => {
      const image1 = captureImage(videoRef1, canvasRef1);
      const image2 = captureImage(videoRef2, canvasRef2);

      processImage(image1);
      processImage(image2);
    }, 10000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Kamera za prepoznavanje tablica</h1>
      <div className='camera-container'>
        <div>
          <video ref={videoRef1} style={{ width: '2000px', height: 'auto' }} />
          <canvas ref={canvasRef1} style={{ display: 'none' }} />
        </div>
        <div>
          <video ref={videoRef2} style={{ width: '300px', height: 'auto' }} />
          <canvas ref={canvasRef2} style={{ display: 'none' }} />
        </div>
      </div>
      <h2>Prepoznate tablice:</h2>
      <ul>
        {licensePlates.map((plate, index) => (
          <li key={index}>{plate}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;

