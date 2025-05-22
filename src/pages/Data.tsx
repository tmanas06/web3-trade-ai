
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Data = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Data</h1>
      
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Data Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Data analytics functionality will be implemented soon. This page is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Data;
