import { Link } from "react-router"
import { AuthShell } from "@/features/auth/auth-shell"
import { SignupForm } from "@/features/auth/signup-form"

export function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Start tracking your workouts today."
      footer={
        <span>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-strong underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </span>
      }
    >
      <SignupForm />
    </AuthShell>
  )
}
