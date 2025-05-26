'use client'

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
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

const chartConfig = {
  popularity: {
    label: "Popularidade",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
}

export function ArtistPopularityChart() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/top-artists-popularity")
        const data = await res.json()
        setChartData(data)
      } catch (error) {
        console.error("Failed to fetch artists popularity", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

    function getRandomComparison(chartData) {
        if (!chartData || chartData.length === 0) {
            return <div>Sem dados suficientes para comparação.</div>
        }
        if (chartData.length === 1) {
            return <div>{chartData[0].artist} é seu artista mais popular.</div>
        }
        const [top1, top2] = chartData
        const avg = chartData.reduce((acc, cur) => acc + cur.popularity, 0) / chartData.length
        const diff = top1.popularity - top2.popularity
        const percent = ((diff / top2.popularity) * 100).toFixed(1)
        const random = Math.floor(Math.random() * 4)

        switch (random) {
            case 0:
                return `${top1.artist} é ${percent}% mais popular que ${top2.artist}.`
            case 1:
                return `${top1.artist} está ${Math.round(top1.popularity - avg)} pontos acima da média.`
            case 2:
                return `Mesmo sendo menos popular, ${top2.artist} ainda está entre seus favoritos!`
            case 3:
                return `${top1.artist} superou ${top2.artist} esse semestre. Que virada!`
        }
    }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Popularidade dos seus 5 Artistas Mais Ouvidos</CardTitle>
        <CardDescription>Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[250px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-muted" />
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              data={chartData}
              layout="vertical"
              height={300}
              width={400}
              margin={{ right: 16 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="artist"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                hide
              />
              <XAxis type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="popularity"
                fill="var(--color-popularity)"
                radius={4}
              >
                <LabelList
                  dataKey="artist"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="popularity"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {getRandomComparison(chartData)}
        <div className="leading-none text-muted-foreground">
          Popularidade dos seus artistas mais ouvidos no Spotify
        </div>
      </CardFooter>
    </Card>
  )
}
