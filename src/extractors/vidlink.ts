import crypto from "crypto";
import { DecryptMethods, Provider, Source } from "../utils/types";
import { json } from "stream/consumers";
import axios from 'axios';
import { load } from 'cheerio';
class Vidlink extends Provider {
  baseURL = "https://vidlink.pro/api/";
  private key = Buffer.from(
    "81060e6a859466b13871d1eeeae166d54d42cf3ea20cc87194a94ff6c3ec845c",
    "hex"
  );
  private algorithm = "aes-256-cbc";
  private _cryptoMethods: DecryptMethods = {
    encodeID: (data: string): string => {
      let iv = crypto.randomBytes(16);
      console.log(iv.buffer);

      let cipher = crypto.createCipheriv(this.algorithm, this.key, "");
      let encrypted = Buffer.concat([
        cipher.update(data, "utf8"),
        cipher.final(),
      ]);
      return iv.toString("hex") + ":" + encrypted.toString("hex");
    },
    decodeID: (encrypted: string): string => {
      let parts = encrypted.split(":");
      let iv = Buffer.from(parts.shift() as string, "hex");
      let encryptedText = Buffer.from(parts.join(":"), "hex");

      let decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      let decrypted = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
      ]);
      return decrypted.toString();
    },
    decrypt: (encrypted: string): string => {
      let parts = encrypted.split(":");
      let iv = Buffer.from(parts.shift() as string, "hex");
      let encryptedText = Buffer.from(parts.join(":"), "hex");

      let decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      let decrypted = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
      ]);
      return decrypted.toString();
    },
  };

  getSource = async (
    id: string,
    isMovie: boolean,
    season?: string,
    episode?: string
  ): Promise<Source | any> => {

    const DOMAIN = "https://vidlink.pro";
    const headers = {
        'user-agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        'Referer': "https://vidlink.pro/",
        'Origin': DOMAIN,
    };
    let urlEmbed = `${DOMAIN}/tv/${id}/${season}/${episode}`;
    if (isMovie) {
      urlEmbed = `${DOMAIN}/movie/${id}`;
    }
    const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 4000);
    const resSearch = await axios.get(urlEmbed, { 
      headers : headers,
      signal: controller.signal,
      method: 'GET'
    });
    const parseEmbed = load(resSearch.data);
    const scripts: string[] = [];
        parseEmbed("script").each((key: any, item: any) => {
            const scriptData = parseEmbed(item).attr("src");
            if (scriptData && scriptData.indexOf("/page-") !== -1) {
                scripts.push(`${DOMAIN}${scriptData}`);
            }
        });
      let KEY = "";
      for (let item of scripts) {
          const scriptData = await fetch(item);
          const textData =  await scriptData.text();
          let matchKey = textData.match(/\, *i *\= *\"([^\"]+)/i);
          let matchKeyText = matchKey ? matchKey[1] : "";
          if (matchKeyText) {
              KEY = matchKeyText;
          }
      }
      console.log("KEY: " + KEY);
      const hash = await (await fetch(`https://aquariumtv.app/encrypt?id=${id}&key=${KEY}`)).text();
      console.log("HASH: " + hash);
      let urlSearch = `${DOMAIN}/api/tv/${hash}/${season}/${episode}?multiLang=0`;
      if (isMovie) {
        urlSearch = `${DOMAIN}/api/movie/${hash}?multiLang=0`;
      }
      const dataSearch = await fetch(urlSearch, { headers });
      const textSearch = await dataSearch.text();
      console.log("textSearch: " + textSearch);
      console.log("textSearch: " + `https://aquariumtv.app/decrypt?data=${textSearch}&key=${KEY}`);
      const decryptX = await axios.get(`https://aquariumtv.app/decrypt?data=${textSearch}&key=${KEY}`);
      
      const decrypt = await (await fetch(`https://aquariumtv.app/decrypt?data=${textSearch}&key=${KEY}`)).text();
      console.log("decrypt: " + decrypt);
       const encoded = this._cryptoMethods.encodeID(id);
       const endpoint = isMovie
         ? `movie/${encoded}`
         : `tv/${encoded}/${season}/${episode}`;
      const response = await (await fetch(this.baseURL + endpoint)).text();
      const link = this._cryptoMethods.decrypt(response);
     return JSON.parse(link);
  };
}
export default Vidlink;
