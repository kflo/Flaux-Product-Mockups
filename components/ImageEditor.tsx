import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import ImageUpload from './ImageUpload';
import Button from './Button';
import Spinner from './Spinner';
import Alert from './Alert';
import type { Base64File } from '../utils/fileUtils';

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<Base64File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!image || !prompt) {
      setError('Please upload an image and enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);
    try {
      const result = await editImage(image.base64, image.mimeType, prompt);
      setEditedImage(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Image Editor</h2>
      <p className="text-gray-400 mb-6">Upload an image and tell Gemini how to change it.</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-6">
          <ImageUpload onImageUpload={setImage} label="1. Upload Image:" />
          {image && (
             <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                2. Enter your edit prompt:
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'add a retro filter', 'make the sky purple'"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                rows={3}
              />
            </div>
          )}
          <Button onClick={handleEdit} disabled={isLoading || !image || !prompt}>
            {isLoading ? 'Editing...' : 'Edit Image'}
          </Button>
        </div>

        {/* Output Column */}
        <div className="flex flex-col items-center justify-center bg-gray-900 rounded-lg p-4 min-h-[300px]">
          {isLoading && <Spinner text="Gemini is working its magic..."/>}
          {error && <Alert message={error} />}
          {editedImage && !isLoading && (
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-2 text-center">Edited Image</h3>
              <img src={`data:image/png;base64,${editedImage}`} alt="Edited result" className="rounded-lg shadow-lg w-full h-auto object-contain" />
            </div>
          )}
          {!editedImage && !isLoading && !error && (
            <div className="text-center text-gray-500">
                <p>Your edited image will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;