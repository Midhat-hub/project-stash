"use client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
      
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome to Stash</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Everything organized in one place.
          </p>
        </CardContent>
      </Card>

      <Button onClick={() => window.location.href = "/dashboard"}>
        Go to Dashboard
      </Button>
      <button 
  onClick={() => window.location.href="/mock-upi"} 
  className="bg-blue-600 text-white px-5 py-2 rounded-xl mt-4"
>
  Send Money
</button>



      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          This is a test alert to make sure UI is working.
        </AlertDescription>
      </Alert>
    </div>
  );
}
