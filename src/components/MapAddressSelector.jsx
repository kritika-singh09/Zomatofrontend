import React, { useState, useEffect } from 'react';
import { FaTimes, FaLocationArrow } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import MyLocationPointer from './MyLocationPointer';

const MapAddressSelector = ({ isOpen, onClose, onAddressSelect }) => {
  // Restaurant location (source)
  const restaurantLocation = { lat: 26.715511, lng: 83.378906 };
  
  const [selectedLocation, setSelectedLocation] = useState({ lat: 26.7606, lng: 83.3732 });
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mapInstance = null;
    let marker = null;

    if (isOpen) {
      const initMap = () => {
        const mapContainer = document.getElementById('address-selector-map');
        
        if (!mapContainer) {
          console.log('Map container not found, retrying...');
          setTimeout(initMap, 200);
          return;
        }
        
        if (!window.mappls && !window.MapmyIndia) {
          console.log('MapmyIndia SDK not available on localhost, using fallback');
          // Create interactive fallback map for localhost
          mapContainer.className = 'bg-gradient-to-br from-blue-100 to-green-100 relative cursor-pointer';
          
          const centerDiv = document.createElement('div');
          centerDiv.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center';
          
          centerDiv.innerHTML = `
            <div class="text-3xl mb-2">📍</div>
            <div class="text-gray-700 font-medium">Interactive Map</div>
            <div class="text-xs text-gray-500 mt-1">Click to select location</div>
            <div id="coord-display" class="text-xs text-gray-500 mt-1">Lat: ${selectedLocation.lat.toFixed(4)}, Lng: ${selectedLocation.lng.toFixed(4)}</div>
          `;
          
          const labelDiv = document.createElement('div');
          labelDiv.className = 'absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs text-gray-600';
          labelDiv.textContent = 'MapmyIndia Fallback';
          
          mapContainer.appendChild(centerDiv);
          mapContainer.appendChild(labelDiv);
          
          // Make fallback map clickable
          mapContainer.addEventListener('click', (e) => {
            const rect = mapContainer.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const newLat = 26.715511 + (0.5 - y) * 0.02;
            const newLng = 83.378906 + (x - 0.5) * 0.02;
            
            setSelectedLocation({ lat: newLat, lng: newLng });
            fetchAddressFromMappls(newLat, newLng);
            
            const coordDisplay = document.getElementById('coord-display');
            if (coordDisplay) {
              coordDisplay.textContent = `Lat: ${newLat.toFixed(4)}, Lng: ${newLng.toFixed(4)}`;
            }
          });
          
          fetchAddressFromMappls(selectedLocation.lat, selectedLocation.lng);
          return;
        }
        
        const mapAPI = window.mappls || window.MapmyIndia;
        
        console.log('Latest Mappls SDK loaded successfully');
        
        console.log('MapmyIndia SDK loaded, initializing map...');

        mapInstance = new mapAPI.Map('address-selector-map', {
          center: [83.378906, 26.715511],
          zoom: 15,
          minZoom: 10,
          maxZoom: 18,
          zoomControl: true,
          scrollwheel: true
        });
        
        console.log('Map instance created:', mapInstance);
        
        // Create markers immediately after map creation
        console.log('Creating markers...');
        
        // Wait for map to load before adding markers
        setTimeout(() => {
          // Restaurant marker (red pin)
          const restaurantMarker = mapAPI.marker({
            map: mapInstance,
            position: [restaurantLocation.lng, restaurantLocation.lat],
            popupHtml: "🍽️ Restaurant"
          });
          
          // Delivery marker (blue pin, draggable)
          marker = mapAPI.marker({
            map: mapInstance,
            position: [selectedLocation.lng, selectedLocation.lat],
            draggable: true,
            popupHtml: "📍 Drag to select delivery location"
          });
          
          console.log('Markers created successfully');
          
          // Marker drag events
          marker.addListener('dragstart', () => {
            mapInstance.setOptions({ draggable: false });
          });
          
          marker.addListener('dragend', () => {
            mapInstance.setOptions({ draggable: true });
            const pos = marker.getPosition();
            if (pos) {
              updateLocation(pos[1], pos[0]); // lat, lng
            }
          });

          // Map click event
          mapInstance.addListener('click', (e) => {
            let lat, lng;
            if (e.lngLat && Array.isArray(e.lngLat)) {
              lng = e.lngLat[0];
              lat = e.lngLat[1];
            } else if (e.lat && e.lng) {
              lat = e.lat;
              lng = e.lng;
            } else {
              return;
            }
            
            marker.setPosition([lng, lat]);
            updateLocation(lat, lng);
          });

          mapContainer._mapInstance = mapInstance;
          mapContainer._marker = marker;
        }, 1000);
        
        console.log('Map initialized successfully, creating markers...');
        
        const updateLocation = (lat, lng) => {
          console.log('Updating location to:', lat, lng);
          setSelectedLocation({ lat, lng });
          fetchAddressFromMappls(lat, lng);
        };


        
        // Get initial address
        fetchAddressFromMappls(selectedLocation.lat, selectedLocation.lng);
      };
      
      setTimeout(initMap, 500);
    }

    return () => {
      // Cleanup map instance
      if (mapInstance) {
        try {
          mapInstance.remove();
          mapInstance = null;
        } catch (e) {
          console.log('Map cleanup error:', e);
        }
      }
      
      // Clear container references
      const mapContainer = document.getElementById('address-selector-map');
      if (mapContainer) {
        mapContainer._mapInstance = null;
        mapContainer._marker = null;
        mapContainer.innerHTML = '';
      }
    };
  }, [isOpen]);

  const fetchAddressFromMappls = async (lat, lng) => {
    setIsLoading(true);
    try {
      // Use MapmyIndia REST API for reverse geocoding
      const response = await fetch(
        `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=68356bb1a3afb750007085wdx475b3a`
      );
      
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('MapmyIndia geocoding failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by this browser');
      return;
    }

    setIsLoading(true);
    console.log('Getting current location...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Got location:', latitude, longitude);
        
        setSelectedLocation({ lat: latitude, lng: longitude });
        
        // Update map and marker
        const mapContainer = document.getElementById('address-selector-map');
        if (mapContainer && mapContainer._mapInstance && mapContainer._marker) {
          const mapInstance = mapContainer._mapInstance;
          const marker = mapContainer._marker;
          
          // Center map on current location
          mapInstance.setCenter([longitude, latitude]);
          mapInstance.setZoom(15);
          
          // Move marker to current location
          marker.setPosition({ lat: latitude, lng: longitude });
          
          console.log('Map and marker updated');
        }
        
        fetchAddressFromMappls(latitude, longitude);
        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let message = 'Unable to get current location';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        
        alert(message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleConfirm = () => {
    onAddressSelect({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      address: address,
      name: address.split(',')[0] || 'Selected Location'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Select Delivery Location</h2>
          <button onClick={onClose} className="text-gray-500">
            <FaTimes />
          </button>
        </div>

        <div className="relative">
          <div
            id="address-selector-map"
            className="w-full h-[300px] relative bg-gray-100 block visible"
          ></div>
          
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg border"
          >
            <FaLocationArrow className="text-red-600" />
          </button>
          
          <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs shadow">
            🍽️ Red: Restaurant | 📍 Blue: Your Location
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Selected Address:</label>
            <div className="p-2 bg-gray-50 rounded text-sm min-h-[40px]">
              {isLoading ? 'Getting address...' : address || 'Select location on map'}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!address || isLoading}
              className="flex-1 py-2 bg-red-600 text-white rounded-lg disabled:bg-gray-400"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapAddressSelector;