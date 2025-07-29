import React from 'react';
import { Heart, QrCode, Smartphone, Shield, Clock, Users } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-8">
              <Heart className="h-16 w-16 text-orange-500" />
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                PetConnect
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Keep your pets safe with smart QR code technology. Create profiles, generate QR codes, 
              and help lost pets find their way home quickly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </button>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="h-5 w-5" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How PetConnect Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, effective pet protection in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Pet Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Register your pet with photos, details, and your contact information. 
                Our system automatically generates a unique QR code.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Attach QR Code</h3>
              <p className="text-gray-600 leading-relaxed">
                Download and print the QR code, then attach it to your pet's collar. 
                Weatherproof options ensure long-lasting protection.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Reunion</h3>
              <p className="text-gray-600 leading-relaxed">
                When someone finds your pet, they scan the QR code to instantly 
                access your contact information and reunite you quickly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PetConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive pet protection designed with modern technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instant Access</h3>
              <p className="text-gray-600">
                QR codes provide immediate access to pet information without apps or accounts needed by finders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mobile Optimized</h3>
              <p className="text-gray-600">
                Pet profiles are designed for mobile viewing, ensuring clear information display on any phone.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Privacy Protected</h3>
              <p className="text-gray-600">
                Your personal information is secure. Only essential contact details are shown to help reunite pets.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Found Pet Reports</h3>
              <p className="text-gray-600">
                Finders can submit reports with their contact information and location details for easy coordination.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Multiple Pets</h3>
              <p className="text-gray-600">
                Manage all your pets from one dashboard. Each pet gets its own unique QR code and profile.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Easy QR Management</h3>
              <p className="text-gray-600">
                Download high-quality QR codes as PNG files. Activate or deactivate profiles as needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-orange-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Protect Your Pet?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join thousands of pet owners who trust PetConnect to keep their beloved companions safe.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-orange-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Create Your First Pet Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;