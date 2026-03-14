// Video Interfaces
export interface PixabayVideo {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  duration: number;
  picture_id: string;
  videos: {
    large: PixabayVideoVersion;
    medium: PixabayVideoVersion;
    small: PixabayVideoVersion;
    tiny: PixabayVideoVersion;
  };
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface PixabayVideoVersion {
  url: string;
  width: number;
  height: number;
  size: number;
  thumbnail: string;
}

export interface PixabayVideoResponse {
  total: number;
  totalHits: number;
  hits: PixabayVideo[];
}

// Image Interfaces
export interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  collections: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface PixabayImageResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}

const API_KEY = process.env.PIXABAY_API_KEY || '';
const VIDEO_BASE_URL = 'https://pixabay.com/api/videos/';
const IMAGE_BASE_URL = 'https://pixabay.com/api/'; // Images are at the root API path

export type MediaType = 'videos' | 'images';
export type OrientationFilter = 'vertical' | 'horizontal' | 'all';

export const searchPixabayVideos = async (
  query: string,
  category: string = '',
  page: number = 1,
  orientation: OrientationFilter = 'vertical'
): Promise<PixabayVideo[]> => {
  if (!API_KEY) {
    console.error('PIXABAY_API_KEY is not defined in .env');
    return [];
  }

  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    category: category,
    per_page: '24',
    page: page.toString(),
    safesearch: 'true',
  });

  if (orientation !== 'all') {
    params.append('orientation', orientation);
  }

  try {
    const response = await fetch(`${VIDEO_BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Pixabay Video API error: ${response.statusText}`);
    }
    const data: PixabayVideoResponse = await response.json();
    return data.hits;
  } catch (error) {
    console.error('Error fetching Pixabay videos:', error);
    return [];
  }
};

export const searchPixabayImages = async (
  query: string,
  category: string = '',
  page: number = 1,
  orientation: OrientationFilter = 'all'
): Promise<PixabayImage[]> => {
  if (!API_KEY) {
    console.error('PIXABAY_API_KEY is not defined in .env');
    return [];
  }

  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    category: category,
    per_page: '24',
    page: page.toString(),
    safesearch: 'true',
  });

  if (orientation !== 'all') {
    params.append('orientation', orientation);
  }

  try {
    const response = await fetch(`${IMAGE_BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Pixabay Image API error: ${response.statusText}`);
    }
    const data: PixabayImageResponse = await response.json();
    return data.hits;
  } catch (error) {
    console.error('Error fetching Pixabay images:', error);
    return [];
  }
};

