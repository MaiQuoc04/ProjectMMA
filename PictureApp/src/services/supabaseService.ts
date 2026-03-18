import { supabase } from "@/config/supabaseClient";
import {
  AspectRatio,
  CommunityItem,
  GeneratedImage,
  ImageStyle,
  Illustration,
  Story,
  StoryGenre,
  StoryWithIllustration,
} from "@/types";

export const supabaseService = {
  saveStory: async (payload: {
    userId: string;
    imageUrl: string | null;
    storyText: string;
    genre: StoryGenre;
  }) => {
    const { data, error } = await supabase
      .from("stories")
      .insert({
        user_id: payload.userId,
        image_url: payload.imageUrl,
        story_text: payload.storyText,
        genre: payload.genre,
      })
      .select("*")
      .single<Story>();

    if (error) {
      throw error;
    }
    return data;
  },

  updateStory: async (storyId: string, storyText: string) => {
    const { error } = await supabase
      .from("stories")
      .update({ story_text: storyText })
      .eq("id", storyId);
    if (error) {
      throw error;
    }
  },

  saveIllustration: async (payload: {
    storyId: string;
    imageUrl: string;
    prompt: string;
    style: string;
  }) => {
    const { data, error } = await supabase
      .from("illustrations")
      .insert({
        story_id: payload.storyId,
        image_url: payload.imageUrl,
        prompt: payload.prompt,
        style: payload.style,
      })
      .select("*")
      .single<Illustration>();

    if (error) {
      throw error;
    }
    return data;
  },

  saveGeneratedImage: async (payload: {
    userId: string;
    imageUrl: string;
    prompt: string;
    revisedPrompt: string | null;
    style: ImageStyle;
    aspectRatio: AspectRatio;
  }) => {
    const { data, error } = await supabase
      .from("generated_images")
      .insert({
        user_id: payload.userId,
        image_url: payload.imageUrl,
        prompt: payload.prompt,
        revised_prompt: payload.revisedPrompt,
        style: payload.style,
        aspect_ratio: payload.aspectRatio,
      })
      .select("*")
      .single<GeneratedImage>();

    if (error) {
      throw error;
    }
    return data;
  },

  getStoriesByUser: async (userId: string) => {
    const { data: stories, error } = await supabase
      .from("stories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .returns<Story[]>();

    if (error) {
      throw error;
    }

    const storyIds = stories.map((story) => story.id);
    if (!storyIds.length) {
      return [] as StoryWithIllustration[];
    }

    const { data: illustrations, error: illError } = await supabase
      .from("illustrations")
      .select("*")
      .in("story_id", storyIds)
      .returns<Illustration[]>();

    if (illError) {
      throw illError;
    }

    return stories.map((story) => ({
      ...story,
      illustration: illustrations.find((ill) => ill.story_id === story.id) ?? null,
    }));
  },

  getGeneratedImagesByUser: async (userId: string) => {
    const { data, error } = await supabase
      .from("generated_images")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .returns<GeneratedImage[]>();

    if (error) {
      throw error;
    }
    return data;
  },

  deleteStory: async (storyId: string) => {
    const { error } = await supabase.from("stories").delete().eq("id", storyId);
    if (error) {
      throw error;
    }
  },

  deleteGeneratedImage: async (generatedImageId: string) => {
    const { error } = await supabase
      .from("generated_images")
      .delete()
      .eq("id", generatedImageId);
    if (error) {
      throw error;
    }
  },

  getCommunityFeed: async () => {
    const { data: stories, error: storyError } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(25)
      .returns<Story[]>();

    if (storyError) {
      throw storyError;
    }

    const { data: generatedImages, error: generatedError } = await supabase
      .from("generated_images")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(25)
      .returns<GeneratedImage[]>();

    if (generatedError) {
      throw generatedError;
    }

    const storyItems: CommunityItem[] = stories.map((story) => ({
      id: `story-${story.id}`,
      type: "story",
      userId: story.user_id,
      createdAt: story.created_at,
      imageUrl: story.image_url,
      title: `${story.genre} Story`,
      subtitle: `By ${story.user_id.slice(0, 8)}...`,
      body: story.story_text,
    }));

    const generatedImageItems: CommunityItem[] = generatedImages.map((item) => ({
      id: `generated-${item.id}`,
      type: "generated_image",
      userId: item.user_id,
      createdAt: item.created_at,
      imageUrl: item.image_url,
      title: `${item.style} Image`,
      subtitle: `By ${item.user_id.slice(0, 8)}...`,
      body: item.prompt,
    }));

    return [...storyItems, ...generatedImageItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },
};
