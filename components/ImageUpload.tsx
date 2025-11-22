import React, { useState, useRef, useCallback } from 'react';
import { fileToBase64, Base64File } from '../utils/fileUtils';

interface ImageUploadProps {
  onImageUpload: (file: Base64File | null) => void;
  label: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, label }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileData = await fileToBase64(file);
        setPreview(URL.createObjectURL(file));
        setFileName(fileData.name);
        onImageUpload(fileData);
      } catch (error) {
        console.error("Error converting file to base64", error);
        onImageUpload(null);
      }
    }
  }, [onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };
  
  const handleDrop = useCallback(async (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
     if (file && file.type.startsWith('image/')) {
       try {
        const fileData = await fileToBase64(file);
        setPreview(URL.createObjectURL(file));
        setFileName(fileData.name);
        onImageUpload(fileData);
      } catch (error) {
        console.error("Error converting file to base64", error);
        onImageUpload(null);
      }
    }
  }, [onImageUpload]);
  
  const uniqueId = `file-upload-${label.replace(/[^a-zA-Z0-9]/g, '-')}`;

  return (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
        </label>
        <label 
            htmlFor={uniqueId}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
        >
            <div className="space-y-1 text-center">
                {preview ? (
                    <img src={preview} alt="Preview" className="mx-auto h-24 w-auto rounded-md object-contain" />
                ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
                <div className="flex text-sm text-gray-400">
                    <p className="pl-1">{fileName || 'Drag & drop or click to upload'}</p>
                </div>
                 <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
             <input id={uniqueId} name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" ref={fileInputRef} />
        </label>
    </div>
  );
};

export default ImageUpload;