import { Session, User } from "@supabase/supabase-js";

export const STORY_GENRES = [
  "Horror",
  "Romance",
  "Comedy",
  "Adventure",
  "Sci-Fi",
  "Mystery",
] as const;

export const STORY_LENGTHS = [500, 1000, 2000] as const;
export const IMAGE_STYLES = [
  "Realistic",
  "Anime",
  "Watercolor",
  "Oil painting",
  "Pixel art",
] as const;
export const ASPECT_RATIOS = ["1:1", "4:3", "9:16"] as const;

export type StoryGenre = (typeof STORY_GENRES)[number];
export type StoryLength = (typeof STORY_LENGTHS)[number];
export type ImageStyle = (typeof IMAGE_STYLES)[number];
export type AspectRatio = (typeof ASPECT_RATIOS)[number];

export type AppUser = User;
export type AppSession = Session;

export interface Story {
  id: string;
  user_id: string;
  image_url: string | null;
  story_text: string;
  genre: StoryGenre;
  created_at: string;
}

export interface Illustration {
  id: string;
  story_id: string;
  image_url: string;
  prompt: string;
  style: ImageStyle;
  created_at: string;
}

export interface StoryWithIllustration extends Story {
  illustration?: Illustration | null;
}

export interface GeneratedImage {
  id: string;
  user_id: string;
  image_url: string;
  prompt: string;
  revised_prompt: string | null;
  style: ImageStyle;
  aspect_ratio: AspectRatio;
  created_at: string;
}

export interface CommunityItem {
  id: string;
  type: "story" | "generated_image";
  userId: string;
  createdAt: string;
  imageUrl: string | null;
  title: string;
  subtitle: string;
  body: string;
}

export interface VisionResult {
  objects: string[];
  scene: string;
  mood: string;
  colors: string[];
}

export interface PhotoToStoryInput {
  imageUrl: string;
  genre: StoryGenre;
  length: StoryLength;
  ideaText?: string;
}

export interface PhotoToStoryOutput {
  vision: VisionResult;
  story: string;
  sceneDescription: string;
}

export interface TextToImageInput {
  prompt: string;
  style: ImageStyle;
  aspectRatio: AspectRatio;
}
