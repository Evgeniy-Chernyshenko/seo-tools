import { Logo } from "@/shared/ui/logo";
import { Anchor, AppShell, Center, Flex } from "@mantine/core";
import { ThemeSwitcher, useTheme } from "@/features/theme-switcher";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  const { isLight, isDark } = useTheme();

  const bgColor = isLight ? "gray.0" : undefined;

  return (
    <AppShell bg={bgColor} header={{ height: 60 }} withBorder={false}>
      <AppShell.Header px="md" bg={bgColor}>
        <Flex h="100%" align="center" justify="space-between" gap="md">
          <Anchor href="/">
            <Logo dark={isDark} />
          </Anchor>

          <ThemeSwitcher />
        </Flex>
      </AppShell.Header>

      <AppShell.Main>
        <Center mih="calc(100vh - var(--app-shell-header-height))" p="md">
          <Outlet />
        </Center>
      </AppShell.Main>
    </AppShell>
  );
};
