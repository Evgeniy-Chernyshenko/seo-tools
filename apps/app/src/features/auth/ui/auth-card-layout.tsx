import {
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useTheme } from "../../theme-switcher";
import { YandexIcon } from "@/shared/ui/icons/yandex-icon";
import { GoogleIcon } from "@/shared/ui/icons/google-icon";
import type { ReactNode } from "react";
import { useOAuth } from "../model/use-oauth";

export const AuthCardLayout = ({
  title,
  description,
  form,
  additional,
}: {
  title: string;
  description?: ReactNode;
  form: ReactNode;
  additional: ReactNode;
}) => {
  const { isLight, isDark } = useTheme();
  const oAuth = useOAuth();

  return (
    <Paper
      maw={360}
      w="100%"
      p="lg"
      shadow={isLight ? "md" : undefined}
      withBorder={isDark}
      radius="lg"
    >
      <Stack>
        <Title ta="center" size="h3">
          {title}
        </Title>

        {description && (
          <Text c="gray" size="sm" ta="center">
            {description}
          </Text>
        )}

        {form}

        <Divider label="Или войти через" />

        <Group justify="center">
          <Button
            leftSection={<YandexIcon />}
            variant="default"
            onClick={() => oAuth.mutate("yandex")}
            loading={oAuth.isPendingProvider("yandex")}
          >
            Яндекс
          </Button>

          <Button
            leftSection={<GoogleIcon />}
            variant="default"
            onClick={() => oAuth.mutate("google")}
            loading={oAuth.isPendingProvider("google")}
          >
            Google
          </Button>
        </Group>

        <Text c="gray" ta="center" size="sm">
          {additional}
        </Text>
      </Stack>
    </Paper>
  );
};
