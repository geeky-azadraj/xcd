'use client';

import { Button } from '@/components/ui/button';

const LoginWithSSO = ({ handleSSOLogin }: { handleSSOLogin: () => void }) => {

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-white">
            <div className="w-full max-w-md p-8 bg-white">
                {/* Logo and Header */}
                <div className="w-full flex flex-row items-center gap-4 justify-start mb-9">
                    <div className="flex items-center justify-start">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-col items-start">
                        <h1 className="text-xl font-bold text-typography-900">X-CD</h1>
                        <p className="text-xs text-typography-600">CUSTOMER ADMIN</p>
                    </div>
                </div>

                {/* Welcome Message */}
                <div className="text-left mb-9">
                    <h2 className="text-3xl font-bold text-typography-900">Welcome Admin!</h2>
                </div>

                {/* Login Form */}
                <div>
                    {/* SSO Button */}
                    <Button
                        onClick={handleSSOLogin}
                        variant="outline"
                        className="w-full bg-gray-50 hover:bg-gray-100 text-typography-700 font-medium py-2 px-4 rounded-md border-0 transition-colors duration-200"
                    >
                        Sign in with SSO
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginWithSSO;
