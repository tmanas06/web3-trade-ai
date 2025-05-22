
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Assets = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Assets</h1>
      
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Your Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Asset management functionality will be implemented soon. This page is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Assets;
