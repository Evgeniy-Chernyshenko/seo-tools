import type { PropsWithChildren } from "react";
import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/query-client";
import { theme } from "./theme";
import { Notifications } from "@mantine/notifications";

export function Providers({ children }: PropsWithChildren) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

      <Notifications />
    </MantineProvider>
  );
}
