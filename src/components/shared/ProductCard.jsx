import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";
import truncateText from "../../utils/truncateText";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/actions";
import toast from "react-hot-toast";
import { formatPrice } from "../../utils/formatPrice";

const ProductCard = (props) => {
    const [openProductViewModal, setOpenProductViewModal] = useState(false);
    const [selectedViewProduct, setSelectedViewProduct] = useState("");
    const isAvailable = props.stock_quantity && Number(props.stock_quantity) > 0;
    const dispatch = useDispatch();

    // DEBUG: Lihat isi props
    console.log("ProductCard props:", props);

    const handleProductView = (product) => {
        if (!props.about) {
            setSelectedViewProduct(product);
            setOpenProductViewModal(true);
        }
    };

    const handleAddToCart = () => {
        const id = Number(props.product_id || props.id || props.productId);
        console.log("ID yang dipakai:", id, typeof id);
        if (!id || isNaN(id)) {
            toast.error("Invalid product ID");
            return;
        }
        dispatch(addToCart(id, 1, toast));
    };

    return (
        <div className="border rounded-lg shadow-xl overflow-hidden transition-shadow duration-300">
            <div
                onClick={() => {
                    handleProductView({
                        id: props.product_id,
                        productName: props.product_name,
                        image: props.main_image?.image_url,
                        description: props.description,
                        quantity: props.stock_quantity,
                        price: props.price,
                    });
                }}
                className="w-full overflow-hidden aspect-[3/2]">
                <img
                    className="w-full h-full cursor-pointer transition-transform duration-300 transform hover:scale-105"
                    src={props.main_image?.image_url}
                    alt={props.product_name}
                />
            </div>
            <div className="p-4">
                <h2
                    onClick={() => {}}
                    className="text-lg font-semibold mb-2 cursor-pointer">
                    {truncateText(props.product_name, 50)}
                </h2>

                <div className="min-h-20 max-h-20">
                    <p className="text-gray-600 text-sm">
                        {truncateText(props.description, 80)}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-slate-700">
                        {formatPrice(props.price)}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        disabled={!isAvailable}
                        className="bg-custom-gradient text-white px-4 py-2 rounded-md hover:opacity-90 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
                        <FaShoppingCart />
                    </button>
                </div>
            </div>

            {openProductViewModal && (
                <ProductViewModal
                    open={openProductViewModal}
                    setOpen={setOpenProductViewModal}
                    product={selectedViewProduct}
                    isAvailable={isAvailable}
                />
            )}
        </div>
    );
};

export default ProductCard;