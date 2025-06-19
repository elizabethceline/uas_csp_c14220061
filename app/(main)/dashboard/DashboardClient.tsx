"use client";

import { useState, useMemo } from 'react';
import axios, { type AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { ProductTable } from '../../../components/ui/ProductTable';
import type { User, Product } from '../../../lib/types';

const ITEMS_PER_PAGE = 5;

const SearchIcon = () => (<svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const KpiIconProducts = () => (<svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>);
const KpiIconValue = () => (<svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1.268a2 2 0 00-2-2h-1.5a2 2 0 00-2 2V6m12 6h-1.5a2 2 0 00-2 2v1.268a2 2 0 002 2H12m6 0h1.5a2 2 0 002-2V12a2 2 0 00-2-2H18m0 0h-1.5a2 2 0 00-2 2v1.268a2 2 0 002 2H12m-6 0H7.5a2 2 0 01-2-2V12a2 2 0 012-2H6m0 0H4.5a2 2 0 01-2-2V7a2 2 0 012-2H6" /></svg>);
const KpiIconCategory = () => (<svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 8v-3c0-1.1.9-2 2-2z" /></svg>);


interface DashboardClientProps {
    user: User;
    initialProducts: Product[];
}

export default function DashboardClient({ user, initialProducts }: DashboardClientProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.nama_produk.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const totalStockValue = useMemo(() => products.reduce((acc, p) => acc + (p.harga_satuan * p.quantity), 0), [products]);
    const uniqueCategories = useMemo(() => new Set(products.map(p => p.nama_produk.split(' ')[0])).size, [products]);

    const handleOpenModal = (product: Product | null = null) => {
        setIsEditMode(!!product);
        setCurrentProduct(product || { nama_produk: '', harga_satuan: 0, quantity: 0 });
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

        if (!currentProduct.nama_produk || currentProduct.nama_produk.trim() === '') {
            toast.error('Product Name cannot be empty.');
            return;
        }

        const price = Number(currentProduct.harga_satuan);
        if (isNaN(price) || price <= 0) {
            toast.error('Unit Price must be a number greater than 0.');
            return;
        }

        const quantity = Number(currentProduct.quantity);
        if (isNaN(quantity) || quantity <= 0) {
            toast.error('Quantity must be a number greater than 0.');
            return;
        }

        const productData = { ...currentProduct, harga_satuan: price, quantity: quantity };

        try {
            let response: AxiosResponse<Product>;
            const apiPort = 5050;

            if (isEditMode) {
                response = await axios.put<Product>(`http://localhost:${apiPort}/products/${productData.id}`, productData);
                setProducts(products.map(p => p.id === productData.id ? response.data : p));
                toast.success('Product updated successfully!');
            } else {
                response = await axios.post<Product>(`http://localhost:${apiPort}/products`, productData);
                setProducts([...products, response.data]);
                toast.success('Product added successfully!');
            }
            handleCloseModal();
        } catch (error) {
            toast.error('Failed to process product data.');
            console.error(error);
        }
    };

    const handleDelete = async (productId: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const apiPort = 5050;
                await axios.delete(`http://localhost:${apiPort}/products/${productId}`);
                setProducts(products.filter(p => p.id !== productId));
                toast.success('Product deleted successfully.');
            } catch (error) {
                toast.error('Failed to delete product.');
                console.error(error);
            }
        }
    };

    if (user.role === 'admin') {
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                            <KpiIconProducts />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Products</p>
                                <p className="text-xl sm:text-3xl font-bold text-gray-800">{products.length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                            <KpiIconValue />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Stock Value</p>
                                <p className="text-xl sm:text-3xl font-bold text-gray-800" suppressHydrationWarning>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalStockValue)}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                            <KpiIconCategory />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Product Categories</p>
                                <p className="text-xl sm:text-3xl font-bold text-gray-800">{uniqueCategories}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <h2 className="text-xl font-bold text-slate-800">Product Management</h2>
                        <div className="relative w-full md:w-1/3">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                            <input type="text" placeholder="Search product..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                        </div>
                        <button onClick={() => handleOpenModal()} className="w-full md:w-auto cursor-pointer px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all">
                            + Add Product
                        </button>
                    </div>
                    <ProductTable products={paginatedProducts} isAdmin={true} onEdit={handleOpenModal} onDelete={handleDelete} />
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-500">
                                Page {currentPage} of {totalPages}
                            </span>
                            <div className="space-x-2">
                                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="cursor-pointer px-4 py-2 text-sm bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300">Previous</button>
                                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="cursor-pointer px-4 py-2 text-sm bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300">Next</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-60">
                        <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl transform transition-all">
                            <h3 className="text-xl font-semibold text-gray-800">{isEditMode ? 'Edit Product' : 'Add New Product'}</h3>
                            <p className="text-sm text-gray-500 mt-1 mb-6">Fill in the details below.</p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                    <input type="text" name="nama_produk" value={currentProduct.nama_produk || ''} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                                    <input type="number" name="harga_satuan" value={currentProduct.harga_satuan} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                    <input type="number" name="quantity" value={currentProduct.quantity} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div className="flex justify-end pt-4 space-x-3">
                                    <button type="button" onClick={handleCloseModal} className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
                                    <button type="submit" className="cursor-pointer px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-semibold">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Product List</h2>
            <ProductTable products={products} isAdmin={false} />
        </div>
    );
}
