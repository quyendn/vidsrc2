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
        let info = '{"imdbId" : "tt1877830", "season" : 0, "episode": "0", "title" : "The Batman", "tmdbId": "414906", "year" : "2022"}';
        let episodeX = await  manifest["autoEmbed"].GetStream(info,"movie");
        console.log("episodeX:" + episodeX);
        return episodeX;
      };
}
export default AutoEmbed;