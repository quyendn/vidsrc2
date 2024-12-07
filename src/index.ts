import express, { Request, Response } from "express";
import getSource from "./extractors/upcloud";
import Upcloud from "./extractors/upcloud";
import { Source } from "./utils/types";
import VidsrcNet from "./extractors/vidsrcNet";
import Vidlink from "./extractors/vidlink";
import { mainVidSrc } from "./extractors/vidsrc.xyz";
import { decodeVidSrc } from "./extractors/vidsrc.decode";
import Hdrezka from "./extractors/hdrezka";
import Iosmirror from "./extractors/iosmirror";
import chalk from "chalk";
import AutoEmbed  from "./extractors/autoembed";
import moviesDrive  from "./extractors/moviesDrive";
import moviesApi from "./extractors/moviesApi";
import multi from "./extractors/multi";
const cors = require("cors");

const app = express();
const PORT = 8088;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Sample data (could be replaced with a database)
let items: string[] = [];

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.get("/", (req, res) => {
  res.status(200).send("Welcome to FlixQuest API! 🎉");
});
// GET route to fetch items
app.get("/autoEmbed/watch", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  let src: Source;
  const autoEmbed = new AutoEmbed();

  try {
    const id = req.query.id;
    const isMovie = req.query.isMovie == "true";
    if (!isMovie) {
      const season = req.query.season;
      const episode = req.query.episode;
      console.log(id, isMovie, episode, season);
      src = await autoEmbed.getSource( id?.toString()!,
      isMovie,
      season?.toString(),
      episode?.toString());
    } else {
      src = await autoEmbed.getSource(id?.toString()!, isMovie);
    }
    res.json(src);
  } catch (error) {
    console.log("faild ", error);

    res.send(error);
  }
});
app.get("/moviesApi/watch", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  let src: Source;
  const moviesAPI = new moviesApi();

  try {
    const id = req.query.id;
    const isMovie = req.query.isMovie == "true";
    if (!isMovie) {
      const season = req.query.season;
      const episode = req.query.episode;
      console.log(id, isMovie, episode, season);
      src = await moviesAPI.getSource( id?.toString()!,
      isMovie,
      season?.toString(),
      episode?.toString());
    } else {
      src = await moviesAPI.getSource(id?.toString()!, isMovie);
    }
    res.json(src);
  } catch (error) {
    console.log("faild ", error);

    res.send(error);
  }
});
app.get("/moviesDrive/watch", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  let src: Source;
  const movieDrive = new moviesDrive();

  try {
    const id = req.query.id;
    const isMovie = req.query.isMovie == "true";
    if (!isMovie) {
      const season = req.query.season;
      const episode = req.query.episode;
      console.log(id, isMovie, episode, season);
      src = await movieDrive.getSource( id?.toString()!,
      isMovie,
      season?.toString(),
      episode?.toString());
    } else {
      src = await movieDrive.getSource(id?.toString()!, isMovie);
    }
    res.json(src);
  } catch (error) {
    console.log("faild ", error);

    res.send(error);
  }
});
app.get("/iosmirror/watch", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  let src: Source;
  const iosmirror = new Iosmirror();

  try {
    const id = req.query.id;
    const isMovie = req.query.isMovie == "true";
    if (!isMovie) {
      const season = req.query.season;
      const episode = req.query.episode;
      console.log(id, isMovie, episode, season);
      src = await iosmirror.getSource( id?.toString()!,
      isMovie,
      season?.toString(),
      episode?.toString());
    } else {
      src = await iosmirror.getSource(id?.toString()!, isMovie);
    }
    res.json(src);
  } catch (error) {
    console.log("faild ", error);

    res.send(error);
  }
});
app.get("/upcloud/watch", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  let src: Source;
  const upcloud = new Upcloud();

  try {
    const id = req.query.id;
    const isMovie = req.query.isMovie == "true";
    if (!isMovie) {
      const season = req.query.season;
      const episode = req.query.episode;
      console.log(id, isMovie, episode, season);
      src = await upcloud.getSource(
        id?.toString()!,
        isMovie,
        season?.toString(),
        episode?.toString()
      );
    } else {
      src = await upcloud.getSource(id?.toString()!, isMovie);
    }

    res.json(src);
  } catch (error) {
    console.log("faild ", error);

    res.send(error);
  }
});
app.get("/hdrezka/watch", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  let src: Source;
  const hdrezka = new Hdrezka();

  try {
    const id = req.query.id;
    const isMovie = req.query.isMovie == "true";
    if (!isMovie) {
      const season = req.query.season;
      const episode = req.query.episode;
      console.log(id, isMovie, episode, season);
      src = await hdrezka.getSource(
        id?.toString()!,
        isMovie,
        season?.toString(),
        episode?.toString()
      );
    } else {
      src = await hdrezka.getSource(id?.toString()!, isMovie);
    }

    res.json(src);
  } catch (error) {
    console.log("faild ", error);

    res.send(error);
  }
});
app.get("/vidsrc/watch", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  let src: Source;
  const vidsrc = new VidsrcNet();

  try {
    const id = req.query.id;
    const isMovie = req.query.isMovie == "true";
    if (!isMovie) {
      const season = req.query.season;
      const episode = req.query.episode;
      console.log(id, isMovie, episode, season);
      src = await vidsrc.getSource(
        id?.toString()!,
        isMovie,
        season?.toString(),
        episode?.toString()
      );
    } else {
      src = await vidsrc.getSource(id?.toString()!, isMovie);
    }

    res.json(src);
  } catch (error) {
    console.log("faild ", error);

    res.send(error);
  }
});
app.get("/vidlink/watch", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  let src: Source;
  const vidsrc = new Vidlink();

  try {
    const id = req.query.id;
    const isMovie = req.query.isMovie == "true";
    if (!isMovie) {
      const season = req.query.season;
      const episode = req.query.episode;
      console.log(id, isMovie, episode, season);
      src = await vidsrc.getSource(
        id?.toString()!,
        isMovie,
        season?.toString(),
        episode?.toString()
      );
    } else {
      src = await vidsrc.getSource(id?.toString()!, isMovie);
    }

    res.json(src);
  } catch (error) {
    console.log("faild ", error);

    res.send(error);
  }
});
app.get("/vidsrcin/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const s = (req.query as unknown as { s: string }).s;
    const e = (req.query as unknown as { e: string }).e;
    const result = await mainVidSrc(id,s,e);
    console.log("result from vidsrcpro: ", result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error vidsrc.me' });
  }
});
app.get("/vidsrcx/:id", async (req: Request, res: Response) => {
  try {
    const src_link = (req.query as unknown as { src_link: string }).src_link;
    const rcp_link = (req.query as unknown as { rcp_link: string }).rcp_link;
    const result = await decodeVidSrc(src_link,rcp_link);
    console.log("result from vidsrcx: ", result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error vidsrc.me' });
  }
});

app.get("/multi/watch", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  let src: Source;
  const moviemulti = new multi();

  try {
    const id = req.query.id;
    const isMovie = req.query.isMovie == "true";
    if (!isMovie) {
      const season = req.query.season;
      const episode = req.query.episode;
      console.log(id, isMovie, episode, season);
      src = await moviemulti.getSource( id?.toString()!,
      isMovie,
      season?.toString(),
      episode?.toString());
    } else {
      src = await moviemulti.getSource(id?.toString()!, isMovie);
    }
    res.json(src);
  } catch (error) {
    console.log("faild ", error);

    res.send(error);
  }
});


app.listen(PORT, () => {
  console.log(chalk.green(`Starting server on port ${PORT}... 🚀`));
  console.log(`Server is running on http://localhost:${PORT}`);
});
