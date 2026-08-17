import { Suspense } from 'react'
import NoCopyPaste from './NoCopyPaste'
import EquippedShowcase from './EquippedShowcase'
import ThemeApplicator from './ThemeApplicator'
import CosmeticEffects from './CosmeticEffects'
import { getStudentByToken, getThemeById } from '@/lib/student-cache'

/**
 * Async inner component — loads theme & cosmetics in the background.
 * Wrapped in Suspense so it never blocks the HTML shell from streaming.
 */
async function ThemeLoader({ token }) {
  let theme = null
  let equippedList = []

  try {
    const student = await getStudentByToken(token)
    if (student) {
      if (student.activeThemeId) {
        theme = await getThemeById(student.activeThemeId)
      }
      equippedList = (student.equipped || []).map(e => ({
        type: e.type,
        name: e.cosmetic?.name || '',
        rarity: e.cosmetic?.rarity || 'COMMON',
      }))
    }
  } catch (e) {
    console.error('[ThemeLoader]', e)
  }

  const themeData = theme ? {
    name: theme.name,
    primary: theme.primary,
    secondary: theme.secondary,
    accent: theme.accent,
    glowColor: theme.glowColor,
    bgGradient: theme.bgGradient,
  } : null

  return (
    <>
      <ThemeApplicator initialTheme={themeData} />
      <CosmeticEffects items={equippedList} />
      <EquippedShowcase items={equippedList} themeName={theme?.name} />
    </>
  )
}

/**
 * Synchronous shell — renders children immediately (no DB calls here).
 * ThemeLoader streams in asynchronously inside Suspense, so the browser
 * receives the first HTML byte without waiting for any DB round-trips.
 */
export default function StudentThemeShell({ token, children }) {
  return (
    <>
      <Suspense fallback={null}>
        <ThemeLoader token={token} />
      </Suspense>
      <NoCopyPaste />
      {children}
    </>
  )
}
