"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage("❌ " + error.message);
      } else {
        setMessage("✅ Veiksmīgi pieslēgts!");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage("❌ " + error.message);
      } else {
        setMessage("✅ Reģistrācija veiksmīga! Apstiprini e-pastu.");
      }

      const user = data.user;
      if (user) {
        await supabase.from("users").insert([
          {
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/dashboard");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  });

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center">
        {isLogin ? "Pieslēgties" : "Izveidot kontu"}
      </h2>

      <Input
        type="email"
        placeholder="E-pasts"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Parole"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Gaidi..." : isLogin ? "Pieslēgties" : "Reģistrēties"}
      </Button>

      <div className="text-center text-sm">
        {isLogin ? (
          <span>
            Nav konta?{" "}
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className="underline"
            >
              Reģistrēties
            </button>
          </span>
        ) : (
          <span>
            Jau ir konts?{" "}
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className="underline"
            >
              Pieslēgties
            </button>
          </span>
        )}
      </div>

      {message && <div className="text-sm text-center">{message}</div>}
    </form>
  );
}
