import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList, MainTabParamList } from "@/navigation/types";
import { CreateScreen } from "@/screens/CreateScreen";
import { TextToImageScreen } from "@/screens/TextToImageScreen";
import { LibraryScreen } from "@/screens/LibraryScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { StoryResultScreen } from "@/screens/StoryResultScreen";
import { StoryDetailScreen } from "@/screens/StoryDetailScreen";
import { GenreSelectionScreen } from "@/screens/GenreSelectionScreen";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { AuthScreen } from "@/screens/AuthScreen";
import { useUserStore } from "@/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabParamList>();

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ICONS: Record<string, { active: IoniconName; inactive: IoniconName }> = {
  Create: { active: "camera", inactive: "camera-outline" },
  TextToImage: { active: "image", inactive: "image-outline" },
  Library: { active: "library", inactive: "library-outline" },
  Profile: { active: "person-circle", inactive: "person-circle-outline" },
};

const MainTabNavigator = () => (
  <MainTabs.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: "#8b5cf6",
      tabBarInactiveTintColor: "#475569",
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: "600",
        marginBottom: 2,
      },
      tabBarStyle: {
        height: 72,
        paddingBottom: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#1e293b",
        backgroundColor: "#0f172a",
      },
      tabBarIcon: ({ focused, color, size }) => {
        const icons = TAB_ICONS[route.name];
        const iconName = focused ? icons?.active : icons?.inactive;
        return iconName ? <Ionicons name={iconName} size={size} color={color} /> : null;
      },
    })}
  >
    <MainTabs.Screen name="Create" component={CreateScreen} options={{ title: "Create" }} />
    <MainTabs.Screen
      name="TextToImage"
      component={TextToImageScreen}
      options={{ title: "Imagine" }}
    />
    <MainTabs.Screen name="Library" component={LibraryScreen} options={{ title: "Library" }} />
    <MainTabs.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
  </MainTabs.Navigator>
);

export const AppNavigator = () => {
  const user = useUserStore((state) => state.user);
  const isAuthLoading = useUserStore((state) => state.isAuthLoading);

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0f172a" },
        headerTintColor: "#f1f5f9",
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: "700", color: "#f1f5f9" },
      }}
    >
      {!user ? (
        <RootStack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <RootStack.Screen
            name="MainTabs"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="GenreSelection"
            component={GenreSelectionScreen}
            options={{
              title: "Story Settings",
              headerStyle: { backgroundColor: "#0f172a" },
              headerTintColor: "#f1f5f9",
            }}
          />
          <RootStack.Screen
            name="Loading"
            component={LoadingScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <RootStack.Screen
            name="StoryResult"
            component={StoryResultScreen}
            options={{
              title: "Story Result",
              headerStyle: { backgroundColor: "#0f172a" },
              headerTintColor: "#f1f5f9",
            }}
          />
          <RootStack.Screen
            name="StoryDetail"
            component={StoryDetailScreen}
            options={{
              title: "Story Detail",
              headerStyle: { backgroundColor: "#0f172a" },
              headerTintColor: "#f1f5f9",
            }}
          />
        </>
      )}
    </RootStack.Navigator>
  );
};
