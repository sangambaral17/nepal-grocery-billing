import React, { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, QrCode } from 'lucide-react';
import { db } from '../db';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

const POS = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discount, setDiscount] = useState(0);
    const searchInputRef = useRef(null);

    const products = useLiveQuery(
        () => db.products
            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery))
            .toArray(),
        [searchQuery]
    );

    // Focus search on load
    useEffect(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
    }, []);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxRate = 0.13; // 13% VAT
    const tax = subtotal * taxRate;
    const total = subtotal + tax - discount;

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        const sale = {
            date: new Date(),
            items: cart,
            subtotal,
            tax,
            discount,
            total,
            paymentMethod,
        };

        // Transaction: Add sale and update stock
        await db.transaction('rw', db.products, db.sales, async () => {
            await db.sales.add(sale);
            for (const item of cart) {
                const product = await db.products.get(item.id);
                if (product) {
                    await db.products.update(item.id, { stock: product.stock - item.quantity });
                }
            }
        });

        setCart([]);
        setIsCheckoutOpen(false);
        setDiscount(0);
        alert('Sale completed successfully!');
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
            {/* Left: Product Grid */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                <Card className="p-4">
                    <Input
                        ref={searchInputRef}
                        placeholder="Scan barcode or search products..."
                        icon={Search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </Card>

                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                    {products?.map(product => (
                        <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-left flex flex-col h-full border border-transparent hover:border-indigo-200 group"
                        >
                            <div className="flex-1">
                                <h3 className="font-semibold text-[var(--text-main)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">{product.name}</h3>
                                <p className="text-xs text-[var(--text-muted)] mt-1">#{product.barcode}</p>
                            </div>
                            <div className="mt-3 flex items-end justify-between">
                                <span className="font-bold text-lg text-emerald-600">Rs. {product.price}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${product.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {product.stock} left
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Cart */}
            <Card className="w-full lg:w-96 flex flex-col h-full p-0 overflow-hidden border-l border-white/20">
                <div className="p-4 bg-white/50 border-b border-gray-100">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <ShoppingCart size={20} /> Current Order
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-50">
                            <ShoppingCart size={48} className="mb-2" />
                            <p>Cart is empty</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                <div className="flex-1 min-w-0 mr-2">
                                    <p className="font-medium truncate">{item.name}</p>
                                    <p className="text-xs text-[var(--text-muted)]">Rs. {item.price} x {item.quantity}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100 rounded"><Minus size={14} /></button>
                                    <span className="w-6 text-center font-medium">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100 rounded"><Plus size={14} /></button>
                                    <button onClick={() => removeFromCart(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded ml-1"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-white border-t border-gray-100 space-y-3">
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-[var(--text-muted)]">
                            <span>Subtotal</span>
                            <span>Rs. {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[var(--text-muted)]">
                            <span>VAT (13%)</span>
                            <span>Rs. {tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[var(--text-muted)]">
                            <span>Discount</span>
                            <span className="text-red-500">- Rs. {discount.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between font-bold text-xl pt-2 border-t border-dashed border-gray-200">
                        <span>Total</span>
                        <span>Rs. {total.toFixed(2)}</span>
                    </div>

                    <Button
                        className="w-full py-3 text-lg"
                        disabled={cart.length === 0}
                        onClick={() => setIsCheckoutOpen(true)}
                    >
                        Checkout
                    </Button>
                </div>
            </Card>

            {/* Checkout Modal */}
            <Modal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} title="Complete Payment">
                <div className="space-y-6">
                    <div className="text-center py-4 bg-gray-50 rounded-xl">
                        <p className="text-[var(--text-muted)]">Total Amount to Pay</p>
                        <h2 className="text-4xl font-bold text-[var(--color-primary)]">Rs. {total.toFixed(2)}</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Payment Method</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setPaymentMethod('cash')}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cash' ? 'border-[var(--color-primary)] bg-indigo-50 text-[var(--color-primary)]' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <Banknote size={24} />
                                <span className="text-sm font-medium">Cash</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-[var(--color-primary)] bg-indigo-50 text-[var(--color-primary)]' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <CreditCard size={24} />
                                <span className="text-sm font-medium">Card</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('qr')}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'qr' ? 'border-[var(--color-primary)] bg-indigo-50 text-[var(--color-primary)]' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <QrCode size={24} />
                                <span className="text-sm font-medium">QR Code</span>
                            </button>
                        </div>
                    </div>

                    <Input
                        label="Discount Amount"
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    />

                    <div className="flex gap-3 pt-2">
                        <Button variant="ghost" className="flex-1" onClick={() => setIsCheckoutOpen(false)}>Cancel</Button>
                        <Button className="flex-1" onClick={handleCheckout}>Confirm Payment</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default POS;
