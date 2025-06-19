import type { Product } from '../../lib/types';

interface ProductTableProps {
    products: Product[];
    isAdmin: boolean;
    onEdit?: (product: Product) => void;
    onDelete?: (productId: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, isAdmin, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full leading-normal">
                <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="px-5 py-3">Nama Produk</th>
                        <th className="px-5 py-3">Harga Satuan</th>
                        <th className="px-5 py-3">Quantity</th>
                        {isAdmin && <th className="px-5 py-3">Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-5 py-4 text-sm">{product.nama_produk}</td>
                            <td className="px-5 py-4 text-sm">Rp {new Intl.NumberFormat('id-ID').format(product.harga_satuan)}</td>
                            <td className="px-5 py-4 text-sm">{product.quantity}</td>
                            {isAdmin && (
                                <td className="px-5 py-4 text-sm space-x-2">
                                    <button onClick={() => onEdit?.(product)} className="cursor-pointer px-4 py-2 text-white bg-sky-400 rounded-md hover:bg-sky-500">Edit</button>
                                    <button onClick={() => onDelete?.(product.id)} className="cursor-pointer px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
