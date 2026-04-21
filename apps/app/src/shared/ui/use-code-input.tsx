import { Button, Flex, PinInput, Stack } from "@mantine/core";
import { useState } from "react";

export const useCodeInput = ({
  getCodeInputProps,
}: {
  getCodeInputProps: () => {
    length: number;
    disabled: boolean;
    onEntry: (code: string) => void;
    onResend: VoidFunction;
    resending: boolean;
  };
}) => {
  const [key, setKey] = useState(() => crypto.randomUUID());
  const [error, setError] = useState(false);

  const handleChange = () => {
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setKey(crypto.randomUUID());
  };

  const resetInput = () => {
    setError(false);
    setKey(crypto.randomUUID());
  };

  return {
    resetInput,
    handleError,
    render: () => {
      const { disabled, length, onEntry, onResend, resending } =
        getCodeInputProps();
      return (
        <Stack gap="md">
          <PinInput
            key={key}
            size="md"
            placeholder=""
            type="number"
            autoFocus
            onChange={handleChange}
            error={error}
            disabled={disabled}
            length={length}
            onComplete={onEntry}
          />

          <Flex justify="center">
            <Button
              variant="transparent"
              onClick={onResend}
              loading={resending}
            >
              Отправить код повторно
            </Button>
          </Flex>
        </Stack>
      );
    },
  };
};
