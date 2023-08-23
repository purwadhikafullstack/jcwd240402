import React, { useState } from 'react';
import axios from 'axios';
import AsyncSelect from 'react-select/async';

const CreateStock = () => {
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stockQuantity, setStockQuantity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const loadWarehouses = async (inputValue) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/warehouse/warehouse-list?searchName=${inputValue}`);
            return response.data.warehouses.map(warehouse => ({
                value: warehouse.id,
                label: warehouse.warehouse_name,
            }));
        } catch (error) {
            console.error("Error fetching warehouses:", error);
            return [];
        }
    };
    const loadProducts = async (inputValue) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/admin/products?category_id=&page=&pageSize=10`);
            return response.data.data.map(product => ({
                value: product.id,
                label: product.name,
            }));
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    };
    const handleStockCreation = async () => {
        if (!selectedWarehouse) {
            setErrorMessage('Please select a warehouse.');
            return;
        }
        if (!selectedProduct) {
            setErrorMessage('Please select a product.');
            return;
        }
        if (parseInt(stockQuantity, 10) <= 0 || stockQuantity === '') {
            setErrorMessage('Stock quantity should be a positive number.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/warehouse-stock', {
                warehouseId: selectedWarehouse.value,
                productId: selectedProduct.value,
                productStock: stockQuantity,
            });
            console.log("Stock creation response:", response.data);
            alert('Stock created successfully!');
            setErrorMessage(''); 
        } catch (error) {
            console.error("Error creating stock:", error);

            if (error.response && error.response.data.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
                setErrorMessage(error.response.data.errors[0].msg);
            } else if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Error creating stock.');
            }
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-4">
            <h1 className="text-2xl mb-4">Stock Management</h1>

            <AsyncSelect
                cacheOptions
                loadOptions={loadWarehouses}
                onChange={setSelectedWarehouse}
                placeholder="Select a warehouse"
            />

            <AsyncSelect
                cacheOptions
                loadOptions={loadProducts}
                onChange={setSelectedProduct}
                placeholder="Select a product"
                className="mt-4"
            />

            <input
                type="number"
                placeholder="Enter Stock Quantity"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="mt-4 p-2 border rounded"
            />

            {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}

            <button
                className="mt-4 p-2 bg-blue-500 text-white rounded"
                onClick={handleStockCreation}
            >
                Create Stock
            </button>
        </div>
    );
};

export default CreateStock;
