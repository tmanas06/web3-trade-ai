
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings functionality will be implemented soon. This page is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
