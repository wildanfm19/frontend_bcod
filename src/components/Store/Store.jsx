import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../store/actions";
import api from "../../api/api";

const UploadProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    discount: "0",
    categoryId: "2", // Default to category 2 as per your endpoint
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // 1. Prepare product data (without image first)
    const productData = {
      productName: formData.productName,
      description: formData.description,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount || 0), // default to 0 if empty
    };

    // 2. Send product data to create the product
    const response = await api.post(
      `/admin/categories/${formData.categoryId}/product`,
      productData
    );

    // 3. If there's an image, upload it separately
    if (formData.image) {
      const imageFormData = new FormData();
      imageFormData.append('image', formData.image);
      
      await api.put(
        `/products/${response.data.productId}/image`,
        imageFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    }

    toast.success('Product created successfully!');
    navigate('/admin/products');
  } catch (error) {
    console.error('Error creating product:', error);
    toast.error(error.response?.data?.message || 'Failed to create product');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 500,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 4,
      }}
    >
      <Typography variant="h5" textAlign="center" fontWeight="bold">
        Upload Product
      </Typography>

      <TextField
        label="Product Name"
        name="productName"
        value={formData.productName}
        onChange={handleChange}
        fullWidth
        required
      />

      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        required
      />

      <TextField
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        fullWidth
        required
        inputProps={{ step: "0.01" }}
      />

      <TextField
        label="Discount (%)"
        name="discount"
        type="number"
        value={formData.discount}
        onChange={handleChange}
        fullWidth
        inputProps={{ min: 0, max: 100 }}
      />

      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          label="Category"
          disabled // Disabled since we're hardcoding to category 2
        >
          <MenuItem value="2">Category 2</MenuItem>
        </Select>
      </FormControl>

      <Button variant="outlined" component="label">
        Upload Image
        <input
          type="file"
          name="image"
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />
      </Button>

      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Product"}
      </Button>
    </Box>
  );
};

export default UploadProductForm;