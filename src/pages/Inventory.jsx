import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Search, Edit2, Trash2, Package, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import { db } from '../db';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

const Inventory = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        barcode: '',
        category: '',
        price: '',
        costPrice: '',
        stock: ''
    });

    const products = useLiveQuery(
        () => db.products
            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery))
            .toArray(),
        [searchQuery]
    );

    // Calculate Stats
    const totalProducts = products?.length || 0;
    const lowStockCount = products?.filter(p => p.stock < 10).length || 0;
    const totalValue = products?.reduce((acc, p) => acc + (p.price * p.stock), 0) || 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            costPrice: parseFloat(formData.costPrice),
            stock: parseInt(formData.stock),
        };

        if (editingProduct) {
            await db.products.update(editingProduct.id, productData);
        } else {
            await db.products.add(productData);
        }

        closeModal();
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                barcode: product.barcode,
                category: product.category,
                price: product.price,
                costPrice: product.costPrice,
                stock: product.stock
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', barcode: '', category: '', price: '', costPrice: '', stock: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await db.products.delete(id);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-main)]">Inventory</h1>
                    <p className="text-[var(--text-muted)] mt-1">Manage your store's products and stock levels</p>
                </div>
                <Button onClick={() => openModal()} icon={Plus} className="shadow-lg shadow-indigo-200">
                    <Plus size={20} className="mr-2" /> Add Product
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-indigo-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-muted)] font-medium">Total Products</p>
                            <h3 className="text-2xl font-bold text-[var(--text-main)]">{totalProducts}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-muted)] font-medium">Low Stock Items</p>
                            <h3 className="text-2xl font-bold text-[var(--text-main)]">{lowStockCount}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-muted)] font-medium">Inventory Value</p>
                            <h3 className="text-2xl font-bold text-[var(--text-main)]">Rs. {totalValue.toLocaleString()}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="overflow-hidden border-0 shadow-xl shadow-gray-100/50">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {/* Filter buttons could go here */}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold">
                                <th className="p-4 pl-6">Product</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Inventory</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products?.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                                                <img
                                                    src={`https://source.unsplash.com/random/100x100/?grocery,${product.category}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=100&auto=format&fit=crop';
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[var(--text-main)]">{product.name}</p>
                                                <p className="text-xs text-[var(--text-muted)] font-mono">#{product.barcode}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {product.stock < 10 ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                In Stock
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 font-bold text-[var(--text-main)]">Rs. {product.price}</td>
                                    <td className="p-4 text-sm text-[var(--text-muted)]">
                                        {product.stock} units
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" onClick={() => openModal(product)} className="hover:bg-blue-50 hover:text-blue-600">
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="hover:bg-red-50 hover:text-red-600">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products?.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-[var(--text-muted)]">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <Package size={32} className="opacity-50" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                                            <p className="mb-6 max-w-sm mx-auto">Get started by adding your first product to the inventory.</p>
                                            <Button onClick={() => openModal()} icon={Plus}>
                                                <Plus size={20} className="mr-2" /> Add Product
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Product Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="e.g. Wai Wai Noodles"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Barcode"
                            value={formData.barcode}
                            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                            required
                            placeholder="Scan or type..."
                        />
                        <Input
                            label="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            placeholder="e.g. Snacks"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Selling Price (Rs)"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            placeholder="0.00"
                        />
                        <Input
                            label="Cost Price (Rs)"
                            type="number"
                            value={formData.costPrice}
                            onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                            required
                            placeholder="0.00"
                        />
                    </div>
                    <Input
                        label="Initial Stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                        placeholder="0"
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
                        <Button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Inventory;
