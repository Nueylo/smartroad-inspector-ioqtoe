
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { DefectLocation } from '../types';

export const useLocation = () => {
  const [location, setLocation] = useState<DefectLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async (): Promise<DefectLocation | null> => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission de localisation refusée');
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;
      
      // Get address from coordinates
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const address = addresses[0];
        const formattedAddress = address
          ? `${address.street || ''} ${address.streetNumber || ''}, ${address.city || ''}`
          : undefined;

        const locationData: DefectLocation = {
          latitude,
          longitude,
          address: formattedAddress,
        };

        setLocation(locationData);
        return locationData;
      } catch (geocodeError) {
        console.log('Geocoding error:', geocodeError);
        const locationData: DefectLocation = {
          latitude,
          longitude,
        };
        setLocation(locationData);
        return locationData;
      }
    } catch (locationError) {
      console.log('Location error:', locationError);
      setError('Impossible d\'obtenir la localisation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    loading,
    error,
    getCurrentLocation,
  };
};
