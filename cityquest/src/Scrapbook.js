import React from 'react';
import './Scrapbook.css';

const Scrapbook = ({ images }) => {
  // Randomize images order
  const randomizedImages = [...images].sort(() => Math.random() - 0.5);

  return (
    <div className="scrapbook">
      {randomizedImages.map((src, index) => (
        <div key={index} className="scrapbook-item">
          <img src={src} alt={`Scrapbook item ${index}`} />
        </div>
      ))}
    </div>
  );
};

export default Scrapbook;
