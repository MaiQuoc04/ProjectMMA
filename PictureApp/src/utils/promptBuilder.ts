import { AspectRatio, ImageStyle, StoryGenre, StoryLength } from "@/types";

export const buildStoryPrompt = (
  description: string,
  genre: StoryGenre,
  length: StoryLength,
) =>
  `You are a creative writer. Based on the following image description write a ${genre} story with ${length} words. Make the story engaging and vivid.\n\nImage description: ${description}`;

export const buildIllustrationPrompt = (
  sceneDescription: string,
  style: ImageStyle,
) =>
  `Create a cinematic illustration of the following scene: ${sceneDescription}. Style: ${style}. High detail.`;

export const buildImagePrompt = (
  prompt: string,
  style: ImageStyle,
  aspectRatio: AspectRatio,
) =>
  `Generate a high-quality ${style} image. Aspect ratio: ${aspectRatio}. Scene request: ${prompt}`;
