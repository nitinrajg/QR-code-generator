"use client"

import { useState, useRef, type ChangeEvent, useEffect } from "react"
import { QRCode } from "react-qrcode-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import {
  Download,
  Upload,
  Smartphone,
  Palette,
  LinkIcon,
  ImageIcon,
  Settings,
  Info,
  Check,
  History,
  MoonStar,
  Sun,
  Laptop,
} from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("https://example.com")
  const [logoUrl, setLogoUrl] = useState("")
  const [logoShape, setLogoShape] = useState<"square" | "circle">("circle")
  const [qrSize, setQrSize] = useState(240)
  const [bgColor, setBgColor] = useState("#FFFFFF")
  const [fgColor, setFgColor] = useState("#000000")
  const [logoSize, setLogoSize] = useState(60)
  const [isGenerating, setIsGenerating] = useState(false)
  const [inputType, setInputType] = useState<"url" | "file">("url")
  const [showPreview, setShowPreview] = useState(false)
  const [history, setHistory] = useState<Array<{ id: string; url: string; timestamp: number }>>([])
  const [showHistory, setShowHistory] = useState(false)
  const [dotStyle, setDotStyle] = useState<"dots" | "rounded" | "classy" | "square">("rounded")
  const [eyeRadius, setEyeRadius] = useState(8)

  const qrRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoFileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("qrHistory")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Failed to parse history", e)
      }
    }
  }, [])

  const saveToHistory = () => {
    const newEntry = {
      id: Math.random().toString(36).substring(2, 9),
      url,
      timestamp: Date.now(),
    }
    const updatedHistory = [newEntry, ...history].slice(0, 10) // Keep only last 10 items
    setHistory(updatedHistory)
    localStorage.setItem("qrHistory", JSON.stringify(updatedHistory))
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate loading
    setTimeout(() => {
      setIsGenerating(false)
      saveToHistory()
      toast({
        title: "QR Code Generated",
        description: "Your QR code has been created successfully.",
        duration: 3000,
      })
    }, 800)
  }

  const handleDownload = () => {
    if (!qrRef.current) return

    const canvas = qrRef.current.querySelector("canvas")
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "qr-code-studio.png"
    link.href = canvas.toDataURL("image/png")
    link.click()

    toast({
      title: "Download Complete",
      description: "Your QR code has been downloaded.",
      duration: 3000,
    })
  }

  const handleLogoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogoUrl(event.target.result as string)
        toast({
          title: "Logo Uploaded",
          description: "Your logo has been added to the QR code.",
          duration: 3000,
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleContentFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // For small files, we can encode them directly as data URLs
    if (file.size <= 500 * 1024) {
      // 500KB limit
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setUrl(event.target.result as string)
          toast({
            title: "File Added",
            description: `${file.name} has been encoded in your QR code.`,
            duration: 3000,
          })
        }
      }
      reader.readAsDataURL(file)
    } else {
      // For larger files, we'll just use the file name as a placeholder
      setUrl(`File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`)
      toast({
        title: "Large File Detected",
        description: "Large files need to be hosted online to be accessible via QR code.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const loadFromHistory = (historyItem: { url: string }) => {
    setUrl(historyItem.url)
    setShowHistory(false)
    toast({
      title: "Loaded from History",
      description: "Previous QR code settings restored.",
      duration: 3000,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPreview(!showPreview)}
                  className={showPreview ? "bg-primary/10" : ""}
                >
                  <Smartphone className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle phone preview</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowHistory(!showHistory)}
                  className={showHistory ? "bg-primary/10" : ""}
                >
                  <History className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View history</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme("light")}
                  className={theme === "light" ? "bg-primary/10" : ""}
                >
                  <Sun className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Light mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme("dark")}
                  className={theme === "dark" ? "bg-primary/10" : ""}
                >
                  <MoonStar className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dark mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme("system")}
                  className={theme === "system" ? "bg-primary/10" : ""}
                >
                  <Laptop className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>System preference</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <History className="mr-2 h-5 w-5" />
                  Recent QR Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {history.map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        className="justify-start h-auto py-2 px-3 text-left"
                        onClick={() => loadFromHistory(item)}
                      >
                        <div className="truncate flex-1">
                          <span className="font-medium">
                            {item.url.substring(0, 30)}
                            {item.url.length > 30 ? "..." : ""}
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No history yet. Generate a QR code to see it here.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`grid gap-6 ${showPreview ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        <Card className="md:col-span-1 border-primary/10 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              QR Code Settings
            </CardTitle>
            <CardDescription>Customize your QR code appearance and content</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content" className="flex items-center">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger value="design" className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Design</span>
                </TabsTrigger>
                <TabsTrigger value="logo" className="flex items-center">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Logo</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>QR Code Content</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Enter a URL or upload a small file to encode in your QR code.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Tabs defaultValue="url" onValueChange={(value) => setInputType(value as "url" | "file")}>
                    <TabsList className="grid w-full grid-cols-2 mb-2">
                      <TabsTrigger value="url">URL</TabsTrigger>
                      <TabsTrigger value="file">File</TabsTrigger>
                    </TabsList>

                    <TabsContent value="url" className="space-y-2">
                      <Input
                        id="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="transition-all duration-200"
                      />
                    </TabsContent>

                    <TabsContent value="file" className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input ref={fileInputRef} type="file" className="hidden" onChange={handleContentFileChange} />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Select File
                        </Button>
                      </div>
                      {inputType === "file" && url && url.startsWith("File:") && (
                        <p className="text-sm text-muted-foreground">{url}</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dotStyle">Dot Style</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Change the appearance of the QR code dots</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {(["dots", "rounded", "classy", "square"] as const).map((style) => (
                      <Button
                        key={style}
                        type="button"
                        variant={dotStyle === style ? "default" : "outline"}
                        className="h-10 px-2 text-xs capitalize"
                        onClick={() => setDotStyle(style)}
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="eyeRadius">Corner Style</Label>
                    <span className="text-sm text-muted-foreground">{eyeRadius}</span>
                  </div>
                  <Slider
                    id="eyeRadius"
                    min={0}
                    max={20}
                    step={1}
                    value={[eyeRadius]}
                    onValueChange={(value) => setEyeRadius(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="qrSize">QR Code Size</Label>
                    <span className="text-sm text-muted-foreground">{qrSize}px</span>
                  </div>
                  <Slider
                    id="qrSize"
                    min={120}
                    max={400}
                    step={10}
                    value={[qrSize]}
                    onValueChange={(value) => setQrSize(value[0])}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bgColor">Background</Label>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <Input
                          id="bgColor"
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                      </div>
                      <Input
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fgColor">Foreground</Label>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <Input
                          id="fgColor"
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                      </div>
                      <Input
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-1 uppercase"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="logo" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Logo Image</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add a logo to the center of your QR code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Tabs defaultValue="upload">
                    <TabsList className="grid w-full grid-cols-2 mb-2">
                      <TabsTrigger value="upload">Upload</TabsTrigger>
                      <TabsTrigger value="url">URL</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          ref={logoFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoFileChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => logoFileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="url" className="space-y-2">
                      <Input
                        placeholder="https://your-logo-url.com/logo.png"
                        value={logoUrl.startsWith("data:") ? "" : logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                      />
                    </TabsContent>
                  </Tabs>

                  {logoUrl && (
                    <div className="flex items-center gap-3 mt-3 p-3 bg-muted rounded-md">
                      <div
                        className={`w-12 h-12 border overflow-hidden ${logoShape === "circle" ? "rounded-full" : "rounded-md"}`}
                      >
                        <img
                          src={logoUrl || "/placeholder.svg"}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Logo uploaded</p>
                        <p className="text-xs text-muted-foreground">
                          {logoUrl.startsWith("data:") ? "From your device" : "From URL"}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setLogoUrl("")} className="h-8 w-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-x"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    </div>
                  )}
                </div>

                {logoUrl && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Logo Shape</Label>
                      </div>
                      <RadioGroup
                        value={logoShape}
                        onValueChange={(value) => setLogoShape(value as "square" | "circle")}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="square" id="square" />
                          <Label htmlFor="square">Square</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="circle" id="circle" />
                          <Label htmlFor="circle">Circle</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="logoSize">Logo Size</Label>
                        <span className="text-sm text-muted-foreground">{logoSize}px</span>
                      </div>
                      <Slider
                        id="logoSize"
                        min={20}
                        max={Math.min(120, qrSize / 2)}
                        step={5}
                        value={[logoSize]}
                        onValueChange={(value) => setLogoSize(value[0])}
                      />
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerate} className="w-full" disabled={!url || isGenerating}>
              {isGenerating ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </div>
              ) : (
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Generate QR Code
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className={`${showPreview ? "md:col-span-1" : "md:col-span-1"} border-primary/10 shadow-md`}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-qr-code mr-2"
              >
                <rect width="5" height="5" x="3" y="3" rx="1" />
                <rect width="5" height="5" x="16" y="3" rx="1" />
                <rect width="5" height="5" x="3" y="16" rx="1" />
                <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                <path d="M21 21v.01" />
                <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                <path d="M3 12h.01" />
                <path d="M12 3h.01" />
                <path d="M12 16v.01" />
                <path d="M16 12h1" />
                <path d="M21 12v.01" />
                <path d="M12 21v-1" />
              </svg>
              Generated QR Code
            </CardTitle>
            <CardDescription>Scan with your mobile device to test</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
            <motion.div
              ref={qrRef}
              className="flex items-center justify-center p-6 bg-white rounded-xl shadow-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <QRCode
                value={url || "https://example.com"}
                size={qrSize}
                bgColor={bgColor}
                fgColor={fgColor}
                logoImage={logoUrl || undefined}
                logoWidth={logoUrl ? logoSize : undefined}
                logoHeight={logoUrl ? logoSize : undefined}
                logoOpacity={1}
                qrStyle={dotStyle}
                eyeRadius={eyeRadius}
                removeQrCodeBehindLogo={true}
                logoPadding={4}
                logoPaddingStyle={logoShape}
              />
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleDownload} variant="default" disabled={!url} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </CardFooter>
        </Card>

        {showPreview && (
          <Card className="md:col-span-1 border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="mr-2 h-5 w-5" />
                Mobile Preview
              </CardTitle>
              <CardDescription>See how your QR code will look on a device</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="relative w-[220px] h-[440px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[36px] p-1 shadow-xl border-[8px] border-gray-800">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-[24px] bg-gray-800 rounded-b-xl"></div>
                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[24px] overflow-hidden flex flex-col">
                  <div className="h-12 bg-gradient-to-r from-primary/80 to-primary flex items-center justify-center text-white text-sm font-medium">
                    Camera App
                  </div>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4">
                    <motion.div
                      className="relative"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full border-2 border-primary/50 animate-pulse"></div>
                      </div>
                      <QRCode
                        value={url || "https://example.com"}
                        size={160}
                        bgColor={bgColor}
                        fgColor={fgColor}
                        logoImage={logoUrl || undefined}
                        logoWidth={logoUrl ? logoSize * 0.7 : undefined}
                        logoHeight={logoUrl ? logoSize * 0.7 : undefined}
                        logoOpacity={1}
                        qrStyle={dotStyle}
                        eyeRadius={eyeRadius}
                        removeQrCodeBehindLogo={true}
                        logoPadding={4}
                        logoPaddingStyle={logoShape}
                      />
                    </motion.div>
                  </div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-900 flex items-center justify-center">
                    <div className="w-1/3 h-1 bg-gray-400 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground">
              Scan with a real device to test functionality
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
