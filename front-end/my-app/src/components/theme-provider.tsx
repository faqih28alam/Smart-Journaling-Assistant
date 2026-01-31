// theme-provider.tsx
// src/components/theme-provider.tsx

import { ThemeProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export function ThemeProviderWrapper(props: ThemeProviderProps) {
    return <ThemeProvider {...props}>{props.children}</ThemeProvider>
}