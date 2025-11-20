import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Search, FileText, Share2, Printer, Eye } from 'lucide-react';
import { db } from '../db';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

const Sales = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);

    const sales = useLiveQuery(
        () => db.sales.orderBy('date').reverse().toArray()
    );

    const filteredSales = sales?.filter(sale =>
        sale.id.toString().includes(searchQuery) ||
        new Date(sale.date).toLocaleDateString().includes(searchQuery)
    );

    const handlePrint = () => {
        window.print();
    };

    const handleShare = (sale) => {
        const text = `Bill from Pasal POS\nDate: ${new Date(sale.date).toLocaleDateString()}\nTotal: Rs. ${sale.total}\nThank you for shopping!`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[var(--text-main)]">Sales History</h1>
                <div className="w-64">
                    <Input
                        placeholder="Search by ID or Date..."
                        icon={Search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200 text-[var(--text-muted)] text-sm uppercase">
                            <th className="p-4">Sale ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Payment</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredSales?.map(sale => (
                            <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 font-medium">#{sale.id}</td>
                                <td className="p-4 text-[var(--text-muted)]">{new Date(sale.date).toLocaleString()}</td>
                                <td className="p-4">{sale.items.length} items</td>
                                <td className="p-4 font-bold text-emerald-600">Rs. {sale.total.toFixed(2)}</td>
                                <td className="p-4 capitalize">{sale.paymentMethod}</td>
                                <td className="p-4 text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedSale(sale)}>
                                        <Eye size={18} className="mr-2" /> View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {/* Receipt Modal */}
            {selectedSale && (
                <Modal isOpen={!!selectedSale} onClose={() => setSelectedSale(null)} title="Sale Details">
                    <div id="receipt-content" className="space-y-4">
                        <div className="text-center border-b border-dashed border-gray-300 pb-4">
                            <h2 className="text-xl font-bold">Pasal Grocery</h2>
                            <p className="text-sm text-[var(--text-muted)]">Kathmandu, Nepal</p>
                            <p className="text-sm text-[var(--text-muted)]">Phone: 9800000000</p>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span>Date: {new Date(selectedSale.date).toLocaleDateString()}</span>
                            <span>Bill No: #{selectedSale.id}</span>
                        </div>

                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-left">
                                    <th className="py-2">Item</th>
                                    <th className="py-2 text-right">Qty</th>
                                    <th className="py-2 text-right">Price</th>
                                    <th className="py-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {selectedSale.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="py-2">{item.name}</td>
                                        <td className="py-2 text-right">{item.quantity}</td>
                                        <td className="py-2 text-right">{item.price}</td>
                                        <td className="py-2 text-right">{(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="border-t border-gray-200 pt-2 space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rs. {selectedSale.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (13%)</span>
                                <span>Rs. {selectedSale.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-red-500">
                                <span>Discount</span>
                                <span>- Rs. {selectedSale.discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed border-gray-300">
                                <span>Grand Total</span>
                                <span>Rs. {selectedSale.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="text-center text-xs text-[var(--text-muted)] pt-4 border-t border-dashed border-gray-300">
                            <p>Thank you for shopping with us!</p>
                            <p>Visit Again</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6 print:hidden">
                        <Button variant="outline" className="flex-1" onClick={handlePrint}>
                            <Printer size={18} className="mr-2" /> Print
                        </Button>
                        <Button className="flex-1 bg-[#25D366] hover:bg-[#128C7E]" onClick={() => handleShare(selectedSale)}>
                            <Share2 size={18} className="mr-2" /> WhatsApp
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Sales;
