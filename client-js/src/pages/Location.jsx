import React from 'react';
import { useGeolocated } from 'react-geolocated';

const LocationTracker = () => {
  const {
    coords, // Contains the latitude and longitude
    isGeolocationAvailable,
    isGeolocationEnabled,
    errorMessage,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true, // Enable high accuracy mode
      timeout: 5000, // Set timeout to 5 seconds
      maximumAge: 0, // Prevent caching
    },
    watchPosition: false, // Set to false if you only want to get the location once
  });

  // Check if geolocation is available and enabled
  if (!isGeolocationAvailable) {
    return <p>Geolocation is not supported by your browser.</p>;
  }

  if (!isGeolocationEnabled) {
    return <p>Please enable geolocation in your browser settings.</p>;
  }

  // Handle errors in geolocation
  if (errorMessage) {
    return <p>Error: {errorMessage}</p>;
  }

  // If coordinates are available, display them
  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-semibold text-center">Current Location</h1>
      <div className="mt-4 text-center">
        {coords ? (
          <div>
            <p className="text-lg">
              <strong>Latitude:</strong> {coords.latitude}
            </p>
            <p className="text-lg">
              <strong>Longitude:</strong> {coords.longitude}
            </p>
            <p className="text-lg">
              <strong>Accuracy:</strong> {coords.accuracy} meters
            </p>
          </div>
        ) : (
          <p className="text-yellow-500">Fetching location...</p>
        )}
      </div>
    </div>
  );
};

export default LocationTracker;
