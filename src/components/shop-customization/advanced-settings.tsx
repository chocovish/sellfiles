import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useShopCustomization } from '@/routes/dashboard/shop-customization';
import { Code } from 'lucide-react';

export function AdvancedSettings() {
  const { 
    customCss, 
    setCustomCss, 
    customJs, 
    setCustomJs 
  } = useShopCustomization();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-none shadow-sm">
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Advanced Settings</h2>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="customCss" className="text-gray-700 mb-2 block">Custom CSS</Label>
            <Textarea
              id="customCss"
              placeholder="/* Add your custom CSS here */"
              value={customCss || ''}
              onChange={(e) => setCustomCss(e.target.value)}
              className="font-mono h-40 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add custom CSS to style your shop. This will be applied after the default styles.
            </p>
          </div>

          <div>
            <Label htmlFor="customJs" className="text-gray-700 mb-2 block">Custom JavaScript</Label>
            <Textarea
              id="customJs"
              placeholder="// Add your custom JavaScript here"
              value={customJs || ''}
              onChange={(e) => setCustomJs(e.target.value)}
              className="font-mono h-40 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add custom JavaScript to enhance your shop's functionality. Be careful with this as it can affect performance.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-start gap-2">
              <Code className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Advanced Usage Warning</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Custom CSS and JavaScript can break your shop if not implemented correctly. 
                  Make sure to test your changes thoroughly before saving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 