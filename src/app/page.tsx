"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { AxiosError } from "axios";
import Loader from '@/components/Loader';

export default function LoginPage() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      try {
         setIsLoading(true);
         const res = await api.post("/auth/login", { email, password });
         saveToken(res.data.token);
         router.push("/dashboard");
      } catch (err: unknown) {
          if (err instanceof AxiosError) {
              console.log(err);
          }
          setError("Invalid credentials");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
         <form
            onSubmit={handleLogin}
            className="bg-white p-8 rounded shadow-md w-full max-w-md"
         >
            <h2 className="text-2xl font-bold mb-6 text-black">Login</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <input
               type="email"
               placeholder="Email"
               className="w-full border border-gray-300 p-2 rounded mb-4 text-black"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
            />

            <input
               type="password"
               placeholder="Password"
               className="w-full border border-gray-300 p-2 rounded mb-6 text-black"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
            />

            <button
               type="submit"
               className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition h-10"
            >
               {isLoading ? <Loader /> : "Login"}

               {/* <Loader /> */}
            </button>
         </form>
      </main>
   );
}
