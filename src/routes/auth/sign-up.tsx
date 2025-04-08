import { createFileRoute, useSearch } from '@tanstack/react-router'

let schema = z.object({
  userType: z.enum(['buyer', 'seller']).optional(),
})
export const Route = createFileRoute('/auth/sign-up')({
  component: Page,
  validateSearch: zv(schema),
})

import { SignUpForm } from '@/components/auth-pages/sign-up-form'
import { Suspense } from 'react'
import { zv } from '~/lib/utils'
import { z } from 'zod'

function Page() {
  return (
    <div className="flex justify-center pt-8 md:pt-16">
      <SignUpForm />
    </div>
  )
}

