import { createFileRoute } from '@tanstack/react-router'
import { BrandHeader } from '@/components/header/brand-header';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Route = createFileRoute('/contact-us')({
  component: ContactUsPage,
})

function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <BrandHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
          
          <div className="space-y-8 text-gray-700">
            <section>
              <p className="text-lg">The {import.meta.env.VITE_APP_URL} developers are here to help and answer any questions you might have. Whether you have a technical issue, a suggestion, or just want to say hello — we'd love to hear from you!</p>
            </section>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="text-indigo-600 mt-1 h-5 w-5" />
                    <div>
                      <h3 className="font-medium text-gray-800">Email</h3>
                      <p className="text-gray-600">contact@sellfiles.me</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="text-indigo-600 mt-1 h-5 w-5" />
                    <div>
                      <h3 className="font-medium text-gray-800">Phone</h3>
                      <p className="text-gray-600">+91 7278765456</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-indigo-600 mt-1 h-5 w-5" />
                    <div>
                      <h3 className="font-medium text-gray-800">Address</h3>
                      <p className="text-gray-600">
                        301, Trinetra apartment, Chunavati<br />
                        Howrah, West Bengal<br />
                        Pin: 711109
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Hours</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 