import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/myprofile/payment')({
  component: PaymentMethods,
})

import { PaymentMethodForm } from "@/components/payment-methods-form";

function PaymentMethods() {
  return <PaymentMethodForm />;
} 
