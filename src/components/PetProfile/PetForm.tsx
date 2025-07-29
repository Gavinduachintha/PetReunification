import React, { useState, useEffect } from 'react';
import { Pet } from '../../types';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { generateQRCode } from '../../utils/qrcode';
import { Camera, QrCode } from 'lucide-react';

interface PetFormProps {
  pet?: Pet;
  onSuccess: () => void;
  onCancel: () => void;
}

const PetForm: React.FC<PetFormProps> = ({ pet, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: pet?.name || '',
    species: pet?.species || '',
    breed: pet?.breed || '',
    age: pet?.age || 1,
    color: pet?.color || '',
    description: pet?.description || ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(pet?.photo_url || null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (formData.name && user) {
      const generatePreview = async () => {
        try {
          const petUrl = `${window.location.origin}/pet/${pet?.qr_code || 'preview'}`;
          const qrCode = await generateQRCode(petUrl);
          setQrCodePreview(qrCode);
        } catch (error) {
          console.error('Error generating QR preview:', error);
        }
      };
      generatePreview();
    }
  }, [formData.name, user, pet?.qr_code]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 1 : value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('pet-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('pet-photos')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let photoUrl = pet?.photo_url;
      
      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile);
      }

      const qrCode = pet?.qr_code || `${user!.id}-${Date.now()}`;
      const petUrl = `${window.location.origin}/pet/${qrCode}`;
      const qrCodeDataUrl = await generateQRCode(petUrl);

      const petData = {
        ...formData,
        owner_id: user!.id,
        photo_url: photoUrl,
        qr_code: qrCode,
        is_active: true
      };

      if (pet) {
        const { error } = await supabase
          .from('pets')
          .update({ ...petData, updated_at: new Date().toISOString() })
          .eq('id', pet.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pets')
          .insert([petData]);
        
        if (error) throw error;
      }

      onSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Pet Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your pet's name"
              />
            </div>

            <div>
              <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-2">
                Species *
              </label>
              <select
                id="species"
                name="species"
                required
                value={formData.species}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
                Breed
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter breed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min="0"
                  max="30"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  required
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Main color"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Any distinguishing features or special notes"
              />
            </div>

            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                Pet Photo
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex-1 flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-center">
                    <Camera className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload photo
                    </p>
                  </div>
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              {photoPreview && (
                <div className="mt-4">
                  <img
                    src={photoPreview}
                    alt="Pet preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <QrCode className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-medium text-gray-900">QR Code Preview</h3>
              </div>
              {qrCodePreview ? (
                <div className="text-center">
                  <img
                    src={qrCodePreview}
                    alt="QR Code Preview"
                    className="mx-auto mb-4 rounded-lg"
                    style={{ width: '200px', height: '200px' }}
                  />
                  <p className="text-sm text-gray-600">
                    This QR code will link to your pet's profile page
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <QrCode className="mx-auto h-16 w-16 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">
                    QR code will appear here once you enter a pet name
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : pet ? 'Update Pet' : 'Add Pet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PetForm;