import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { LayoutDashboard, ShoppingCart, Package, Settings, History, Users, Menu, X } from 'lucide-react';
import { db } from '../db';
import { useLanguage } from '../context/LanguageContext';

// Import Backgrounds
import dashboardBg from '../assets/bg/dashboard.png';
import posBg from '../assets/bg/pos.png';
import inventoryBg from '../assets/bg/inventory.png';
import customersBg from '../assets/bg/customers.png';
import salesBg from '../assets/bg/sales.png';
import settingsBg from '../assets/bg/settings.png';

const Layout = ({ children }) => {
    const location = useLocation();
    const { t, language, toggleLanguage } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const settings = useLiveQuery(() => db.settings.toArray());
    const ownerName = settings?.find(s => s.key === 'ownerName')?.value || 'Admin';
    const storeName = settings?.find(s => s.key === 'storeName')?.value || 'Pasal POS';

    const navItems = [
        { icon: LayoutDashboard, label: t('dashboard'), path: '/' },
        { icon: ShoppingCart, label: t('pos'), path: '/pos' },
        { icon: Package, label: t('inventory'), path: '/inventory' },
        { icon: Users, label: t('customers'), path: '/customers' },
        { icon: History, label: t('salesHistory'), path: '/sales' },
        { icon: Settings, label: t('settings'), path: '/settings' },
    ];

    // Determine Background Image
    const getBackgroundImage = (path) => {
        switch (path) {
            case '/': return dashboardBg;
            case '/pos': return posBg;
            case '/inventory': return inventoryBg;
            case '/customers': return customersBg;
            case '/sales': return salesBg;
            case '/settings': return settingsBg;
            default: return dashboardBg;
        }
    };

    const currentBg = getBackgroundImage(location.pathname);

    return (
        <div className="flex h-screen bg-[var(--bg-main)] overflow-hidden transition-all duration-500"
            style={{
                backgroundImage: `url(${currentBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay'
            }}>
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-0 pointer-events-none"></div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:relative
                w-64 h-screen
                glass border-r border-white/20 flex flex-col z-40 shadow-xl
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg shadow-lg flex items-center justify-center text-white font-bold">
                            {storeName.charAt(0)}
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] truncate">
                            {storeName}
                        </h1>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 mt-4 flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
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
                            <span className="text-xs font-semibold text-green-600">{t('systemOnline')}</span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">Sync enabled • v1.0.0</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden z-10">
                {/* Header */}
                <header className="h-16 glass border-b border-white/20 flex items-center justify-between px-4 md:px-8 z-10">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 hover:bg-white/30 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-base md:text-lg font-semibold text-[var(--text-main)] text-shadow-sm">
                            {navItems.find(i => i.path === location.pathname)?.label || 'Overview'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-white/30 hover:bg-white transition-all shadow-sm"
                        >
                            <span className="text-xl">{language === 'en' ? '🇺🇸' : '🇳🇵'}</span>
                            <span className="text-sm font-medium text-[var(--text-main)] hidden sm:inline">{language === 'en' ? 'ENG' : 'NEP'}</span>
                        </button>

                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-[var(--text-main)]">{ownerName}</p>
                            <p className="text-xs text-[var(--text-muted)]">{t('admin')}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white shadow-md"></div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 md:p-8 relative">
                    <div className="animate-fade-in">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
