export interface User {
    id: number;
    username: string;
    role: 'user' | 'admin';
}

export interface Product {
    id: number;
    nama_produk: string;
    harga_satuan: number;
    quantity: number;
}
