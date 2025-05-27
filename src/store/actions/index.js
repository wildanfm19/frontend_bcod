import toast from "react-hot-toast";
import api from "../../api/api"

export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch products",
         });
    }
};


export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type: "CATEGORY_LOADER" });
        const { data } = await api.get(`/public/categories`);
        dispatch({
            type: "FETCH_CATEGORIES",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_ERROR" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch categories",
         });
    }
};


export const addToCart = (data, qty = 1, toast) => 
    (dispatch, getState) => {
        // Find the product
        const { products } = getState().products;
        console.log(data);
        const getProduct = products.find(
            (item) => item.productId === data.productId
        );

        // Check for stocks
        const isQuantityExist = getProduct.quantity >= qty;

        // If in stock -> add
        if (isQuantityExist) {
            dispatch({ type: "ADD_CART", payload: {...data, quantity: qty}});
            toast.success(`${data?.productName} added to the cart`);
            localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        } else {
            // error
            toast.error("Out of stock");
        }
};


export const increaseCartQuantity = 
    (data, toast, currentQuantity, setCurrentQuantity) =>
    (dispatch, getState) => {
        // Find the product
        const { products } = getState().products;
        
        const getProduct = products.find(
            (item) => item.productId === data.productId
        );

        const isQuantityExist = getProduct.quantity >= currentQuantity + 1;

        if (isQuantityExist) {
            const newQuantity = currentQuantity + 1;
             console.log("increaseCartQuantity called", { currentQuantity, newQuantity });
            setCurrentQuantity(newQuantity);

            dispatch({
                type: "ADD_CART",
                payload: {...data, quantity: newQuantity + 1},
            });
            localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        } else {
            toast.error("Quantity Reached to Limit");
        }

    };


export const decreaseCartQuantity = 
    (data, newQuantity) => (dispatch, getState) => {
        dispatch({
            type: "ADD_CART",
            payload: {...data, quantity: newQuantity},
        });
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    }

    export const removeFromCart =  (data, toast) => (dispatch, getState) => {
    dispatch({type: "REMOVE_CART", payload: data });
    toast.success(`${data.productName} removed from cart`);
    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
}
    export const authenticateSignInUser = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
        setLoader(true);
        const { data } = await api.post("/auth/signin", sendData);
        dispatch({ type: "LOGIN_USER", payload: data });
        localStorage.setItem("auth", JSON.stringify(data));
        localStorage.setItem('jwtToken', data.jwtToken); 
        reset();
        toast.success("Login Success");
        navigate("/");
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
        setLoader(false);
    }
};


export const registerNewUser = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
        setLoader(true);
        const { data } = await api.post("/auth/signup", sendData);
        reset();
        toast.success(data?.message || "User Registered Success");
        navigate("/login");
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.response?.data?.password || "Internal Server Error");
    } finally {
        setLoader(false);
    }
};


export const logOutUser = (navigate) => (dispatch) => {
    dispatch({type: "LOG_OUT"});

    localStorage.removeItem("auth");
    navigate("/login");
}

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


