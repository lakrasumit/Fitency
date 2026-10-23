import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { usePageTitle } from "@/lib/use-page-title"

export function NotFoundPage() {
  usePageTitle("Page not found")

  return (
    <div className="grid min-h-[60svh] place-items-center px-4">
      <div className="animate-page-in space-y-3 text-center">
        <p className="brand-gradient font-heading text-5xl font-semibold">
          404
        </p>
        <h1 className="font-heading text-xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/library">Browse library</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
