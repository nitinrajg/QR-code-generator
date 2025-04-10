import ClientLayout from '@/app/client-layout'
import { ThemeProvider } from '@/components/theme-provider'
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QR Code Generator',
  description: 'A modern QR code generator tool that helps you create custom QR codes easily',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClientLayout>
            {children}
            <SpeedInsights />
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
