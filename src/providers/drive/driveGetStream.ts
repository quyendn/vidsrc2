import axios from 'axios';
import * as cheerio from 'cheerio';
import * as querystring from 'querystring';
import {Stream} from '../../utils/types';
import {headers} from './header';
import {hubcloudExtracter} from '../hubcloudExtractor';
const API_KEY = '85f31af1-9be8-4122-8c0d-06f502e51d5c';
export const driveGetStream = async (
  url: string,
  type: string
): Promise<Stream[]> => {
  try {
    if (type === 'movie') {
      
      const res = await axios.get(url, {headers});
      const html = res.data;
      const $ = cheerio.load(html);
      const link = $('a:contains("HubCloud")').attr('href');
      url = link || url;
    }
    console.log('driveGetStream', type, url);
    const res = await axios.get(url, {headers});
    const redirectUrl = res.data.match(
      /<meta\s+http-equiv="refresh"\s+content="[^"]*?;\s*url=([^"]+)"\s*\/?>/i,
    )[1];
    console.log('redirectUrl', redirectUrl);
    let redirectUrlProxy = "https://proxy.wafflehacker.io/?destination=" + redirectUrl;
    const res2 = await axios.get(getScrapeOpsUrl(redirectUrl), {
       headers
    });
    const data = res2.data;
    console.log('data', data);
    const $ = cheerio.load(data);
    const hubcloudLink = $('.fa-file-download').parent().attr('href');
    console.log('hubcloudLink', hubcloudLink);

    return await hubcloudExtracter(hubcloudLink!);
  } catch (err) {
    console.error(err);
    return [];
  }
};
function getScrapeOpsUrl(url: string): string {
    const payload = {
        api_key: API_KEY,
        url: url,
        keep_headers: true
    };
    const proxyUrl = 'https://proxy.scrapeops.io/v1/?' + querystring.stringify(payload);
    return proxyUrl;
  } 