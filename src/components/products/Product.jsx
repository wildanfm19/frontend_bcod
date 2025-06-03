import { FaExclamationTriangle } from "react-icons/fa";
import ProductCard from "../shared/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories} from "../../store/actions";
import { useEffect, useState } from "react";
import Filter from "../shared/Filter";
import Loader from "../shared/Loader";
import Paginations from "../shared/Paginations";
import useProductFilter from "../../hooks/useProductFilter.js";
import { useSearchParams } from "react-router-dom";

const ProductsPage = () =>{
    const {isLoading , errorMessage} = useSelector(
        (state) => state.errors
    );
   
    const { categories } = useSelector((state) => state.categories);
    const { pagination } = useSelector((state) => state.products);

    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchText, setSearchText] = useState(searchParams.get('search') || '');

    const filteredAndSortedProducts = useProductFilter();

    useEffect(() => {
        dispatch(fetchCategories());
    },[dispatch]);

    const handleSearchInputChange = (event) => {
        const value = event.target.value;
        setSearchText(value);

        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set('search', value);
        } else {
            newParams.delete('search');
        }
        setSearchParams(newParams);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        setSearchText(searchParams.get('search') || '');
    }, [searchParams]);

    return(
        <div className="lg:px-14 sm:px-8 px-4 py-14 2xl:w-[90%] 2xl:mx-auto">
           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
            <input
                type="text"
                placeholder="Search Products"
                value={searchText}
                onChange={handleSearchInputChange}
                className="px-6 py-3 w-full sm:w-96 text-lg outline-none"
            />
            <button
                type="button"
                onClick={handleSearchSubmit}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </button>
        </div>

        <div className="flex items-center gap-4">
            <Filter />
        </div>
    </div>

            {isLoading ? (
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
                        {filteredAndSortedProducts &&
                         filteredAndSortedProducts.map((item , i) => <ProductCard key={i} {...item} />)

                        }
                    </div>
                    {pagination && (
                         <div className="flex justify-center pt-10">
                            <Paginations
                                numberOfPage = {pagination?.last_page}
                                totalPoducts = {pagination?.total}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProductsPage;