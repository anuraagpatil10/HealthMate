import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";
import Error from "@/components/Error";

const montserratFont = Montserrat({
  weight: ["100", "200", "400", "600"],
  subsets: ["latin"],
});

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState(''); // Add state for role selection
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!role) {
      setError("Please select a role (Patient or Doctor).");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log("Role before API call: ", role); // Add logging here
      
      const response = await window.healthMateAPI.signup(email, password, fullName, phoneNumber, gender, role);
      if (response.error) {
        console.error(response.error);
        setError(response.error);
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className={`${montserratFont.className} min-h-screen bg-[--second] flex flex-col md:flex-row`}>
      <div className="bg-white md:w-3/5 p-8 flex flex-col md:rounded-r-[80px] justify-center">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign up for HealthMate</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your account to start your health journey
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
            <div className="space-y-4">
              {/* Role Selection */}
              <div>
                <Label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Select Role
                </Label>
                <Select name="role" value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role (Patient or Doctor)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Information */}
              <div>
                <Input
                  id="full-name"
                  name="full-name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Input
                  id="phone-number"
                  name="phone-number"
                  type="text"
                  autoComplete="tel"
                  required
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </Label>
                <Select name="gender" value={gender} onValueChange={setGender}>
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
            </div>
            <div>
              <Button className="w-full bg-[--first] hover:bg-[--second] text-white" type="submit" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign up'}
              </Button>
            </div>
          </form>
          {error && <Error errorMessage={error} />}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <div className="bg-[--second] md:w-3/5 p-10 flex flex-col gap-5 items-center text-center justify-center text-white">
        <Logo logoSize="text-2xl md:text-4xl" imgSize={50} />
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
  );
}
