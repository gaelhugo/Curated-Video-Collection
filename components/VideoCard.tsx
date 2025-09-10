import React from 'react';
import type { Video } from '../types';
import { PlayIcon } from './icons';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Play video: ${video.title}`}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-cyan-500/30">
        <img
          src={video.thumbnailUrl}
          alt={`Video thumbnail for ${video.title}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-50 rounded-full p-4 transform transition-all duration-300 scale-0 group-hover:scale-100">
            <PlayIcon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
      <h3 className="mt-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300 h-10 line-clamp-2" title={video.title}>
        {video.title}
      </h3>
    </div>
  );
};

export default VideoCard;
