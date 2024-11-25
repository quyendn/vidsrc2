import {manifest} from '../Manifest';
import { DecryptMethods, Provider, Source } from "../utils/types";
import {Info,Post} from '../utils/types';
import {fetchMovieData, fetchTVData } from "../utils/function";
class multi extends Provider {
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
        const controller = new AbortController();
        console.log("title:" + title);
        info = await manifest["multiMovies"].GetSearchPosts(
          title,1,"multiMovies",controller.signal
          );
        let linkURL = info[0].link;
        console.log("linkURL:" + linkURL);
        let metaData = await  manifest["multiMovies"].GetMetaData(linkURL,"multiMovies");
        console.log("metaData:" + JSON.stringify(metaData));
        let episodeX = await  manifest["multiMovies"].GetStream(linkURL,"movie");
        console.log("episodeX:" + episodeX);
        return episodeX;
      };
}
export default multi;