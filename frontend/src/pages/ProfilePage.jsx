import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { usePreview } from '../context/PreviewContext';
import { useAuth } from '../context/AuthContext';
import { Image } from 'lucide-react';
import api from '../utils/api';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email(),
  avatarUrl: z.string().optional().nullable(),
});

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { setProfilePreview, isSyncing } = usePreview();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      avatarUrl: user?.avatarUrl || '',
    }
  });

  // Subscribe to form changes and update preview without causing re-renders
  useEffect(() => {
    const subscription = watch((values) => {
      setProfilePreview({ ...user, ...values });
    });
    return () => subscription.unsubscribe();
  }, [watch, user, setProfilePreview]);

  const currentAvatar = watch('avatarUrl');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      // 1. Upload to Cloudinary
      const uploadRes = await api.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = uploadRes.data.url;

      // 2. Update form field
      setValue('avatarUrl', imageUrl, { shouldDirty: true });

      // 3. Auto-save to database immediately
      await api.put('/profile', { avatarUrl: imageUrl });
      setUser(prev => ({ ...prev, avatarUrl: imageUrl }));
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await api.put('/profile', data);
      setUser(res.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isSyncing) return null;

  return (
    <div className="flex flex-col h-full animate-fade-in relative">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-[32px] font-bold text-slate-900 leading-tight mt-0">Profile Details</h1>
        <p className="text-slate-500 text-base">Add your details to create a personal touch to your profile.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 flex-1 h-full">
        
        {/* Profile Picture Card */}
        <div className="bg-slate-50 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-slate-500 font-medium">Profile picture</p>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group cursor-pointer w-48 h-48 rounded-3xl overflow-hidden bg-primary-100 flex flex-col items-center justify-center text-primary-600 transition-all hover:bg-primary-200">
              {currentAvatar ? (
                <>
                  <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Image size={32} />
                    <span className="font-semibold mt-2">Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <Image size={40} className="mb-2" />
                  <span className="font-semibold">+ Upload Image</span>
                </>
              )}
              <input type="file" accept="image/png, image/jpeg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} />
            </div>
            <p className="text-slate-400 text-xs max-w-[200px] leading-relaxed">
              Image must be below 1024x1024px. Use PNG or JPG format.
            </p>
          </div>
        </div>

        {/* Basic Details Card */}
        <div className="bg-slate-50 p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-slate-500 font-medium md:w-64">First name*</label>
            <Input 
              placeholder="e.g. John" 
              error={errors.firstName?.message} 
              {...register('firstName')} 
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-slate-500 font-medium md:w-64">Last name*</label>
            <Input 
              placeholder="e.g. Appleseed" 
              error={errors.lastName?.message} 
              {...register('lastName')} 
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-slate-500 font-medium md:w-64">Email</label>
            <Input 
              placeholder="e.g. email@example.com" 
              error={errors.email?.message} 
              {...register('email')} 
              disabled
              className="bg-slate-200 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Footer actions - only visible when form has changes */}
        {(isDirty || saveSuccess) && (
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-end gap-4 pb-2 animate-slide-up">
          {saveSuccess && <span className="text-slate-500 font-medium animate-fade-in flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Successfully saved!
          </span>}
          <Button type="submit" isLoading={isSaving} className="w-full md:w-auto px-10">
            Save
          </Button>
        </div>
        )}
      </form>
    </div>
  );
};
