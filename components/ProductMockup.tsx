import React, { useState } from 'react';
import { createMockup, createMockupWithImage } from '../services/geminiService';
import ImageUpload from './ImageUpload';
import Button from './Button';
import Spinner from './Spinner';
import Alert from './Alert';
import type { Base64File } from '../utils/fileUtils';

const ProductMockup: React.FC = () => {
  const [logo, setLogo] = useState<Base64File | null>(null);
  const [productPrompt, setProductPrompt] = useState<string>('a white t-shirt');
  const [mockupImage, setMockupImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [subjectImage, setSubjectImage] = useState<Base64File | null>(null);
  const [inputType, setInputType] = useState<'text' | 'image'>('text');

  const handleGenerate = async () => {
    if (!logo) {
      setError('Please upload a logo.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setMockupImage(null);

    try {
      let result;
      if (inputType === 'text') {
        if (!productPrompt) {
          setError('Please describe the product.');
          setIsLoading(false);
          return;
        }
        result = await createMockup(logo.base64, logo.mimeType, productPrompt);
      } else { // inputType === 'image'
        if (!subjectImage) {
          setError('Please upload a product image.');
          setIsLoading(false);
          return;
        }
        result = await createMockupWithImage(
          logo.base64, 
          logo.mimeType, 
          subjectImage.base64, 
          subjectImage.mimeType
        );
      }
      setMockupImage(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isGenerateDisabled = isLoading || !logo || (inputType === 'text' && !productPrompt) || (inputType === 'image' && !subjectImage);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Product Mockup Generator</h2>
      <p className="text-gray-400 mb-6">Upload your logo and generate a photorealistic product mockup.</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-6">
          <ImageUpload onImageUpload={setLogo} label="1. Upload Logo:" />
          {logo && (
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    2. Provide the product:
                </label>
                <div className="flex space-x-2 rounded-md bg-gray-700 p-1 mb-4">
                    <button 
                        onClick={() => setInputType('text')}
                        className={`w-full px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${inputType === 'text' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                    >
                        Describe with Text
                    </button>
                    <button 
                        onClick={() => {
                            setInputType('image');
                        }}
                        className={`w-full px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${inputType === 'image' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                    >
                        Upload an Image
                    </button>
                </div>

                {inputType === 'text' ? (
                    <div>
                        <label htmlFor="productPrompt" className="sr-only">
                            Describe the product:
                        </label>
                        <input
                            type="text"
                            id="productPrompt"
                            value={productPrompt}
                            onChange={(e) => setProductPrompt(e.target.value)}
                            placeholder="e.g., 'a black coffee mug', 'a blue hoodie'"
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                ) : (
                    <ImageUpload onImageUpload={setSubjectImage} label="Upload Product Image:" />
                )}
            </div>
          )}
          <Button onClick={handleGenerate} disabled={isGenerateDisabled}>
            {isLoading ? 'Generating...' : 'Generate Mockup'}
          </Button>
        </div>

        {/* Output Column */}
        <div className="flex flex-col items-center justify-center bg-gray-900 rounded-lg p-4 min-h-[300px]">
          {isLoading && <Spinner text="Building your mockup..."/>}
          {error && <Alert message={error} />}
          {mockupImage && !isLoading && (
            <div className="w-full">
               <h3 className="text-lg font-semibold mb-2 text-center">Your Mockup</h3>
              <img src={`data:image/png;base64,${mockupImage}`} alt="Generated mockup" className="rounded-lg shadow-lg w-full h-auto object-contain" />
            </div>
          )}
           {!mockupImage && !isLoading && !error && (
            <div className="text-center text-gray-500">
                <p>Your product mockup will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductMockup;