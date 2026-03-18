import { create } from "zustand";
import {
  AspectRatio,
  ImageStyle,
  StoryGenre,
  StoryLength,
  StoryWithIllustration,
} from "@/types";

interface StoryState {
  selectedImageUri: string | null;
  selectedGenre: StoryGenre;
  selectedLength: StoryLength;
  generatedStory: string;
  sceneDescription: string;
  generatedImageUrl: string | null;
  textPrompt: string;
  selectedStyle: ImageStyle;
  selectedAspectRatio: AspectRatio;
  libraryStories: StoryWithIllustration[];
  isGenerating: boolean;
  setSelectedImageUri: (uri: string | null) => void;
  setGenre: (genre: StoryGenre) => void;
  setLength: (length: StoryLength) => void;
  setGeneratedStory: (story: string) => void;
  setSceneDescription: (description: string) => void;
  setGeneratedImageUrl: (url: string | null) => void;
  setTextPrompt: (prompt: string) => void;
  setStyle: (style: ImageStyle) => void;
  setAspectRatio: (aspectRatio: AspectRatio) => void;
  setLibraryStories: (stories: StoryWithIllustration[]) => void;
  setGenerating: (value: boolean) => void;
  resetCurrentFlow: () => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  selectedImageUri: null,
  selectedGenre: "Adventure",
  selectedLength: 1000,
  generatedStory: "",
  sceneDescription: "",
  generatedImageUrl: null,
  textPrompt: "",
  selectedStyle: "Realistic",
  selectedAspectRatio: "1:1",
  libraryStories: [],
  isGenerating: false,

  setSelectedImageUri: (selectedImageUri) => set({ selectedImageUri }),
  setGenre: (selectedGenre) => set({ selectedGenre }),
  setLength: (selectedLength) => set({ selectedLength }),
  setGeneratedStory: (generatedStory) => set({ generatedStory }),
  setSceneDescription: (sceneDescription) => set({ sceneDescription }),
  setGeneratedImageUrl: (generatedImageUrl) => set({ generatedImageUrl }),
  setTextPrompt: (textPrompt) => set({ textPrompt }),
  setStyle: (selectedStyle) => set({ selectedStyle }),
  setAspectRatio: (selectedAspectRatio) => set({ selectedAspectRatio }),
  setLibraryStories: (libraryStories) => set({ libraryStories }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  resetCurrentFlow: () =>
    set({
      selectedImageUri: null,
      generatedStory: "",
      sceneDescription: "",
      generatedImageUrl: null,
      textPrompt: "",
      isGenerating: false,
    }),
}));
