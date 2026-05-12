'use client';

import { useRef, useState } from 'react';
import { useUser } from './UserProvider';
import { updateUser } from '@/lib/actions';
import { MdCameraAlt } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';
import { toast } from 'react-toastify';

export default function ProfileCard() {
  const { user, setUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    setIsUploading(true);

    try {
      // Read the file as a Data URL (base64)
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        
        // 1. Optimistic Client-Side Update
        setUser((prev) => ({ ...prev, avatar: base64Image }));

        // 2. Server-Side Update
        await updateUser({ avatar: base64Image });
        
        setIsUploading(false);
        toast.success('Profile picture updated successfully');
      };
      
      reader.onerror = () => {
        toast.error('Error reading file.');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update profile picture');
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border border-outline-variant/30 flex flex-col items-center text-center">
      <div 
        className="relative w-32 h-32 rounded-full mb-md border-4 border-surface-container group cursor-pointer"
        onClick={handleImageClick}
      >
        <img 
          src={user.avatar} 
          alt={user.fullName} 
          className="w-full h-full object-cover rounded-full transition-opacity duration-300 group-hover:opacity-75" 
        />
        
        {/* Upload Overlay */}
        <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isUploading ? (
            <ImSpinner8 size={24} className="text-white animate-spin" />
          ) : (
            <>
              <MdCameraAlt size={24} className="text-white mb-1" />
              <span className="text-white text-xs font-semibold">Change</span>
            </>
          )}
        </div>
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <h2 className="font-h2 text-h2 text-primary">{user.fullName}</h2>
      <p className="font-body-md text-on-surface-variant">Patient ID: {user.id.toUpperCase()}-0092</p>
    </div>
  );
}
