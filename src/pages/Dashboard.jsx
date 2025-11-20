import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import { db, seedDatabase } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-[var(--color-primary)]">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
            <Icon size={64} className={color} />
        </div>
        <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('500', '100')} ${color}`}>
                <Icon size={24} />
            </div>
            <h3 className="text-[var(--text-muted)] font-medium">{title}</h3>
        </div>
        <div className="flex items-end gap-2">
            <h2 className="text-3xl font-bold text-[var(--text-main)]">{value}</h2>
            {trend && <span className="text-sm text-green-500 font-medium mb-1">{trend}</span>}
        </div>
    </Card>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        todaySales: 0,
        totalProducts: 0,
        lowStock: 0,
    });

    useEffect(() => {
        // Seed DB for demo purposes
        seedDatabase();
    }, []);

    const products = useLiveQuery(() => db.products.toArray());
    const sales = useLiveQuery(() => db.sales.toArray());

    const settings = useLiveQuery(() => db.settings.toArray());
    const ownerName = settings?.find(s => s.key === 'ownerName')?.value || 'Store Owner';

    useEffect(() => {
        if (products && sales) {
            const today = new Date().toDateString();
            const todaySalesTotal = sales
                .filter(s => new Date(s.date).toDateString() === today)
                .reduce((acc, curr) => acc + curr.total, 0);

            const lowStockCount = products.filter(p => p.stock < 10).length;

            setStats({
                todaySales: todaySalesTotal,
                totalProducts: products.length,
                lowStock: lowStockCount,
            });
        }
    }, [products, sales]);

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1000&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                <div className="relative p-8 md:p-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back, {ownerName}! 👋</h1>
                    <p className="text-indigo-100 text-lg max-w-xl">Here's what's happening in your store today. You have {stats.todaySales > 0 ? 'made some great sales!' : 'no sales yet. Let\'s get started!'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Today's Sales"
                    value={`Rs. ${stats.todaySales.toLocaleString()}`}
                    icon={DollarSign}
                    color="text-emerald-500"
                    trend="+12% from yesterday"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={ShoppingBag}
                    color="text-blue-500"
                />
                <StatCard
                    title="Low Stock Alerts"
                    value={stats.lowStock}
                    icon={AlertTriangle}
                    color="text-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Recent Sales</h3>
                        <button onClick={() => navigate('/sales')} className="text-sm text-indigo-600 hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {sales?.slice(0, 5).reverse().map(sale => (
                            <div key={sale.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                        #{sale.id}
                                    </div>
                                    <div>
                                        <p className="font-medium text-[var(--text-main)]">Sale #{sale.id}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{new Date(sale.date).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-emerald-600">+ Rs. {sale.total}</span>
                            </div>
                        ))}
                        {(!sales || sales.length === 0) && <p className="text-center text-[var(--text-muted)] py-4">No sales yet today.</p>}
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/pos')}
                            className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] text-left group"
                        >
                            <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform">
                                <ShoppingBag size={20} />
                            </div>
                            <p className="font-bold text-lg">New Sale</p>
                            <p className="text-xs opacity-80">Open POS Terminal</p>
                        </button>
                        <button
                            onClick={() => navigate('/inventory')}
                            className="p-4 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
                        >
                            <div className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform">
                                <Plus size={20} />
                            </div>
                            <p className="font-bold text-[var(--text-main)]">Add Product</p>
                            <p className="text-xs text-[var(--text-muted)]">Update Inventory</p>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
