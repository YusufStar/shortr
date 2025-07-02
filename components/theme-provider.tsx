"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Toaster } from "./ui/sonner"
import { setupUser } from "@/actions/setup-user"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {

  React.useEffect(() => {
    async function setup () {
      await setupUser()
    }

    setup()
  }, [])

  return <NextThemesProvider {...props}>
    {children}
    <Toaster richColors />
  </NextThemesProvider>
}