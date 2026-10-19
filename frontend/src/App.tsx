import { StylePreview } from "@/components/style-preview"
import { Toaster } from "@/components/ui/sonner"
import { AppRoutes } from "@/routes/app-routes"

function App() {
  const showPreview =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("preview")

  return (
    <>
      {showPreview ? <StylePreview /> : <AppRoutes />}
      <Toaster position="top-center" />
    </>
  )
}

export default App
