import fs from "fs/promises";
import path from "path";
import type { BlogPost, Celebrity, Movie, Series, UserData } from "./types";

const dataDir = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function readMovies(): Promise<Movie[]> {
  const file = path.join(dataDir, "movies.json");
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as Movie[];
  } catch {
    return [];
  }
}

export async function writeMovies(movies: Movie[]): Promise<void> {
  await ensureDataDir();
  const file = path.join(dataDir, "movies.json");
  await fs.writeFile(file, JSON.stringify(movies, null, 2), "utf-8");
}

export async function readPosts(): Promise<BlogPost[]> {
  const file = path.join(dataDir, "posts.json");
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as BlogPost[];
  } catch {
    return [];
  }
}

export async function writePosts(posts: BlogPost[]): Promise<void> {
  await ensureDataDir();
  const file = path.join(dataDir, "posts.json");
  await fs.writeFile(file, JSON.stringify(posts, null, 2), "utf-8");
}

export async function readCelebrities(): Promise<Celebrity[]> {
  const file = path.join(dataDir, "celebrities.json");
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as Celebrity[];
  } catch {
    return [];
  }
}

export async function writeCelebrities(list: Celebrity[]): Promise<void> {
  await ensureDataDir();
  const file = path.join(dataDir, "celebrities.json");
  await fs.writeFile(file, JSON.stringify(list, null, 2), "utf-8");
}

export async function readSeriesList(): Promise<Series[]> {
  const file = path.join(dataDir, "series.json");
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as Series[];
  } catch {
    return [];
  }
}

export async function writeSeriesList(list: Series[]): Promise<void> {
  await ensureDataDir();
  const file = path.join(dataDir, "series.json");
  await fs.writeFile(file, JSON.stringify(list, null, 2), "utf-8");
}

export async function readUserData(): Promise<UserData> {
  const file = path.join(dataDir, "user.json");
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as UserData;
  } catch {
    return {
      profile: {
        username: "guest",
        email: "",
        firstName: "",
        lastName: "",
        country: "",
        state: "",
        avatar: "/images/placeholders/portrait.svg",
      },
      favoriteSlugs: [],
      ratings: [],
    };
  }
}

export async function writeUserData(data: UserData): Promise<void> {
  await ensureDataDir();
  const file = path.join(dataDir, "user.json");
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}
