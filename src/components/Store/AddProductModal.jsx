import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { fetchCategories } from '../../store/actions';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh', // Limit height
  overflowY: 'auto', // Enable scrolling
};

const AddProductModal = ({ open, handleClose, onProductAdded }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    main_image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Fetch categories when modal opens, if not already loaded
    if (open && (!categories || categories.length === 0)) {
      setLoadingCategories(true);
      dispatch(fetchCategories()).finally(() => setLoadingCategories(false));
    }
  }, [open, dispatch, categories]);

  useEffect(() => {
      // Reset form when modal is opened/closed
      setFormData({
          product_name: '',
          description: '',
          price: '',
          stock_quantity: '',
          category_id: '',
          main_image: null,
      });
      setImagePreview(null);
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, main_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.product_name || !formData.description || !formData.price || !formData.stock_quantity || !formData.category_id || !formData.main_image) {
        toast.error("Please fill in all required fields and select an image.");
        return;
    }

    setIsSubmitting(true);

    const postData = new FormData();
    postData.append('product_name', formData.product_name);
    postData.append('description', formData.description);
    postData.append('price', parseFloat(formData.price)); // Ensure price is a number
    postData.append('stock_quantity', parseInt(formData.stock_quantity)); // Ensure quantity is an integer
    postData.append('category_id', parseInt(formData.category_id)); // Ensure category_id is an integer
    postData.append('main_image', formData.main_image);

    try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("User not authenticated.");
          setIsSubmitting(false);
          return;
        }

      const { data } = await api.post('/seller/products', postData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for sending files
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.code === "000") {
        toast.success("Product added successfully!");
        onProductAdded(); // Callback to refresh product list in parent
        handleClose(); // Close modal on success
      } else {
        toast.error(data.message || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error?.response?.data?.message || "Failed to add product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-product-modal-title"
      aria-describedby="add-product-modal-description"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="add-product-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Add New Product
        </Typography>
        
        <TextField
          label="Product Name"
          name="product_name"
          value={formData.product_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={3}
          required
        />

        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          inputProps={{ step: "0.01" }}
        />

        <TextField
          label="Stock Quantity"
          name="stock_quantity"
          type="number"
          value={formData.stock_quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          inputProps={{ min: "0" }}
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            name="category_id"
            value={formData.category_id}
            label="Category"
            onChange={handleChange}
            disabled={loadingCategories || isSubmitting}
          >
            {loadingCategories ? (
              <MenuItem disabled value="">Loading Categories...</MenuItem>
            ) : categories && categories.length > 0 ? (
              categories.map((category) => (
                <MenuItem key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </MenuItem>
              ))
            ) : (
                <MenuItem disabled value="">No Categories Available</MenuItem>
            )}
          </Select>
        </FormControl>

        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="outlined" component="span" fullWidth>
            Upload Main Image
          </Button>
        </label>
         {imagePreview && (
              <Box mt={2} textAlign="center">
                <img src={imagePreview} alt="Image Preview" style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }} />
              </Box>
          )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={isSubmitting || loadingCategories}
        >
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddProductModal; 