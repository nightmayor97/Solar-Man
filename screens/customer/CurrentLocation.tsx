import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { LocationIcon } from '../../components/Icons';

interface Coordinates {
    lat: number;
    lng: number;
}

const CurrentLocation: React.FC = () => {
    const [coords, setCoords] = useState<Coordinates | null>(null);
    const [status, setStatus] = useState<string>('Requesting location...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setStatus('Geolocation is not supported by your browser.');
            setError('Geolocation is not supported by your browser.');
            return;
        }

        const handleSuccess = (position: GeolocationPosition) => {
            setStatus('Location found!');
            setError(null);
            setCoords({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        };

        const handleError = (error: GeolocationPositionError) => {
            let errorMessage = 'An unknown error occurred.';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "Location access denied. Please allow location access in your browser settings.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    errorMessage = "The request to get user location timed out.";
                    break;
            }
            setStatus(errorMessage);
            setError(errorMessage);
        };

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
             enableHighAccuracy: true,
             timeout: 10000,
             maximumAge: 0
        });

    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-secondary-dark">Your Current Location</h2>
            
            <Card>
                {error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 text-center" role="alert">
                        <span className="font-medium">Error:</span> {error}
                    </div>
                )}
                
                {!coords && !error && (
                     <div className="text-center py-10 text-gray-500">
                        <p>{status}</p>
                    </div>
                )}
                
                {coords && (
                    <div className="w-full aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg border">
                         <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&hl=es&z=15&output=embed`}
                        ></iframe>
                    </div>
                )}
            </Card>

            {coords && (
                <Card title="Coordinates" icon={<LocationIcon className="w-6 h-6"/>} className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-500">Latitude</p>
                            <p className="text-2xl font-semibold text-secondary-dark">{coords.lat.toFixed(6)}</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-500">Longitude</p>
                            <p className="text-2xl font-semibold text-secondary-dark">{coords.lng.toFixed(6)}</p>
                        </div>
                    </div>
                </Card>
            )}

        </div>
    );
};

export default CurrentLocation;