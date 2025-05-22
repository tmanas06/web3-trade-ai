
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Network = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Network</h1>
      
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Network Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Network monitoring functionality will be implemented soon. This page is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Network;
