import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useShopCustomization } from '@/routes/dashboard/shop-customization';
import { Link as LinkIcon, Type, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { uploadFile } from '@/lib/upload';
import { 
  Dropzone,
  DropzoneZone,
  DropzoneUploadIcon,
  DropzoneGroup,
  DropzoneTitle,
  DropzoneDescription,
  DropzoneTrigger,
  DropzoneInput,
  DropzoneAccepted,
  DropzoneRejected
} from '@/components/ui/dropzone';
import { useCallback } from 'react';

export function BannerSettings() {
  const { 
    bannerImage, 
    bannerLink, 
    bannerText, 
    setBannerImage, 
    setBannerLink, 
    setBannerText 
  } = useShopCustomization();
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      // Upload the file to Supabase storage
      uploadFile(file, 'thumbnails')
        .then(({ fileUrl }) => {
          setBannerImage(fileUrl);
          toast.success('Banner image uploaded successfully');
        })
        .catch((error) => {
          console.error('Error uploading banner image:', error);
          toast.error('Failed to upload banner image');
        })
        .finally(() => {
          setIsUploading(false);
        });
    }
  }, [setBannerImage]);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-none shadow-sm">
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Banner Settings</h2>
        
        <div className="space-y-4">
          <div>
            <Label className="text-gray-700">Banner Image</Label>
            <div className="mt-1">
              {bannerImage ? (
                <div className="relative mb-4">
                  <img 
                    src={bannerImage} 
                    alt="Banner Preview" 
                    className="w-full h-auto rounded-lg shadow-md"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      setBannerImage(undefined);
                      toast.success('Banner image removed');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Dropzone
                  onDrop={onDrop}
                  accept={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
                  }}
                  maxSize={5 * 1024 * 1024} // 5MB
                  disabled={isUploading}
                >
                  <DropzoneTrigger asChild>
                    <DropzoneZone className="h-32 border-2 border-dashed border-purple-200 rounded-lg bg-white hover:border-purple-300 transition-colors cursor-pointer relative">
                      <DropzoneGroup>
                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center">
                            <Loader2 className="h-8 w-8 text-purple-500 animate-spin mb-2" />
                            <DropzoneTitle>Uploading...</DropzoneTitle>
                          </div>
                        ) : (
                          <>
                            <DropzoneUploadIcon className="text-purple-500" />
                            <DropzoneTitle>Upload Banner Image</DropzoneTitle>
                            <DropzoneDescription>
                              Drag & drop an image here, or click to select
                            </DropzoneDescription>
                            <DropzoneDescription className="text-xs">
                              PNG, JPG, GIF up to 5MB
                            </DropzoneDescription>
                          </>
                        )}
                      </DropzoneGroup>
                      <DropzoneInput />
                    </DropzoneZone>
                  </DropzoneTrigger>
                  <DropzoneAccepted>
                    {(acceptedFiles) => {
                      // We're handling this in onDrop callback
                      return null;
                    }}
                  </DropzoneAccepted>
                  <DropzoneRejected>
                    {(rejections) => {
                      toast.error('Please upload an image file (PNG, JPG, GIF) under 5MB');
                      return null;
                    }}
                  </DropzoneRejected>
                </Dropzone>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="bannerLink" className="text-gray-700">Banner Link (Optional)</Label>
            <div className="flex gap-2 mt-1">
              <LinkIcon className="h-5 w-5 text-purple-500 mt-2" />
              <Input 
                id="bannerLink" 
                placeholder="https://example.com" 
                value={bannerLink || ''} 
                onChange={(e) => setBannerLink(e.target.value)}
                className="border-purple-100 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              When clicked, the banner will redirect to this URL.
            </p>
          </div>

          <div>
            <Label htmlFor="bannerText" className="text-gray-700">Banner Text (Optional)</Label>
            <div className="flex gap-2 mt-1">
              <Type className="h-5 w-5 text-purple-500 mt-2" />
              <Input 
                id="bannerText" 
                placeholder="Special offer: 20% off all products!" 
                value={bannerText || ''} 
                onChange={(e) => setBannerText(e.target.value)}
                className="border-purple-100 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This text will be displayed over the banner image.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}