import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import axios from 'axios';

interface HlsPlayerProps {
  initialStream?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ 
  initialStream = '',
  autoPlay = true,
  controls = true,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [streamNameInput, setStreamNameInput] = useState(initialStream);
  const [streamName, setStreamName] = useState(initialStream);
  const [status, setStatus] = useState('Enter stream name');
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get base URL from Vite environment
  const baseUrl = import.meta.env.VITE_MEDIAMTX_URL || 'localhost:8889';
  const hlsUrl = streamName ? `${baseUrl.replace(/\/$/, '')}/${streamName}/index.m3u8` : '';

  // Validate stream existence before playing
  const validateAndPlay = async () => {
    if (!streamNameInput.trim()) {
      setError('Stream name cannot be empty');
      return;
    }

    setStatus('Checking stream availability...');
    setError(null);
    
    try {
      // Pre-validate with Axios HEAD request
      await axios.head(`${hlsUrl}/index.m3u8`, {
        timeout: 3000,
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      // Stream exists - start playback
      setStreamName(streamNameInput.trim());
      setStatus('Connecting...');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stream not found or unavailable');
      setStatus('Validation failed');
      console.error('Stream validation error:', err);
    }
  };

  // Playback logic (triggers when streamName changes)
  useEffect(() => {
    if (!streamName || !hlsUrl) return;

    const video = videoRef.current;
    if (!video) return;

    // Cleanup previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
      video.src = '';
    }

    setIsPlaying(false);
    setError(null);

    // Safari/iOS native HLS support
    if (video.canPlayType('application/vnd.apple.mpegurl') && !Hls.isSupported()) {
      video.src = hlsUrl;
      
      const handleLoaded = () => {
        setIsPlaying(true);
        setStatus('✅ Playing (native)');
        if (autoPlay) video.play().catch(() => {});
      };
      
      video.addEventListener('loadedmetadata', handleLoaded);
      video.addEventListener('error', () => {
        setError('Playback failed');
        setStatus('❌ Error');
      });
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoaded);
        video.src = '';
      };
    }

    // HLS.js for Chrome/Firefox/Edge
    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
        backBufferLength: 15,
        liveSyncDurationCount: 3,
        manifestLoadingTimeOut: 10000,
        fragLoadingTimeOut: 10000
      });
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsPlaying(true);
        setStatus('✅ Live');
        if (autoPlay) video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            setError(`Playback error: ${data.details}`);
            setStatus('❌ Error');
          }
        }
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
    } else {
      setError('HLS not supported in this browser');
      setStatus('❌ Unsupported');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.pause();
        video.src = '';
      }
    };
  }, [streamName, hlsUrl, autoPlay]);

  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden ${className}`}>
      {/* Stream Input Controls */}
      <div className="p-3 bg-gray-800 border-b border-gray-700 flex gap-2">
        <input
          type="text"
          value={streamNameInput}
          onChange={(e) => setStreamNameInput(e.target.value)}
          placeholder="Enter stream name (e.g., test)"
          className="px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          onKeyPress={(e) => e.key === 'Enter' && validateAndPlay()}
        />
        <button
          onClick={validateAndPlay}
          disabled={!streamNameInput.trim()}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPlaying ? '🔄 Refresh' : '▶️ Play'}
        </button>
      </div>

      {/* Player Area */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          controls={controls}
          className="w-full h-full"
          playsInline
          aria-label={`Stream: ${streamName}`}
        />
        
        {/* Loading Overlay */}
        {!isPlaying && streamName && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-3" />
            <div className="text-blue-300 text-sm">{status}</div>
          </div>
        )}
        
      </div>

      {/* Stream Info */}
      {streamName && (
        <div className="p-3 bg-gray-800 text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Stream: <span className="font-mono text-blue-300">{streamName}</span></span>
            <span className="flex items-center">
              {isPlaying ? (
                <span className="flex items-center text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
                  Live
                </span>
              ) : (
                <span className="text-gray-500">Idle</span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HlsPlayer;