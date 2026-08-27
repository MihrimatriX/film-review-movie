export type Movie = {
  id: string;
  slug: string;
  title: string;
  year: number;
  rating: number;
  genres: string[];
  poster: string;
  synopsis: string;
  runtime?: string;
  director?: string;
  mpaa?: string;
  releaseLabel?: string;
  stars?: string;
  /** TMDB popularity; used for “featured” sort */
  popularity?: number;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string;
  author: string;
  body?: string;
  /** Optional tags for filtering / discovery */
  tags?: string[];
};

export type Celebrity = {
  id: string;
  slug: string;
  name: string;
  role: string;
  country?: string;
  /** TMDB `place_of_birth` (ülke filtresi için metin eşlemesi). */
  placeOfBirth?: string;
  bio?: string;
  image: string;
  imageGrid2?: string;
  imageList?: string;
  popularity?: number;
  /** TMDB: 0 bilinmiyor, 1 kadın, 2 erkek, 3 non-binary */
  gender?: number;
  /** ISO tarih (yaş filtresi; TMDB detayından). */
  birthday?: string;
  deathday?: string | null;
};

export type SeriesSeason = {
  title: string;
  episodes: number;
  description: string;
  image: string;
};

export type SeriesCast = {
  name: string;
  role: string;
  image: string;
};

export type Series = {
  id: string;
  slug: string;
  title: string;
  yearLabel: string;
  rating: number;
  reviewCount: number;
  poster: string;
  synopsis: string;
  runtime: string;
  mpaa: string;
  genres: string[];
  director: string;
  writers: string;
  starsLine: string;
  releaseDate: string;
  plotKeywords: string[];
  seasons: SeriesSeason[];
  cast: SeriesCast[];
  mediaThumbs: string[];
  videoThumb: string;
  popularity?: number;
};

export type UserProfile = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  avatar: string;
};

export type UserRatingEntry = {
  movieSlug: string;
  userRating: number;
  reviewTitle?: string;
  reviewDate?: string;
  reviewBody?: string;
};

export type UserData = {
  profile: UserProfile;
  favoriteSlugs: string[];
  ratings: UserRatingEntry[];
};
