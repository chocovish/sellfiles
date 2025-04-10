'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './button';
import { Card } from './card';
import { uploadFile } from '@/lib/upload';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from './input';
import { useForm } from 'react-hook-form';
import {
  Dropzone,
  DropzoneDescription,
  DropzoneGroup,
  DropzoneInput,
  DropzoneTitle,
  DropzoneUploadIcon,
  DropzoneZone,
} from '@/components/ui/dropzone';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/rich-text/rich-text-editor';
import {type createProductInputSchema} from "@/actions/products"
type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  fileUrl: string;
  isVisible: boolean;
  displayOrder: number;
  thumbnail?: File[];
  productFile?: File[];
};

type ProductFormProps = {
  initialData?: Partial<Product>;
  onSubmit: (data: z.infer<typeof createProductInputSchema> ) => Promise<void>;
  onClose: () => void;
  mode: 'create' | 'edit';
};

const productFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  thumbnail: z.custom<FileList>(),
  productFile: z.custom<FileList>(),
});

export function ProductForm({ initialData, onSubmit, onClose, mode }: ProductFormProps) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(initialData?.imageUrl || '');
  const [filePreview, setFilePreview] = useState<string>(initialData?.fileUrl || '');

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
    },
  });

  const handleFormSubmit = async (formData: z.infer<typeof productFormSchema>) => {
    try {
      const thumbnailFile = formData.thumbnail?.[0];
      const productFile = formData.productFile?.[0];

      let imageUrl = initialData?.imageUrl || '';
      let fileUrl = initialData?.fileUrl || '';

      if (thumbnailFile) {
        const result = await uploadFile(thumbnailFile, 'thumbnails');
        imageUrl = result.fileUrl;
      }

      if (productFile) {
        const result = await uploadFile(productFile, 'products');
        fileUrl = result.fileUrl;
      }

      const data = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        imageUrl,
        fileUrl,
      };

      await onSubmit(data);
      form.reset();
      toast.success('Product saved successfully');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg transform hover:scale-[1.01] transition-all duration-300">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    className="pl-8"
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Thumbnail Image</FormLabel>
                <FormControl>
                  <Dropzone
                    accept={{
                      'image/jpeg': ['.jpg', '.jpeg'],
                      'image/png': ['.png'],
                    }}
                    onDropAccepted={(files) => {
                      onChange(files);
                      const file = files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setThumbnailPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }}
                  >
                    <div className="grid gap-4">
                      <DropzoneZone>
                        <DropzoneInput type="file" {...field} />
                        <DropzoneGroup className="gap-4">
                          {thumbnailPreview ? (
                            <img
                              src={thumbnailPreview}
                              alt="Preview"
                              className="max-w-full max-h-48 mx-auto"
                            />
                          ) : (
                            <DropzoneGroup>
                              <DropzoneUploadIcon />
                              <DropzoneTitle>Drop files here or click to upload</DropzoneTitle>
                              <DropzoneDescription>
                                You can upload files up to 10MB in size. Supported formats: JPG, PNG.
                              </DropzoneDescription>
                            </DropzoneGroup>
                          )}
                        </DropzoneGroup>
                      </DropzoneZone>
                    </div>
                  </Dropzone>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productFile"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Product File</FormLabel>
                <FormControl>
                  <Dropzone
                    onDropAccepted={(files) => {
                      onChange(files);
                      const file = files[0];
                      setFilePreview(file.name);
                    }}
                  >
                    <div className="grid gap-4">
                      <DropzoneZone>
                        <DropzoneInput {...field} />
                        <DropzoneGroup className="gap-4">
                          {filePreview ? (
                            <div className="flex max-w-full  truncate items-center justify-center space-x-2">
                              {filePreview}
                            </div>
                          ) : (
                            <DropzoneGroup>
                              <DropzoneUploadIcon />
                              <DropzoneTitle>Drop files here or click to upload</DropzoneTitle>
                              <DropzoneDescription>
                                You can upload files up to 10MB in size. Supported formats: PDF, ZIP,
                                etc.
                              </DropzoneDescription>
                            </DropzoneGroup>
                          )}
                        </DropzoneGroup>
                      </DropzoneZone>
                    </div>
                  </Dropzone>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            variant="gradient2"
          >
            {mode === 'create' ? 'Create Product' : 'Update Product'}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            type="button"
            className="w-full font-semibold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-[1.02]"
          >
            {mode === 'create' ? 'Cancel create' : 'Cancel update'}
          </Button>
        </form>
      </Form>
    </Card>
  );
}