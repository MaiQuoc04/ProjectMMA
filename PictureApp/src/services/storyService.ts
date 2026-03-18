import { openaiService } from "@/services/openaiService";
import { supabaseService } from "@/services/supabaseService";
import { uploadBase64Image, uploadImageFromUri } from "@/utils/imageUpload";
import {
  AspectRatio,
  GeneratedImage,
  ImageStyle,
  PhotoToStoryOutput,
  StoryGenre,
  StoryLength,
} from "@/types";

export const storyService = {
  createStoryFromPhoto: async (params: {
    userId: string;
    imageUri: string;
    genre: StoryGenre;
    length: StoryLength;
    ideaText?: string;
  }) => {
    const upload = await uploadImageFromUri(
      params.imageUri,
      "images-original",
      params.userId,
    );

    const aiResult = await openaiService.photoToStory({
      imageUrl: upload.publicUrl,
      genre: params.genre,
      length: params.length,
      ideaText: params.ideaText,
    });

    const story = await supabaseService.saveStory({
      userId: params.userId,
      imageUrl: upload.publicUrl,
      storyText: aiResult?.story ?? "",
      genre: params.genre,
    });

    return { aiResult, story };
  },

  regenerateStory: async (params: {
    imageUrl: string;
    genre: StoryGenre;
    length: StoryLength;
  }) => {
    const aiResult = await openaiService.photoToStory({
      imageUrl: params.imageUrl,
      genre: params.genre,
      length: params.length,
    });
    return aiResult as PhotoToStoryOutput;
  },

  generateIllustrationForStory: async (params: {
    userId: string;
    storyId: string;
    sceneDescription: string;
    style: string;
  }) => {
    const aiResult = await openaiService.storyIllustration(
      params.sceneDescription,
      params.style,
    );

    const upload = await uploadBase64Image(
      aiResult.imageBase64,
      "images-generated",
      params.userId,
      "png",
    );
    const illustration = await supabaseService.saveIllustration({
      storyId: params.storyId,
      imageUrl: upload.publicUrl,
      prompt: aiResult.prompt,
      style: params.style,
    });

    return illustration;
  },

  textToImageAndSave: async (params: {
    userId: string;
    prompt: string;
    style: ImageStyle;
    aspectRatio: AspectRatio;
  }) => {
    const aiResult = await openaiService.textToImage({
      prompt: params.prompt,
      style: params.style,
      aspectRatio: params.aspectRatio,
    });

    const upload = await uploadBase64Image(
      aiResult.imageBase64,
      "images-generated",
      params.userId,
      "png",
    );
    const dbRecord = await supabaseService.saveGeneratedImage({
      userId: params.userId,
      imageUrl: upload.publicUrl,
      prompt: params.prompt,
      revisedPrompt: aiResult.revisedPrompt,
      style: params.style,
      aspectRatio: params.aspectRatio,
    });

    return {
      imageUrl: upload.publicUrl,
      revisedPrompt: aiResult.revisedPrompt,
      generatedImage: dbRecord as GeneratedImage,
    };
  },
};
