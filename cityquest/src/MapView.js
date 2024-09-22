import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: -3.745, // Default center
  lng: -38.523,
};

const MapView = ({ userLocation, mapMarkers }) => {
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  // Debugging logs
  useEffect(() => {
    console.log('User Location:', userLocation);
    console.log('Map Markers:', mapMarkers);

    if (mapMarkers.length === 0) {
      console.warn('No markers to display.');
    }
  }, [userLocation, mapMarkers]);

  return (
    <LoadScript googleMapsApiKey={"AIzaSyDOvAterXwk2eF-Gvg66oG8ehWCqgNRfh8"}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
      >
        {userLocation && (
          <Marker position={userLocation} label="You" />
        )}
        {mapMarkers.map((marker, index) => {
          // Additional debug information for each marker
          console.log(`Rendering marker ${index}:`, marker);
          return (
            <Marker
              key={marker.name}
              position={marker.position}
              label={marker.name}
            />
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapView;