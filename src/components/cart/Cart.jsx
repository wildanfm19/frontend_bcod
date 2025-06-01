import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, incrementCartItem, decrementCartItem, removeFromCart } from "../../store/actions";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CartEmpty from "./CartEmpty";
import { formatPrice } from "../../utils/formatPrice";

const Cart = () => {
    const cartState = useSelector((state) => state.carts);
    const items = cartState?.items || [];
    const total_items = cartState?.total_items || 0;
    const subtotal = cartState?.subtotal || 0;
    const loading = cartState?.loading || false;
    const error = cartState?.error || null;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (!items || items.length === 0) {
        return <CartEmpty />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {items.map((item) => (
                        <div key={item.cart_item_id} className="flex items-center justify-between border-b py-4">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={item.product.image_url}
                                    alt={item.product.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div>
                                    <h3 className="font-semibold">{item.product.name}</h3>
                                    <p className="text-gray-600">{formatPrice(item.product.price)}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => dispatch(decrementCartItem(item.cart_item_id, toast))}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <FiMinus />
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => dispatch(incrementCartItem(item.cart_item_id, toast))}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                                
                                <button
                                    onClick={() => dispatch(removeFromCart(item.cart_item_id, toast))}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Total Items:</span>
                                <span>{total_items}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span>Subtotal:</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                        </div>
                        <button className="w-full bg-gray-800 text-white py-2 rounded mt-4 hover:bg-gray-900 active:bg-gray-700 transition-all duration-150 text-sm focus:outline-none"
                            onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;