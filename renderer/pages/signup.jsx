import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Facebook, Twitter, Github } from "lucide-react"
import Link from "next/link"
import Logo from "@/components/Logo"

import { Montserrat } from "next/font/google";
const montserratFont = Montserrat({
    weight: ["100", "200", "400", "600"],
    subsets: ["latin"],
});

export default function SignUp() {
  return (
    <div className= {`${montserratFont.className} min-h-screen bg-[--second] flex flex-col md:flex-row `}>
      <div className="bg-white md:w-3/5 p-8 flex flex-col md:rounded-r-[80px] justify-center">
        <div className="max-w-md w-full mx-auto space-y-8 ">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign up for HealthMate</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your account to start your health journey
            </p>
          </div>
            <form className="mt-8 space-y-6" action="#" method="POST">
            <div className="rounded-md shadow-sm space-y-4">
                <div>
                <Input
                    id="full-name"
                    name="full-name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Full Name"
                />
                </div>
                <div>
                <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Email Address"
                />
                </div>
                <div>
                <Input
                    id="phone-number"
                    name="phone-number"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="Phone number"
                />
                </div>
                <div>
                <Select name="gender">
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Password"
                />
                </div>
                <div>
                <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    
                    placeholder="Confirm Password"
                />
                </div>
            </div>

            <div className="flex items-center">
                <Checkbox id="terms" />
                <Label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-900"
                >
                I agree to the{" "}
                <Link href="#" className="text-indigo-600 hover:text-indigo-500">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-indigo-600 hover:text-indigo-500">
                    Privacy Policy
                </Link>
                </Label>
            </div>

            <div>
                <Button className="w-full bg-[--first] hover:bg-[--second] text-white">Sign Up</Button>
            </div>
            </form>

          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <div className="bg-[--second] md:w-3/5 p-10 flex flex-col gap-5 items-center text-center justify-center text-white">
          <Logo />
          <p className="text-xl my-8">
            Discover the power of personalized health insights and seamless tracking with HealthMate.
          </p>
          <ul className="text-left space-y-2">
            <li>✓ Secure and private health data management</li>
            <li>✓ Easy appointment scheduling</li>
            <li>✓ Personalized health insights</li>
            <li>✓ 24/7 access to your health information</li>
          </ul>
      </div>
    </div>
  )
}