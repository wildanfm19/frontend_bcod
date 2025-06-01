import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

const Filter = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const { categories } = useSelector((state) => state.categories);

    console.log("Filter Component - Categories:", categories);

    const currentSort = searchParams.get("sort") || "";
    const currentCategory = searchParams.get("category_id") || "";

    const handleSort = (sortValue) => {
        const newParams = new URLSearchParams(searchParams);
        if (sortValue) {
            newParams.set("sort", sortValue);
        } else {
            newParams.delete("sort");
        }
        setSearchParams(newParams);
        setIsSortOpen(false);
    };

    const handleCategory = (categoryId) => {
        const newParams = new URLSearchParams(searchParams);
        if (categoryId) {
            newParams.set("category_id", categoryId);
        } else {
            newParams.delete("category_id");
        }
        setSearchParams(newParams);
        setIsCategoryOpen(false);
    };

    // Function to clear all filters
    const handleClearFilter = () => {
        setSearchParams(new URLSearchParams()); // Set to empty search params
        setIsCategoryOpen(false);
        setIsSortOpen(false);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Category Filter */}
            <div className="relative">
                <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 w-full sm:w-auto"
                >
                    <span>Category</span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isCategoryOpen && (
                    <div className="absolute z-10 w-48 mt-2 bg-white border rounded-lg shadow-lg">
                        <div className="py-1">
                            <button
                                onClick={() => handleCategory("")}
                                className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${
                                    !currentCategory ? "bg-gray-100" : ""
                                }`}
                            >
                                All Categories
                            </button>
                            {categories?.map((category) => (
                                <button
                                    key={category.category_id}
                                    onClick={() => handleCategory(category.category_id)}
                                    className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${
                                        currentCategory === category.category_id.toString() ? "bg-gray-100" : ""
                                    }`}
                                >
                                    {category.category_name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Price Sort */}
            <div className="relative">
                <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 w-full sm:w-auto"
                >
                    <span>Sort by Price</span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isSortOpen && (
                    <div className="absolute z-10 w-48 mt-2 bg-white border rounded-lg shadow-lg">
                        <div className="py-1">
                            <button
                                onClick={() => handleSort("")}
                                className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${
                                    !currentSort ? "bg-gray-100" : ""
                                }`}
                            >
                                Default
                            </button>
                            <button
                                onClick={() => handleSort("price_low")}
                                className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${
                                    currentSort === "price_low" ? "bg-gray-100" : ""
                                }`}
                            >
                                Price: Low to High
                            </button>
                            <button
                                onClick={() => handleSort("price_high")}
                                className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${
                                    currentSort === "price_high" ? "bg-gray-100" : ""
                                }`}
                            >
                                Price: High to Low
                            </button>
                        </div>
                    </div>
                )}
            </div>
             {/* Clear Filter Button */}
            <button
                onClick={handleClearFilter}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
                Clear Filter
            </button>
        </div>
    );
};

export default Filter; 