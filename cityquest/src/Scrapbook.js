import React, { useEffect, useState } from 'react';
import './Scrapbook.css';

const Scrapbook = ({ images }) => {
  const [imagePositions, setImagePositions] = useState([]);
  const [scrapbookSize, setScrapbookSize] = useState({ width: 300, height: 300 }); // Start small

  useEffect(() => {
    const calculatePositions = () => {
      const imageWidth = 150; // Fixed width of each image
      const imageHeight = 150;
      const padding = 10; // Padding between images

      // Dynamically increase the scrapbook size based on the number of images
      const numRows = Math.ceil(Math.sqrt(images.length)); // Determine number of rows/columns
      const newWidth = numRows * (imageWidth + padding) + padding; // Account for padding between images
      const newHeight = numRows * (imageHeight + padding) + padding;

      setScrapbookSize({ width: newWidth, height: newHeight });

      // Place images in a grid layout but with some randomness in rotation and position
      const positions = images.map((_, index) => {
        const row = Math.floor(index / numRows);
        const col = index % numRows;

        const baseTop = row * (imageHeight + padding) + padding; // Calculate position with padding
        const baseLeft = col * (imageWidth + padding) + padding;

        // Add some small random displacements and rotation to give a natural look
        const randomTop = baseTop + Math.floor(Math.random() * 30) - 15; // Randomize position slightly
        const randomLeft = baseLeft + Math.floor(Math.random() * 30) - 15;
        const randomRotation = Math.floor(Math.random() * 20) - 10; // Smaller random rotation for less chaos

        return {
          top: randomTop,
          left: randomLeft,
          rotation: randomRotation,
        };
      });

      setImagePositions(positions);
    };

    calculatePositions();
    window.addEventListener('resize', calculatePositions); // Recalculate on window resize

    return () => {
      window.removeEventListener('resize', calculatePositions);
    };
  }, [images]);

  return (
    <div
      className="scrapbook"
      style={{
        width: `${scrapbookSize.width}px`,
        height: `${scrapbookSize.height}px`,
      }}
    >
      {imagePositions.map((pos, index) => (
        <div
          key={index}
          className="scrapbook-item"
          style={{
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            transform: `rotate(${pos.rotation}deg)`,
            zIndex: index,
          }}
        >
          <img src={images[index]} alt={`Scrapbook item ${index}`} />
        </div>
      ))}
    </div>
  );
};

export default Scrapbook;
