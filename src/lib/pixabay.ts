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

export interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayVideo[];
}

const API_KEY = process.env.PIXABAY_API_KEY || '';
const BASE_URL = 'https://pixabay.com/api/videos/';

export const searchPixabayVideos = async (
  query: string,
  category: string = '',
  page: number = 1
): Promise<PixabayVideo[]> => {
  if (!API_KEY) {
    console.error('PIXABAY_API_KEY is not defined in .env');
    return [];
  }

  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    category: category,
    orientation: 'vertical',
    per_page: '24',
    page: page.toString(),
    safesearch: 'true',
  });

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.statusText}`);
    }
    const data: PixabayResponse = await response.json();
    return data.hits;
  } catch (error) {
    console.error('Error fetching Pixabay videos:', error);
    return [];
  }
};
