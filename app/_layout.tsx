import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { useAuthStore } from "@/store/auth-store";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    async function requestPermission() {
      const asked = await AsyncStorage.getItem("notification_permission");
      if (!asked) {
        await AsyncStorage.setItem("notification_permission", "1");
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          await Notifications.requestPermissionsAsync();
        }
      }
    }
    requestPermission();
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { user } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";
    if (!user && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, segments]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen
            name="auth/login"
            options={{
              title: "Iniciar Sesión",
              headerShown: true,
              presentation: "card",
            }}
          />
          <Stack.Screen
            name="auth/register"
            options={{
              title: "Crear Cuenta",
              headerShown: true,
              presentation: "card",
            }}
          />
          <Stack.Screen
            name="supplement/[id]"
            options={{
              title: "Detalles del Suplemento",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="supplement/add"
            options={{
              title: "Añadir Suplemento",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="supplement/edit"
            options={{
              title: "Editar Suplemento",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="supplement/schedule"
            options={{
              title: "Programación",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="supplement/review"
            options={{
              title: "Escribir Reseña",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="supplement/replenish"
            options={{
              title: "Reponer Suplemento",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="ranking"
            options={{
              title: "Ranking",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="CommunityFeed"
            options={{
              title: "Feed",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="resumen"
            options={{
              title: "Resumen",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="admin-panel"
            options={{
              title: "Admin",
              headerShown: true,
            }}
          />
        </Stack>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
