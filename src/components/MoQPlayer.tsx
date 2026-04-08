'use client'
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface MoQPlayerProps {
  streamUrl?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  onStatusChange?: (status: string) => void;
}

interface StreamStats {
  framesDecoded: number;
  framesDropped: number;
  latency: number;
  fps: number;
  bufferLevel: number;
}

const MoQPlayer: React.FC<MoQPlayerProps> = ({
  streamUrl = '',
  autoPlay = true,
  controls = true,
  className = '',
  onStatusChange
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const decoderRef = useRef<VideoDecoder | null>(null);
  const transportRef = useRef<WebTransport | null>(null);
  const frameBufferRef = useRef<VideoFrame[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  
  const [streamNameInput, setStreamNameInput] = useState(streamUrl);
  const [streamName, setStreamName] = useState(streamUrl);
  const [status, setStatus] = useState('Enter stream name');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StreamStats>({
    framesDecoded: 0,
    framesDropped: 0,
    latency: 0,
    fps: 0,
    bufferLevel: 0
  });

  const baseUrl = import.meta.env.VITE_MOQ_URL || 'https://localhost:4443';
  const moqUrl = streamName ? `${baseUrl.replace(/\/$/, '')}/${streamName}` : '';

  const updateStatus = useCallback((newStatus: string) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (decoderRef.current && decoderRef.current.state !== 'closed') {
      try {
        decoderRef.current.close();
      } catch {}
      decoderRef.current = null;
    }
    
    if (transportRef.current && transportRef.current.state !== 'closed') {
      try {
        transportRef.current.close();
      } catch {}
      transportRef.current = null;
    }
    
    frameBufferRef.current.forEach(frame => {
      try { frame.close(); } catch {}
    });
    frameBufferRef.current = [];
    
    setIsConnected(false);
  }, []);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = performance.now();
    const buffer = frameBufferRef.current;
    
    if (buffer.length > 0 && now - (buffer[0] as any).renderTime >= 33) {
      const frame = buffer.shift();
      if (frame) {
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
        (frame as any).renderTime = now;
        try { frame.close(); } catch {}
        
        setStats(prev => ({
          ...prev,
          framesDecoded: prev.framesDecoded + 1,
          bufferLevel: buffer.length
        }));
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(renderFrame);
  }, []);

  const configureDecoder = useCallback((sps: Uint8Array, pps: Uint8Array) => {
    if (decoderRef.current?.state === 'configured') return;

    let actualSps = sps;
    let actualPps = pps;
    
    if (sps[0] === 0x00 && sps[1] === 0x00 && sps[2] === 0x00 && sps[3] === 0x01) {
      actualSps = sps.slice(4);
    } else if (sps[0] === 0x00 && sps[1] === 0x00 && sps[2] === 0x01) {
      actualSps = sps.slice(3);
    }
    
    if (pps[0] === 0x00 && pps[1] === 0x00 && pps[2] === 0x00 && pps[3] === 0x01) {
      actualPps = pps.slice(4);
    } else if (pps[0] === 0x00 && pps[1] === 0x00 && pps[2] === 0x01) {
      actualPps = pps.slice(3);
    }

    const codecString = `avc1.${actualSps[1].toString(16).padStart(2, '0')}${actualSps[2].toString(16).padStart(2, '0')}${actualSps[3].toString(16).padStart(2, '0')}`;

    const decoder = new VideoDecoder({
      output: (frame) => {
        frameBufferRef.current.push(frame);
        if (frameBufferRef.current.length > 30) {
          const dropped = frameBufferRef.current.shift();
          try { dropped?.close(); } catch {}
          setStats(prev => ({ ...prev, framesDropped: prev.framesDropped + 1 }));
        }
      },
      error: (err) => {
        console.error('Decoder error:', err);
        setError(`Decoder error: ${err.message}`);
      }
    });

    try {
      decoder.configure({
        codec: codecString,
        codedWidth: 1280,
        codedHeight: 720,
        hardwareAcceleration: 'prefer-hardware'
      });
      decoderRef.current = decoder;
    } catch (e) {
      console.error('Failed to configure decoder:', e);
      setError('Failed to configure video decoder');
    }
  }, []);

  const connectMoQ = useCallback(async () => {
    if (!streamNameInput.trim()) {
      setError('Stream name cannot be empty');
      return;
    }

    cleanup();
    setError(null);
    updateStatus('Connecting...');

    try {
      const transport = new WebTransport(moqUrl, {
        allowInsecure: false
      });

      transportRef.current = transport;

      transport.on开放 = () => {
        setIsConnected(true);
        updateStatus('Connected, waiting for stream...');
        
        if (autoPlay) {
          startRenderLoop();
        }
      };

      transport.onclosed = () => {
        cleanup();
        updateStatus('Connection closed');
      };

      transport.onerror = (err) => {
        console.error('WebTransport error:', err);
        setError(`Connection error: ${err.message || 'Unknown error'}`);
        updateStatus('Connection error');
        cleanup();
      };

      await transport.ready;
      
      const uniStream = transport.acceptUnidirectionalStream;
      const reader = uniStream.getReader();
      
      const readLoop = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            if (value && value.length > 4) {
              const data = new Uint8Array(value);
              const type = data[0];
              
              if (type === 0x00 && data.length > 8) {
                const groupId = data[1];
                const objectId = data[2];
                const size = (data[3] << 16) | (data[4] << 8) | data[5];
                const payload = data.slice(6, 6 + size);
                
                if (groupId === 0x01 && objectId === 0x01 && decoderRef.current?.state === 'configured') {
                  decoderRef.current.decode(new EncodedVideoChunk({
                    type: 'key',
                    timestamp: Date.now() * 1000,
                    data: payload
                  }));
                } else if (groupId === 0x02 && decoderRef.current?.state === 'configured') {
                  decoderRef.current.decode(new EncodedVideoChunk({
                    type: 'delta',
                    timestamp: Date.now() * 1000,
                    data: payload
                  }));
                }
              }
            }
          }
        } catch (e) {
          console.error('Read loop error:', e);
        }
      };

      readLoop();
      updateStatus('Waiting for media...');

    } catch (err) {
      console.error('MoQ connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to MoQ server');
      updateStatus('Connection failed');
      cleanup();
    }
  }, [streamNameInput, moqUrl, autoPlay, cleanup, updateStatus]);

  const startRenderLoop = useCallback(() => {
    if (animationFrameRef.current) return;
    renderFrame();
  }, [renderFrame]);

  const disconnect = useCallback(() => {
    cleanup();
    setStreamName('');
    updateStatus('Disconnected');
  }, [cleanup, updateStatus]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden ${className}`}>
      <div className="p-3 bg-gray-800 border-b border-gray-700 flex gap-2">
        <input
          type="text"
          value={streamNameInput}
          onChange={(e) => setStreamNameInput(e.target.value)}
          placeholder="Enter stream name (e.g., mystream)"
          className="px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          onKeyPress={(e) => e.key === 'Enter' && connectMoQ()}
        />
        <button
          onClick={connectMoQ}
          disabled={!streamNameInput.trim()}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isConnected ? '🔄 Reconnect' : '▶️ Connect'}
        </button>
        {isConnected && (
          <button
            onClick={disconnect}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
          >
            Disconnect
          </button>
        )}
      </div>

      <div className="relative aspect-video bg-black">
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full"
        />
        <video
          ref={videoRef}
          controls={controls}
          className="hidden"
          playsInline
        />
        
        {!isConnected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-3" />
            <div className="text-blue-300 text-sm">{status}</div>
          </div>
        )}
      </div>

      <div className="p-3 bg-gray-800 text-sm text-gray-300">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>
              Stream: <span className="font-mono text-blue-300">{streamName || '-'}</span>
            </span>
            <span className="text-gray-500">|</span>
            <span>
              Protocol: <span className="text-green-400">MoQ/QUIC</span>
            </span>
          </div>
          <div className="flex items-center">
            {isConnected ? (
              <span className="flex items-center text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse" />
                Connected
              </span>
            ) : (
              <span className="text-gray-500">Disconnected</span>
            )}
          </div>
        </div>
        
        {error && (
          <div className="mt-2 p-2 bg-red-900/50 border border-red-700 rounded text-red-300 text-xs">
            Error: {error}
          </div>
        )}
        
        <div className="mt-2 flex gap-4 text-xs text-gray-400">
          <span>FPS: {stats.fps}</span>
          <span>Decoded: {stats.framesDecoded}</span>
          <span>Dropped: {stats.framesDropped}</span>
          <span>Buffer: {stats.bufferLevel}</span>
          <span>Latency: {stats.latency}ms</span>
        </div>
      </div>
    </div>
  );
};

export default MoQPlayer;
