
import React from 'react';
import { Card } from "@/components/ui/card";
import { CircleDollarSign, TrendingUp, WalletIcon, Network } from 'lucide-react';

interface Metric {
  title: string;
  value: string;
  change: {
    value: string;
    positive: boolean;
  };
  icon: React.ReactNode;
}

export function DashboardMetrics() {
  const metrics: Metric[] = [
    {
      title: 'Portfolio Value',
      value: '$14,450.32',
      change: {
        value: '+11.2%',
        positive: true
      },
      icon: <CircleDollarSign className="h-5 w-5 text-crypto-accent" />
    },
    {
      title: 'Trading Volume (24h)',
      value: '$3,241.87',
      change: {
        value: '+5.6%',
        positive: true
      },
      icon: <TrendingUp className="h-5 w-5 text-crypto-accent-purple" />
    },
    {
      title: 'Active Balance',
      value: '$8,923.54',
      change: {
        value: '-2.1%',
        positive: false
      },
      icon: <WalletIcon className="h-5 w-5 text-blue-400" />
    },
    {
      title: 'Network Activity',
      value: '32 TPS',
      change: {
        value: '+15.3%',
        positive: true
      },
      icon: <Network className="h-5 w-5 text-green-400" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="glass-effect p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="text-sm text-gray-300">{metric.title}</div>
            <div className="p-2 rounded-lg bg-white/5">{metric.icon}</div>
          </div>
          <div className="text-2xl font-bold mb-1">{metric.value}</div>
          <div className={`text-sm ${metric.change.positive ? 'text-green-500' : 'text-red-500'}`}>
            {metric.change.positive ? '↑' : '↓'} {metric.change.value} past month
          </div>
        </Card>
      ))}
    </div>
  );
}
