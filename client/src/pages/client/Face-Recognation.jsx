import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { setBackend } from '@tensorflow/tfjs';

const FacialRecognition = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  setBackend('webgl');
  useEffect(() => {
    const runFacialRecognition = async () => {
      // Load models from the public/models directory
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.ageGenderNet.loadFromUri('/models'),
      ]);

      // Reference face (Michael Jordan)
      const refFace = await faceapi.fetchImage(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/220px-Michael_Jordan_in_2014.jpg'
      );

      // Image to check
      const facesToCheck = await faceapi.fetchImage(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/JordanSmithWorthy2.jpg/170px-JordanSmithWorthy2.jpg'
      );

      // Detect faces, landmarks, and descriptors
      const refFaceAiData = await faceapi
        .detectAllFaces(refFace)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const facesToCheckAiData = await faceapi
        .detectAllFaces(facesToCheck)
        .withFaceLandmarks()
        .withFaceDescriptors();

      // Create a FaceMatcher instance
      const faceMatcher = new faceapi.FaceMatcher(refFaceAiData);

      // Get the canvas and set its dimensions
      const canvas = canvasRef.current;
      faceapi.matchDimensions(canvas, facesToCheck);

      // Resize results
      const resizedFacesToCheckAiData = faceapi.resizeResults(
        facesToCheckAiData,
        facesToCheck
      );

      // Draw matches on canvas
      resizedFacesToCheckAiData.forEach((face) => {
        const { detection, descriptor } = face;
        const label = faceMatcher.findBestMatch(descriptor).toString();

        if (label.includes('unknown')) {
          return;
        }

        const drawBox = new faceapi.draw.DrawBox(detection.box, {
          label: 'Jordan',
        });
        drawBox.draw(canvas);
      });
    };

    runFacialRecognition();
  }, []);

  return (
    <div className="facial-recognition">
      <div>
        {/* Load the image to be checked */}
        <img
          ref={imageRef}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/JordanSmithWorthy2.jpg/170px-JordanSmithWorthy2.jpg"
          alt="Faces to check"
          style={{ display: 'none' }}
        />
      </div>
      <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
    </div>
  );
};

export default FacialRecognition;
