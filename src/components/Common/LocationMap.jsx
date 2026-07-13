import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, Autocomplete } from '@react-google-maps/api';
import { add } from "lodash";
const MAP_API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY;

const libraries = ['places'];

const LocationMap = ({
    lat,
    lng,
    title = "Location",
    height = "300px",
    width = "100%",
    zoom = 14,
    showInfoWindow = true,
    editable = false,
    validation = null,
    addressField = "",
    cityField = "",
    stateField = "",
    pincodeField = "",
    initialValues = null,
    disabled = false,
}) => {
    // State for editable mode
    const [location, setLocation] = useState({
        lat: initialValues?.lat || lat || 20.5937,
        lng: initialValues?.lng || lng || 78.9629,
    });
    const [selected, setSelected] = useState(null);
    const mapRef = useRef(null);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        // Sync the marker with props if they change (for edit mode).
        // Branch (and other forms) pass saved coordinates via lat/lng, not initialValues,
        // so fall back to lat/lng so the marker lands on the saved location when editing.
        if (editable) {
            const nextLat = initialValues?.lat ?? lat;
            const nextLng = initialValues?.lng ?? lng;
            if (
                nextLat !== null && nextLat !== undefined && nextLat !== "" &&
                nextLng !== null && nextLng !== undefined && nextLng !== "" &&
                !Number.isNaN(parseFloat(nextLat)) && !Number.isNaN(parseFloat(nextLng))
            ) {
                setLocation({ lat: parseFloat(nextLat), lng: parseFloat(nextLng) });
            }
        }
    }, [initialValues, lat, lng, editable]);

    const containerStyle = {
        width: width,
        height: height,
    };

    const onSelect = (marker) => {
        setSelected(marker);
    };

    // --- Editable logic ---
    const handleLocationChange = async (lat, lng) => {
        setLocation({ lat, lng });
        if (validation) {
            validation.setFieldValue('lat', lat);
            validation.setFieldValue('lng', lng);
        }

        if (validation && (addressField || cityField || stateField || pincodeField)) {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_API_KEY}`
            );


            const data = await response.json();


            if (data.status === "OK" && data.results.length > 0) {
                const firstResult = data.results[0];
                if (addressField) {
                    validation.setFieldValue(addressField, firstResult.formatted_address);
                }

                const addressComponents = firstResult.address_components;
                let city = null;
                let state = null;
                let postalCode = null;

                console.log("Geocoding response:", addressComponents); // Debug log for address components


                addressComponents.forEach((component) => {
                    const types = component.types;

                    console.log("Component types:", types); // Debug log for component types

                    if (!city && (types.includes('locality') || types.includes('postal_town') || types.includes('administrative_area_level_2'))) {
                        city = component.long_name;
                    }
                    if (!state && types.includes('administrative_area_level_1')) {
                        state = component.long_name;
                    }
                    if (!postalCode && types.includes('postal_code')) {
                        postalCode = component.long_name;
                    }
                });

                if (cityField && city) {
                    validation.setFieldValue(cityField, city);
                }
                if (stateField && state) {
                    validation.setFieldValue(stateField, state);
                }
                if (pincodeField && postalCode) {
                    validation.setFieldValue(pincodeField, postalCode);
                }
            }
        }
    };

    const onPlaceSelected = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                handleLocationChange(lat, lng);
                if (mapRef.current) {
                    mapRef.current.panTo({ lat, lng });
                }
            }
        }
    };

    // --- End editable logic ---

    // Use editable state if enabled, otherwise use props
    const mapCenter = editable ? location : (lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : { lat: 20.5937, lng: 78.9629 });

    return (
        <div className="location-map-container">
            <LoadScript googleMapsApiKey={MAP_API_KEY} libraries={libraries}>
                {editable && !disabled && (
                    <Autocomplete
                        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                        onPlaceChanged={onPlaceSelected}
                    >
                        <input
                            type="text"
                            placeholder="Search for a location"
                            disabled={disabled}
                            style={{
                                width: '100%',
                                height: '40px',
                                padding: '10px',
                                marginBottom: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                position: 'relative',
                                zIndex: 10000,
                                backgroundColor: disabled ? '#f5f5f5' : 'white',
                            }}
                        />
                    </Autocomplete>
                )}
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={zoom}
                    onLoad={map => (mapRef.current = map)}
                    options={{
                        draggable: !disabled && editable,
                        scrollwheel: !disabled && editable,
                        disableDoubleClickZoom: !editable,
                    }}
                >
                    {(editable ? location.lat && location.lng : lat && lng) && (
                        <Marker
                            position={mapCenter}
                            onClick={() => !editable && onSelect(mapCenter)}
                        />
                    )}
                    {selected && showInfoWindow && !editable && (
                        <InfoWindow
                            position={selected}
                            onCloseClick={() => setSelected(null)}
                        >
                            <div>
                                <h6>{title}</h6>
                                <p>Latitude: {lat}</p>
                                <p>Longitude: {lng}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default LocationMap; 