import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, CircularProgress } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import api from '../../api/api';
import toast from 'react-hot-toast';

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
  maxHeight: '90vh',
  overflowY: 'auto',
};

const EditProductModal = ({ open, handleClose, onProductEdited, product, categories }) => {
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
    if (product) {
      setFormData({
        product_name: product.product_name || '',
        description: product.description || '',
        price: product.price || '',
        stock_quantity: product.stock_quantity || '',
        category_id: product.category_id || '',
        main_image: null,
      });
      setImagePreview(product.main_image?.image_url || null);
    }
  }, [product, open]);

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
    if (!formData.product_name || !formData.description || !formData.price || !formData.stock_quantity || !formData.category_id) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    const postData = new FormData();
    postData.append('product_name', formData.product_name);
    postData.append('description', formData.description);
    postData.append('price', parseFloat(formData.price));
    postData.append('stock_quantity', parseInt(formData.stock_quantity));
    postData.append('category_id', parseInt(formData.category_id));
    if (formData.main_image) {
      postData.append('main_image', formData.main_image);
    }
    postData.append('_method', 'PUT');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('User not authenticated.');
        setIsSubmitting(false);
        return;
      }
      const { data } = await api.post(`/seller/products/${product.product_id}`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.code === '000') {
        toast.success('Product updated successfully!');
        onProductEdited();
        handleClose();
      } else {
        toast.error(data.message || 'Failed to update product.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error?.response?.data?.message || 'Failed to update product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="edit-product-modal-title" aria-describedby="edit-product-modal-description">
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
        <Typography id="edit-product-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Edit Product
        </Typography>
        <TextField label="Product Name" name="product_name" value={formData.product_name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={3} required />
        <TextField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth margin="normal" required inputProps={{ step: '0.01' }} />
        <TextField label="Stock Quantity" name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleChange} fullWidth margin="normal" required inputProps={{ min: '0' }} />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select labelId="category-select-label" name="category_id" value={formData.category_id} label="Category" onChange={handleChange}>
            {categories && categories.map((cat) => (
              <MenuItem key={cat.category_id} value={cat.category_id}>{cat.category_name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box mt={2} mb={2}>
          <Button variant="contained" component="label" fullWidth>
            {formData.main_image ? 'Change Image' : 'Upload Image'}
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </Button>
          {imagePreview && (
            <Box mt={2} display="flex" justifyContent="center">
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, border: '1px solid #eee' }} />
            </Box>
          )}
        </Box>
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={handleClose} color="inherit" variant="outlined" disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} startIcon={isSubmitting && <CircularProgress size={18} color="inherit" />}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProductModal; 