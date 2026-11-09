'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

declare global {
  // eslint-disable-next-line no-var
  var __next_themes_script_suppressed__: boolean | undefined;
}

// Suppress the React 19 false-positive warning for next-themes inline script in development
if (
  process.env.NODE_ENV === 'development' &&
  !globalThis.__next_themes_script_suppressed__
) {
  globalThis.__next_themes_script_suppressed__ = true;
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    const firstArg = args[0];
    if (
      typeof firstArg === 'string' &&
      (firstArg.includes('Encountered a script tag') ||
        firstArg.includes('Scripts inside React components are never executed'))
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}


