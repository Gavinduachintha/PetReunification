import React from 'react';
import { Pet } from '../../types';
import { generateQRCode, downloadQRCode } from '../../utils/qrcode';
import { Edit, Download, Eye, EyeOff, Heart } from 'lucide-react';

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
  onToggleStatus: (pet: Pet) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onEdit, onToggleStatus }) => {
  const handleDownloadQR = async () => {
    try {
      const petUrl = `${window.location.origin}/pet/${pet.qr_code}`;
      const qrCodeDataUrl = await generateQRCode(petUrl);
      downloadQRCode(qrCodeDataUrl, `${pet.name}-qr-code.png`);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
            <Heart className="h-16 w-16 text-gray-300" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            pet.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {pet.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Pet Information */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{pet.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
              {pet.species}
            </span>
            <span>{pet.age} years old</span>
          </div>
        </div>

        <div className="space-y-1 text-sm text-gray-600 mb-4">
          <div className="flex justify-between">
            <span className="font-medium">Breed:</span>
            <span>{pet.breed || 'Mixed'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Color:</span>
            <span>{pet.color}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(pet)}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          
          <button
            onClick={handleDownloadQR}
            className="flex items-center justify-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            title="Download QR Code"
          >
            <Download className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onToggleStatus(pet)}
            className={`flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
              pet.is_active
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            title={pet.is_active ? 'Deactivate' : 'Activate'}
          >
            {pet.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetCard;