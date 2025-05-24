'use client'

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function timeRangeToggle({ timeRange, setTimeRange }) {
  return (
    <ToggleGroup type="single" variant="outline" className="w-full" defaultValue="a">
      <ToggleGroupItem value="a" onClick={() => setTimeRange('short_term')}>4 Weeks</ToggleGroupItem>
      <ToggleGroupItem value="b" onClick={() => setTimeRange('medium_term')}>6 Months</ToggleGroupItem>
      <ToggleGroupItem value="c" onClick={() => setTimeRange('long_term')}>Lifetime</ToggleGroupItem>
    </ToggleGroup>
  )
}