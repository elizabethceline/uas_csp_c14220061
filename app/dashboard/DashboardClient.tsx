"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { ProductTable } from '../../components/ui/ProductTable';
import type { User, Product } from '../../lib/types';

interface DashboardClientProps {
    user: User;
    initialProducts: Product[];
}

export default function DashboardClient({ user, initialProducts }: DashboardClientProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('user-data');
        toast.success('Berhasil logout!');
        router.push('/signin');
    };

    const handleOpenModal = (product: Product | null = null) => {
        if (product) {
            setIsEditMode(true);
            setCurrentProduct(product);
        } else {
            setIsEditMode(false);
            setCurrentProduct({ nama_produk: '', harga_satuan: 0, quantity: 0 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentProduct) return;

        const productData = {
            ...currentProduct,
            harga_satuan: Number(currentProduct.harga_satuan),
            quantity: Number(currentProduct.quantity)
        };

        try {
            let response: AxiosResponse<Product>;
            if (isEditMode) {
                response = await axios.put<Product>(`http://localhost:5050/products/${productData.id}`, productData);
                setProducts(products.map(p => p.id === productData.id ? response.data : p));
                toast.success('Produk berhasil diupdate!');
            } else {
                response = await axios.post<Product>('http://localhost:5050/products', productData);
                setProducts([...products, response.data]);
                toast.success('Produk berhasil ditambah!');
            }
            handleCloseModal();
        } catch (error) {
            toast.error('Gagal memproses data produk.');
            console.error(error);
        }
    };

    const handleDelete = async (productId: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            try {
                await axios.delete(`http://localhost:5050/products/${productId}`);
                setProducts(products.filter(p => p.id !== productId));
                toast.success('Produk berhasil dihapus.');
            } catch (error) {
                toast.error('Gagal menghapus produk.');
                console.error(error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {user.role === 'admin' ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Manajemen Produk</h2>
            <button onClick={() => handleOpenModal()} className="px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600">
              + Tambah Produk
            </button>
          </div>
          <ProductTable products={products} isAdmin={true} onEdit={handleOpenModal} onDelete={handleDelete} />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Daftar Produk</h2>
          <ProductTable products={products} isAdmin={false} />
        </div>
      )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
                    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">{isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                                <input type="text" name="nama_produk" value={currentProduct.nama_produk || ''} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Harga Satuan</label>
                                <input type="number" name="harga_satuan" value={currentProduct.harga_satuan || 0} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input type="number" name="quantity" value={currentProduct.quantity || 0} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" required />
                            </div>
                            <div className="flex justify-end pt-4 space-x-2">
                                <button type="button" onClick={handleCloseModal} className="cursor-pointer px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="cursor-pointer px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}