import { FaExclamationTriangle } from "react-icons/fa";
import ProductCard from "../shared/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories} from "../../store/actions";
import { useEffect, useState, useCallback } from "react";
import Filter from "../shared/Filter";
import Loader from "../shared/Loader";
import Paginations from "../shared/Paginations";
import useProductFilter from "../../hooks/useProductFilter.js";
import { useSearchParams } from "react-router-dom";
import api from "../../api/api";

const ProductsPage = () =>{
    const {isLoading , errorMessage} = useSelector(
        (state) => state.errors
    );
   
    const { categories } = useSelector((state) => state.categories);
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [searchText, setSearchText] = useState(searchParams.get('search') || '');
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        dispatch(fetchCategories());
    },[dispatch]);

    const fetchProducts = async () => {
        setIsLoadingProducts(true);
        try {
            const params = new URLSearchParams(searchParams);
            
            const { data } = await api.get(`/products?${params.toString()}`);
            
            if (data.code === '000' && data.status === 'success') {
                setProducts(data.data.data);
                setPagination({
                    currentPage: data.data.current_page,
                    lastPage: data.data.last_page,
                    total: data.data.total,
                    perPage: data.data.per_page,
                    from: data.data.from,
                    to: data.data.to,
                    links: data.data.links,
                    nextPageUrl: data.data.next_page_url,
                    prevPageUrl: data.data.prev_page_url,
                    path: data.data.path
                });
            } else {
                console.error('API Error fetching products:', data.message);
                setProducts([]);
                setPagination(null);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setPagination(null);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const handlePageChange = (page) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', page.toString());
        setSearchParams(newParams);
    };

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    const handleSearchInputChange = (event) => {
        const value = event.target.value;
        setSearchText(value);

        // Clear any existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Set a new timeout
        const timeout = setTimeout(() => {
            const newParams = new URLSearchParams(searchParams);
            if (value) {
                newParams.set('search', value);
            } else {
                newParams.delete('search');
            }
            newParams.set('page', '1');
            setSearchParams(newParams);
        }, 2000); // 2 seconds delay

        setSearchTimeout(timeout);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        // Clear any existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        // Immediately update search params
        const newParams = new URLSearchParams(searchParams);
        if (searchText) {
            newParams.set('search', searchText);
        } else {
            newParams.delete('search');
        }
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    // Cleanup timeout on component unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    useEffect(() => {
        setSearchText(searchParams.get('search') || '');
    }, [searchParams]);

    return(
        <div className="lg:px-14 sm:px-8 px-4 py-14 2xl:w-[90%] 2xl:mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <form 
                    onSubmit={handleSearchSubmit}
                    className="w-full sm:w-[500px]"
                >
                    <label htmlFor="product-search" className="sr-only">Search Products</label>
                    <div className="flex items-center border rounded-lg overflow-hidden">
                        <input
                            id="product-search"
                            name="search"
                            type="text"
                            placeholder="Search Products"
                            value={searchText}
                            onChange={handleSearchInputChange}
                            className="px-4 py-2 w-full outline-none"
                            aria-label="Search products"
                        />
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                            aria-label="Submit search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </form>

                <div className="flex items-center gap-4">
                    <Filter />
                </div>
            </div>

            {isLoadingProducts ? (
                <Loader />
            ) : errorMessage ? (
                <div className="flex justify-center items-center h-[200px]">
                    <FaExclamationTriangle className="text-slate-800 text-3xl mr-2"/>
                    <span className="text-slate-800 text-lg font-medium">
                        {errorMessage}
                    </span>
                </div>
            ) : (
                <div className="min-h-[700px]">
                    <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
                        {products && products.length > 0 ? (
                            products.map((item, i) => <ProductCard key={i} {...item} />)
                        ) : (
                            <div className="col-span-full text-center text-gray-600 py-10">
                                No products found
                            </div>
                        )}
                    </div>
                    {pagination && (
                         <div className="flex justify-center pt-10">
                            <Paginations
                                numberOfPage={pagination?.lastPage}
                                totalPoducts={pagination?.total}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProductsPage;