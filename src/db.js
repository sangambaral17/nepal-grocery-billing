import Dexie from 'dexie';

export const db = new Dexie('NepalGroceryDB');

db.version(1).stores({
  products: '++id, name, barcode, category, price, stock', // Primary key and indexed props
  sales: '++id, date, total, paymentMethod',
  customers: '++id, name, phone',
  settings: 'key' // Key-value store for settings
});

// Helper to seed initial data if needed
export const seedDatabase = async () => {
  const count = await db.products.count();
  if (count === 0) {
    await db.products.bulkAdd([
      { name: 'Wai Wai Noodles', barcode: '1001', category: 'Snacks', price: 20, costPrice: 18, stock: 100 },
      { name: 'Coca Cola 500ml', barcode: '1002', category: 'Drinks', price: 60, costPrice: 50, stock: 50 },
      { name: 'Rice (Sona Mansuli) 25kg', barcode: '1003', category: 'Grains', price: 1800, costPrice: 1600, stock: 20 },
      { name: 'Mustard Oil 1L', barcode: '1004', category: 'Essentials', price: 250, costPrice: 220, stock: 40 },
    ]);
  }
};
