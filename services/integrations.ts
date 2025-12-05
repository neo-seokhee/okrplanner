import { supabase } from './supabase';


export interface FeedbackData {
    email: string;
    feedback: string;
    created_at: string;
}

/**
 * Submit feedback to Supabase Database
 */
export async function submitFeedback(email: string, feedback: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('feedback')
            .insert([
                {
                    email: email,
                    feedback: feedback,
                    created_at: new Date().toISOString(),
                }
            ]);

        if (error) {
            console.error('Failed to submit feedback:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return false;
    }
}

/**
 * Upload profile photo to Supabase Storage
 */
export async function uploadProfilePhoto(userId: string, file: File): Promise<string | null> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('profile-photos')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Upload error:', error);
            return null;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('profile-photos')
            .getPublicUrl(data.path);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading photo:', error);
        return null;
    }
}

/**
 * Delete profile photo from Supabase Storage
 */
export async function deleteProfilePhoto(photoUrl: string): Promise<boolean> {
    try {
        // Extract file path from URL
        const urlParts = photoUrl.split('/profile-photos/');
        if (urlParts.length < 2) return false;

        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from('profile-photos')
            .remove([filePath]);

        if (error) {
            console.error('Delete error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error deleting photo:', error);
        return false;
    }
}

/**
 * Update user profile photo URL in database
 */
export async function updateUserProfilePhoto(userId: string, photoUrl: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('users')
            .update({ profile_photo_url: photoUrl })
            .eq('id', userId);

        if (error) {
            console.error('Database update error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error updating profile photo:', error);
        return false;
    }
}
