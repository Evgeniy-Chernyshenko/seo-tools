import type { DefaultMantineColor } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import type { ComponentType } from "react";

type NotificationType = "success" | "error";

const notificationConfig: Record<
  NotificationType,
  { icon: ComponentType; color?: DefaultMantineColor }
> = {
  success: { icon: IconCheck, color: "teal" },
  error: { icon: IconX, color: "red" },
};

export const showNotification = ({
  title,
  message,
  type = "success",
  id,
}: {
  title: string;
  message: string;
  type?: NotificationType;
  id?: string;
}) => {
  const { icon: IconComponent, color } = notificationConfig[type];

  notifications.show({
    title,
    message,
    position: "top-right",
    icon: <IconComponent />,
    color,
    id,
  });
};
