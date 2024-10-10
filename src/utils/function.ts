import axios, { AxiosError } from "axios";
import { tmdbBaseUrl, tmdbKey } from "../constants/api_constants";
export async function fetchMovieData(id: string): Promise<{
    title: string;
    year: number;
} | null> {
    const key = `tmdb-movie:${id}`;
    const fetchData = async () => {
        const apiFindData = `${tmdbBaseUrl}/3/find/${id}?language=en-US&api_key=${tmdbKey}&external_source=imdb_id`;
        try {
            const responseFind = await axios.get(apiFindData);
            var tmdbId = responseFind.data.movie_results[0].id;
            const apiUrl = `${tmdbBaseUrl}/3/movie/${tmdbId}?language=en-US&api_key=${tmdbKey}&external_source=imdb_id`;
            const response = await axios.get(apiUrl);
            const releaseDate = response.data.release_date;
            const title = response.data.title;
            const year: number = parseInt(releaseDate.split("-")[0]);
            const dataToCache = { title, year };
            return dataToCache;
        } catch (error) {
            throw new Error("Error fetching TMDB data:," + error);
        }
    };

    return await fetchData();
}
export async function fetchTVData(
    id: string,
    seasonNum: string,
    episodeNum: string,
): Promise<{
    title: string;
    episodeId: number;
    seasonId: number;
    year: number;
    numberOfSeasons: number;
}> {
    const key = `tmdb-tv:${id}:${episodeNum}:${seasonNum}`;
    const fetchData = async () => {
        try {
            const apiFindData = `${tmdbBaseUrl}/3/find/${id}?language=en-US&api_key=${tmdbKey}&external_source=imdb_id`;
            const responseFind = await axios.get(apiFindData);
            var tmdbId = responseFind.data.tv_results[0].id;
            const apiUrlSeason = `${tmdbBaseUrl}/3/tv/${tmdbId}/season/${seasonNum}?language=en-US&api_key=${tmdbKey}&external_source=imdb_id`;

            const response = await axios.get(apiUrlSeason);
            
            const resposneGeneral = await fetchTVPrimaryData(tmdbId);

            const episodes = response.data.episodes;
            const seasonId = response.data.id;
            const title = resposneGeneral.title;
            const year = resposneGeneral?.year;
            const numberOfSeasons = resposneGeneral?.numberOfSeasons;
            const episodeIndex = parseInt(episodeNum) - 1;

            if (episodeIndex >= 0 && episodeIndex < episodes.length) {
                const { id: episodeId } = episodes[episodeIndex];
                const dataToCache = {
                    title,
                    episodeId,
                    seasonId,
                    year,
                    numberOfSeasons,
                };
                return dataToCache;
            } else {
                throw new Error("Invalid episode number");
            }
        } catch (error) {
            throw new Error("Error fetching TMDB data:," + error);
        }
    };

    return await fetchData();
}
async function fetchTVPrimaryData(
    id: string,
): Promise<{ title: string; year: number; numberOfSeasons: number }> {
    const key = `tmdb-tv-info:${id}`;
    const fetchTVData = async () => {
        try {
            const apiUrlGeneral = `${tmdbBaseUrl}/3/tv/${id}?language=en-US&api_key=${tmdbKey}&external_source=imdb_id`;
            const resposneGeneral = await axios.get(apiUrlGeneral);
            const title = resposneGeneral.data.name;
            const year = parseInt(
                resposneGeneral.data.first_air_date.split("-")[0],
            );
            const numberOfSeasons = resposneGeneral.data.number_of_seasons;
            const dataToCache = {
                title,
                year,
                numberOfSeasons,
            };
            return dataToCache;
        } catch (error) {
            throw new Error("Error fetching TMDB data:," + error);
        }
    };
    return fetchTVData();
}