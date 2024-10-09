import axios from 'axios';
import {Info, Link} from '../../utils/types';
import {headers} from './nfHeaders';

export const nfGetInfo = async function (link: string): Promise<Info> {
  try {
    const url = link;
    console.log('nfifo', url);
    const res = await axios.get(url, {
      headers: headers,
    });
    const data = res.data;
    console.log('data', data);
    const id = link.split('id=')[1]?.split('&')[0];
    const meta = {
      id: id,
      title: data.title,
      synopsis: data.desc,
      image: `https://img.nfmirrorcdn.top/poster/h/${id}.jpg`,
      cast: data?.short_cast?.split(','),
      tags: [data?.year, data?.hdsd, ...data?.thismovieis?.split(',')],
      imdbId: '',
      type: 'series',
    };
    console.log('nfinfo', meta);

    const linkList: Link[] = [];
    if (data?.season?.length > 0) {
      data.season.map((season: any) => {
        linkList.push({
          id : id,
          title: 'Season ' + season?.s,
          episodesLink: season?.id,
        });
      });
    } else {
      linkList.push({
        id : id,
        title: meta.title,
        directLinks: [{link: link, title: 'Movie', type: 'movie'}],
      });
    }

    return {
      ...meta,

      linkList: linkList,
    };
  } catch (err) {
    console.error(err);
    return {
      id : '',
      title: '',
      synopsis: '',
      image: '',
      imdbId: '',
      type: '',
      linkList: [],
    };
  }
};
