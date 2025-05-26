"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

function groupByHour(items) {
  const buckets = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    faixas: 0,
    minutos: 0,
  }))

  items.forEach(({ played_at, track }) => {
    const date = new Date(played_at)
    const hour = date.getHours()
    buckets[hour].faixas++
    buckets[hour].minutos += track.duration_ms / 60000
  })

  return buckets
}

const chartConfig = {

}

export function ListeningHoursChart() {
  const { data: session } = useSession()
  const [tracks, setTracks] = useState([])

  useEffect(() => {
    if (!session?.accessToken) return

    const fetchRecentlyPlayed = async () => {
      try {
        const res = await fetch(
          "https://api.spotify.com/v1/me/player/recently-played?limit=50",
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        )
        const data = await res.json()

        const now = new Date()
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

        const parsedTracks = data.items
          .filter(item => new Date(item.played_at) >= twentyFourHoursAgo)
          .map(item => ({
            played_at: item.played_at,
            track: {
              duration_ms: item.track.duration_ms,
            },
          }))

        setTracks(parsedTracks)
      } catch (error) {
        console.error("Erro ao buscar faixas recentes:", error)
      }
    }

    fetchRecentlyPlayed()
  }, [session])

  const chartData = useMemo(() => groupByHour(tracks), [tracks])

  const total = useMemo(() => {
    return {
      faixas: chartData.reduce((acc, curr) => acc + curr.faixas, 0),
      minutos: chartData.reduce((acc, curr) => acc + curr.minutos, 0),
    }
  }, [chartData])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Escutas por Hora</CardTitle>
        <CardDescription>Últimas 24 horas de atividade no Spotify</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}:00`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="faixas"
              type="monotone"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="minutos"
              type="monotone"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Total: {total.faixas} faixas, {total.minutos.toFixed(1)} minutos
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Dados baseados nas últimas 50 musicas ouvidas
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
