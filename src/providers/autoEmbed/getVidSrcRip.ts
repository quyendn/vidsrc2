import {Stream} from '../../utils/types';

export async function getVidSrcRip(
  tmdbId: string,
  season: string,
  episode: string,
  stream: Stream[],
) {
  //const sources = ['flixhq', 'vidsrcuk', 'vidsrcicu'];
  const sources = ['flixhq', 'vidsrcicu'];
  const baseUrl = 'aHR0cHM6Ly92aWRzcmMucmlw';
  await Promise.all(
    sources.map(async source => {
      const apiUrl = await useVRF(source, tmdbId, season, episode);
      let urlRequest = atob(baseUrl) + apiUrl;
      console.log("urlRequest: " + urlRequest);
      const response = await fetch(atob(baseUrl) + apiUrl);
      const data = await response.json();
      console.log("data: " + JSON.stringify(data));
      if(data!=null)
      {
        if (data.sources?.length > 0) {
          stream.push({
            server: source,
            type: data?.sources[0].file.includes('.mp4') ? 'mp4' : 'm3u8',
            link: data?.sources[0].file,
            subtitles: []
          });
        }
      }
    }),
  );
}

async function generateVRF(sourceIdentifier: string, tmdbId: string) {
  // Helper function to fetch key from image
  async function fetchKeyFromImage() {
    const response = await fetch('https://vidsrc.rip/images/skip-button.png');
    const data = await response.text();
    console.log('Fetched data from image:', data);
    return data;
  }

  // XOR encryption/decryption function
  function xorEncryptDecrypt(key: string, data: string): string {
    const keyChars = Array.from(key, char => (char as string).charCodeAt(0));
    const dataChars = Array.from(data, char => (char as string).charCodeAt(0));
    const result = [];
    
    for (let i = 0; i < dataChars.length; i++) {
      result.push(dataChars[i] ^ keyChars[i % keyChars.length]);
    }
  
    return String.fromCharCode(...result);
  }

  // Fetch the key
  const key = await fetchKeyFromImage();
  console.log('Fetched key:', key);

  // Construct the input string
  const input = `/api/source/${sourceIdentifier}/${tmdbId}`;

  // Decode the input string
  const decodedInput = decodeURIComponent(input);

  // Perform XOR encryption
  const xorResult = xorEncryptDecrypt(key, decodedInput);

  // Base64 encode and URL encode the result
  const vrf = encodeURIComponent(btoa(xorResult));

  return vrf;
}

// Usage example
async function useVRF(
  sourceIdentifier: string,
  tmdbId: string,
  season: string,
  episode: string,
) {
  try {
    const vrf = await generateVRF(sourceIdentifier, tmdbId);
    console.log('Generated VRF:', vrf);
    const params = season && episode ? `&s=${season}&e=${episode}` : '';
    // Use the VRF in your API call
    const apiUrl = `/api/source/${sourceIdentifier}/${tmdbId}?vrf=${vrf}${params}`;
    console.log('API URL:', apiUrl);

    // Make your API call here
    // const response = await fetch(apiUrl);
    // ... handle the response
    return apiUrl;
  } catch (error) {
    console.error('Error generating VRF:', error);
  }
}
