"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/dashboard");
      } else {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router, supabase]);

  if (checkingSession) {
    return <div className="p-6 text-muted-foreground">Lādē...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm />
    </div>
  );
}
