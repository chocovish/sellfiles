import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: Page,
})

import { LoginForm } from '@/components/auth-pages/login-form'

function Page() {
  return (
    <div className="flex justify-center my-auto">
      <LoginForm />
    </div>
  )
}
