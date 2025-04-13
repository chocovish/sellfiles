import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client';

interface UploadResult {
  fileUrl: string;
  fileName: string;
}

const supabase = createClient();

export async function uploadFile(file: File, folder: 'thumbnails' | 'products'): Promise<UploadResult> {
  try {
    // Create a unique file name
    const uniqueId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uniqueId}.${fileExtension}`;

    let fileToUpload = file;

    // If it's a thumbnail, compress the image
    if (folder === 'thumbnails') {
      const options = {
        maxSizeMB: .2, // Max file size in MB
        maxWidthOrHeight: 600, // Max width/height of the image
        useWebWorker: true, // Use Web Worker for better performance
        fileType: "image/webp", // Preserve the original file type
        maxIteration: 30, // Max number of compression iterations
      };

      try {
        fileToUpload = await imageCompression(file, {...options,});
      } catch (error) {
        console.error('Error compressing image:', error);
        throw new Error('Failed to compress image');
      }
    }

    console.log('Compressed file size:', fileToUpload.size / 1024, 'KB', fileToUpload.type); // Convert bytes to megabytes for easier readability
    console.log('Original file size:', file.size / 1024, 'KB', file.type); // Convert bytes to megabytes for easier readabilit

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(folder)
      .upload(fileName, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(folder)
      .getPublicUrl(fileName);

    return {
      fileUrl: publicUrl,
      fileName
    };
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
}