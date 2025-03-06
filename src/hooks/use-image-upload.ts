import { useState, useEffect, useCallback } from 'react';
import {
  getPresignedUploadUrl,
  getPresignedGetUrl,
  setFileUploadCompleted
} from '@/lib/api/sdk.gen';
import { UseFormReturn } from 'react-hook-form';

interface UseImageUploadOptions {
  /**
   * Form instance from react-hook-form
   */
  form?: UseFormReturn<any>;
  /**
   * Name of the form field that stores file IDs
   */
  fieldName?: string;
  /**
   * Maximum file size in bytes
   */
  maxFileSize?: number;
}

interface UseImageUploadReturn {
  /**
   * Upload progress for each file
   */
  uploadProgress: Record<string, number>;
  /**
   * Map of file IDs to preview URLs
   */
  filePreviewMap: Record<string, string>;
  /**
   * Array of preview URLs
   */
  previewUrls: string[];
  /**
   * Function to handle file upload
   */
  handleUpload: (files: File[]) => Promise<void>;
  /**
   * Function to handle image deletion
   */
  handleDeleteImage: (fileId: string) => void;
  /**
   * Function to load preview URLs for existing file IDs
   */
  loadPreviewUrls: (fileIds: string[] | number[]) => Promise<void>;
}

/**
 * Custom hook for handling image uploads with presigned URLs
 *
 * This hook handles the entire image upload process:
 * 1. Gets a presigned upload URL
 * 2. Uploads the file to S3
 * 3. Automatically calls setFileUploadCompleted to notify the backend
 * 4. Updates the form with the file ID
 * 5. Manages preview URLs and upload progress
 */
export function useImageUpload({
  form,
  fieldName = 'image_file_ids',
  maxFileSize = 1024 * 1024 * 5 // 5MB
}: UseImageUploadOptions = {}): UseImageUploadReturn {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [filePreviewMap, setFilePreviewMap] = useState<Record<string, string>>(
    {}
  );

  const testImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'GET' });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const loadPreviewUrls = useCallback(async (fileIds: string[] | number[]) => {
    if (!fileIds?.length) {
      setFilePreviewMap({});
      setPreviewUrls([]);
      return;
    }

    const newFilePreviewMap: Record<string, string> = {};

    const urls = await Promise.all(
      fileIds.map(async (fileId) => {
        try {
          let attempts = 0;
          let url = '';

          while (attempts < 3 && !url) {
            attempts++;
            try {
              const response = await getPresignedGetUrl({
                path: { fileId: String(fileId) }
              });

              url = response.data?.data?.object_url || '';

              if (!url) {
                await new Promise((resolve) => setTimeout(resolve, 500));
              }
            } catch (retryError) {
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          }

          if (url) {
            const isAccessible = await testImageUrl(url);
            if (isAccessible) {
              newFilePreviewMap[String(fileId)] = url;
            }
          }
          return url;
        } catch (error) {
          return '';
        }
      })
    );

    setPreviewUrls(urls.filter(Boolean));
    setFilePreviewMap(newFilePreviewMap);
  }, []);

  const handleUpload = async (files: File[]) => {
    for (const file of files) {
      try {
        const presignedResponse = await getPresignedUploadUrl({
          query: {
            filename: file.name
          }
        });

        if (!presignedResponse.data?.data) {
          throw new Error('Failed to get presigned URL');
        }

        const { upload_url: presignedUrl, file: uploadedFile } =
          presignedResponse.data.data;

        const fileUrl = URL.createObjectURL(file);

        setFilePreviewMap((prev) => ({
          ...prev,
          [String(uploadedFile.id)]: fileUrl
        }));

        if (form && fieldName) {
          const currentFileIds = form.getValues(fieldName) || [];
          form.setValue(fieldName, [
            ...currentFileIds,
            String(uploadedFile.id)
          ]);
        }

        try {
          const response = await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type
            }
          });

          if (!response.ok) {
            throw new Error(
              `Failed to upload file: ${response.status} ${response.statusText}`
            );
          }

          try {
            await setFileUploadCompleted({
              path: { fileId: String(uploadedFile.id) }
            });
          } catch (completedError) {
            // Continue even if this fails, as the file is already uploaded to S3
          }
        } catch (uploadError) {
          // Keep the file ID in the form despite upload failure
          // This way, the backend can handle the file that was registered but not uploaded
        }

        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: 100
        }));
      } catch (error) {
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: 0
        }));
      }
    }
  };

  const handleDeleteImage = (fileId: string) => {
    if (form && fieldName) {
      const currentFileIds = form.getValues(fieldName) || [];
      const updatedFileIds = currentFileIds.filter(
        (id: string | number) => id !== fileId
      );
      form.setValue(fieldName, updatedFileIds);
    }

    const updatedFilePreviewMap = { ...filePreviewMap };
    delete updatedFilePreviewMap[fileId];
    setFilePreviewMap(updatedFilePreviewMap);

    if (filePreviewMap[fileId] && filePreviewMap[fileId].startsWith('blob:')) {
      URL.revokeObjectURL(filePreviewMap[fileId]);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(filePreviewMap).forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [filePreviewMap]);

  return {
    uploadProgress,
    filePreviewMap,
    previewUrls,
    handleUpload,
    handleDeleteImage,
    loadPreviewUrls
  };
}
