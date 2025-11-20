import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
    const navigate = useNavigate();
    const [storeName, setStoreName] = useState('');
    const [pin, setPin] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple simulation for now
        if (pin === '1234') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('storeName', storeName || 'My Kirana Store');
            navigate('/');
        } else {
            alert('Invalid PIN (Try 1234)');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md p-8 mx-4">
                <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-white/20 animate-scale-in">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center shadow-lg mb-4">
                            <Store size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white text-center">Welcome Back</h1>
                        <p className="text-gray-300 text-center mt-2">Nepal Grocery Billing Software</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">Store Name</label>
                            <Input
                                placeholder="e.g. Ram Kirana Pasal"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">Access PIN</label>
                            <Input
                                type="password"
                                placeholder="Enter PIN (1234)"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                            />
                        </div>

                        <Button className="w-full py-3 text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all">
                            Open System <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </form>

                    <p className="text-center text-gray-400 text-xs mt-8">
                        Powered by SangamBaral • v1.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
