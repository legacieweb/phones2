import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { useCartStore } from '../store';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-500">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/catalog" className="flex items-center text-gray-600 hover:text-primary-600 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          {product.images.length > 1 && (
            <div className="flex space-x-2 mt-4">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer ${
                    selectedImage === index ? 'ring-2 ring-primary-600' : ''
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <span className="text-3xl font-bold text-primary-600">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded">
                  <span className="font-medium text-gray-700">{key}:</span> {value}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}