import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { LayoutDashboard, ShoppingCart, Package, Settings, History, Users } from 'lucide-react';
import { db } from '../db';

const Layout = ({ children }) => {
    const location = useLocation();

    const settings = useLiveQuery(() => db.settings.toArray());
    const ownerName = settings?.find(s => s.key === 'ownerName')?.value || 'Store Admin';

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: ShoppingCart, label: 'POS (Billing)', path: '/pos' },
        { icon: Package, label: 'Inventory', path: '/inventory' },
        { icon: Users, label: 'Customers', path: '/customers' },
        { icon: History, label: 'Sales History', path: '/sales' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="flex h-screen bg-[var(--bg-main)] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-white/20 flex flex-col z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg shadow-lg"></div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
                        Pasal POS
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-indigo-500/30'
                                    : 'text-[var(--text-muted)] hover:bg-white/50 hover:text-[var(--color-primary)]'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="glass-panel p-4 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-semibold text-green-600">System Online</span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">Sync enabled • v1.0.0</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Header */}
                <header className="h-16 glass border-b border-white/20 flex items-center justify-between px-8 z-10">
                    <h2 className="text-lg font-semibold text-[var(--text-main)]">
                        {navItems.find(i => i.path === location.pathname)?.label || 'Overview'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-[var(--text-main)]">{ownerName}</p>
                            <p className="text-xs text-[var(--text-muted)]">Admin</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white shadow-md"></div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-8 relative">
                    {/* Background Blobs */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"></div>
                    </div>

                    <div className="animate-fade-in">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
