import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSunHigh } from "@tabler/icons-react";

export const ThemeSwitcher = () => {
  const { toggleColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme();

  const nextColorScheme = colorScheme === "light" ? "dark" : "light";
  const IconComponent = nextColorScheme === "light" ? IconSunHigh : IconMoon;

  return (
    <ActionIcon
      onClick={() => {
        toggleColorScheme();
      }}
      variant="default"
      size="lg"
    >
      <IconComponent size={22} stroke={1.5} />
    </ActionIcon>
  );
};
