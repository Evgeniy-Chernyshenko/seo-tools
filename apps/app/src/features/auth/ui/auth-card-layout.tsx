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
          <Button leftSection={<YandexIcon />} variant="default">
            Яндекс
          </Button>
          <Button leftSection={<GoogleIcon />} variant="default">
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
