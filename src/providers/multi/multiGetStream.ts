import axios from 'axios';
import * as cheerio from 'cheerio';
import {Stream} from '../../utils/types';
import {headers} from './headers';


export const multiGetStream = async (
  url: string,
  type: string,
): Promise<Stream[]> => {
  try {
    const res = await axios.get(url, {headers});
    const html = res.data;
    const $ = cheerio.load(html);
    const streamLinks: Stream[] = [];
    const postId = $('#player-option-1').attr('data-post');
    const nume = $('#player-option-1').attr('data-nume');
    const typeValue = $('#player-option-1').attr('data-type');

    const baseUrl = url.split('/').slice(0, 3).join('/');
    console.log('baseUrl', baseUrl);
    if (!postId || !nume || !typeValue) {
      throw new Error('Required data attributes are missing.');
    }
    const formData = new FormData();
    formData.append('action', 'doo_player_ajax');
    formData.append('post', postId);
    formData.append('nume', nume);
    formData.append('type', typeValue);

    console.log('formData', formData);

    const playerRes = await fetch(`${baseUrl}/wp-admin/admin-ajax.php`, {
      headers: headers,
      body: formData,
      method: 'POST',
    });
    const playerData = await playerRes.json();
    console.log('playerData', playerData);
    let ifameUrl =
      playerData?.embed_url?.match(/<iframe[^>]+src="([^"]+)"[^>]*>/i)?.[1] ||
      playerData?.embed_url;
    console.log('ifameUrl', ifameUrl);
    if (!ifameUrl.includes('multimovies')) {
      const iframeRes = await axios.get(ifameUrl, {headers});
      // console.log('iframeRes', iframeRes.data);
      const $$ = cheerio.load(iframeRes.data);
      let newIframeUrl =
        $$('.linkserver').first().attr('data-video') ||
        $$('#videoLinks').children().first().attr('data-link');
      console.log('newIframeUrl', newIframeUrl);
      if (newIframeUrl) {
        ifameUrl = newIframeUrl;
      }
    }
    const iframeRes = await axios.get(ifameUrl, {headers});
    const iframeData = iframeRes.data;

    // Step 1: Extract the function parameters and the encoded string
    var functionRegex =
      /eval\(function\((.*?)\)\{.*?return p\}.*?\('(.*?)'\.split/;
    var match = functionRegex.exec(iframeData);
    let p = '';
    if (match) {
      var params = match[1].split(',').map(param => param.trim());
      var encodedString = match[2];

      // console.log('Parameters:', params);
      // console.log('Encoded String:', encodedString.split("',36,")[0], '🔥🔥');

      p = encodedString.split("',36,")?.[0].trim();
      let a = 36;
      let c = encodedString.split("',36,")[1].slice(2).split('|').length;
      let k = encodedString.split("',36,")[1].slice(2).split('|');

      while (c--) {
        if (k[c]) {
          var regex = new RegExp('\\b' + c.toString(a) + '\\b', 'g');
          p = p.replace(regex, k[c]);
        }
      }

      // console.log('Decoded String:', p);
    } else {
      console.log('No match found');
    }

    const streamUrl = p?.match(/file:\s*"([^"]+\.m3u8[^"]*)"/)?.[1];
    console.log('streamUrl', streamUrl);
    console.log('newUrl', streamUrl?.replace(/&i=\d+,'\.4&/, '&i=0.4&'));
    if (streamUrl) {
      streamLinks.push({
        server: 'Multi',
        link: streamUrl.replace(/&i=\d+,'\.4&/, '&i=0.4&'),
        type: 'm3u8',
        subtitles : [],
      });
    }

    return streamLinks;
  } catch (err) {
    console.error(err);
    return [];
  }
};
