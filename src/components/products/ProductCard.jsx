import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../../store/actions";
import toast from "react-hot-toast";

const ProductCard = (props) => {
    const dispatch = useDispatch();

    console.log("ProductCard props:", props);
    
    const handleAddToCart = () => {
        const id = props.product_id || props.id || props.productId;
        if (!id || typeof id !== 'number') {
            toast.error("Invalid product data");
            return;
        }
        dispatch(addToCart(id, 1, toast));
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link to={`/products/${props.product_id || props.id || props.productId}`}>
                <img
                    src={props.image || props.image_url}
                    alt={props.productName || props.product_name || props.name}
                    className="w-full h-48 object-cover"
                />
            </Link>
            <div className="p-4">
                <Link to={`/products/${props.product_id || props.id || props.productId}`}>
                    <h3 className="text-lg font-semibold mb-2">{props.productName || props.product_name || props.name}</h3>
                </Link>
                <p className="text-gray-600 mb-2">${props.price}</p>
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard; 