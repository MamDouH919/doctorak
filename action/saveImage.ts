
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/firebase'

export const saveImage = async (image: File, fileName: string, name?: string) => {
    const imageName = `${fileName}/${crypto.randomUUID()}-${name}.${image.type.split('/')[1]}`;
    const storageRef = ref(storage, imageName);
    // Convert the file to an array buffer and then to a buffer for server-side use
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the image buffer to Firebase Storage
    await uploadBytes(storageRef, buffer, {
        contentType: image.type, // Set the correct content type
    });

    const url = await getDownloadURL(storageRef);

    return {
        imagePath: url,
        imageName: imageName,
    };
}