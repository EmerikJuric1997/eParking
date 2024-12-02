import React, { useEffect, useRef } from 'react';
import Tesseract from 'tesseract.js';
import './CameraPage.css';
import Store from '../../store/Store';
import { observer } from 'mobx-react-lite';
import NotFound from '../Main/NotFound/NotFound';

const CameraPage = observer(() => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startVideoStream = async (videoRef) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const preprocessCanvas = (canvas) => {
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const threshold = 128;
    for (let i = 0; i < pixels.length; i += 4) {
      const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      const value = avg > threshold ? 255 : 0;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = value;
    }

    context.putImageData(imageData, 0, 0);
  };

  const captureImage = (videoRef, canvasRef) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    preprocessCanvas(canvas);
    return canvas.toDataURL('image/png');
  };

  const cleanLicensePlate = (text) => {
    return text.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  };

  const processImage = async (imageDataUrl) => {
    try {
      const { data: { text } } = await Tesseract.recognize(imageDataUrl, 'eng', {
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      });

      const cleanedText = cleanLicensePlate(text.trim());
      if (cleanedText) {
        const cameraCheckPlate = cleanedText.toUpperCase();
        const zone = 1;
        Store.validateParkingPayment(cameraCheckPlate, zone)
      }
    } catch (error) {
      console.error('Error processing image with Tesseract:', error);
    }
  };

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        startVideoStream(videoRef);
      } catch (error) {
        console.error('Error initializing camera:', error);
      }
    };

    initializeCamera();

    const interval = setInterval(() => {
      if (videoRef.current) {
        const image = captureImage(videoRef, canvasRef);
        processImage(image);
      }
    }, 10000);

    return () => {
      const stream = videoRef.current?.srcObject;

      if (stream) stream.getTracks().forEach(track => track.stop());
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {Store.user.role === 'admin' &&
        <div className="camera-container">
          <h1>Kamera za prepoznavanje tablica</h1>
          <div>
            <div>
              <video ref={videoRef} className='video' />
              <canvas ref={canvasRef} className='canvas' />
            </div>
          </div>
        </div>
      }
      {Store.user.role !== 'admin' &&
        <NotFound />
      }
    </>
  );
});

export default CameraPage;
