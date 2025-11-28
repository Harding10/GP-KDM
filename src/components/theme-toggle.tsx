
'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { Sun, Moon, Laptop } from 'lucide-react'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex flex-col sm:flex-row gap-2 rounded-lg border p-1">
      <Button
        variant={theme === 'light' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => setTheme('light')}
        className="w-full justify-center sm:justify-start gap-2 px-3"
      >
        <Sun className="h-4 w-4" />
        <span className="sm:inline">Clair</span>
      </Button>
      <Button
        variant={theme === 'dark' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => setTheme('dark')}
        className="w-full justify-center sm:justify-start gap-2 px-3"
      >
        <Moon className="h-4 w-4" />
        <span className="sm:inline">Sombre</span>
      </Button>
      <Button
        variant={theme === 'system' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => setTheme('system')}
        className="w-full justify-center sm:justify-start gap-2 px-3"
      >
        <Laptop className="h-4 w-4" />
        <span className="sm:inline">Système</span>
      </Button>
    </div>
  )
}
