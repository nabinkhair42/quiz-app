import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-10 w-[100px]" />
        <div>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-[100px]" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-[80px]" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    </div>
  );
} 