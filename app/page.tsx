import QRCodeGenerator from "@/components/qr-code-generator"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "QR Code Studio",
  description: "Create beautiful, customized QR codes with your own logo and styling",
}

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
        <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
          <header className="mb-10 text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 pb-1">
              QR Code Studio
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create stunning, customized QR codes for your business, products, or personal use
            </p>
          </header>

          <QRCodeGenerator />
        </div>
      </main>
    </ThemeProvider>
  )
}
