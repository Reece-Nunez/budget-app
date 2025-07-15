'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format, subMonths, addMonths } from 'date-fns'

export default function MonthSelector({
  onChange,
}: {
  onChange?: (date: Date) => void
}) {
  const [current, setCurrent] = useState(new Date())

  const handlePrev = () => {
    const newDate = subMonths(current, 1)
    setCurrent(newDate)
    onChange?.(newDate)
  }

  const handleNext = () => {
    const newDate = addMonths(current, 1)
    setCurrent(newDate)
    onChange?.(newDate)
  }

  const handleToday = () => {
    const today = new Date()
    setCurrent(today)
    onChange?.(today)
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="ghost" size="icon" onClick={handlePrev}>
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <h2 className="text-lg font-semibold">
        {format(current, 'MMMM yyyy')}
      </h2>
      <Button variant="ghost" size="icon" onClick={handleNext}>
        <ChevronRight className="w-5 h-5" />
      </Button>
      <Button variant="outline" size="sm" onClick={handleToday}>
        Today
      </Button>
    </div>
  )
}
