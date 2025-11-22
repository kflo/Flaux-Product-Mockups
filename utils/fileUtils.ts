
export interface Base64File {
    base64: string;
    mimeType: string;
    name: string;
}

export const fileToBase64 = (file: File): Promise<Base64File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type, name: file.name });
    };
    reader.onerror = (error) => reject(error);
  });
};
