"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Simulação de dados de tempo de música ouvida (em minutos) por mês
const chartData = [
  { month: "January", minutesListened: 82 },
  { month: "February", minutesListened: 1034 },
  { month: "March", minutesListened: 945 },
  { month: "April", minutesListened: 50 },
  { month: "May", minutesListened: 980 },
  { month: "June", minutesListened: 176 },
]

const chartConfig = {
  minutesListened: {
    label: "Minutos Ouvidos",
    color: "hsl(var(--chart-2))",
  },
}

export function minListenedChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tempo de Música Ouvida</CardTitle>
        <CardDescription>Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            {/* <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value} min`}
            /> */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="minutesListened"
              type="monotone"
              stroke="var(--color-minutesListened)"
              strokeWidth={2}
              dot={{ fill: "var(--color-minutesListened)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Aumento de 5.2% em relação ao mês anterior <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total de minutos de músicas ouvidas por mês
        </div>
      </CardFooter>
    </Card>
  )
}