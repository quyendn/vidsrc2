import {manifest} from '../Manifest';
import { DecryptMethods, Provider, Source } from "../utils/types";
import {Info,Post} from '../utils/types';
class AutoEmbed extends Provider {
    getSource = async (
        id: string,
        isMovie: boolean,
        season?: string,
        episode?: string
      ): Promise<Source | any> => {
        let type = "tv";
        if(isMovie)
        {
          type = "movie"
        }
        let info = JSON.stringify({
          imdbId: id,
          season: season || "0",
          episode: episode || "0",
          tmdbId: id
      });
        let episodeX = await  manifest["autoEmbed"].GetStream(info,type);
        console.log("episodeX:" + episodeX);
        return episodeX;
      };
}
export default AutoEmbed;