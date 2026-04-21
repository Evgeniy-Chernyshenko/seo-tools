import { Group, Popover, Progress, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState, type ReactNode } from "react";

type Rule = { test: (password: string) => boolean; errorText: string };

export const PasswordStrengthMeterPopover = ({
  password,
  rules,
  children,
}: {
  password: string;
  rules: Rule[];
  children: ReactNode;
}) => {
  const [popoverOpened, setPopoverOpened] = useState(false);

  const strength = getStrength({ password, rules });
  const isStrength = strength === 100;
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  return (
    <Popover
      opened={popoverOpened && !isStrength}
      position="bottom"
      width="target"
      transitionProps={{
        transition: "pop",
        exitDelay: isStrength ? 500 : undefined,
      }}
    >
      <Popover.Target>
        <div
          onFocusCapture={() => setPopoverOpened(true)}
          onBlurCapture={() => setPopoverOpened(false)}
        >
          {children}
        </div>
      </Popover.Target>

      <Popover.Dropdown>
        <Progress color={color} value={strength} size={5} mb="xs" />

        {rules.map((rule) => (
          <PasswordRequirement
            key={rule.errorText}
            label={rule.errorText}
            meets={rule.test(password)}
          />
        ))}
      </Popover.Dropdown>
    </Popover>
  );
};

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  const IconComponent = meets ? IconCheck : IconX;
  const color = meets ? "teal" : "red";

  return (
    <Group gap="xs" mt={5} align="center" c={color} wrap="nowrap">
      <IconComponent size={14} />

      <Text size="sm" c={color}>
        {label}
      </Text>
    </Group>
  );
}

function getStrength({ password, rules }: { password: string; rules: Rule[] }) {
  const passed = rules.filter((rule) => rule.test(password)).length;

  return (passed / rules.length) * 100;
}
