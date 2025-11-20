import React, { useState, useEffect } from 'react';
import { Save, Trash2, AlertTriangle } from 'lucide-react';
import { db } from '../db';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Settings = () => {
    const [settings, setSettings] = useState({
        storeName: 'Pasal Grocery',
        address: 'Kathmandu, Nepal',
        phone: '9800000000',
        taxRate: '13',
        currency: 'Rs.'
    });

    useEffect(() => {
        const loadSettings = async () => {
            const storedSettings = await db.settings.toArray();
            if (storedSettings.length > 0) {
                const settingsMap = storedSettings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
                setSettings(prev => ({ ...prev, ...settingsMap }));
            }
        };
        loadSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await db.transaction('rw', db.settings, async () => {
            await db.settings.clear();
            const settingsArray = Object.entries(settings).map(([key, value]) => ({ key, value }));
            await db.settings.bulkAdd(settingsArray);
        });
        alert('Settings saved successfully!');
    };

    const handleResetDatabase = async () => {
        if (window.confirm('⚠️ DANGER: Are you sure you want to DELETE ALL DATA?\n\nThis will remove all products, sales, and customers permanently. This action cannot be undone.')) {
            try {
                await db.delete();
                await db.open();
                localStorage.removeItem('db_seeded');
                window.location.reload();
            } catch (error) {
                console.error("Failed to reset database:", error);
                alert("Failed to reset database. Please try again.");
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-[var(--text-main)]">Store Settings</h1>

            <Card>
                <form onSubmit={handleSave} className="space-y-4">
                    <Input
                        label="Store Name"
                        name="storeName"
                        value={settings.storeName}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Address"
                        name="address"
                        value={settings.address}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Phone Number"
                        name="phone"
                        value={settings.phone}
                        onChange={handleChange}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Tax Rate (%)"
                            name="taxRate"
                            type="number"
                            value={settings.taxRate}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Currency Symbol"
                            name="currency"
                            value={settings.currency}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" icon={Save} className="w-full">
                            <Save size={20} className="mr-2" /> Save Settings
                        </Button>
                    </div>
                </form>
            </Card>

            <Card className="bg-blue-50 border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">About Offline Mode</h3>
                <p className="text-sm text-blue-600">
                    This application is designed to work offline. Your data is stored securely in your browser.
                    Please do not clear your browser data (Cache/Cookies) for this site, or you may lose your records.
                    <br /><br />
                    <strong>Recommendation:</strong> Use the "Export Data" feature regularly (Coming Soon) to backup your data.
                </p>
            </Card>

            <Card className="border-red-100">
                <div className="flex items-center gap-2 mb-4 text-red-600">
                    <AlertTriangle size={24} />
                    <h2 className="text-lg font-semibold">Danger Zone</h2>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                    Resetting the database will delete all products, sales, and customers. This action cannot be undone.
                </p>
                <Button
                    variant="danger"
                    onClick={handleResetDatabase}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                >
                    <Trash2 size={18} />
                    Reset Database & Clear All Data
                </Button>
            </Card>

            <div className="text-center text-sm text-[var(--text-muted)] mt-8">
                <p>Nepal Grocery Billing Software v1.0</p>
                <p>© 2025 SangamBaral</p>
            </div>
        </div>
    );
};

export default Settings;
