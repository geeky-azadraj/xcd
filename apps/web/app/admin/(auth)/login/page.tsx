'use client';
import LoginWithSSO from '@/components/(auth)/LoginWithSSO';
import AuthShowcase from '@/components/(auth)/AuthShowcase';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-end justify-end">
      {/* Left Side - Login Form */}
      <div className="w-[50%] flex items-center justify-center">
        <LoginWithSSO handleSSOLogin={() => {console.log('SSO login')}} />
      </div>
      
      {/* Right Side - Auth Showcase */}
      <div className="w-[45%] flex items-center justify-end">
        <AuthShowcase />
      </div>
    </div>
  );
}
