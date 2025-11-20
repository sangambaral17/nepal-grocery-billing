import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Search, Edit2, Trash2, Package, AlertCircle, DollarSign, X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from '../db';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Inventory = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
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

        resetForm();
    };

    const editProduct = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            barcode: product.barcode,
            category: product.category,
            price: product.price,
            costPrice: product.costPrice,
            stock: product.stock
        });
        setIsFormOpen(true);
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
        setFormData({ name: '', barcode: '', category: '', price: '', costPrice: '', stock: '' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await db.products.delete(id);
        }
    };

    return (
        <div className="space-y-8">
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
                                            <Button variant="ghost" size="icon" onClick={() => editProduct(product)} className="hover:bg-blue-50 hover:text-blue-600">
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="hover:bg-red-50 hover:text-red-600">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr >
                            ))}
{
    products?.length === 0 && (
        <tr>
            <td colSpan="6" className="p-12 text-center">
                <div className="flex flex-col items-center justify-center text-[var(--text-muted)]">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Package size={32} className="opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                    <p className="mb-6 max-w-sm mx-auto">Get started by adding your first product to the inventory.</p>
                    <Button onClick={() => setIsFormOpen(true)} icon={Plus}>
                        <Plus size={20} className="mr-2" /> Add Product
                    </Button>
                </div>
            </td>
        </tr>
    )
}
                        </tbody >
                    </table >
                </div >
            </Card >
        </div >
    );
};

export default Inventory;
