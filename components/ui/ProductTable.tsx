import type { Product } from '../../lib/types';

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
);
const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);


interface ProductTableProps {
    products: Product[];
    isAdmin: boolean;
    onEdit?: (product: Product) => void;
    onDelete?: (productId: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, isAdmin, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Product Name</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Unit Price</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Quantity</th>
                        {isAdmin && <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {products.length > 0 ? products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nama_produk}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" suppressHydrationWarning>
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.harga_satuan)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.quantity}</td>
                            {isAdmin && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                    <button onClick={() => onEdit?.(product)} className="inline-flex items-center px-3 py-2 cursor-pointer text-white bg-sky-500 rounded-md hover:bg-sky-600 transition-all text-xs font-semibold">
                                        <EditIcon /> Edit
                                    </button>
                                    <button onClick={() => onDelete?.(product.id)} className="inline-flex items-center px-3 py-2 cursor-pointer text-white bg-red-500 rounded-md hover:bg-red-600 transition-all text-xs font-semibold">
                                        <DeleteIcon /> Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={isAdmin ? 4 : 3} className="text-center py-10 text-gray-500">
                                No products found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
