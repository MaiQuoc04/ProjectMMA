import { OPENAI_FUNCTIONS } from "@/config/openaiConfig";
import { supabase, supabaseKey } from "@/config/supabaseClient";
import { PhotoToStoryInput, PhotoToStoryOutput, TextToImageInput } from "@/types";
import { withTimeout } from "@/utils/apiHelpers";

const buildFunctionError = async (
  fallback: string,
  error: unknown,
): Promise<Error> => {
  const err = error as { context?: Response; message?: string } | undefined;
  if (err?.context?.status === 401) {
    return new Error(
      "Unauthorized calling Edge Function (401). Verify EXPO_PUBLIC_SUPABASE_ANON_KEY, redeploy functions if needed, and sign in again.",
    );
  }
  if (err?.context) {
    try {
      const bodyText = await err.context.text();
      const parsed = JSON.parse(bodyText) as { error?: string };
      if (parsed?.error) {
        return new Error(parsed.error);
      }
      if (bodyText) {
        return new Error(bodyText);
      }
    } catch {
      // no-op, fallback below
    }
  }
  return new Error(err?.message || fallback);
};

export const openaiService = {
  getInvokeHeaders: () => {
    // Use anon key consistently for Edge Function gateway auth.
    // This avoids stale/invalid user access tokens causing 401 on web.
    return {
      Authorization: `Bearer ${supabaseKey}`,
      apikey: supabaseKey,
    };
  },

  photoToStory: async (payload: PhotoToStoryInput) => {
    const headers = openaiService.getInvokeHeaders();
    const response = await withTimeout(
      supabase.functions.invoke<PhotoToStoryOutput>(OPENAI_FUNCTIONS.photoToStory, {
        body: payload,
        headers,
      }),
      90000,
    );

    if (response.error || !response.data) {
      throw await buildFunctionError("No story result returned.", response.error);
    }

    return response.data;
  },

  textToImage: async (payload: TextToImageInput) => {
    const headers = openaiService.getInvokeHeaders();
    const response = await withTimeout(
      supabase.functions.invoke<{ imageBase64: string; revisedPrompt: string }>(
        OPENAI_FUNCTIONS.textToImage,
        {
          body: payload,
          headers,
        },
      ),
      120000,
    );

    if (response.error || !response.data) {
      throw await buildFunctionError("No image result returned.", response.error);
    }

    return response.data;
  },

  storyIllustration: async (sceneDescription: string, style: string) => {
    const headers = openaiService.getInvokeHeaders();
    const response = await withTimeout(
      supabase.functions.invoke<{ imageBase64: string; prompt: string }>(
        OPENAI_FUNCTIONS.storyIllustration,
        {
          body: { sceneDescription, style },
          headers,
        },
      ),
      120000,
    );

    if (response.error || !response.data) {
      throw await buildFunctionError("No illustration returned.", response.error);
    }

    return response.data;
  },
};
