"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {

  const router = useRouter();

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");

    if (!token) {

      router.replace("/login");

      return;
    }

    localStorage.setItem("jwt", token); console.log("JWT SET:", localStorage.getItem("jwt"));

    router.replace("/");

  }, [router]);

  return (

    <main className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white rounded-3xl shadow-xl p-12">

        <h1 className="text-3xl font-bold">
          Signing you in...
        </h1>

      </div>

    </main>

  );
}
