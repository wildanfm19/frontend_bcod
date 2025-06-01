import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../store/actions";

const useProductFilter = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);

    useEffect(() => {
        const params = new URLSearchParams();

        // Pagination
        const currentPage = searchParams.get("page")
            ? Number(searchParams.get("page"))
            : 1;
        params.set("page", currentPage);

        // Category filter
        const categoryId = searchParams.get("category_id");
        if (categoryId) {
            params.set("category_id", categoryId);
        }

        // Search keyword
        const keyword = searchParams.get("search");
        if (keyword) {
            params.set("search", keyword);
        }

        // Price range
        const minPrice = searchParams.get("min_price");
        if (minPrice) {
            params.set("min_price", minPrice);
        }

        const maxPrice = searchParams.get("max_price");
        if (maxPrice) {
            params.set("max_price", maxPrice);
        }

        // Rating filter
        const minRating = searchParams.get("min_rating");
        if (minRating) {
            params.set("min_rating", minRating);
        }

        // Stock filter
        const inStock = searchParams.get("in_stock");
        if (inStock === "true") {
            params.set("in_stock", "true");
        }

        const queryString = params.toString();
        console.log("Fetching Products with Query String:", queryString);

        dispatch(fetchProducts(queryString));
    }, [dispatch, searchParams]);

    // Handle local sorting AFTER fetching
    const sortBy = searchParams.get("sort");
    if (products && sortBy) {
        const sortedProducts = [...products];
        if (sortBy === "price_low") {
            sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === "price_high") {
            sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortBy === "rating_high") {
            sortedProducts.sort((a, b) => Number(b.average_rating) - Number(a.average_rating));
        } else if (sortBy === "best_seller") {
            sortedProducts.sort((a, b) => Number(b.total_sales) - Number(a.total_sales));
        } else if (sortBy === "oldest") {
            sortedProducts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else if (sortBy === "latest") {
            sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        return sortedProducts;
    }

    return products;
};

export default useProductFilter;