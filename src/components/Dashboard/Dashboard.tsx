import React, { useState, useEffect } from 'react';
import { Pet } from '../../types';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';
import PetCard from '../PetProfile/PetCard';
import PetForm from '../PetProfile/PetForm';
import { Plus, PawPrint } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPets();
  }, [user]);

  const fetchPets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPets(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (pet: Pet) => {
    try {
      const { error } = await supabase
        .from('pets')
        .update({ 
          is_active: !pet.is_active,
          updated_at: new Date().toISOString() 
        })
        .eq('id', pet.id);
      
      if (error) throw error;
      fetchPets();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingPet(null);
    fetchPets();
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingPet(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="h-12 w-12 text-orange-500 mx-auto animate-pulse" />
          <p className="mt-2 text-gray-600">Loading your pets...</p>
        </div>
      </div>
    );
  }

  if (showAddForm || editingPet) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {editingPet ? 'Edit Pet Profile' : 'Add New Pet'}
            </h1>
            <p className="text-gray-600">
              {editingPet ? 'Update your pet\'s information' : 'Create a new pet profile and QR code'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <PetForm
              pet={editingPet || undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Pets</h1>
            <p className="text-gray-600">Manage your pet profiles and QR codes</p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Pet</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {pets.length === 0 ? (
          <div className="text-center py-12">
            <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pets registered yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first pet profile</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Your First Pet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onEdit={setEditingPet}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;