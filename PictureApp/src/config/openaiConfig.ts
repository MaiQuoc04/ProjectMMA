export const OPENAI_MODELS = {
  vision: "gpt-4o-mini",
  story: "gpt-4o",
  image: "gpt-image-1",
} as const;

export const OPENAI_FUNCTIONS = {
  photoToStory: "photo-to-story",
  textToImage: "text-to-image",
  storyIllustration: "story-illustration",
} as const;
