import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

interface PhotoToStoryRequest {
  imageUrl: string;
  genre: string;
  length: number;
  ideaText?: string;
}

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return jsonResponse({ error: "Missing OPENAI_API_KEY" }, 500);
    }

    const { imageUrl, genre, length, ideaText } =
      (await req.json()) as PhotoToStoryRequest;
    if (!imageUrl || !genre || !length) {
      return jsonResponse({ error: "Missing required payload fields." }, 400);
    }

    const visionPrompt = [
      "Analyze this image and respond with JSON only.",
      'Format: {"objects":["..."],"scene":"...","mood":"...","colors":["..."]}',
      "Keep it concise.",
    ].join(" ");

    const visionResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: visionPrompt },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!visionResponse.ok) {
      const errorBody = await visionResponse.text();
      return jsonResponse(
        { error: `Vision call failed: ${visionResponse.status} ${errorBody}` },
        500,
      );
    }

    const visionData = await visionResponse.json();
    const visionRaw = visionData?.choices?.[0]?.message?.content;
    const vision = JSON.parse(visionRaw);
    const sceneDescription = `Scene: ${vision.scene}. Mood: ${vision.mood}. Objects: ${(
      vision.objects ?? []
    ).join(", ")}. Colors: ${(vision.colors ?? []).join(", ")}.`;

    const ideaInstruction = ideaText?.trim()
      ? `\n\nUser story idea and constraints: ${ideaText.trim()}`
      : "";
    const storyPrompt =
      "Ban la nha van sang tao. Hay viet truyen bang tieng Viet tu nhien, de doc, giau cam xuc va de hieu voi nguoi Viet Nam. " +
      `Dua tren mo ta hinh anh sau day, hay viet mot truyen the loai ${genre} voi do dai khoang ${length} chu. Can bang bo cuc mo dau-than bai-ket bai ro rang.\n\n` +
      `Mo ta hinh anh: ${sceneDescription}` +
      ideaInstruction;

    const storyResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: storyPrompt,
          },
        ],
      }),
    });

    if (!storyResponse.ok) {
      const errorBody = await storyResponse.text();
      return jsonResponse(
        { error: `Story call failed: ${storyResponse.status} ${errorBody}` },
        500,
      );
    }

    const storyData = await storyResponse.json();
    const story = storyData?.choices?.[0]?.message?.content ?? "";

    return jsonResponse({
      vision,
      sceneDescription,
      story,
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
