import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  searchPixabayVideos, searchPixabayImages, 
  PixabayVideo, PixabayImage, 
  MediaType, OrientationFilter 
} from '../lib/pixabay';

const VIDEO_CATEGORIES = [
  { label: '🔥 Effects', value: 'effects', query: 'fire' },
  { label: '❤️ Hearts', value: 'effects', query: 'heart' },
  { label: '🪄 Magic', value: 'effects', query: 'magic' },
  { label: '🌌 BG', value: 'backgrounds', query: 'background' },
  { label: '✨ Particles', value: 'particles', query: 'particles' },
  { label: '⚡ Cyber', value: 'backgrounds', query: 'cyber' },
  { label: '💫 Light', value: 'effects', query: 'light' },
  { label: '💨 Motion', value: 'effects', query: 'motion' },
  { label: '🎆 Neon', value: 'backgrounds', query: 'neon' },
  { label: '🔮 Abstract', value: 'backgrounds', query: 'abstract' },
];

const IMAGE_CATEGORIES = [
  { label: '🌌 BG', value: 'backgrounds', query: 'background' },
  { label: '🪄 Magic', value: 'backgrounds', query: 'magic circle' },
  { label: '🌟 Sparkles', value: 'backgrounds', query: 'sparkle' },
  { label: '🔲 Frames', value: 'backgrounds', query: 'frame' },
  { label: '🎨 Texture', value: 'backgrounds', query: 'texture' },
  { label: '⚡ Cyber', value: 'backgrounds', query: 'cyber' },
  { label: '💫 Light', value: 'backgrounds', query: 'light' },
  { label: '🌸 Anime', value: 'backgrounds', query: 'anime' },
  { label: '🎆 Neon', value: 'backgrounds', query: 'neon' },
  { label: '🔮 Abstract', value: 'backgrounds', query: 'abstract' },
];

type MediaItem = PixabayVideo | PixabayImage;

export const AssetPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWide, setIsWide] = useState(false); // 2-stage width toggle
  const [mediaType, setMediaType] = useState<MediaType>('videos');
  const [orientation, setOrientation] = useState<OrientationFilter>('vertical');
  
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
  const [downloading, setDownloading] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const getCategories = () => {
    switch (mediaType) {
      case 'videos': return VIDEO_CATEGORIES;
      case 'images': return IMAGE_CATEGORIES;
      default: return VIDEO_CATEGORIES;
    }
  };

  const handleSearch = useCallback(async (
    q: string, 
    type: MediaType = mediaType, 
    orient: OrientationFilter = orientation, 
    pageNum: number = 1, 
    append: boolean = false
  ) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    let results: MediaItem[] = [];
    const catValue = getCategories().find(c => q.includes(c.query))?.value || '';

    try {
      if (type === 'videos') {
        results = await searchPixabayVideos(q, catValue, pageNum, orient);
      } else if (type === 'images') {
        results = await searchPixabayImages(q, catValue, pageNum, orient);
      }
      
      if (append) {
        setItems(prev => {
            const existingIds = new Set(prev.map(v => v.id));
            const newResults = results.filter(v => !existingIds.has(v.id));
            return [...prev, ...newResults] as MediaItem[];
        });
      } else {
        setItems(results);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      }
      
      setHasMore(results.length >= 24);
    } catch (err: any) {
      console.error("Search failed", err);
      if (!append) setItems([]);
      
      setMessage('❌ Search failed. Please try again.');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [mediaType, orientation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      // Trigger search even with empty query to load popular default items
      handleSearch(query, mediaType, orientation, 1, false);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, mediaType, orientation, handleSearch]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(query, mediaType, orientation, nextPage, true);
  }, [loading, loadingMore, hasMore, page, query, mediaType, orientation, handleSearch]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const bottomReached = target.scrollHeight - target.scrollTop <= target.clientHeight + 150;
    if (bottomReached) {
      loadMore();
    }
  };

  const handleDownload = async (item: MediaItem) => {
    setDownloading(item.id);
    setMessage('Downloading...');
    
    let downloadUrl = '';
    
    if (mediaType === 'videos') {
      const v = item as PixabayVideo;
      downloadUrl = v.videos?.large?.url || v.videos?.medium?.url || v.videos?.small?.url || v.videos?.tiny?.url;
    } else if (mediaType === 'images') {
        const i = item as PixabayImage;
        downloadUrl = i.largeImageURL || i.webformatURL;
    }

    if (!downloadUrl) {
       setMessage('❌ Error: No download URL found');
       setDownloading(null);
       setTimeout(() => setMessage(null), 3000);
       return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/download-pixabay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: downloadUrl,
          mediaType: mediaType,
          id: item.id,
          tags: item.tags,
          // Extract extension from URL, fallback to defaults
          ext: downloadUrl.split('?')[0].split('.').pop() || (mediaType === 'images' ? 'jpg' : 'mp4')
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('✅ Saved to public/assets/pixabay/');
      } else {
        setMessage('❌ Server Error');
      }
    } catch (err) {
      setMessage('❌ Connection Error (Server running?)');
    } finally {
      setDownloading(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getGridColumns = () => {
    if (!isWide) return 'repeat(2, 1fr)';
    // When wide, show more items based on orientation
    if (orientation === 'vertical') return 'repeat(5, 1fr)';
    if (orientation === 'horizontal') return 'repeat(3, 1fr)';
    return 'repeat(4, 1fr)';
  };

  const getItemAspectRatio = () => {
    if (orientation === 'vertical') return '9/16';
    if (orientation === 'horizontal') return '16/9';
    return '1/1'; // Square for "All" Mixed
  };

  return (
    <>
      {/* Main Toggle Button */}
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

      {/* Sidebar Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : isWide ? '-50vw' : -420,
          width: isWide ? '50vw' : 400,
          height: '100vh',
          background: 'rgba(15, 15, 20, 0.95)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          zIndex: 9999,
          transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-20px 0 50px rgba(0,0,0,0.5)',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        <div style={{ padding: '30px 30px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', color: 'white' }}>
              PIXABAY <span style={{ color: '#00ccff' }}>HUB v3</span>
            </h2>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>Find Videos, Images & Audio</p>
          </div>
          <button
            onClick={() => setIsWide(!isWide)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 8,
              padding: '6px 12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            {isWide ? '📱 Compact' : '🖥️ Expand'}
          </button>
        </div>

        {/* Media Type Tabs */}
        <div style={{ padding: '0 30px 15px', display: 'flex', gap: 10 }}>
          {[
            { id: 'videos', icon: '🎥', label: 'Videos' },
            { id: 'images', icon: '🖼️', label: 'Images' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setMediaType(tab.id as MediaType); setQuery(''); setPage(1); }}
              style={{
                flex: 1,
                padding: '10px 0',
                background: mediaType === tab.id ? '#00ccff' : 'rgba(255,255,255,0.05)',
                color: mediaType === tab.id ? 'black' : 'white',
                border: 'none',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ marginRight: 6 }}>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '0 30px 15px', display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder={`Search ${mediaType}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: 14,
                outline: 'none',
              }}
            />
            {loading && (
              <div style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                🌀
              </div>
            )}
          </div>
        </div>

        {/* Quick Category Filters */}
        <div style={{ padding: '0 30px 15px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {getCategories().map((cat) => (
            <button
              key={cat.label}
              onClick={() => {
                setQuery(cat.query);
                setPage(1);
              }}
              style={{
                padding: '8px 12px',
                fontSize: 12,
                borderRadius: 8,
                background: query.includes(cat.query) ? '#00ccff' : 'rgba(255,255,255,0.05)',
                border: 'none',
                color: query.includes(cat.query) ? 'black' : '#ccc',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            display: 'grid', 
            gridTemplateColumns: getGridColumns(), 
            gridAutoRows: 'min-content',
            gap: 16,
            padding: '10px 30px 100px',
            alignContent: 'start',
            transition: 'all 0.3s'
          }}
        >
          {items.map((item) => {
            const isHovered = hoveredId === item.id;
            const isSelected = selectedId === item.id;
            
            // Videos and Images logic
            const shouldPreview = isHovered || isSelected;
            const bgImg = mediaType === 'videos' 
               ? ((item as PixabayVideo).videos?.tiny?.thumbnail || `https://i.vimeocdn.com/video/${(item as any).picture_id}_295x166.jpg`)
               : ((item as PixabayImage).webformatURL);

            return (
              <div 
                key={item.id} 
                style={{ 
                  position: 'relative',
                  cursor: 'pointer', 
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: isSelected ? '2px solid #00ccff' : '1px solid rgba(255,255,255,0.05)',
                  background: '#000',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onClick={() => setSelectedId(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div style={{ aspectRatio: getItemAspectRatio(), width: '100%', position: 'relative' }}>
                  {mediaType === 'videos' && shouldPreview ? (
                    (() => {
                      const v = item as PixabayVideo;
                      const previewUrl = v.videos?.small?.url || v.videos?.tiny?.url || v.videos?.medium?.url || v.videos?.large?.url;
                      return previewUrl ? (
                        <video
                          src={previewUrl}
                          poster={bgImg}
                          muted
                          autoPlay
                          loop
                          playsInline
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      ) : null;
                    })()
                  ) : null}
                  
                  {!(mediaType === 'videos' && shouldPreview) && (
                    <img 
                      src={bgImg} 
                      alt={item.tags}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: shouldPreview && mediaType === 'images' ? 1 : 0.6, transition: 'opacity 0.2s' }}
                    />
                  )}
                  
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '15px 10px 10px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    opacity: shouldPreview ? 1 : 0,
                    transition: 'opacity 0.2s',
                    pointerEvents: shouldPreview ? 'auto' : 'none'
                  }}>
                    <div style={{ color: 'white', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.tags}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        fontSize: 11,
                        background: downloading === item.id ? '#444' : '#00ccff',
                        color: 'black',
                        border: 'none',
                        borderRadius: 6,
                        fontWeight: 'bold',
                        cursor: downloading === item.id ? 'wait' : 'pointer'
                      }}
                    >
                      {downloading === item.id ? '...' : `💾 SAVE ${mediaType === 'videos' ? 'MP4' : 'IMAGE'}`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {loadingMore && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#00ccff' }}>
              🌀 Loading more...
            </div>
          )}
        </div>

        {message && (
          <div style={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '14px 24px',
            borderRadius: 12,
            background: message.includes('❌') ? '#ff3366' : '#00ccff',
            color: message.includes('❌') ? 'white' : 'black',
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 10001,
            whiteSpace: 'nowrap'
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
