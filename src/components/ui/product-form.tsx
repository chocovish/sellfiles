import { useState, useEffect } from 'react';
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
import { type createProductInputSchema, type updateProductInputSchema } from "@/actions/products"
import { Star, X } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// SortableThumbnail component for dnd-kit
function SortableThumbnail({ thumbnail, onRemove }: { thumbnail: ThumbnailItem; onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: thumbnail.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };
  
  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="relative rounded-md overflow-hidden border border-gray-200 cursor-move"
          {...attributes}
          {...listeners}>
        
        <img
          src={thumbnail.preview}
          alt="Thumbnail preview"
          className="w-32 h-32 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-white/80 hover:bg-white rounded-full"
            onClick={() => onRemove(thumbnail.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2 bg-gray-800/70 text-xs text-white px-2 py-1 rounded-full">
          #{thumbnail.displayOrder + 1}
        </div>
        {thumbnail.isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
}

type ThumbnailItem = {
  id: string;
  fileUrl: string;
  preview: string;
  displayOrder: number;
  isUploading?: boolean;
};

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  fileUrl: string;
  isVisible: boolean;
  displayOrder: number;
  thumbnails?: ThumbnailItem[];
  productFile?: File[];
};

type ProductFormProps = {
  initialData?: Partial<Product>;
  onSubmit: (data: z.infer<typeof createProductInputSchema | typeof updateProductInputSchema>) => Promise<void>;
  onClose: () => void;
  mode: 'create' | 'edit';
};

const productFormSchemaCreate = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  thumbnails: z.array(z.object({
    id: z.string(),
    fileUrl: z.string(),
    preview: z.string(),
    displayOrder: z.number()
  })).min(1, 'At least one thumbnail is required').max(5, 'Maximum 5 thumbnails allowed'),
  productFile: z.custom<FileList>().refine((files) => files?.length > 0, 'Product file is required')
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, 'File size must be less than 10MB'),
});

const productFormSchemaUpdate = productFormSchemaCreate.partial();

export function ProductForm({ initialData, onSubmit, onClose, mode }: ProductFormProps) {
  const [thumbnails, setThumbnails] = useState<ThumbnailItem[]>(() => {
    if (initialData?.thumbnails && initialData.thumbnails.length > 0) {
      return initialData.thumbnails.map(t => ({
        id: t.id,
        fileUrl: t.fileUrl || '',
        preview: t.fileUrl || '',
        displayOrder: t.displayOrder || 0
      }));
    }
    return [];
  });
  const [filePreview, setFilePreview] = useState<string>(initialData?.fileUrl || '');

  const form = useForm({
    resolver: zodResolver(mode === 'create' ? productFormSchemaCreate : productFormSchemaUpdate),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
    },
  });

  // Update form value when thumbnails change
  useEffect(() => {
    form.setValue('thumbnails', thumbnails);
  }, [thumbnails, form]);

  const handleFormSubmit = async (formData: z.infer<typeof productFormSchemaCreate | typeof productFormSchemaUpdate>) => {
    try {
      const productFile = formData.productFile?.[0];
      let fileUrl = initialData?.fileUrl || '';

      // Get the featured thumbnail URL
      const firstThumbnail = thumbnails[0];
      const imageUrl = firstThumbnail?.fileUrl || initialData?.imageUrl || '';

      if (productFile) {
        const result = await uploadFile(productFile, 'products');
        fileUrl = result.fileUrl;
      }

      const processedThumbnails = thumbnails.map(t => ({
        id: t.id,
        fileUrl: t.fileUrl,
        displayOrder: t.displayOrder
      }));

      if (mode === 'create') {
        const createFormData = formData as z.infer<typeof productFormSchemaCreate>;
        const createData = {
          title: createFormData.title,
          description: createFormData.description,
          price: createFormData.price,
          imageUrl,
          fileUrl,
          thumbnails: processedThumbnails,
        };
        await onSubmit(createData);
      } else {
        const updateFormData = formData as z.infer<typeof productFormSchemaUpdate>;
        const updateData = {
          id: initialData!.id!,
          title: updateFormData.title,
          description: updateFormData.description,
          price: updateFormData.price,
          imageUrl,
          fileUrl,
          thumbnails: processedThumbnails,
        };
        await onSubmit(updateData);
      }
      form.reset();
      toast.success('Product saved successfully');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleAddThumbnail = async (files: File[]) => {
    if (thumbnails.length >= 5) {
      toast.error('Maximum 5 thumbnails allowed');
      return;
    }

    // Create a map of files by name for easy lookup
    const filesByName = new Map(files.map(file => [file.name, file]));

    const newThumbnails: ThumbnailItem[] = files.map(file => ({
      id: file.name,
      fileUrl: '',
      preview: URL.createObjectURL(file),
      displayOrder: thumbnails.length, // Add to end of list
      isUploading: true
    }));

    setThumbnails(prev => [...prev, ...newThumbnails]);

    // Upload each thumbnail immediately
    for (const thumbnail of newThumbnails) {
      const file = filesByName.get(thumbnail.id);
      if (!file) continue;

      try {
        const result = await uploadFile(file, 'thumbnails');
        setThumbnails(prev =>
          prev.map(t => t.id === thumbnail.id ? {
            ...t,
            fileUrl: result.fileUrl,
            isUploading: false
          } : t)
        );
      } catch (error) {
        console.error('Error uploading thumbnail:', error);
        toast.error(`Failed to upload ${thumbnail.id}`);
        setThumbnails(prev => prev.filter(t => t.id !== thumbnail.id));
      }
    }
  };

  const handleRemoveThumbnail = (id: string) => {
    setThumbnails(prev => {
      const newThumbnails = prev.filter(t => t.id !== id);
      // Reorder thumbnails after removal
      newThumbnails.forEach((t, index) => {
        t.displayOrder = index;
      });
      return newThumbnails;
    });
  };

  const handleReorderThumbnails = (activeId: string, overId: string) => {
    setThumbnails(prev => {
      const oldIndex = prev.findIndex(t => t.id === activeId);
      const newIndex = prev.findIndex(t => t.id === overId);
      
      const newThumbnails = arrayMove(prev, oldIndex, newIndex);
      return newThumbnails.map((t, index) => ({ ...t, displayOrder: index }));
    });
  };
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
                    value={field.value ?? ""}
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
            name="thumbnails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail Images (Max 5)</FormLabel>
                <FormControl>
                  {/* dnd-kit implementation */}
                  <div className="space-y-4">
                    <DndContext 
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => {
                        const { active, over } = event;
                        if (over && active.id !== over.id) {
                          handleReorderThumbnails(active.id.toString(), over.id.toString());
                        }
                      }}
                    >
                      <SortableContext 
                        items={thumbnails.map(t => t.id)}
                        strategy={horizontalListSortingStrategy}
                      >
                        <div className="flex gap-3">
                          {/* Thumbnails display */}
                          {thumbnails.map((thumbnail) => (
                            <SortableThumbnail 
                              key={thumbnail.id} 
                              thumbnail={thumbnail} 
                              onRemove={handleRemoveThumbnail} 
                            />
                          ))}


                          {thumbnails.length < 5 && (
                            <div className="w-32 h-32">
                              <Dropzone
                                accept={{
                                  'image/jpeg': ['.jpg', '.jpeg'],
                                  'image/png': ['.png'],
                                }}
                                onDropAccepted={handleAddThumbnail}
                              >
                                <div className="w-full h-full">
                                  <DropzoneZone className="w-full h-full border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                                    <DropzoneInput type="file" multiple />
                                    <DropzoneGroup className="gap-2">
                                      <DropzoneUploadIcon />
                                      <p className="text-xs text-center text-gray-500">
                                        Upload more ({5 - thumbnails.length} left)
                                      </p>
                                    </DropzoneGroup>
                                  </DropzoneZone>
                                </div>
                              </Dropzone>
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>

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