'use server'

import { deletePublicId, uploadImage } from "@/lib/cloudinary"
import { extractPublicId } from 'cloudinary-build-url';

export const getImageUrl = async (image: File) => {
    try {
        const imageUrl = await uploadImage(image)
         return imageUrl
    } catch (error) {
        throw new Error('שגיאה בטעינת התמונה, נסה שוב מאוחר יותר')
    }
}


export const deleteImage = async (image: string) => {

  if (!image) {
     throw new Error('Missing public ID' );
  }

  try {
    const publicId = extractPublicId(image)
    await deletePublicId(publicId);
  } catch (error) {
    console.error('שגיאה במחיקת Cloudinary:', error);
     throw new Error('Failed to delete image');
  }
}