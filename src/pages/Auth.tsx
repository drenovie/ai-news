import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Auth() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-md py-16">
        <Card className="border-border relative overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-heading">
              <span className="text-italia-green">It</span>
              <span className="text-foreground">al</span>
              <span className="text-italia-red">ia</span>
              <span className="text-foreground"> Kick</span>
            </CardTitle>
            <CardDescription>Sign in to personalize your experience</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {/* Blurred form with coming soon overlay */}
            <div className="relative">
              <div className="blur-[3px] pointer-events-none select-none" aria-hidden="true">
                <Tabs defaultValue="signin">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" placeholder="you@example.com" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input type="password" placeholder="••••••••" disabled />
                      </div>
                      <Button className="w-full bg-italia-green" disabled>Sign In</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Coming Soon overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg px-6 py-4 text-center border border-border shadow-lg">
                  <p className="text-lg font-heading font-bold text-foreground">Coming Soon</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Authentication will be available shortly.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
