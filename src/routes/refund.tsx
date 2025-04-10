import { BrandHeader } from '@/components/header/brand-header';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/refund')({
  component: RefundPolicy,
})

function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <BrandHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Refund Policy</h1>
        <p className="text-lg sm:text-xl mb-4">
          At SellFiles.me, we strive to ensure customer satisfaction with every purchase. However, as our platform deals with digital products, refunds are only provided under specific circumstances.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Eligibility for Refund</h2>
        <p className="mb-4">
          Refunds will only be issued if the purchased product does not match the description provided on our platform. To qualify for a refund, you must raise a dispute within <strong>24 hours</strong> of purchase.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">How to Raise a Dispute</h2>
        <p className="mb-4">
          To raise a dispute, please send an email to <a href="mailto:contact@sellfiles.me" className="font-bold underline">contact@sellfiles.me</a> with the following details:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Your order ID</li>
          <li>A detailed explanation of the issue</li>
          <li>Any supporting evidence (e.g., screenshots)</li>
        </ul>
        <p className="mb-4">
          Our team will manually verify the claim and respond within 3-5 business days.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Important Notes</h2>
        <p>
          Refunds will not be provided for the following reasons:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Change of mind after purchase</li>
          <li>Failure to read the product description</li>
          <li>Issues caused by third-party software or hardware</li>
        </ul>
        <p>
          By purchasing from SellFiles.me, you agree to this refund policy.
        </p>
        </div>
      </main>
    </div>
  );
}

