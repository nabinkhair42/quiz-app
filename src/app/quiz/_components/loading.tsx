import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-6 w-[100px]" />
      </div>

      <Skeleton className="h-8 w-full" />

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[300px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
    </div>
  );
} 