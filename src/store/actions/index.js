import toast from "react-hot-toast";
import api from "../../api/api"

// Action Types
export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export const FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';

export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/products?${queryString}`);
        
        if (data.code === "000") {
        dispatch({
            type: "FETCH_PRODUCTS",
                payload: data.data.data,
                pagination: {
                    currentPage: data.data.current_page,
                    perPage: data.data.per_page,
                    total: data.data.total,
                    lastPage: data.data.last_page,
                    from: data.data.from,
                    to: data.data.to,
                    links: data.data.links
                }
        });
        dispatch({ type: "IS_SUCCESS" });
        } else {
            dispatch({ 
                type: "IS_ERROR",
                payload: "Failed to fetch products"
            });
        }
    } catch (error) {
        console.error(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch products"
         });
    }
};


export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type: FETCH_CATEGORIES_REQUEST });
        const { data } = await api.get('/categories'); // Assuming the endpoint for categories is /categories
        
        if (data.status === "success") {
            dispatch({
                type: FETCH_CATEGORIES_SUCCESS,
                payload: data.data
            });
        } else {
        dispatch({
                type: FETCH_CATEGORIES_FAILURE,
                payload: data.message || "Failed to fetch categories"
            });
        }
    } catch (error) {
        console.error(error);
        dispatch({ 
            type: FETCH_CATEGORIES_FAILURE,
            payload: error?.response?.data?.message || "Failed to fetch categories"
         });
    }
};


export const addToCart = (productId, quantity = 1, toast) => async (dispatch) => {
    try {
        if (typeof productId !== 'number') {
            toast.error("Invalid product ID");
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to add items to cart");
            return;
        }
    
        console.log('Adding to cart with product_id:', productId);
        const { data } = await api.post(`/cart/add/${productId}`);
        console.log('Response data:', data);
    
        if (data.status === "success") {
            dispatch(fetchCart());
            toast.success("Product added to cart");
        } else {
            toast.error(data.message || "Failed to add product to cart");
        }
    
    } catch (error) {
        console.error('Error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
    
        const status = error.response?.status;
        const message = error.response?.data?.message;
    
        if (status === 401) {
            toast.error("Please login to add items to cart");
        } else if (status === 403 && message === "Sellers cannot add their own products to the cart") {
            toast.error("You can't add your own product to the cart");
        } else if (status === 422) {
            toast.error(message || "Invalid product data");
        } else {
            toast.error(message || "Failed to add product to cart");
        }
    }
};

export const fetchCart = () => async (dispatch) => {
    try {
        const { data } = await api.get('/cart');
        
        if (data.status === "success") {
            dispatch({
                type: "FETCH_CART",
                payload: data.data
            });
        }
    } catch (error) {
        console.error(error);
        dispatch({ 
            type: "CART_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch cart"
        });
    }
};

export const incrementCartItem = (itemId, toast) => async (dispatch, getState) => {
    try {
        // Get current cart state to find the item's current quantity
        const cartState = getState().carts;
        const currentItem = cartState.items.find(item => item.cart_item_id === itemId);
        
        if (!currentItem) {
            toast.error("Item not found in cart");
            return;
        }

        const newQuantity = currentItem.quantity + 1;
        
        // Use PUT method for incrementing with the new quantity
        console.log('Incrementing cart item with ID:', itemId, 'New quantity:', newQuantity);
        const { data } = await api.put(`/cart/items/${itemId}`, {
            quantity: newQuantity
        });
        console.log('Increment response data:', data);

        if (data.status === "success") {
            dispatch(fetchCart()); // Fetch updated cart after successful increment
            toast.success("Item quantity updated");
        } else {
            toast.error(data.message || "Failed to update quantity");
        }
    } catch (error) {
        console.error('Increment error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            toast.error("Please login to update cart");
        } else if (error.response?.status === 422) {
            // Log validation errors from backend
            console.error('Validation Error Data:', error.response.data);
            toast.error(error.response.data.message || "Failed to update quantity due to invalid data.");
        } else {
            toast.error(error?.response?.data?.message || "Failed to update quantity");
        }
    }
};

export const decrementCartItem = (itemId, toast) => async (dispatch, getState) => {
    try {
        // Get current cart state to find the item's current quantity
        const cartState = getState().carts;
        const currentItem = cartState.items.find(item => item.cart_item_id === itemId);
        
        if (!currentItem) {
            toast.error("Item not found in cart");
            return;
        }

        const newQuantity = Math.max(1, currentItem.quantity - 1); // Ensure quantity doesn't go below 1
        
        // Use PUT method for decrementing with the new quantity
        console.log('Decrementing cart item with ID:', itemId, 'New quantity:', newQuantity);
        const { data } = await api.put(`/cart/decrement/${itemId}`, {
            quantity: newQuantity
        });
        console.log('Decrement response data:', data);

        if (data.status === "success") {
            dispatch(fetchCart()); // Fetch updated cart after successful decrement
            toast.success("Item quantity updated");
        } else {
            toast.error(data.message || "Failed to update quantity");
        }
    } catch (error) {
        console.error('Decrement error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            toast.error("Please login to update cart");
        } else if (error.response?.status === 422) {
            // Log validation errors from backend
            console.error('Validation Error Data:', error.response.data);
            toast.error(error.response.data.message || "Failed to update quantity due to invalid data.");
        } else {
            toast.error(error?.response?.data?.message || "Failed to update quantity");
        }
    }
};

export const removeFromCart = (itemId, toast) => async (dispatch) => {
    try {
        const { data } = await api.delete(`/cart/items/${itemId}`);
        
        if (data.status === "success") {
            dispatch(fetchCart());
            toast.success("Item removed from cart");
        } else {
            toast.error(data.message || "Failed to remove item");
        }
    } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Failed to remove item");
    }
};

    export const authenticateSignInUser = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
        setLoader(true);
        const { data } = await api.post("/login", sendData);
        
        if (data.code === "000") {
        dispatch({ type: "LOGIN_USER", payload: data });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("seller_profile", JSON.stringify(data.seller_profile));
        reset();
            toast.success(data.message || "Login successful!");
        navigate("/");
        } else {
            toast.error(data.message || "Login failed");
        }
    } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    } finally {
        setLoader(false);
    }
};


export const registerNewUser = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      const { data } = await api.post("/register/seller", sendData);
  
      if (data.code === "000") {
        reset();
        toast.success(data.message || "Seller registered successfully!")
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      const errMsg =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errMsg);
    } finally {
      setLoader(false);
    }
  };
  


export const logOutUser = (navigate) => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            await api.post("/logout");
        }
    } catch (error) {
        // Optional: log error
    } finally {
        dispatch({ type: "LOG_OUT" });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("seller_profile");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("auth");
        localStorage.clear(); // Hapus semua data localStorage
        navigate("/login");
    }
};

export const getProfile = () => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING_PROFILE" });

    const { data } = await api.get("/auth/user", {
      withCredentials: true,
    });

    dispatch({ type: "GET_PROFILE", payload: data });
  } catch (error) {
    dispatch({
      type: "PROFILE_ERROR",
      payload: error?.response?.data?.message || "Failed to fetch profile",
    });
  }
};


export const addProduct = (productData, categoryId, imageFile, toast, navigate) => async (dispatch) => {
    try {
        // 1. First create the product
        const { data } = await api.post(`/admin/categories/${categoryId}/product`, productData);
        
        const productId = data.productId;
        toast.success("Product added successfully");

        // 2. Then upload the image if it exists
        if (imageFile) {
            const formData = new FormData();
            formData.append("image", imageFile);

            await api.put(`/products/${productId}/image`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Image uploaded successfully");
        }

        navigate("/admin/products");
    } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Failed to add product");
    }
};


