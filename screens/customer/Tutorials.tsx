import React from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import { TutorialIcon, PlayIcon } from '../../components/Icons';

const Tutorials: React.FC = () => {
    const { tutorials } = useAppContext();

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-secondary-dark">DIY Tutorials</h2>
            <p className="mb-6 text-gray-600">Click on a video to open it in a new tab on YouTube for the best viewing experience.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map(tutorial => {
                    // Extract video ID from various YouTube URL formats
                    const videoIdMatch = tutorial.youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                    const videoId = videoIdMatch ? videoIdMatch[1] : null;
                    
                    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
                    const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#';

                    return (
                        <a 
                            key={tutorial.id}
                            href={watchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                            aria-label={`Watch tutorial: ${tutorial.title}`}
                        >
                            <Card 
                                className="p-0 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow" 
                            >
                                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                                    {thumbnailUrl ? (
                                        <img src={thumbnailUrl} alt={tutorial.title} className="absolute top-0 left-0 w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
                                            <TutorialIcon className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                                        <PlayIcon className="w-16 h-16 text-white text-opacity-90" />
                                    </div>
                                </div>
                                <div className="p-4 flex-1">
                                    <h4 className="text-lg font-semibold text-secondary-dark flex items-center">
                                        <TutorialIcon className="w-5 h-5 mr-2" />
                                        {tutorial.title}
                                    </h4>
                                </div>
                            </Card>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default Tutorials;
