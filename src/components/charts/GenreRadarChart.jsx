"use client"

import { useEffect, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartConfig = {
  desktop: {
    color: "hsl(var(--chart-1))",
  },
}

export function GenreRadarChart() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [term, setTerm] = useState("short_term") // default

  useEffect(() => {
    setLoading(true)
    setError(false)

    const fetchGenres = async () => {
      try {
        const res = await fetch(`/api/genres?term=${term}`)
        const data = await res.json()
        if (!data || data.length === 0) throw new Error("Dados vazios")
        setChartData(data)
      } catch (err) {
        console.error("Failed to fetch genres:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [term])

  return (
    <Card>
      <CardHeader className="items-center pb-4 flex justify-between">
        <div>
          <CardTitle>Evolução dos Gêneros Musicais</CardTitle>
          <CardDescription>
            Estilos que você mais ouviu no periodo selecionado
          </CardDescription>
        </div>

        <Select value={term} onValueChange={setTerm}>
          <SelectTrigger className="w-[130px] h-7 rounded-lg pl-2.5">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            <SelectItem value="short_term">Últimas 4 semanas</SelectItem>
            <SelectItem value="medium_term">Últimos 6 meses</SelectItem>
            <SelectItem value="long_term">Desde sempre</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      {loading ? (
        <CardContent className="flex justify-center items-center h-[250px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-muted" />
        </CardContent>
      ) : error ? (
        <CardContent className="text-center text-sm text-muted-foreground h-[250px] flex items-center justify-center">
          Não foi possível carregar os dados agora. Tente novamente mais tarde.
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
                name="Gêneros"
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
        Dados baseados nas suas músicas mais ouvidas por período
      </CardFooter>
    </Card>
  )
}
