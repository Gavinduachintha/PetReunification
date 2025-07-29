import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { Heart } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Heart className="h-12 w-12 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">PetConnect</h1>
          </div>
          <h2 className="text-xl text-gray-600">
            {isSignIn ? 'Welcome back!' : 'Join PetConnect today'}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isSignIn 
              ? 'Sign in to manage your pet profiles and QR codes'
              : 'Create an account to start protecting your pets'
            }
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-xl">
          {isSignIn ? (
            <SignInForm onSwitchToSignUp={() => setIsSignIn(false)} />
          ) : (
            <SignUpForm onSwitchToSignIn={() => setIsSignIn(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;