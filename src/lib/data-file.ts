import fs from "fs/promises";
import path from "path";
import type { BlogPost, Celebrity, Movie, Series, UserData } from "./types";

const dataDir = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

/**
 * Önce geçici dosyaya yazıp sonra `rename` eder: süreç yazım ortasında ölse bile
 * JSON dosyası yarım kalmaz. Aynı dosyaya eşzamanlı yazımlar sıraya alınır.
 */
const writeQueues = new Map<string, Promise<void>>();

async function writeJsonAtomic(name: string, data: unknown): Promise<void> {
  await ensureDataDir();
  const file = path.join(dataDir, name);
  const prev = writeQueues.get(file) ?? Promise.resolve();
  const job = prev
    .catch(() => undefined)
    .then(async () => {
      const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
      await fs.rename(tmp, file);
    });
  writeQueues.set(file, job);
  try {
    await job;
  } finally {
    if (writeQueues.get(file) === job) writeQueues.delete(file);
  }
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
  await writeJsonAtomic("movies.json", movies);
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
  await writeJsonAtomic("posts.json", posts);
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
  await writeJsonAtomic("celebrities.json", list);
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
  await writeJsonAtomic("series.json", list);
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
  await writeJsonAtomic("user.json", data);
}
