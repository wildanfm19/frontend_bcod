import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import Loader from "../shared/Loader";
import { FaExclamationTriangle } from "react-icons/fa";
import Paginations from "../shared/Paginations";
import { Link, useSearchParams } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { fetchCategories } from "../../store/actions";
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import toast from 'react-hot-toast';

const SellerProductsPage = () => {
  const dispatch = useDispatch();
  const [sellerProducts, setSellerProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const { categories } = useSelector((state) => state.categories);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category_id") || "");
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("is_active") || "");

  const currentPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [sortBy, setSortBy] = useState("");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenEditModal = (product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditProduct(null);
    setIsEditModalOpen(false);
  };

  const fetchSellerProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        setIsLoading(false);
        return;
      }

      const params = new URLSearchParams(searchParams);
      if (searchTerm) params.set("search", searchTerm);
      if (selectedCategory) params.set("category_id", selectedCategory);
      if (selectedStatus === 'true') {
        params.set("status", 'active');
      } else if (selectedStatus === 'false') {
        params.set("status", 'inactive');
      }
      params.delete("is_active");

      const queryString = params.toString();

      const { data } = await api.get(`/seller/products?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.code === "000" && data.status === "success" && data.data) {
        setSellerProducts(data.data.data);
        setPagination({
          currentPage: data.data.current_page,
          lastPage: data.data.last_page,
          total: data.data.total,
          perPage: data.data.per_page,
        });
      } else {
        setError(data.message || "Failed to fetch seller products.");
        setSellerProducts([]);
        setPagination(null);
      }
    } catch (error) {
      console.error("Error fetching seller products:", error);
      setError(error?.response?.data?.message || "Failed to fetch seller products.");
      setSellerProducts([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
    // eslint-disable-next-line
  }, [searchParams]);

  const handleProductAdded = () => {
    setSearchParams({});
    fetchSellerProducts(); // Refresh data setelah tambah produk
  };

  useEffect(() => {
    if (!categories || categories.length === 0) {
      setLoadingCategories(true);
      dispatch(fetchCategories()).finally(() => setLoadingCategories(false));
    }
  }, [dispatch, categories]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set("search", value);
    else newParams.delete("search");
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
        newParams.set("category_id", value);
    } else {
        newParams.delete("category_id"); // Reset category filter
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleStatusChange = (event) => {
    const value = event.target.value; // value will be 'true', 'false', or ''
    setSelectedStatus(value);
    const newParams = new URLSearchParams(searchParams);
    // Map frontend value to backend parameter name and value
    if (value === 'true') {
      newParams.set("status", "active");
    } else if (value === 'false') {
      newParams.set("status", "inactive");
    } else { // When value is empty string (All Status)
      newParams.delete("status"); // Correctly remove status param for reset
    }
    // Also remove the old is_active param if it exists
    newParams.delete("is_active");
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
  };

  const formatPrice = (price) => {
    return `Rp ${price?.toLocaleString('id-ID')}`;
  };

  // Sorting logic (frontend)
  const getSortedProducts = (products) => {
    if (!products) return [];
    let sorted = [...products];
    if (sortBy === "name_az") {
      sorted.sort((a, b) => a.product_name.localeCompare(b.product_name));
    } else if (sortBy === "name_za") {
      sorted.sort((a, b) => b.product_name.localeCompare(a.product_name));
    } else if (sortBy === "price_low") {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_high") {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "stock_high") {
      sorted.sort((a, b) => Number(b.stock_quantity) - Number(a.stock_quantity));
    }
    return sorted;
  };

  const handleProductEdited = () => {
    setSearchParams({});
    fetchSellerProducts();
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('User not authenticated.');
        return;
      }
      const { data } = await api.delete(`/seller/products/${productId}/force`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.code === '000') {
        toast.success('Product deleted successfully!');
        fetchSellerProducts();
      } else {
        toast.error(data.message || 'Failed to delete product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete product.');
    }
  };

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-10 2xl:w-[90%] 2xl:mx-auto">
      <h1 className="text-2xl font-semibold mb-6">My Products</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center border rounded-lg overflow-hidden w-full sm:w-auto flex-grow">
          <input
            type="text"
            placeholder="Search Products"
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 w-full outline-none"
          />
          <button type="button" className="px-4 py-2 bg-gray-100 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <select
          className="border rounded-lg px-4 py-2 outline-none w-full sm:w-auto"
          value={selectedCategory}
          onChange={handleCategoryChange}
          disabled={loadingCategories || isLoading}
        >
          <option value="">All Categories</option>
          {categories && categories.map(category => (
            <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
          ))}
        </select>

        <select
          className="border rounded-lg px-4 py-2 outline-none w-full sm:w-auto"
          value={selectedStatus}
          onChange={handleStatusChange}
          disabled={isLoading}
        >
          <option value="">All Status</option>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>

        {/* Dropdown Sort */}
        <select
          className="border rounded-lg px-4 py-2 outline-none w-full sm:w-auto"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="name_az">Name A-Z</option>
          <option value="name_za">Name Z-A</option>
          <option value="price_low">Lowest Price</option>
          <option value="price_high">Highest Price</option>
          <option value="stock_high">Most Stock</option>
        </select>

        <button 
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 active:bg-gray-700 transition duration-200 w-full sm:w-auto"
          onClick={handleOpenModal}
          disabled={isLoading}
        >
          Add Product
        </button>

        {/* Link to Received Orders */}
        <Link 
          to="/store/received-orders"
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 active:bg-gray-700 transition duration-200 w-full sm:w-auto text-center"
        >
          Received Orders
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="flex justify-center items-center h-[200px] w-full text-center">
          <FaExclamationTriangle className="text-red-500 text-3xl mr-2" />
          <span className="text-red-500 text-lg font-medium">{error}</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {sellerProducts && getSortedProducts(sellerProducts).length > 0 ? (
            <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">No.</th>
                  <th className="py-3 px-6 text-left">Nama Produk</th>
                  <th className="py-3 px-6 text-left">Foto</th>
                  <th className="py-3 px-6 text-left">Kategori</th>
                  <th className="py-3 px-6 text-left">Persediaan</th>
                  <th className="py-3 px-6 text-left">Harga Jual</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {getSortedProducts(sellerProducts).map((product, index) => (
                  <tr key={product.product_id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{(pagination?.currentPage - 1) * (pagination?.perPage || 0) + index + 1}</td>
                    <td className="py-3 px-6 text-left">{product.product_name}</td>
                    <td className="py-3 px-6 text-left">
                      {product.main_image?.image_url ? (
                        <img src={product.main_image.image_url} alt={product.product_name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">{product.category?.category_name || 'N/A'}</td>
                    <td className="py-3 px-6 text-left">{product.stock_quantity}</td>
                    <td className="py-3 px-6 text-left">{formatPrice(product.price)}</td>
                    <td className="py-3 px-6 text-left">
                      <span className={`py-1 px-3 rounded-full text-xs ${
                        (product.is_active && product.stock_quantity > 0) ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'
                      }`}>
                        {(product.is_active && product.stock_quantity > 0) ? 'Available' : 'Not Available'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <Link to="#" className="w-6 mr-2 transform hover:text-purple-500 hover:scale-110" onClick={() => handleOpenEditModal(product)}>
                          <FiEdit size={18}/>
                        </Link>
                        <button className="w-6 mr-2 transform hover:text-red-500 hover:scale-110" onClick={() => handleDeleteProduct(product.product_id)}>
                          <FiTrash2 size={18}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-600 min-h-[500px] flex items-center justify-center">No products found for this seller.</div>
          )}
        </div>
      )}

      {pagination && sellerProducts && sellerProducts.length > 0 && (
        <div className="flex justify-center pt-10">
          <Paginations
            numberOfPage={pagination.lastPage}
            totalPoducts={pagination.total}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <AddProductModal 
        open={isModalOpen} 
        handleClose={handleCloseModal} 
        onProductAdded={handleProductAdded} 
      />
      <EditProductModal
        open={isEditModalOpen}
        handleClose={handleCloseEditModal}
        onProductEdited={handleProductEdited}
        product={editProduct}
        categories={categories}
      />
    </div>
  );
};

export default SellerProductsPage;