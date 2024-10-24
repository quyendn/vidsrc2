type Links = {
    lang: string;
    url: string;
  };
  export async function fileExtractor(url: string): Promise<Links[]> {
    try {
      // console.log('stableExtractorUrl', url);
      const links: Links[] = [];
            const res = await fetch(url);
      const jsonResponse = await res.json();
      console.log('stableExtractor JSON:', jsonResponse);
       // Truy cập đến thuộc tính playlist trong JSON
        const stream = jsonResponse.stream;
        if (stream && stream.length > 0) {
        const playlistUrl = stream[0].playlist;
        if (playlistUrl) {
            links.push({ lang: '', url: playlistUrl });
        }
        }
      // console.log('stableExtractor', links);
      return links;
    } catch (err) {
      console.error('stableExtractor', err);
      return [];
    }
  }
  