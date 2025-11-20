import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';
import Card from '../components/ui/Card';
import { db, seedDatabase } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 p-4 opacity-10`}>
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
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[var(--text-main)]">Dashboard Overview</h1>
                <div className="text-sm text-[var(--text-muted)]">{new Date().toLocaleDateString('en-NP', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
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
                    <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
                    <div className="space-y-4">
                        {sales?.slice(0, 5).reverse().map(sale => (
                            <div key={sale.id} className="flex items-center justify-between p-3 hover:bg-white/50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                        #{sale.id}
                                    </div>
                                    <div>
                                        <p className="font-medium">Sale #{sale.id}</p>
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
                        <button className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 text-left">
                            <ShoppingBag size={24} className="mb-2" />
                            <p className="font-bold">New Sale</p>
                            <p className="text-xs opacity-80">Open POS Terminal</p>
                        </button>
                        <button className="p-4 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left">
                            <TrendingUp size={24} className="mb-2 text-indigo-600" />
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
