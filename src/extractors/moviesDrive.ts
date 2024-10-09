import {manifest} from '../Manifest';
import { DecryptMethods, Provider, Source } from "../utils/types";
import {Info,Post} from '../utils/types';
class moviesDrive extends Provider {
    getSource = async (
        id: string,
        isMovie: boolean,
        season?: string,
        episode?: string
      ): Promise<Source | any> => {
        let info = '{"imdbId" : "tt1877830", "season" : 0, "episode": "0", "title" : "The Batman", "tmdbId": "414906", "year" : "2022"}';
        //let episodeX = await  manifest["moviesDrive"].GetSearchPosts("The Batman",1,"moviesDrive");
        //let movieInfo = await  manifest["moviesDrive"].GetMetaData(episodeX[0].link,"moviesDrive");
        let movieLink = await  manifest["moviesDrive"].GetStream("https://mdrive.site/archives/16160","movie");
        console.log("movieLink:" + movieLink);
        return movieLink;
      };
}
export default moviesDrive;