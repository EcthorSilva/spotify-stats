'use client'

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { useEffect, useState } from "react";

const chartConfig = {
  desktop: {
    color: "hsl(var(--chart-1))",
  },
}


export function GenreRadarChart() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch("/api/genres")
        const data = await res.json()
        setChartData(data)
        console.log("Fetched genres data:", data)
        if (!data || data.length === 0) {
          console.error("No data received for genres chart")
        }
      } catch (error) {
        console.error("Failed to fetch genres:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [])


  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Evolução dos Gêneros Musicais</CardTitle>
        <CardDescription>
          Estilos que você mais ouviu nos últimos 6 meses
        </CardDescription>
      </CardHeader>
      {loading ? (
        <CardContent className="flex justify-center items-center h-[250px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-muted" />
        </CardContent>
      ) : (
        <CardContent className="pb-0">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square min-w-[300] max-h-[250px]">
            <RadarChart data={chartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="genre" />
              <PolarGrid />
              <Tooltip
                contentStyle={{ backgroundColor: "#111", border: "1px solid #333", color: "#fff" }}
                labelStyle={{ color: "#fff" }}
              />
              <Radar
                name="Últimos 6 meses"
                dataKey="medium_term"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      )}
      <CardFooter className="text-muted-foreground text-sm text-center">
        Dados baseados nas suas 50 músicas mais ouvidas por período
      </CardFooter>
    </Card>

  )
}
