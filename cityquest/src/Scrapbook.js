import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import './Scrapbook.css';

const Scrapbook = ({ images, showButton}) => {
  const [imagePositions, setImagePositions] = useState([]);
  const [scrapbookSize, setScrapbookSize] = useState({ width: 300, height: 300 }); // Start small
  const scrapbookRef = useRef(null); // Ref for the scrapbook element

  useEffect(() => {
    const calculatePositions = () => {
      const imageWidth = 150; // Fixed width of each image
      const imageHeight = 150;
      const padding = 5; // Padding between images

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
        const randomTop = baseTop + Math.floor(Math.random() * 10) - 5; // Randomize position slightly
        const randomLeft = baseLeft + Math.floor(Math.random() * 10) - 5;
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

  const handleDownload = async () => {
    const canvas = await html2canvas(scrapbookRef.current); // Capture the scrapbook as a canvas
    const dataURL = canvas.toDataURL('image/png'); // Convert the canvas to an image URL
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'scrapbook.png'; // Download as "scrapbook.png"
    link.click();
  };

  return (
    <div>
      <div
        className="scrapbook"
        ref={scrapbookRef} // Attach the ref to the scrapbook element
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
      {showButton && (
        <button onClick={handleDownload} className="download-btn">Download Scrapbook</button>
      )}
    </div>
  );
};

export default Scrapbook;
