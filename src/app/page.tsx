"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { PlayCircle, History, Brain } from "lucide-react"
import { features } from "@/data/constants/feature"

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="mb-8 overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Brain className="h-10 w-10 text-primary" />
            <CardTitle className="text-4xl font-bold text-primary">Interactive Quiz Platform</CardTitle>
          </div>
          <CardDescription className="text-xl">
            Test your knowledge across various topics with our timed quiz system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/quiz" className="sm:col-span-1">
              <Button className="w-full h-16 text-lg group transition-all duration-300" size="lg">
                <PlayCircle className="h-6 w-6 mr-2 transition-transform duration-300 group-hover:scale-110" />
                Start New Quiz
              </Button>
            </Link>
            <Link href="/history" className="sm:col-span-1">
              <Button
                variant="outline"
                className="w-full h-16 text-lg group transition-all duration-300 border-2"
                size="lg"
              >
                <History className="h-6 w-6 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                View History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default h-full"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20">
                    <Icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl leading-none font-semibold">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
