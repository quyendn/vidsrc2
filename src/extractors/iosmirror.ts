import {manifest} from '../Manifest';
import { DecryptMethods, Provider, Source } from "../utils/types";
import {Info,Post} from '../utils/types';
import {fetchMovieData, fetchTVData } from "../utils/function";
class Iosmirror extends Provider {
    getSource = async (
        tmdbId: string,
        isMovie: boolean,
        season?: string,
        episode?: string
      ): Promise<Source | any> => {
        let info: Post[];
        let releaseYear: string = "";
        let title: string = "";
        if(isMovie)
        {
          await fetchMovieData(tmdbId).then((data) => {
            if (data) {
                  releaseYear = data?.year.toString();
                  title = data?.title;
              }
          });
        }
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