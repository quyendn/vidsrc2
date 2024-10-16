import axios from 'axios';
interface SearchResult {
  embedId: string;
  [key: string]: any; // Optional: This allows other properties if they exist
}
export const getWhvxStream = async (
    imdbId: string,
    tmdbId: string,
    season: string,
    episode: string,
    title: string,
    type: string,
    year: string,
    provider: string,
    baseUrl: string,
  ) => {
    try {
      const searchQuery = encodeURIComponent(
        JSON.stringify({
          title: title,
          imdbId: imdbId,
          tmdbId: tmdbId,
          type: type === 'series' ? 'show' : 'movie',
          season: season || '',
          episode: episode || '',
          releaseYear: year
            ? year?.split('–')?.length > 0
              ? year?.split('–')[0]
              : year
            : '',
        }),
      );
      console.log('searchQuery', {
        title: title,
        imdbId: imdbId,
        tmdbId: tmdbId,
        type: type === 'series' ? 'show' : 'movie',
        releaseYear: year
          ? year?.split('–')?.length > 0
            ? year?.split('–')[0]
            : year
          : '',
        season: season,
        episode: episode,
      });
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 4000);
      const controller2 = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 4000);
      
      const proxies = {
        http: 'http://89.117.130.19:80',
        https: 'https://128.92.239.190:8080'
      };
      let urlSearch = `${atob(baseUrl)}/search?query=${searchQuery}&provider=${provider}`;
      console.log("urlSearch: " + urlSearch);
      const resSearch = await axios.get(urlSearch, { 
        headers : {
          Host : 'api.whvx.net',
          Origin: 'https://www.vidbinge.com',
        },
        proxy: get_random_proxy(proxies),
        signal: controller.signal,
        method: 'GET'
      });
     

      
      // const searchRes = await fetch(`${atob(baseUrl)}/search?query=${searchQuery}&provider=${provider}`,
      //   {
      //     headers: {
      //       'if-none-match': 'W/"d4-7mcv5HTZs5ogd/iJwPMEZ/NGCw0"',
      //       host : 'www.vidbinge.com',
      //       origin: 'https://www.vidbinge.com',
      //     },
      //     signal: controller.signal,
      //     referrerPolicy: 'no-referrer',
      //     method : 'GET'
          
      //   },
      // );
      const searchController = new AbortController();
      setTimeout(() => {
        searchController.abort();
      }, 4000);
      const searchJson = resSearch.data as SearchResult;

      //let searchJson = await data.json() as SearchResult;
      

      console.log('whvx', provider, JSON.stringify(searchJson));

      // const resSearch = await axios.get(urlSearch, { 
      //   headers : {
      //     Host : 'api.whvx.net',
      //     Origin: 'https://www.vidbinge.com',
      //   },
      //   proxy: get_random_proxy(proxies),
      //   signal: controller.signal,
      //   method: 'GET'
      // });



      const streamRes = await axios.get(`${atob(baseUrl)}/source?resourceId=${encodeURIComponent(
          searchJson?.url,
        )}&provider=${provider}`,
        {
          headers: {
            'if-none-match': 'W/"d4-7mcv5HTZs5ogd/iJwPMEZ/NGCw0"',
            Host : 'api.whvx.net',
            Origin: 'https://www.vidbinge.com'
          },
          proxy: get_random_proxy(proxies),
          signal: searchController.signal,
          method: 'GET',
        },
      );
      const streamJson = await streamRes.data as SearchResult;
      console.log('whvx', provider, streamJson);
      return streamJson?.stream?.[0] || null;
    } catch (err) {
      console.error('whvx', err);
    }
  };
function get_random_proxy(proxies: any) {
  return proxies[Math.floor((Math.random() * proxies.length))];
}