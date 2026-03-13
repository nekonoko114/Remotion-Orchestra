import React, { useState, useEffect, useCallback, useRef } from 'react';
import { searchPixabayVideos, PixabayVideo } from '../lib/pixabay';

const CATEGORIES = [
  { label: '🔥 Effects', value: 'effects', query: 'fire' },
  { label: '❤️ Hearts', value: 'effects', query: 'heart' },
  { label: '🪄 Magic', value: 'effects', query: 'magic' },
  { label: '🌌 BG', value: 'backgrounds', query: 'background' },
  { label: '✨ Particles', value: 'particles', query: 'particles' },
  { label: '🖼️ Frames', value: 'frames', query: 'frame' },
];

export const AssetPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<PixabayVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (q: string, category: string = '', pageNum: number = 1, append: boolean = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    const results = await searchPixabayVideos(q, category, pageNum);
    
    if (append) {
      setVideos(prev => {
          // Prevent duplicates by checking ID
          const existingIds = new Set(prev.map(v => v.id));
          const newResults = results.filter(v => !existingIds.has(v.id));
          return [...prev, ...newResults];
      });
    } else {
      setVideos(results);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }

    setHasMore(results.length >= 24);
    setLoading(false);
    setLoadingMore(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        setPage(1);
        handleSearch(query, '', 1, false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(query, '', nextPage, true);
  }, [loading, loadingMore, hasMore, page, query, handleSearch]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const bottomReached = target.scrollHeight - target.scrollTop <= target.clientHeight + 150;
    if (bottomReached) {
      loadMore();
    }
  };

  const handleDownload = async (video: PixabayVideo, category: string) => {
    setDownloading(video.id);
    setMessage('Downloading...');
    try {
      const response = await fetch('http://localhost:3001/api/download-pixabay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: video.videos.large.url,
          category: category,
          id: video.id
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('✅ Saved!');
      } else {
        setMessage('❌ Failed');
      }
    } catch (err) {
      setMessage('❌ Error');
    } finally {
      setDownloading(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: 30,
          background: '#00ccff',
          color: 'black',
          border: 'none',
          fontSize: 24,
          cursor: 'pointer',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0,204,255,0.4)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isOpen ? 'rotate(180deg) scale(0.9)' : 'rotate(0) scale(1)',
        }}
      >
        {isOpen ? '✕' : '📂'}
      </button>

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : -420,
          width: 400,
          height: '100vh',
          background: 'rgba(15, 15, 20, 0.9)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          zIndex: 9999,
          transition: 'right 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-20px 0 50px rgba(0,0,0,0.5)',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        <div style={{ padding: '40px 30px 20px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', color: 'white' }}>
            PIXABAY <span style={{ color: '#00ccff' }}>HUB</span>
          </h2>
          <p style={{ margin: 0, fontSize: 12, color: '#888' }}>Scroll to discover more assets</p>
        </div>

        <div style={{ padding: '0 30px 20px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search vertical assets..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: 16,
                outline: 'none',
              }}
            />
            {loading && (
              <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                🌀
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '0 30px 20px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => {
                setQuery(cat.query);
                setPage(1);
                handleSearch(cat.query, cat.value, 1, false);
              }}
              style={{
                padding: '10px 14px',
                fontSize: 12,
                borderRadius: 10,
                background: query === cat.query ? '#00ccff' : 'rgba(255,255,255,0.05)',
                border: 'none',
                color: query === cat.query ? 'black' : '#ccc',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gridAutoRows: 'min-content', // This prevents items from overlapping by forcing row height
            gap: 16,
            padding: '0 30px 100px',
            alignContent: 'start'
          }}
        >
          {videos.map((video) => (
            <div 
              key={video.id} 
              style={{ 
                position: 'relative',
                cursor: 'pointer', 
                borderRadius: 16,
                overflow: 'hidden',
                border: selectedId === video.id ? '2px solid #00ccff' : '1px solid rgba(255,255,255,0.05)',
                background: '#000',
                display: 'flex', // Ensures content fills the grid cell properly
                flexDirection: 'column'
              }}
              onClick={() => setSelectedId(video.id)}
            >
              <div style={{ aspectRatio: '9/16', width: '100%', position: 'relative' }}>
                <img 
                  src={video.videos.tiny.thumbnail || `https://i.vimeocdn.com/video/${video.picture_id}_295x166.jpg`} 
                  alt={video.tags}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: selectedId === video.id ? 1 : 0.6 }}
                />
                
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '15px 10px 10px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const cat = CATEGORIES.find(c => query.includes(c.query))?.value || 'effects';
                      handleDownload(video, cat);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: 11,
                      background: downloading === video.id ? '#444' : '#00ccff',
                      color: 'black',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 'bold',
                      cursor: downloading === video.id ? 'wait' : 'pointer'
                    }}
                  >
                    {downloading === video.id ? '...' : '💾 SAVE'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {loadingMore && (
            <div style={{ gridColumn: '1 / span 2', textAlign: 'center', padding: '20px', color: '#00ccff' }}>
              🌀 Loading more...
            </div>
          )}
        </div>

        {message && (
          <div style={{
            position: 'absolute',
            bottom: 30,
            left: 30,
            right: 30,
            padding: '14px',
            borderRadius: 12,
            background: '#00ccff',
            color: 'black',
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 10001
          }}>
            {message}
          </div>
        )}
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
      `}</style>
    </>
  );
};
