import {manifest} from '../Manifest';
import { DecryptMethods, Provider, Source } from "../utils/types";
import {Info,Post} from '../utils/types';
class Iosmirror extends Provider {
    getSource = async (
        id: string,
        isMovie: boolean,
        season?: string,
        episode?: string
      ): Promise<Source | any> => {
        let info: Post[];
        info = await manifest["netflixMirror"].GetSearchPosts(
            "The Batman",1,"netflixMirror"
          );
        let linkURL = info[0].link;
        console.log("linkURL:" + linkURL);
        let metaData = await  manifest["netflixMirror"].GetMetaData(linkURL,"netflixMirror");
        console.log("metaData:" + metaData);
        let episodeX = await  manifest["netflixMirror"].GetStream(metaData.id,"movie");
        console.log("episodeX:" + episodeX);
        return episodeX;
      };
}
export default Iosmirror;