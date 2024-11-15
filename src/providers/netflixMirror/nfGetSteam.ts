import axios from 'axios';
import {Stream} from '../../utils/types';
import {getNfHeaders} from './nfHeaders';
import {getBaseUrl} from '../../utils/getBaseUrl';
import {nfGetCookie} from './nfGetCookie';
export const nfGetStream = async (id: string): Promise<Stream[]> => {
  try {
    const baseUrl = await getBaseUrl('nfMirror');
    const url = `${baseUrl}/playlist.php?id=${id}&t=${Math.round(
      new Date().getTime() / 1000,
    )}`;
    const cookies = (await nfGetCookie()) + ' hd=on;';
    console.log('cookies', cookies);
    const res = await fetch(url, {
      headers: {
        cookie: cookies,
      },
      credentials: 'omit',
    });
    const resJson = await res.json();
    const data = resJson?.[0];
    const streamLinks: Stream[] = [];
    data?.sources.forEach((source: any) => {
      streamLinks.push({
        server: source.label,
        link: baseUrl + source.file,
        type: 'm3u8',
        subtitles : [],
        headers: {
          Referer: baseUrl,
          origin: baseUrl,
        },
      });
    });
    console.log(streamLinks);
    return streamLinks;
  } catch (err) {
    console.error(err);
    return [];
  }
};
