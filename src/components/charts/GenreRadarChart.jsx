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

const chartData = [
  { genre: "Pop", short_term: 40, medium_term: 60, long_term: 70 },
  { genre: "Rock", short_term: 65, medium_term: 60, long_term: 50 },
  { genre: "Indie", short_term: 50, medium_term: 70, long_term: 90 },
  { genre: "Rap", short_term: 80, medium_term: 60, long_term: 30 },
  { genre: "Electronic", short_term: 30, medium_term: 40, long_term: 50 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
}


export function GenreRadarChart() {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Evolução dos Gêneros Musicais</CardTitle>
        <CardDescription>
          Estilos que você mais ouviu nos ultimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
          <ChartContainer  config={chartConfig} className="mx-auto aspect-square min-w-[300] max-h-[250px]">
            <RadarChart data={chartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="genre"/>
              <PolarGrid />
              <Tooltip
                contentStyle={{ backgroundColor: "#111", border: "1px solid #333", color: "#fff" }}
                labelStyle={{ color: "#fff" }}
              />
              <Radar
                name="Últimos 6 meses"
                dataKey="medium_term"
                stroke="#10b981" // verde esmeralda
                fill="#10b981"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ChartContainer>
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm text-center">
        Dados baseados nas suas 50 músicas mais ouvidas por período
      </CardFooter>
    </Card>
  )
}
