import { useComputedColorScheme } from "@mantine/core";

export const useTheme = () => {
  const colorScheme = useComputedColorScheme();

  const isLight = colorScheme === "light";
  const isDark = !isLight;

  return { theme: colorScheme, isLight, isDark };
};
