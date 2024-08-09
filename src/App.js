import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const libraries = ['places'];
const mapContainerStyle = {
  width: '80%',
  height: '400px',
};

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyD1y4QL2HBgEilncYl-jd19FBBSstOzmLg", 
    libraries,
  });

  const [selected, setSelected] = useState(null);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <Search setSelected={setSelected} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
       
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </div>
  );
}

function Search({ setSelected }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 28.7041, lng: () => 77.1025 }, // Center location for autocomplete
      radius: 200 * 1000, // Search within a 200 km radius
    },
  });

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setSelected({ lat, lng });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Search for a location"
        style={{ width: '100%', padding: '8px' }}
      />
      {status === "OK" && (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {data.map(({ place_id, description }) => (
            <li key={place_id} onClick={() => handleSelect(description)} style={{ cursor: 'pointer' }}>
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
