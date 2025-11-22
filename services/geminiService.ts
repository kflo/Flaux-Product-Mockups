import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. Please set your API key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY" });

/**
 * Edits an image using a text prompt.
 * @param base64Image The base64 encoded image data.
 * @param mimeType The MIME type of the image.
 * @param prompt The text prompt for editing.
 * @returns A promise that resolves to the base64 string of the edited image.
 */
export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: prompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error("No image data found in the API response.");
};

/**
 * Creates a product mockup by placing a logo on a product described by a prompt.
 * @param base64Logo The base64 encoded logo data.
 * @param mimeType The MIME type of the logo.
 * @param productPrompt A description of the product for the mockup.
 * @returns A promise that resolves to the base64 string of the mockup image.
 */
export const createMockup = async (base64Logo: string, mimeType: string, productPrompt: string): Promise<string> => {
  const fullPrompt = `Create a high-quality, photorealistic product mockup of ${productPrompt}. Place the following logo onto the product in a natural and appealing way. The logo should be clearly visible and centered appropriately. The background should be clean and professional.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Logo, mimeType } },
        { text: fullPrompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error("No image data found in the API response.");
};

/**
 * Creates a product mockup by placing a logo on a subject image.
 * @param base64Logo The base64 encoded logo data.
 * @param logoMimeType The MIME type of the logo.
 * @param base64Subject The base64 encoded subject image data.
 * @param subjectMimeType The MIME type of the subject image.
 * @returns A promise that resolves to the base64 string of the mockup image.
 */
export const createMockupWithImage = async (
    base64Logo: string, 
    logoMimeType: string, 
    base64Subject: string, 
    subjectMimeType: string
): Promise<string> => {
  const fullPrompt = "Place the first image, which is a logo, onto the second image, which is a product. The result should be a photorealistic mockup. The logo should be integrated naturally, considering the product's texture, lighting, and shape.";
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Logo, mimeType: logoMimeType } },
        { inlineData: { data: base64Subject, mimeType: subjectMimeType } },
        { text: fullPrompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error("No image data found in the API response.");
};


/**
 * Generates an image from a text prompt using Imagen.
 * @param prompt The text prompt for image generation.
 * @returns A promise that resolves to the base64 string of the generated image.
 */
export const generateImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            aspectRatio: '1:1',
            outputMimeType: 'image/png'
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const imageData = response.generatedImages[0].image.imageBytes;
        if (imageData) {
            return imageData;
        }
    }
    
    throw new Error("Image generation failed or returned no data.");
};