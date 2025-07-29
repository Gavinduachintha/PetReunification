import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pet } from '../../types';
import { supabase } from '../../utils/supabase';
import { Heart, Phone, Mail, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

interface Owner {
  full_name: string;
  phone: string;
  email: string;
}

const PetProfilePage: React.FC = () => {
  const { qrCode } = useParams<{ qrCode: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportData, setReportData] = useState({
    finderName: '',
    finderPhone: '',
    finderEmail: '',
    location: '',
    message: ''
  });

  useEffect(() => {
    if (qrCode) {
      fetchPetProfile();
    }
  }, [qrCode]);

  const fetchPetProfile = async () => {
    try {
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select(`
          *,
          profiles!pets_owner_id_fkey (
            full_name,
            phone,
            email
          )
        `)
        .eq('qr_code', qrCode)
        .eq('is_active', true)
        .single();

      if (petError) throw petError;

      setPet(petData);
      setOwner(petData.profiles);
    } catch (error) {
      console.error('Error fetching pet profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('found_reports')
        .insert([{
          pet_id: pet!.id,
          finder_name: reportData.finderName,
          finder_phone: reportData.finderPhone,
          finder_email: reportData.finderEmail || null,
          location_found: reportData.location,
          message: reportData.message || null
        }]);

      if (error) throw error;

      setReportSuccess(true);
      setShowReportForm(false);
      setReportData({
        finderName: '',
        finderPhone: '',
        finderEmail: '',
        location: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-orange-500 mx-auto animate-pulse" />
          <p className="mt-2 text-gray-600">Loading pet profile...</p>
        </div>
      </div>
    );
  }

  if (!pet || !owner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pet Not Found</h1>
          <p className="text-gray-600">
            This pet profile doesn't exist or has been deactivated by the owner.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {reportSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-green-700 font-medium">
                Thank you! The owner has been notified that you found {pet.name}.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Pet Photo */}
          <div className="aspect-square bg-gray-200 relative">
            {pet.photo_url ? (
              <img
                src={pet.photo_url}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Heart className="h-24 w-24 text-gray-300" />
              </div>
            )}
          </div>

          {/* Pet Information */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{pet.name}</h1>
              <div className="flex justify-center items-center space-x-4 text-gray-600">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {pet.species}
                </span>
                <span>{pet.age} years old</span>
                <span>{pet.color}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <span className="font-medium text-gray-700">Breed:</span>
                <p className="text-gray-600">{pet.breed || 'Mixed'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Color:</span>
                <p className="text-gray-600">{pet.color}</p>
              </div>
            </div>

            {pet.description && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{pet.description}</p>
              </div>
            )}

            {/* Owner Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                🏠 Found me? Contact my owner!
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{owner.full_name}</p>
                      <p className="text-sm text-gray-600">{owner.phone}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${owner.phone}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    Call
                  </a>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{owner.email}</p>
                    </div>
                  </div>
                  <a
                    href={`mailto:${owner.email}?subject=Found ${pet.name}&body=Hello! I found ${pet.name}. Please contact me to arrange pickup.`}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Email
                  </a>
                </div>
              </div>

              {/* Report Found Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowReportForm(true)}
                  className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Report Found Pet
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Found Modal */}
        {showReportForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Report Found Pet</h2>
                <p className="text-gray-600 mb-6">
                  Please provide your contact information so the owner can reach you.
                </p>

                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={reportData.finderName}
                      onChange={(e) => setReportData(prev => ({ ...prev, finderName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={reportData.finderPhone}
                      onChange={(e) => setReportData(prev => ({ ...prev, finderPhone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      value={reportData.finderEmail}
                      onChange={(e) => setReportData(prev => ({ ...prev, finderEmail: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your email (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Found *
                    </label>
                    <input
                      type="text"
                      required
                      value={reportData.location}
                      onChange={(e) => setReportData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Where did you find the pet?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Message
                    </label>
                    <textarea
                      rows={3}
                      value={reportData.message}
                      onChange={(e) => setReportData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Any additional information about the pet's condition or location"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowReportForm(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetProfilePage;