import { useState, useEffect } from 'react'
import defaultMenus from '../data/defaultMenus'

const STORAGE_KEY = 'foodiechoice-menus'

export function useMenuStore() {
  const [menus, setMenus] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultMenus
    } catch {
      return defaultMenus
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menus))
  }, [menus])

  function addMenu(mode, category, name) {
    const trimmed = name.trim()
    if (!trimmed) return
    setMenus(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [category]: [...prev[mode][category], trimmed],
      },
    }))
  }

  function removeMenu(mode, category, index) {
    setMenus(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [category]: prev[mode][category].filter((_, i) => i !== index),
      },
    }))
  }

  return { menus, addMenu, removeMenu }
}
