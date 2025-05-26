"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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
  const now = new Date()
  const currentHour = now.getHours()

  const buckets = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    faixas: 0,
    minutos: 0,
  }))

  items.forEach(({ played_at, track }) => {
    const date = new Date(played_at)
    const hour = date.getHours()
    if (hour <= currentHour) {
      buckets[hour].faixas++
      buckets[hour].minutos += track.duration_ms / 60000
    }
  })

  // Corta as horas à frente da hora atual
  return buckets.slice(0, currentHour + 1)
}

const chartConfig = {}

export function ListeningHoursChart() {
  const { data: session } = useSession()
  const [tracks, setTracks] = useState([])
  const playedAtSet = useRef(new Set())

  useEffect(() => {
    if (!session?.accessToken) return

    const today = new Date()
    today.setHours(0, 0, 0, 0) // 00:00 do dia atual

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

        const newTracks = data.items
          .filter(item => {
            const playedAt = new Date(item.played_at)
            return playedAt >= today && !playedAtSet.current.has(item.played_at)
          })
          .map(item => {
            playedAtSet.current.add(item.played_at)
            return {
              played_at: item.played_at,
              track: {
                duration_ms: item.track.duration_ms,
              },
            }
          })

        setTracks(prev => [...prev, ...newTracks])
      } catch (error) {
        console.error("Erro ao buscar faixas recentes:", error)
      }
    }

    fetchRecentlyPlayed()

    // Atualiza a cada minuto (opcional)
    const interval = setInterval(fetchRecentlyPlayed, 60000)
    return () => clearInterval(interval)
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
        <CardDescription>
          Músicas ouvidas hoje ({new Date().toLocaleDateString("pt-BR")})
        </CardDescription>
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
              tickFormatter={(value) => `${value.toString().padStart(2, "0")}:00`}
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
              Dados baseados nas faixas tocadas hoje (atualizando automaticamente)
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
