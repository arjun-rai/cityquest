import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import './Scrapbook.css';

// Simulating the DALL·E sticker generation with placeholder sticker URLs
const generateStickers = () => {
  return [
    'https://via.placeholder.com/150x150.png?text=Sticker1', // Replace with actual DALL-E call
    'https://via.placeholder.com/150x150.png?text=Sticker2',
    'https://via.placeholder.com/150x150.png?text=Sticker3',
    'https://via.placeholder.com/150x150.png?text=Sticker4',
  ];
};

const Scrapbook = ({ images }) => {
  const [imagePositions, setImagePositions] = useState([]);
  const [scrapbookSize, setScrapbookSize] = useState({ width: 300, height: 300 }); // Start small
  const [scrapbookImages, setScrapbookImages] = useState(images); // Add images and stickers
  const [stickers, setStickers] = useState([]); // Stickers to overlay on images
  const scrapbookRef = useRef(null); // Ref for the scrapbook element

  useEffect(() => {
    const calculatePositions = () => {
      const imageWidth = 150; // Fixed width of each image
      const imageHeight = 150;
      const padding = 20; // Padding between images

      // Dynamically increase the scrapbook size based on the number of images
      const numRows = Math.ceil(Math.sqrt(scrapbookImages.length)); // Determine number of rows/columns
      const newWidth = numRows * (imageWidth + padding) + padding; // Account for padding between images
      const newHeight = numRows * (imageHeight + padding) + padding;

      setScrapbookSize({ width: newWidth, height: newHeight });

      // Place images in a grid layout but with some randomness in rotation and position
      const positions = scrapbookImages.map((_, index) => {
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
  }, [scrapbookImages]);

  const handleDownload = async () => {
    // Step 1: Generate stickers using DALL-E (simulated here)
    const newStickers = generateStickers();

    // Step 2: Add stickers to random positions on top of the images
    const stickerPositions = newStickers.map(() => ({
      top: Math.random() * 120 + 15,  // Randomize position on the image
      left: Math.random() * 120 + 15,
      rotation: Math.random() * 360,  // Random rotation
    }));

    setStickers(newStickers.map((sticker, index) => ({
      url: sticker,
      position: stickerPositions[index],
    })));

    // Step 3: Wait a moment for the stickers to be added to the scrapbook before capturing
    setTimeout(async () => {
      const canvas = await html2canvas(scrapbookRef.current); // Capture the scrapbook as a canvas
      const dataURL = canvas.toDataURL('image/png'); // Convert the canvas to an image URL
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'scrapbook_with_stickers.png'; // Download as "scrapbook_with_stickers.png"
      link.click();
    }, 500); // Allow some time for the stickers to be added
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
            <img src={scrapbookImages[index]} alt={`Scrapbook item ${index}`} />
            {stickers.map((sticker, sIndex) => (
              <div
                key={sIndex}
                className="sticker"
                style={{
                  top: `${sticker.position.top}px`,
                  left: `${sticker.position.left}px`,
                  transform: `rotate(${sticker.position.rotation}deg)`,
                  zIndex: index + 1, // Ensure stickers are above images
                }}
              >
                <img src={sticker.url} alt={`Sticker ${sIndex}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleDownload} className="download-btn">Download Scrapbook with Stickers</button>
    </div>
  );
};

export default Scrapbook;
