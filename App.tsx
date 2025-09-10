import React, { useState, useEffect, useCallback } from 'react';
import { videoUrls } from './constants';
import type { Video } from './types';
import VideoCard from './components/VideoCard';
import Modal from './components/Modal';

const parseVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.substring(1);
    }
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
      return urlObj.searchParams.get('v');
    }
    return null;
  } catch (error) {
    console.error(`Failed to parse URL: ${url}`, error);
    return null;
  }
};

const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      const videoDataPromises = videoUrls.map(async (url) => {
        const id = parseVideoId(url);
        if (!id) return null;

        try {
          const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch metadata for video ${id}`);
          }
          const data = await response.json();
          
          if (data.error) {
            console.warn(`Could not find video ${id}: ${data.error}`);
            return null;
          }

          return {
            id,
            title: data.title || 'Untitled Video',
            thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
            embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
          };
        } catch (error) {
          console.error(`Error fetching video data for ${id}:`, error);
          // Return a fallback object so the video still appears if API fails
          return {
            id,
            title: 'Could not load title',
            thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
            embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
          };
        }
      });

      const fetchedVideos = (await Promise.all(videoDataPromises))
        .filter((video): video is Video => video !== null);
      
      setVideos(fetchedVideos);
      setIsLoading(false);
    };

    fetchVideoData();
  }, []);

  const openModal = useCallback((video: Video) => {
    setSelectedVideo(video);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [closeModal]);
  
  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <header className="py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Curated Video Collection
          </h1>
          <p className="mt-3 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
             A selection of compelling comment on creative coding.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16">
         {isLoading ? (
          <div className="text-center">
            <p className="text-lg text-gray-400">Loading videos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 md:gap-x-8 gap-y-12">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} onClick={() => openModal(video)} />
            ))}
          </div>
        )}
      </main>

      {selectedVideo && <Modal video={selectedVideo} onClose={closeModal} />}
    </div>
  );
};

export default App;
