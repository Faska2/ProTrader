import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-muted rounded-lg',
        className
      )}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-5">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <Skeleton className="w-16 h-6 rounded-lg" />
      </div>
      <Skeleton className="w-20 h-3 mb-2" />
      <Skeleton className="w-32 h-8" />
    </div>
  );
};

export const StatsGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = '350px' }) => {
  return (
    <div className="card">
      <Skeleton className="w-40 h-6 mb-8" />
      <div style={{ height }}>
        <div className="w-full h-full bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded-xl animate-pulse" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <Skeleton className="w-11 h-11 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="w-24 h-4" />
            <div className="flex gap-1.5">
              <Skeleton className="w-12 h-3 rounded-md" />
              <Skeleton className="w-14 h-3 rounded-md" />
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <Skeleton className="w-16 h-6 rounded-lg" />
      </td>
      <td className="px-6 py-5">
        <div className="space-y-1">
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-20 h-3" />
        </div>
      </td>
      <td className="px-6 py-5">
        <Skeleton className="w-24 h-4" />
      </td>
      <td className="px-6 py-5">
        <Skeleton className="w-16 h-4" />
      </td>
      <td className="px-6 py-5">
        <Skeleton className="w-20 h-4" />
      </td>
      <td className="px-6 py-5 text-center">
        <Skeleton className="w-14 h-6 rounded-xl mx-auto" />
      </td>
      <td className="px-6 py-5">
        <Skeleton className="w-8 h-8 rounded-xl ml-auto" />
      </td>
    </tr>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="card !p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {Array.from({ length: 8 }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <Skeleton className="w-20 h-3" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <StatsGridSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <ChartSkeleton height="300px" />
      </div>
      <div className="card bg-gradient-to-br from-muted/50 to-muted/30 h-32">
        <div className="flex items-center gap-6 h-full px-4">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-full max-w-md h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
