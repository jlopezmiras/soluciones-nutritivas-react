
"use client";

import type { IconButtonProps } from "@chakra-ui/react";
import { IconButton, Skeleton, chakra } from "@chakra-ui/react";
import * as React from "react";
import { LuMoon, LuSun } from "react-icons/lu";

export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

// Use Chakra's built-in color mode hook
import { useColorMode as chakraUseColorMode } from "@chakra-ui/react";

export function useColorMode(): UseColorModeReturn {
  const { colorMode, toggleColorMode, setColorMode } = chakraUseColorMode();
  return { colorMode: colorMode as ColorMode, setColorMode, toggleColorMode };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? <LuMoon /> : <LuSun />;
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode();
  return (
    <IconButton
      onClick={toggleColorMode}
      variant="ghost"
      aria-label="Toggle color mode"
      size="sm"
      ref={ref}
      {...props}
      icon={<ColorModeIcon />}
    />
  );
});

// Replace Span with chakra.span
export const LightMode = chakra.span;
export const DarkMode = chakra.span;
