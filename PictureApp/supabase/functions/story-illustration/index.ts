import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

interface StoryIllustrationRequest {
  sceneDescription: string;
  style: string;
}

const IMAGE_URL = "https://api.openai.com/v1/images/generations";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return jsonResponse({ error: "Missing OPENAI_API_KEY" }, 500);
    }

    const { sceneDescription, style } = (await req.json()) as StoryIllustrationRequest;
    if (!sceneDescription || !style) {
      return jsonResponse({ error: "Missing sceneDescription or style." }, 400);
    }

    const prompt = `Tao mot buc minh hoa mang tinh dien anh cho boi canh sau: ${sceneDescription}. Phong cach: ${style}. Chi tiet cao, mau sac hai hoa, bo cuc ro rang.`;

    const imageRes = await fetch(IMAGE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      }),
    });

    if (!imageRes.ok) {
      const body = await imageRes.text();
      return jsonResponse({ error: `Image generation failed: ${body}` }, 500);
    }

    const imageData = await imageRes.json();
    const imageBase64 = imageData?.data?.[0]?.b64_json;
    if (!imageBase64) {
      return jsonResponse({ error: "No image data returned." }, 500);
    }

    return jsonResponse({
      imageBase64,
      prompt,
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
