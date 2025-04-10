import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for access token in cookies
    const checkAccessToken = async () => {
      const cookies = await window.healthMateAPI.getCookies();
      const accessToken = cookies.find(cookie => cookie.name === 'healthMateSession');
      console.log(accessToken);
      if (accessToken) {
        // Fetch user role
        const response = await window.healthMateAPI.getUserRole();
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
  }, [router]);

  return null;
}
