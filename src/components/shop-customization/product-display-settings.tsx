import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Toggle } from '@/components/ui/toggle';
import { useShopCustomization } from '@/routes/dashboard/shop-customization';
import { LayoutGrid, DollarSign, FileText, Image as ImageIcon } from 'lucide-react';

export function ProductDisplaySettings() {
  const { 
    productLayout, 
    setProductLayout, 
    showPrice, 
    setShowPrice, 
    showDescription, 
    setShowDescription, 
    showThumbnails, 
    setShowThumbnails 
  } = useShopCustomization();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-none shadow-sm">
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Product Display Settings</h2>
        
        <div className="space-y-6">
          <div>
            <Label className="text-gray-700 mb-2 block">Product Layout</Label>
            <RadioGroup 
              value={productLayout} 
              onValueChange={setProductLayout}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-purple-50 transition-colors">
                <RadioGroupItem value="grid" id="grid" />
                <Label htmlFor="grid" className="flex items-center gap-2 cursor-pointer">
                  <LayoutGrid className="h-5 w-5 text-purple-500" />
                  <span>Grid Layout</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-purple-50 transition-colors">
                <RadioGroupItem value="list" id="list" />
                <Label htmlFor="list" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-5 w-5 text-purple-500" />
                  <span>List Layout</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-gray-700">Display Options</Label>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-500" />
                <span>Show Price</span>
              </div>
              <Toggle 
                pressed={showPrice} 
                onPressedChange={setShowPrice}
                className="data-[state=on]:bg-purple-500"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                <span>Show Description</span>
              </div>
              <Toggle 
                pressed={showDescription} 
                onPressedChange={setShowDescription}
                className="data-[state=on]:bg-purple-500"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-purple-500" />
                <span>Show Thumbnails</span>
              </div>
              <Toggle 
                pressed={showThumbnails} 
                onPressedChange={setShowThumbnails}
                className="data-[state=on]:bg-purple-500"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 