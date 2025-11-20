import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Search, Edit2, Trash2, Users, Phone, MapPin } from 'lucide-react';
import { db } from '../db';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

const Customers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        email: ''
    });

    const customers = useLiveQuery(
        () => db.customers
            .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery))
            .toArray(),
        [searchQuery]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingCustomer) {
            await db.customers.update(editingCustomer.id, formData);
        } else {
            await db.customers.add(formData);
        }
        closeModal();
    };

    const openModal = (customer = null) => {
        if (customer) {
            setEditingCustomer(customer);
            setFormData({
                name: customer.name,
                phone: customer.phone,
                address: customer.address || '',
                email: customer.email || ''
            });
        } else {
            setEditingCustomer(null);
            setFormData({ name: '', phone: '', address: '', email: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCustomer(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            await db.customers.delete(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)]">Customer Management</h1>
                    <p className="text-[var(--text-muted)]">Track your loyal customers</p>
                </div>
                <Button onClick={() => openModal()} icon={Plus}>
                    <Plus size={20} className="mr-2" /> Add Customer
                </Button>
            </div>

            <Card>
                <div className="mb-6">
                    <Input
                        placeholder="Search customers by name or phone..."
                        icon={Search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-[var(--text-muted)] text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium">Contact</th>
                                <th className="p-4 font-medium">Address</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers?.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-indigo-600">
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--text-main)]">{customer.name}</p>
                                                <p className="text-xs text-[var(--text-muted)]">ID: #{customer.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col text-sm">
                                            <span className="flex items-center gap-1 text-[var(--text-main)]">
                                                <Phone size={14} className="text-[var(--text-muted)]" /> {customer.phone}
                                            </span>
                                            {customer.email && <span className="text-[var(--text-muted)]">{customer.email}</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-[var(--text-muted)]">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} /> {customer.address || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" onClick={() => openModal(customer)}>
                                                <Edit2 size={18} className="text-blue-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id)}>
                                                <Trash2 size={18} className="text-red-500" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {customers?.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-[var(--text-muted)]">
                                        No customers found. Add your first customer!
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
                title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />
                    <Input
                        label="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                    <Input
                        label="Email (Optional)"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
                        <Button type="submit">{editingCustomer ? 'Update Customer' : 'Add Customer'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Customers;
