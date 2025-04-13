import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useShopCustomization } from '@/routes/dashboard/shop-customization';
import { Palette } from 'lucide-react';

export function GeneralSettings() {
  const { accentColor, setAccentColor } = useShopCustomization();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-none shadow-sm">
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">General Settings</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="accentColor" className="text-gray-700">Accent Color</Label>
            <div className="flex gap-2 mt-1">
              <div className="relative">
                <Input 
                  id="accentColor" 
                  type="color" 
                  value={accentColor} 
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <div 
                  className="absolute inset-0 pointer-events-none rounded-md border border-gray-300"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
              <Input 
                type="text" 
                value={accentColor} 
                onChange={(e) => setAccentColor(e.target.value)}
                className="flex-1 font-mono"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This color will be used for buttons, links, and other interactive elements in your shop.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} 