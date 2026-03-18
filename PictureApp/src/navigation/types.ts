import { NavigatorScreenParams } from "@react-navigation/native";
import { StoryWithIllustration } from "@/types";

export type MainTabParamList = {
  Create: undefined;
  TextToImage: undefined;
  Library: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  GenreSelection: undefined;
  Loading: undefined;
  StoryResult: { storyId: string; imageUrl: string | null } | undefined;
  StoryDetail: { story: StoryWithIllustration };
};
