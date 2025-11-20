import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
    en: {
        dashboard: 'Dashboard',
        pos: 'POS (Billing)',
        inventory: 'Inventory',
        customers: 'Customers',
        salesHistory: 'Sales History',
        settings: 'Settings',
        welcome: 'Welcome Back',
        todaySales: "Today's Sales",
        totalProducts: 'Total Products',
        lowStock: 'Low Stock Alerts',
        recentSales: 'Recent Sales',
        quickActions: 'Quick Actions',
        newSale: 'New Sale',
        addProduct: 'Add Product',
        search: 'Search...',
        systemOnline: 'System Online',
        admin: 'Admin',
        storeOwner: 'Store Owner',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        actions: 'Actions',
        price: 'Price',
        stock: 'Stock',
        category: 'Category',
        status: 'Status',
        inStock: 'In Stock',
        outOfStock: 'Out of Stock',
        addToCart: 'Add to Cart',
        checkout: 'Checkout',
        total: 'Total',
        subtotal: 'Subtotal',
        tax: 'Tax',
        discount: 'Discount',
        paymentMethod: 'Payment Method',
        cash: 'Cash',
        digital: 'Digital/QR',
        completeSale: 'Complete Sale',
        receipt: 'Receipt',
        print: 'Print',
        share: 'Share',
        storeSettings: 'Store Settings',
        storeName: 'Store Name',
        address: 'Address',
        phone: 'Phone',
        ownerName: 'Owner Name',
        resetDb: 'Reset Database',
        dangerZone: 'Danger Zone',
        confirmDelete: 'Are you sure you want to delete?',
        language: 'Language'
    },
    ne: {
        dashboard: 'ड्यासबोर्ड',
        pos: 'बिलिङ (POS)',
        inventory: 'सामान सूची (Inventory)',
        customers: 'ग्राहकहरु',
        salesHistory: 'बिक्री इतिहास',
        settings: 'सेटिङ्स',
        welcome: 'स्वागत छ',
        todaySales: 'आजको बिक्री',
        totalProducts: 'जम्मा सामान',
        lowStock: 'सकिन लागेको सामान',
        recentSales: 'हालैको बिक्री',
        quickActions: 'छिटो कार्यहरु',
        newSale: 'नयाँ बिल',
        addProduct: 'सामान थप्नुहोस्',
        search: 'खोज्नुहोस्...',
        systemOnline: 'सिस्टम अनलाइन छ',
        admin: 'एडमिन',
        storeOwner: 'पसल धनी',
        save: 'सेभ गर्नुहोस्',
        cancel: 'रद्द गर्नुहोस्',
        delete: 'हटाउनुहोस्',
        edit: 'सम्पादन',
        actions: 'कार्यहरु',
        price: 'मूल्य',
        stock: 'मौज्दात',
        category: 'वर्ग',
        status: 'अवस्था',
        inStock: 'मौज्दात छ',
        outOfStock: 'सकियो',
        addToCart: 'बिलमा थप्नुहोस्',
        checkout: 'भुक्तानी गर्नुहोस्',
        total: 'जम्मा',
        subtotal: 'उप-जम्मा',
        tax: 'कर',
        discount: 'छुट',
        paymentMethod: 'भुक्तानी विधि',
        cash: 'नगद',
        digital: 'डिजिटल / QR',
        completeSale: 'बिक्री पूरा गर्नुहोस्',
        receipt: 'रसिद',
        print: 'प्रिन्ट',
        share: 'सेयर',
        storeSettings: 'पसल सेटिङ्स',
        storeName: 'पसलको नाम',
        address: 'ठेगाना',
        phone: 'फोन',
        ownerName: 'धनीको नाम',
        resetDb: 'डाटाबेस रिसेट',
        dangerZone: 'खतरा क्षेत्र',
        confirmDelete: 'के तपाइँ मेटाउन निश्चित हुनुहुन्छ?',
        language: 'भाषा'
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => localStorage.getItem('app_lang') || 'en');

    useEffect(() => {
        localStorage.setItem('app_lang', language);
        document.documentElement.lang = language;
    }, [language]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ne' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
