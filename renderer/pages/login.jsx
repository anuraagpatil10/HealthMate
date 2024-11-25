"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Facebook, Twitter, Github } from "lucide-react"
import { FcGoogle } from "react-icons/fc";
import Link from "next/link"
import Logo from "@/components/Logo"

import { Montserrat } from "next/font/google";
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js

import Error from "@/components/Error"
import { useState } from "react"

const montserratFont = Montserrat({
    weight: ["100", "200", "400", "600"],
    subsets: ["latin"],
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('patient'); // Add state for role selection

  const router = useRouter(); // Initialize the router

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Use IPC to call the login function in the main process
      const response = await window.supabaseAPI.login(email, password);
      
      if (response.error) {
        console.error(response.error);
        setError(response.error);
      } else {
        // Check for access token in cookies
        const checkAccessToken = async () => {
          const cookies = await window.supabaseAPI.getCookies();
          const accessToken = cookies.find(cookie => cookie.name === 'supabaseSession');
          if (accessToken) {
            // Fetch user role
            const response = await window.supabaseAPI.getUserRole();
            if (response.role !== role) {
              setError('Invalid role. Please select the correct role.');
              setLoading(false);
              return;
            }
            if (response.role === 'patient') {
              router.push("/patient/dashboard");
            } else if (response.role === 'doctor') {
              router.push("/doctor/dashboard");
            } else {
              router.push("/login");
            }
          } else {
            router.push("/login");
          }
        };

        checkAccessToken();
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await window.supabaseAPI.loginWithGoogle();
      if (response.error) {
        console.error(response.error);
        setError(response.error);
      } else {
        if (role === 'patient') {
          router.push("/patient/dashboard");
        } else if (role === 'doctor') {
          router.push("/doctor/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className={`${montserratFont.className} bg-[--second] min-h-screen flex flex-col md:flex-row`}>
      <div className="md:w-2/5 p-8 flex flex-col items-center justify-center">
        <Logo logoSize="text-2xl md:text-4xl" imgSize={50} />
        <p className="text-[--foreground] text-center text-lg mt-5">
          Discover the power of personalized health insights and seamless tracking with HealthMate.
        </p>
      </div>
      <div className="bg-white md:w-3/5 p-8 flex flex-col justify-center md:rounded-l-[80px]">
        <h2 className="text-3xl w-full text-center font-bold mb-4">LOGIN</h2>
        <div className="max-w-md w-full mx-auto">
          <Tabs defaultValue="patient" className="w-full mb-6" onValueChange={setRole}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="doctor">Doctors</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="patient">
              {error ? <Error errorMessage={error} /> : null}
              <div className="mt-6 space-y-6">
                <form className="space-y-4" onSubmit={handleLogin}>
                  <Input type="email" name="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Input type="password" name="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  <Button className="w-full bg-[--first] hover:bg-[--second] text-white" type="submit">Log in</Button>
                </form>
                <div className="text-center">
                  <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                    Forgotten password
                  </Link>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">or log in with</p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="icon" onClick={handleGoogleLogin}>
                      <FcGoogle />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Facebook className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Twitter className="w-4 h-4 text-sky-500" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Github className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600">
                  Need an account?{" "}
                  <Link href="/signup" className="text-indigo-600 hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </TabsContent>
            <TabsContent value="doctor">
              {error ? <Error errorMessage={error} /> : null}
              <div className="mt-6 space-y-6">
                <form className="space-y-4" onSubmit={handleLogin}>
                  <Input type="email" name="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Input type="password" name="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  <Button className="w-full bg-[--first] hover:bg-[--second] text-white" type="submit">Log in</Button>
                </form>
                <div className="text-center">
                  <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                    Forgotten password
                  </Link>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">or log in with</p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="icon" onClick={handleGoogleLogin}>
                      <FcGoogle />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Facebook className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Twitter className="w-4 h-4 text-sky-500" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Github className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600">
                  Need an account?{" "}
                  <Link href="/signup" className="text-indigo-600 hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </TabsContent>
            <TabsContent value="admin">
              {error ? <Error errorMessage={error} /> : null}
              <div className="mt-6 space-y-6">
                <form className="space-y-4">
                  <Input type="email" placeholder="Email address" />
                  <Input type="password" placeholder="Password" />
                  <Button className="w-full bg-[--first] hover:bg-[--second] text-white">Log in</Button>
                </form>
                <div className="text-center">
                  <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                    Forgotten password
                  </Link>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">or log in with</p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="icon">
                      <Facebook className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <FcGoogle />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Twitter className="w-4 h-4 text-sky-500" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Github className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600">
                  Need an account?{" "}
                  <Link href="/signup" className="text-indigo-600 hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}