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
  const { createStore, updateStore } = useStores();
  const open = useDaumPostcodePopup();
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const loadPreviewUrls = async () => {
      if (selectedStore?.store_image_file_ids?.length) {
        const urls = await Promise.all(
          selectedStore.store_image_file_ids.map(async (fileId) => {
            const response = await getPresignedGetUrl({
              path: { fileId: String(fileId) }
            });
            return response.data?.data?.object_url || '';
          })
        );
        setPreviewUrls(urls.filter(Boolean));
      }
    };

    loadPreviewUrls();
  }, [selectedStore?.store_image_file_ids]);

  const handleUpload = async (files: File[]) => {
    for (const file of files) {
      try {
        // Get presigned URL
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

        // Upload file to S3
        const response = await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type
          }
        });

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

        // Update form value
        const currentFileIds = form.getValues('store_image_file_ids') || [];
        form.setValue('store_image_file_ids', [
          ...currentFileIds,
          String(uploadedFile.id)
        ]);

        // Update progress
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: 100
        }));
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
                        {[1, 2, 3].map((id) => (
                          <SelectItem key={id} value={String(id)}>
                            {`리그${id}`}
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
                      {previewUrls.length > 0 && (
                        <div className='grid grid-cols-3 gap-4'>
                          {previewUrls.map((url, index) => (
                            <div key={index} className='relative aspect-square'>
                              <Image
                                src={url}
                                alt={`Store image ${index + 1}`}
                                fill
                                className='rounded-lg object-cover'
                              />
                            </div>
                          ))}
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
