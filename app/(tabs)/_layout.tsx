import React from "react";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="community" />
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="supplements" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
