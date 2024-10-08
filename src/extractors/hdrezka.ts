import { flags } from '../utils/targets';
import { SourcererOutput, makeSourcerer } from '../../src/base';
import { MovieScrapeContext, ShowScrapeContext } from '../utils/context';
import { NotFoundError } from '../utils/errors';
import { Provider, Source } from "../utils/types";
import { MovieData, VideoLinks } from '../source/hdrezka/types';
import { extractTitleAndYear, generateRandomFavs, parseSubtitleLinks, parseVideoLinks } from '../source/hdrezka/utils';
const rezkaBase = 'https://hdrzk.org';
const baseHeaders = {
  'X-Hdrezka-Android-App': '1',
  'X-Hdrezka-Android-App-Version': '2.2.0',
};
// Hàm tìm kiếm media dựa trên tiêu đề
async function searchMedia(title: string,type: string, year : Number): Promise<MovieData> {
    const itemRegexPattern = /<a href="([^"]+)"><span class="enty">([^<]+)<\/span> \(([^)]+)\)/g;
    const idRegexPattern = /\/(\d+)-[^/]+\.html$/;
    const params = new URLSearchParams({ q: title });
    const movieData: MovieData[] = [];
    const response = await fetch(`${rezkaBase}/engine/ajax/search.php?${params}`, {
      method: 'GET',
      headers: baseHeaders,
    });

    if (!response.ok) {
      throw new Error(`Search failed with status ${response.status}`);
    }

    const data = await response.text();  // Vì API trả về HTML
    console.log('Search results:', data);
    
    for (const match of data.matchAll(itemRegexPattern)) {
        const url = match[1];
        const titleAndYear = match[3];

        const result = extractTitleAndYear(titleAndYear);
        if (result !== null) {
        const id = url.match(idRegexPattern)?.[1] || null;

        movieData.push({ id: id ?? '', year: result.year ?? 0, type: "movie", url });
        }
    }

    const filteredItems = movieData.filter((item) => item.type === type && item.year === year);

    return filteredItems[0] || null;
  
}

// Hàm lấy thông tin stream của media
async function getStreamData(id: string, translatorId: string, mediaType: string, season?: number, episode?: number): Promise<any> {
  const searchParams = new URLSearchParams();
  searchParams.append('id', id);
  searchParams.append('translator_id', translatorId);

  if (mediaType === 'show' && season && episode) {
    searchParams.append('season', season.toString());
    searchParams.append('episode', episode.toString());
  } else if (mediaType === 'movie') {
    searchParams.append('is_camprip', '0');
    searchParams.append('is_ads', '0');
    searchParams.append('is_director', '0');
  }

  searchParams.append('favs', generateRandomFavs());  // Hàm tạo favs giả lập
  searchParams.append('action', mediaType === 'show' ? 'get_stream' : 'get_movie');

  try {
    const response = await fetch(`${rezkaBase}/ajax/get_cdn_series/`, {
      method: 'POST',
      body: searchParams,
      headers: baseHeaders,
    });

    if (!response.ok) {
      throw new Error(`Stream fetch failed with status ${response.status}`);
    }

    const data = await response.json();  // Phản hồi JSON
    console.log('Stream data:', data);
    return data;  // Trả về link video và subtitles
  } catch (error) {
    console.error('Error fetching stream data:', error);
    return null;
  }
}

// Hàm lấy translatorId dựa trên URL của media
async function getTranslatorId(url: string, mediaId: string, mediaType: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: baseHeaders,
    });

    if (!response.ok) {
      throw new Error(`Failed to get translatorId with status ${response.status}`);
    }

    const html = await response.text();  // API trả về HTML
    console.log('Media page HTML:', html);

    // Tìm translatorId từ HTML
    const translatorMatch = html.match(/data-translator_id="(\d+)"/);
    if (translatorMatch) {
      return translatorMatch[1];
    }

    // Nếu không tìm thấy, thử với hàm initCDNSeriesEvents hoặc initCDNMoviesEvents
    const functionName = mediaType === 'movie' ? 'initCDNMoviesEvents' : 'initCDNSeriesEvents';
    const regex = new RegExp(`sof\\.tv\\.${functionName}\\(${mediaId}, ([^,]+)`, 'i');
    const match = html.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error fetching translator ID:', error);
    return null;
  }
}
class Hdrezka extends Provider {
    baseUrl = "https://vidsrc.cc/";
    headers = {
      Referer: this.baseUrl,
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    };
    async getSource(
      id: string,
      isMovie: boolean,
      season?: string,
      episode?: string
    ): Promise<any> {
      try {

        let name = 'The Batman';
        let type = 'movie';
        let year = 2022;
        // Tìm kiếm phim dựa trên tiêu đề
        const searchResult = await searchMedia(name,type,year);
        console.log(searchResult)
        // Lấy translatorId từ trang chi tiết phim
        const translatorId = await getTranslatorId(searchResult.url, searchResult.id, 'movie');
        if (!translatorId) return;
        // Lấy link stream của phim
        const { url: streamUrl, subtitle: streamSubtitle }  = await getStreamData(searchResult.id, translatorId, 'movie');
        const parsedVideos = parseVideoLinks(streamUrl);
        const parsedSubtitles = parseSubtitleLinks(streamSubtitle);
        // return title;
        return { parsedSubtitles, ...parsedVideos };
      } catch (error) {
        console.log("faild ", error);
        throw error;
      }
    }
    
  }
  
  export default Hdrezka;
