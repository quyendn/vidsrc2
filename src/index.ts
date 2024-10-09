import express, { Request, Response } from "express";
import getSource from "./extractors/upcloud";
import Upcloud from "./extractors/upcloud";
import { Source } from "./utils/types";
import VidsrcNet from "./extractors/vidsrcNet";
import Vidlink from "./extractors/vidlink";
import Hdrezka from "./extractors/hdrezka";
import Iosmirror from "./extractors/iosmirror";
import chalk from "chalk";
import AutoEmbed  from "./extractors/autoembed";
import moviesDrive  from "./extractors/moviesDrive";
const cors = require("cors");

const app = express();
const PORT = 3000;

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
app.listen(PORT, () => {
  console.log(chalk.green(`Starting server on port ${PORT}... 🚀`));
  console.log(`Server is running on http://localhost:${PORT}`);
});
