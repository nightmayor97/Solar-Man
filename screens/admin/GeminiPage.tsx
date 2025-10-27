import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from '../../components/Card';

type Tab = 'video' | 'search' | 'maps';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const GeminiPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('video');
    
    // Video Analysis State
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPrompt, setVideoPrompt] = useState('');
    const [videoResult, setVideoResult] = useState('');
    const [isVideoLoading, setIsVideoLoading] = useState(false);

    // Search Grounding State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<{ text: string; sources: any[] }>({ text: '', sources: [] });
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    // Maps Grounding State
    const [mapsQuery, setMapsQuery] = useState('');
    const [mapsResult, setMapsResult] = useState<{ text: string; sources: any[] }>({ text: '', sources: [] });
    const [isMapsLoading, setIsMapsLoading] = useState(false);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setLocationError(null);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationError(`Error getting location: ${error.message}. Please enable location services.`);
            }
        );
    }, []);

    const handleVideoAnalysis = async () => {
        if (!videoFile || !videoPrompt) {
            alert('Please select a video file and enter a prompt.');
            return;
        }
        setIsVideoLoading(true);
        setVideoResult('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const videoPart = await fileToGenerativePart(videoFile);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: [
                    { parts: [ {text: videoPrompt}, videoPart, ]}
                ],
            });
            setVideoResult(response.text);
        } catch (error) {
            console.error(error);
            setVideoResult('An error occurred while analyzing the video.');
        } finally {
            setIsVideoLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsSearchLoading(true);
        setSearchResult({ text: '', sources: [] });
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: searchQuery,
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });
            setSearchResult({
                text: response.text,
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
            });
        } catch (error) {
            console.error(error);
            setSearchResult({ text: 'An error occurred during the search.', sources: [] });
        } finally {
            setIsSearchLoading(false);
        }
    };

    const handleMapsSearch = async () => {
        if (!mapsQuery) return;
        if (!location) {
            alert(locationError || "Location is not available.");
            return;
        }
        setIsMapsLoading(true);
        setMapsResult({ text: '', sources: [] });
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: mapsQuery,
                config: {
                    tools: [{ googleMaps: {} }],
                    toolConfig: {
                        retrievalConfig: {
                            latLng: location,
                        }
                    }
                },
            });
            setMapsResult({
                text: response.text,
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
            });
        } catch (error) {
            console.error(error);
            setMapsResult({ text: 'An error occurred during the map search.', sources: [] });
        } finally {
            setIsMapsLoading(false);
        }
    };

    const renderTabs = () => (
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button onClick={() => setActiveTab('video')} className={`${activeTab === 'video' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Video Analysis</button>
                <button onClick={() => setActiveTab('search')} className={`${activeTab === 'search' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Web Search</button>
                <button onClick={() => setActiveTab('maps')} className={`${activeTab === 'maps' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Place Finder</button>
            </nav>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'video': return renderVideoAnalysis();
            case 'search': return renderSearch();
            case 'maps': return renderMaps();
            default: return null;
        }
    };
    
    const renderVideoAnalysis = () => (
        <Card title="Video Analysis with Gemini 2.5 Pro">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Video</label>
                    <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary-dark hover:file:bg-orange-200" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Prompt</label>
                    <textarea value={videoPrompt} onChange={e => setVideoPrompt(e.target.value)} rows={3} placeholder="e.g., What is the condition of the roof panels shown in the video?" className="mt-1 block w-full p-2 border rounded-md bg-secondary-dark text-white border-secondary placeholder-gray-300 focus:ring-primary focus:border-primary" />
                </div>
                <button onClick={handleVideoAnalysis} disabled={isVideoLoading} className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark disabled:bg-gray-400">
                    {isVideoLoading ? 'Analyzing...' : 'Analyze Video'}
                </button>
                {videoResult && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <h4 className="font-semibold text-secondary-dark">Result:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{videoResult}</p>
                    </div>
                )}
            </div>
        </Card>
    );

    const renderSearch = () => (
        <Card title="Web Search with Google Search Grounding">
            <div className="space-y-4">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Enter your search query..." className="w-full p-2 border rounded-md bg-secondary-dark text-white border-secondary placeholder-gray-300 focus:ring-primary focus:border-primary" />
                <button onClick={handleSearch} disabled={isSearchLoading} className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark disabled:bg-gray-400">
                    {isSearchLoading ? 'Searching...' : 'Search'}
                </button>
                {searchResult.text && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <h4 className="font-semibold text-secondary-dark">Result:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{searchResult.text}</p>
                        {searchResult.sources.length > 0 && (
                            <div className="mt-4">
                                <h5 className="font-semibold text-sm text-gray-600">Sources:</h5>
                                <ul className="list-disc list-inside space-y-1 mt-1">
                                    {searchResult.sources.map((source, index) => (
                                        <li key={index} className="text-sm">
                                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{source.web.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
    
    const renderMaps = () => (
        <Card title="Place Finder with Google Maps Grounding">
            {locationError && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{locationError}</div>}
             <div className="space-y-4">
                <input type="text" value={mapsQuery} onChange={e => setMapsQuery(e.target.value)} placeholder="e.g., Find nearby hardware stores" className="w-full p-2 border rounded-md bg-secondary-dark text-white border-secondary placeholder-gray-300 focus:ring-primary focus:border-primary" />
                <button onClick={handleMapsSearch} disabled={isMapsLoading || !location} className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark disabled:bg-gray-400">
                    {isMapsLoading ? 'Finding...' : 'Find Places'}
                </button>
                {mapsResult.text && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <h4 className="font-semibold text-secondary-dark">Result:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{mapsResult.text}</p>
                        {mapsResult.sources.length > 0 && (
                            <div className="mt-4">
                                <h5 className="font-semibold text-sm text-gray-600">Places:</h5>
                                <ul className="list-disc list-inside space-y-1 mt-1">
                                    {mapsResult.sources.map((source, index) => (
                                        <li key={index} className="text-sm">
                                            <a href={source.maps.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{source.maps.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4 text-secondary-dark">Gemini AI Tools</h2>
            <p className="mb-6 text-gray-600">Leverage the power of Gemini for advanced analysis and information retrieval.</p>
            {renderTabs()}
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default GeminiPage;