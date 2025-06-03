import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Button
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiRefreshCcw,
  FiSearch,
  FiFilter
} from "react-icons/fi";
import {
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";

const Filter = ({ categories }) => {
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const currentCategory = searchParams.get("category") || "all";
    const currentSortOrder = searchParams.get("sortby") || "asc";
    const currentSearchTerm = searchParams.get("keyword") || "";

    setCategory(currentCategory);
    setSortOrder(currentSortOrder);
    setSearchTerm(currentSearchTerm);
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
        if (searchTerm) {
            searchParams.set("keyword",searchTerm);
        } else{
            searchParams.delete("keyword");
        }
        navigate(`${pathname}?${searchParams.toString()}`);
    } , 700);

    return () => {
        clearTimeout(handler);
    }
  },[searchParams,searchTerm , navigate , pathname])

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;

    if (selectedCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", selectedCategory);
    }

    navigate(`${pathname}?${params.toString()}`);
    setCategory(selectedCategory);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => {
      const newOrder = prevOrder === "asc" ? "desc" : "asc";
      params.set("sortby", newOrder);
      navigate(`${pathname}?${params.toString()}`);
      return newOrder;
    });
  };

  const handleClearFilter = () => {
   navigate({pathname : window.location.pathname})
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-white/20 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
          <FiFilter className="text-white text-lg" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Filter & Search
        </h2>
      </div>

      <div className="flex lg:flex-row flex-col-reverse lg:justify-between justify-center items-center gap-6">
        {/* SEARCH BAR */}
        <div className="relative flex items-center 2xl:w-[450px] sm:w-[420px] w-full group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 border border-gray-200 text-slate-800 rounded-xl py-3 pl-12 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
              <FiSearch className="text-white text-sm" />
            </div>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col gap-4 items-center">
          {/* CATEGORY DROPDOWN */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <FormControl variant="outlined" size="small" className="relative">
              <InputLabel 
                id="category-select-label"
                className="text-gray-600 font-medium"
              >
                Category
              </InputLabel>
              <Select
                labelId="category-select-label"
                value={category}
                onChange={handleCategoryChange}
                label="Category"
                className="min-w-[140px] text-slate-800 bg-white/80 rounded-xl shadow-sm border-gray-200 hover:shadow-md transition-all duration-300"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                    },
                  },
                }}
              >
                <MenuItem value="all" className="font-medium">All Categories</MenuItem>
                {categories.map((item) => (
                  <MenuItem key={item.category_id} value={item.category_name} className="font-medium">
                    {item.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* SORT BUTTON */}
          <Tooltip title={`Sorted by Price: ${sortOrder.toUpperCase()}`} placement="top">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button
                onClick={toggleSortOrder}
                className="relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <span>Sort Price</span>
                {sortOrder === "asc" ? (
                  <FiArrowUp size={18} />
                ) : (
                  <FiArrowDown size={18} />
                )}
              </button>
            </div>
          </Tooltip>

          {/* CLEAR BUTTON */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <button 
              className="relative bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              onClick={handleClearFilter}
            >
              <FiRefreshCcw size={16} />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;