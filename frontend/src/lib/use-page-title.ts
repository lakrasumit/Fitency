import { useEffect } from "react"

const APP_NAME = "Fitency"

/** Keeps the document title in step with the active route. */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · ${APP_NAME}`
  }, [title])
}
