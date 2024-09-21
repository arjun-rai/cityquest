// MapView.js
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: -3.745, // Default center, will update to user location
  lng: -38.523,
};

const MapView = ({ userLocation, locations }) => {
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  return (
    <LoadScript googleMapsApiKey={AIzaSyDOvAterXwk2eFGvg66oG8ehWCqgNRfh8}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
      >
        {userLocation && <Marker position={userLocation} label="You" />}
        {locations.map((location) => (
          <Marker
            key={location.number}
            position={{
              lat: location.latitude,
              lng: location.longitude,
            }}
            label={location.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapView;
