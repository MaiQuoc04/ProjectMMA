import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

interface TextToImageRequest {
  prompt: string;
  style: string;
  aspectRatio: string;
}

const CHAT_URL = "https://api.openai.com/v1/chat/completions";
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

    const { prompt, style, aspectRatio } = (await req.json()) as TextToImageRequest;
    if (!prompt || !style || !aspectRatio) {
      return jsonResponse({ error: "Missing required payload fields." }, 400);
    }

    const enhancePrompt =
      `Ban la prompt engineer cho tao anh. Hay viet lai prompt sau de tao anh dep hon, giu nguyen y tuong goc va doi tuong chinh:\n"${prompt}"\n` +
      `Phong cach: ${style}. Ti le khung hinh: ${aspectRatio}. ` +
      "Neu prompt goc bang tieng Viet thi giu tieng Viet. Tra ve mot dong van ban thuong, khong markdown, khong giai thich.";

    const enhanceRes = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: enhancePrompt }],
      }),
    });

    if (!enhanceRes.ok) {
      const body = await enhanceRes.text();
      return jsonResponse({ error: `Prompt enhancement failed: ${body}` }, 500);
    }

    const enhancedData = await enhanceRes.json();
    const revisedPrompt = enhancedData?.choices?.[0]?.message?.content ?? prompt;

    const sizeMap: Record<string, string> = {
      "1:1": "1024x1024",
      "4:3": "1536x1024",
      "9:16": "1024x1536",
    };

    const imageRes = await fetch(IMAGE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: revisedPrompt,
        size: sizeMap[aspectRatio] ?? "1024x1024",
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
      revisedPrompt,
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
