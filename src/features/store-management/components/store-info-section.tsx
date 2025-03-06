'use client';
import { useEffect, useCallback, useState } from 'react';
import { Section, SectionTitle, SectionContent } from '@/components/section';
import {
  FormLabel,
  FormItem,
  Form,
  FormField,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { storeSchema, type StoreFormValues } from '../utils/form-schema';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PageState } from './store-management-page';
import { useStores } from '@/hooks/use-stores';
import { StoreRestResponse } from '@/lib/api';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { FileUploader } from '@/components/file-uploader';
import { getPresignedUploadUrl, getPresignedGetUrl } from '@/lib/api/sdk.gen';
import Image from 'next/image';
import { useLeagues } from '@/hooks/use-leagues';

const facilityTypeMap = {
  PARKING_LOT: '주차 가능',
  CREDIT_CARD: '신용카드 가능',
  WIFI: '와이파이',
  RESERVATION: '예약가능',
  GROUP_TABLE: '단체석',
  SMOKING_ROOM: '흡연실',
  VALET_PARKING: '발렛파킹'
} as const;

interface StoreInfoSectionProps {
  selectedStore: StoreRestResponse | null;
  pageState: PageState;
}

export default function StoreInfoSection({
  selectedStore,
  pageState
}: StoreInfoSectionProps) {
  console.log('🚀 ~ selectedStore:', selectedStore);
  const { createStore, updateStore } = useStores();
  const open = useDaumPostcodePopup();
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [filePreviewMap, setFilePreviewMap] = useState<Record<string, string>>(
    {}
  );
  const { leagues } = useLeagues();

  // Function to test if an image URL is accessible
  const testImageUrl = async (url: string): Promise<boolean> => {
    try {
      console.log(`Testing image URL: ${url}`);
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`URL test result: ${response.status} ${response.statusText}`);
      return response.ok;
    } catch (error) {
      console.error(`Error testing URL ${url}:`, error);
      return false;
    }
  };

  useEffect(() => {
    const loadPreviewUrls = async () => {
      if (selectedStore?.store_image_file_ids?.length) {
        console.log(
          'Loading images for file IDs:',
          selectedStore.store_image_file_ids
        );
        const newFilePreviewMap: Record<string, string> = {};

        const urls = await Promise.all(
          selectedStore.store_image_file_ids.map(async (fileId) => {
            console.log(`Fetching presigned URL for file ID: ${fileId}`);
            try {
              // Try up to 3 times to get a valid presigned URL
              let attempts = 0;
              let url = '';

              while (attempts < 3 && !url) {
                attempts++;
                try {
                  const response = await getPresignedGetUrl({
                    path: { fileId: String(fileId) }
                  });

                  console.log(
                    `Response for file ${fileId} (attempt ${attempts}):`,
                    response
                  );

                  url = response.data?.data?.object_url || '';
                  console.log(`Got URL for file ${fileId}:`, url);

                  if (!url) {
                    console.warn(
                      `Empty URL received for file ${fileId}, retrying...`
                    );
                    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms before retry
                  }
                } catch (retryError) {
                  console.error(
                    `Error on attempt ${attempts} for file ${fileId}:`,
                    retryError
                  );
                  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms before retry
                }
              }

              if (url) {
                // Test if the URL is accessible
                const isAccessible = await testImageUrl(url);
                console.log(`URL ${url} is accessible: ${isAccessible}`);

                if (isAccessible) {
                  newFilePreviewMap[String(fileId)] = url;
                } else {
                  console.warn(
                    `URL ${url} is not accessible, won't add to preview map`
                  );
                }
              }
              return url;
            } catch (error) {
              console.error(
                `Error getting presigned URL for file ${fileId}:`,
                error
              );
              return '';
            }
          })
        );

        console.log('All image URLs:', urls);
        console.log('File preview map:', newFilePreviewMap);

        setPreviewUrls(urls.filter(Boolean));
        setFilePreviewMap(newFilePreviewMap);
      } else {
        setFilePreviewMap({});
        setPreviewUrls([]);
      }
    };

    loadPreviewUrls();
  }, [selectedStore?.store_image_file_ids]);

  const handleUpload = async (files: File[]) => {
    console.log(
      `Starting upload for ${files.length} files:`,
      files.map((f) => f.name)
    );

    for (const file of files) {
      try {
        console.log(
          `Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`
        );

        // Get presigned URL
        console.log('Requesting presigned upload URL...');
        const presignedResponse = await getPresignedUploadUrl({
          query: {
            filename: file.name
          }
        });
        console.log('Presigned upload response:', presignedResponse);

        if (!presignedResponse.data?.data) {
          console.error(
            'No data in presigned URL response:',
            presignedResponse
          );
          throw new Error('Failed to get presigned URL');
        }

        const { upload_url: presignedUrl, file: uploadedFile } =
          presignedResponse.data.data;
        console.log('Got presigned URL:', presignedUrl);
        console.log('File metadata:', uploadedFile);

        // Create a local preview URL for the uploaded file
        const fileUrl = URL.createObjectURL(file);
        console.log('Created local preview URL:', fileUrl);

        // Update filePreviewMap with the new file
        setFilePreviewMap((prev) => ({
          ...prev,
          [String(uploadedFile.id)]: fileUrl
        }));
        console.log(`Added file ID ${uploadedFile.id} to preview map`);

        // Update form value
        const currentFileIds = form.getValues('store_image_file_ids') || [];
        console.log('Current file IDs in form:', currentFileIds);

        form.setValue('store_image_file_ids', [
          ...currentFileIds,
          String(uploadedFile.id)
        ]);
        console.log('Updated form with new file ID:', uploadedFile.id);

        // Upload file to S3
        console.log('Uploading file to S3...');
        try {
          const response = await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type
            }
          });
          console.log('S3 upload response:', response);

          if (!response.ok) {
            console.error('S3 upload failed with status:', response.status);
            console.error(
              'S3 upload error details:',
              await response.text().catch(() => 'No response text')
            );
            throw new Error(
              `Failed to upload file: ${response.status} ${response.statusText}`
            );
          }

          console.log('S3 upload successful!');
        } catch (uploadError) {
          console.error('Error during S3 upload:', uploadError);
          // Even if S3 upload fails, we'll keep the file ID in the form
          // This way, the backend can handle the file that was registered but not uploaded
          console.warn('Keeping file ID in form despite upload failure');
        }

        // Update progress
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: 100
        }));
        console.log(`Set upload progress for ${file.name} to 100%`);
      } catch (error) {
        console.error('Error uploading file:', error);
        // Update progress for error
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: 0
        }));
      }
    }
  };

  const handleDeleteImage = (fileId: string) => {
    // Remove from form values
    const currentFileIds = form.getValues('store_image_file_ids') || [];
    const updatedFileIds = currentFileIds.filter((id) => id !== fileId);
    form.setValue('store_image_file_ids', updatedFileIds);

    // Remove from preview map
    const updatedFilePreviewMap = { ...filePreviewMap };
    delete updatedFilePreviewMap[fileId];
    setFilePreviewMap(updatedFilePreviewMap);

    // If it was a local object URL, revoke it to free up memory
    if (filePreviewMap[fileId] && filePreviewMap[fileId].startsWith('blob:')) {
      URL.revokeObjectURL(filePreviewMap[fileId]);
    }
  };

  const initialValues: StoreFormValues = selectedStore
    ? {
        name: selectedStore.name,
        phone_number: selectedStore.phone_number,
        address: selectedStore.address,
        league_id: Number(selectedStore.league_id),
        longitude: selectedStore.longitude || 0,
        latitude: selectedStore.latitude || 0,
        store_image_file_ids: selectedStore.store_image_file_ids || [],
        available_facility_types: selectedStore.available_facility_types.map(
          (info) => {
            const entry = Object.entries(facilityTypeMap).find(
              ([_, value]) => (value as string) === info
            );
            return entry ? (entry[0] as keyof typeof facilityTypeMap) : 'WIFI';
          }
        )
      }
    : {
        name: '',
        phone_number: '',
        address: '',
        league_id: 1,
        longitude: 0,
        latitude: 0,
        store_image_file_ids: [],
        available_facility_types: []
      };

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    mode: 'onChange',
    defaultValues: initialValues
  });

  const handleComplete = useCallback(
    (data: any) => {
      let fullAddress = data.address;
      let extraAddress = '';

      if (data.addressType === 'R') {
        if (data.bname !== '') {
          extraAddress += data.bname;
        }
        if (data.buildingName !== '') {
          extraAddress +=
            extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
      }

      form.setValue('address', fullAddress);
      form.setValue('longitude', Number(data.x));
      form.setValue('latitude', Number(data.y));
    },
    [form]
  );

  const handleClick = useCallback(() => {
    open({ onComplete: handleComplete });
  }, [open, handleComplete]);

  const onSubmit = useCallback(
    (data: StoreFormValues) => {
      if (pageState === 'create') {
        createStore(data);
      } else if (pageState === 'update' && selectedStore) {
        updateStore({
          storeId: Number(selectedStore.id),
          ...data
        });
      }
    },
    [pageState, selectedStore, createStore, updateStore]
  );

  const readOnly = pageState === 'read';

  return (
    <Section>
      <SectionTitle>매장 정보</SectionTitle>
      <SectionContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>매장 이름</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='매장 이름을 입력하세요'
                      disabled={readOnly}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>전화번호</FormLabel>
                  <FormControl>
                    <Input
                      type='tel'
                      placeholder='전화번호를 입력하세요'
                      disabled={readOnly}
                      {...field}
                      onInput={(e) => {
                        let value = e.currentTarget.value.replace(/\D/g, '');
                        if (value.length > 3 && value.length <= 7) {
                          value = value.replace(/(\d{3})(\d+)/, '$1-$2');
                        } else if (value.length > 7) {
                          value = value.replace(
                            /(\d{3})(\d{4})(\d+)/,
                            '$1-$2-$3'
                          );
                        }
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>매장 주소</FormLabel>
                  <div className='flex gap-2'>
                    <FormControl>
                      <Input
                        placeholder='매장 주소를 입력하세요'
                        disabled={readOnly}
                        {...field}
                      />
                    </FormControl>
                    {!readOnly && (
                      <Button
                        type='button'
                        variant='outline'
                        onClick={handleClick}
                        className='w-32'
                      >
                        주소 검색
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='league_id'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>리그</FormLabel>
                  <FormControl>
                    <Select
                      value={String(value)}
                      disabled={readOnly}
                      onValueChange={(val) => onChange(Number(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='리그 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {leagues?.data?.map((league) => (
                          <SelectItem key={league.id} value={String(league.id)}>
                            {league.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>편의정보</FormLabel>
              <div className={cn('grid grid-cols-2 gap-2')}>
                {Object.entries(facilityTypeMap).map(([type, label]) => (
                  <FormField
                    key={type}
                    control={form.control}
                    name='available_facility_types'
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={type}
                          className='mb-0 flex flex-row items-start space-x-3 space-y-0'
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                type as keyof typeof facilityTypeMap
                              )}
                              disabled={readOnly}
                              onCheckedChange={(checked) => {
                                const facilityType =
                                  type as keyof typeof facilityTypeMap;
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      facilityType
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== facilityType
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className='text-sm font-normal'>
                            {label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </FormItem>
            <FormField
              control={form.control}
              name='store_image_file_ids'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>매장 이미지</FormLabel>
                  <FormControl>
                    <div className='space-y-4'>
                      <FileUploader
                        disabled={readOnly}
                        onUpload={handleUpload}
                        progresses={uploadProgress}
                        maxFiles={5}
                        multiple={true}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 5} // 5MB
                      />

                      {/* Debug info */}
                      <div className='mb-2 text-xs text-gray-500'>
                        <p>
                          File IDs in form: {field.value?.join(', ') || 'None'}
                        </p>
                        <p>
                          Preview URLs available:{' '}
                          {Object.keys(filePreviewMap).length}
                        </p>
                      </div>

                      {field.value && field.value.length > 0 ? (
                        <div className='grid grid-cols-3 gap-4'>
                          {field.value.map((fileId) => {
                            const previewUrl = filePreviewMap[fileId];
                            console.log(
                              `Rendering image for ${fileId}, URL: ${previewUrl}`
                            );

                            if (!previewUrl) {
                              return (
                                <div
                                  key={fileId}
                                  className='group relative flex aspect-square items-center justify-center rounded-lg bg-gray-200'
                                >
                                  <p className='text-xs text-gray-500'>
                                    이미지 로딩 중...
                                  </p>
                                  {!readOnly && (
                                    <button
                                      type='button'
                                      onClick={() => handleDeleteImage(fileId)}
                                      className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100'
                                      aria-label='Delete image'
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              );
                            }

                            return (
                              <div
                                key={fileId}
                                className='group relative aspect-square'
                              >
                                <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100'>
                                  <p className='text-xs text-gray-500'>
                                    로딩 중...
                                  </p>
                                </div>
                                <Image
                                  src={previewUrl}
                                  alt={`Store image`}
                                  fill
                                  className='rounded-lg object-cover'
                                  onError={(e) => {
                                    console.error(
                                      `Failed to load image from URL: ${previewUrl}`
                                    );
                                    // Set a fallback image or placeholder
                                    (e.target as HTMLImageElement).src =
                                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="%23999"%3EImage Error%3C/text%3E%3C/svg%3E';
                                  }}
                                  onLoad={() => {
                                    console.log(
                                      `Image for ${fileId} loaded successfully`
                                    );
                                  }}
                                />
                                {!readOnly && (
                                  <button
                                    type='button'
                                    onClick={() => handleDeleteImage(fileId)}
                                    className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100'
                                    aria-label='Delete image'
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className='rounded-lg border border-dashed border-gray-300 py-4 text-center'>
                          <p className='text-gray-500'>이미지가 없습니다</p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!readOnly && (
              <Button type='submit'>
                {pageState === 'create' ? '추가' : '수정'}
              </Button>
            )}
          </form>
        </Form>
      </SectionContent>
    </Section>
  );
}
