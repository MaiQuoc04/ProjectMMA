# StorySnap

StorySnap is an AI-powered Expo mobile app that:

- Converts photos into short stories with genre/length controls.
- Generates images from text prompts with style/aspect ratio controls.
- Saves user content in Supabase (Postgres + Storage).

https://docs.google.com/spreadsheets/d/1cUC-s8jnU6zzkSQdEpjtBPy7X6XfIpTbmNtLl1Mo3hs/edit?usp=sharing

## Tech Stack

- React Native (Expo) + TypeScript
- NativeWind
- Zustand
- Supabase Auth, Postgres, Storage, Edge Functions
- OpenAI APIs (`gpt-4o-mini` vision, `gpt-4o`, `gpt-image-1`)

## Project Structure

```txt
src/
  components/
    StoryCard.tsx
    GenreSelector.tsx
    ImagePreview.tsx
    PromptInput.tsx
    LoadingAnimation.tsx
  screens/
    AuthScreen.tsx
    HomeScreen.tsx
    CreateScreen.tsx
    GenreSelectionScreen.tsx
    LoadingScreen.tsx
    StoryResultScreen.tsx
    TextToImageScreen.tsx
    LibraryScreen.tsx
    StoryDetailScreen.tsx
    ProfileScreen.tsx
  services/
    openaiService.ts
    supabaseService.ts
    storyService.ts
  store/
    useStoryStore.ts
    useUserStore.ts
  utils/
    promptBuilder.ts
    imageUpload.ts
    apiHelpers.ts
  config/
    supabaseClient.ts
    openaiConfig.ts
  navigation/
    AppNavigator.tsx
    types.ts
  types/
    index.ts

supabase/
  migrations/
    001_init.sql
    002_storage.sql
  functions/
    _shared/cors.ts
    photo-to-story/index.ts
    text-to-image/index.ts
    story-illustration/index.ts
```

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Setup

1. Create a Supabase project.
2. Run SQL migrations:
   - `supabase/migrations/001_init.sql`
   - `supabase/migrations/002_storage.sql`
   - `supabase/migrations/003_generated_images_and_community.sql`
3. Ensure Email/Password auth is enabled in Supabase Auth settings.
4. Deploy edge functions:

```bash
supabase functions deploy photo-to-story
supabase functions deploy text-to-image
supabase functions deploy story-illustration
```

5. Set OpenAI key in Supabase:

```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key
```

## API Flow

### Photo -> Story

1. User captures/selects photo.
2. App uploads photo to `images-original`.
3. App calls `photo-to-story` edge function.
4. Edge function:
   - Vision extraction (`objects`, `scene`, `mood`, `colors`)
   - Story generation using selected genre + length
5. App saves story to `stories`.

### Text -> Image

1. User enters prompt, style, ratio.
2. App calls `text-to-image` edge function.
3. Edge function enhances prompt and generates image.
4. App uploads generated image to `images-generated`.
5. App saves metadata to `generated_images` table for library/community usage.

## Run Locally

```bash
npm install
npm run start
```

Optional:

```bash
npm run android
npm run ios
npm run web
npm run typecheck
```

## Implemented Screens

- `HomeScreen` (personal feed for MVP)
- `CreateScreen` (camera/upload + genre/length)
- `GenreSelectionScreen`
- `LoadingScreen` (rotating loading text)
- `StoryResultScreen` (regenerate, edit, save, share, illustration generation)
- `TextToImageScreen`
- `LibraryScreen`
- `StoryDetailScreen`
- `ProfileScreen`
- `AuthScreen`

## Notes for Production

- OpenAI keys are never stored in the mobile app. Calls are proxied through Supabase Edge Functions.
- Storage uploads are user-scoped by folder path and protected with policies.
- RLS policies are enabled for all core tables.
