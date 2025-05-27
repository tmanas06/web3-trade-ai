import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, ExternalLink } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the appearance of the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-muted-foreground">
                Choose between light and dark themes
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>External Links</CardTitle>
          <CardDescription>Quick access to related platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <h3 className="font-medium">OKX Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Access the OKX trading platform
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a 
                  href="https://www.okx.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Open <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Version 1.0.0</p>
            <p> {new Date().getFullYear()} All rights reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
