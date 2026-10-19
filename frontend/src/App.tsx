import { StylePreview } from "@/components/style-preview"
import { Toaster } from "@/components/ui/sonner"

function App() {
  const showPreview =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("preview")

  return (
    <>
      {showPreview ? (
        <StylePreview />
      ) : (
        <main className="grid min-h-svh place-items-center p-4">
          <p className="text-muted-foreground">
            Fitency is being built phase by phase.
          </p>
        </main>
      )}
      <Toaster position="top-center" />
    </>
  )
}

export default App
