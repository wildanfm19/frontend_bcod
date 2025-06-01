import { useSearchParams } from "react-router-dom";
import { useState } from "react";

const PriceSort = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const currentSort = searchParams.get("sort") || "";

    const handleSort = (sortValue) => {
        const newParams = new URLSearchParams(searchParams);
        if (sortValue) {
            newParams.set("sort", sortValue);
        } else {
            newParams.delete("sort");
        }
        setSearchParams(newParams);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
            >
                <span>Sort by Price</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
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
    );
};

export default PriceSort; 