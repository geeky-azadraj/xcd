'use client';

import Image from 'next/image';
import { Star, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const AuthShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full bg-white p-4 overflow-hidden">
      <div className="w-full h-full pt-16 pl-12 bg-gradient-to-bl from-primary-200 to-white rounded-2xl overflow-hidden">
        <div 
          className={`relative w-full h-full pt-12 bg-white rounded-tl-xl overflow-hidden transition-all duration-1000 ease-out ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="mb-8 border-b border-gray-200" />
          
          <div className="pl-20 pr-4">
            {/* Breadcrumbs */}
            <nav 
              className={`mb-6 transition-all duration-1000 ease-out delay-200 ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-6 opacity-0'
              }`}
            >
              <div className="flex items-center space-x-2 text-sm text-typography-600">
                <span>Explore Hotels</span>
                <span className="text-typography-400">›</span>
                <span className="text-typography-900 font-medium">Hotel Grand Suite</span>
              </div>
            </nav>

            {/* Hotel Title and Info */}
            <div 
              className={`mb-6 transition-all duration-1000 ease-out delay-300 ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-6 opacity-0'
              }`}
            >
              <h1 className="text-3xl font-bold text-typography-900 mb-1">Hotel Grand Suite</h1>
              <div className="flex items-center space-x-4">
                <p className="text-typography-600">123 Maple Avenue, Springfield, USA</p>
                <div className="flex items-center space-x-1 border border-gray-200 px-1 py-0.5 rounded-md">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-typography-700">4.5</span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div 
              className={`mb-6 transition-all duration-1000 ease-out delay-400 ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-6 opacity-0'
              }`}
            >
              <div className="flex gap-4">
                {/* Main Image */}
                <div className="flex-1">
                  <div className="relative h-60 rounded-lg overflow-hidden">
                    <Image 
                      src="/images/dummy/samplehotelone.png" 
                      alt="Hotel Grand Suite - Main View" 
                      fill 
                      className="object-cover" 
                      priority 
                    />
                  </div>
                </div>
                
                {/* Thumbnail Images */}
                <div className="w-24 -mr-16 space-y-4">
                  <div className="relative h-28 rounded-lg overflow-hidden">
                    <Image 
                      src="/images/dummy/samplehoteltwo.png" 
                      alt="Hotel Interior View" 
                      fill 
                      className="object-cover" 
                      style={{ objectPosition: 'left center', transform: 'translateX(-50%)' }} 
                    />
                  </div>
                  <div className="relative h-28 rounded-lg overflow-hidden">
                    <Image 
                      src="/images/dummy/samplehotelthree.png" 
                      alt="Hotel Garden View" 
                      fill 
                      className="object-cover" 
                      style={{ objectPosition: 'left center', transform: 'translateX(-50%)' }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div 
              className={`mb-5 transition-all duration-1000 ease-out delay-500 ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-6 opacity-0'
              }`}
            >
              <div className="flex space-x-4">
                <button className="pb-2 px-1 text-sm font-medium border-b-2 border-primary-500 text-primary-600">
                  Explore Rooms
                </button>
                <button className="pb-2 px-1 text-sm font-medium text-typography-500 hover:text-typography-700 transition-colors">
                  About Hotel
                </button>
                <button className="pb-2 px-1 text-sm font-medium text-typography-500 hover:text-typography-700 transition-colors">
                  Policies
                </button>
              </div>
            </div>

            {/* Room Filters */}
            <div 
              className={`mb-4 transition-all duration-1000 ease-out delay-600 ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-6 opacity-0'
              }`}
            >
              <div className="flex space-x-2">
                <div className="px-3 py-1.5 text-sm rounded-full bg-primary-50 text-typography-600 border border-primary-500">
                  All rooms
                </div>
                <div className="px-3 py-1.5 text-sm rounded-full bg-gray-100 text-typography-600 border border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
                  1 Bed
                </div>
                <div className="px-3 py-1.5 text-sm rounded-full bg-gray-100 text-typography-600 border border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
                  2 Beds
                </div>
                <div className="px-3 py-1.5 text-sm rounded-full bg-gray-100 text-typography-600 border border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
                  3+ Beds
                </div>
              </div>
            </div>

            {/* Room Listing */}
            <div 
              className={`space-y-4 transition-all duration-1000 ease-out delay-700 ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-6 opacity-0'
              }`}
            >
              <div className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Room Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image 
                      src="/images/dummy/samplebedroom.png" 
                      alt="Single Bedroom" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  
                  {/* Room Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-typography-900 mb-1">Single Bedroom</h3>
                      <p className="text-xs text-typography-700 -mr-4 cursor-pointer hover:text-primary-600 transition-colors">
                        More Detai
                      </p>
                    </div>
                    
                    {/* Price Section */}
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-2xl font-bold text-typography-900">$150</span>
                      <span className="text-sm text-typography-500">/ night</span>
                    </div>
                    
                    <div className="flex items-center justify-between -mr-4">
                      {/* Inclusive text with discount tag */}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm text-typography-500">Inclusive of taxes & fees</span>
                        <span className="bg-success-100 text-success-700 text-xs font-medium px-2 py-0.5 rounded">
                          20% OFF
                        </span>
                      </div>
                      
                      <button className="-mt-12 bg-white hover:bg-primary-50 text-primary-600 border border-primary-500 px-3 py-1.5 rounded-l-md border-r-0 flex items-center space-x-1 text-sm transition-colors">
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* White fade overlay from bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default AuthShowcase;









