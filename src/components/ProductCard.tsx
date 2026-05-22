import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '../types';
import { useCartStore } from '../store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${product.id}`}
            className="p-3 bg-white text-gray-900 rounded-full hover:bg-primary-600 hover:text-white transition-colors shadow-lg"
            title="View Details"
          >
            <Eye className="h-5 w-5" />
          </Link>
          <button
            onClick={handleAddToCart}
            className="p-3 bg-white text-gray-900 rounded-full hover:bg-primary-600 hover:text-white transition-colors shadow-lg"
            title="Add to Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="bg-orange-100 text-orange-800 text-[10px] font-bold py-1 px-2 rounded uppercase text-center backdrop-blur-sm bg-opacity-90">
              Only {product.stock} left in stock
            </div>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-primary-600 text-[10px] font-bold uppercase tracking-wider">
            {product.brand}
          </span>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-yellow-400">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="ml-1 text-xs font-bold text-gray-700">{product.rating}</span>
          </div>
          <span className="text-gray-400 text-xs">({product.reviews} reviews)</span>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
          {product.shortDescription}
        </p>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-xs font-medium">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-2xl font-black text-gray-900">
              ${product.price}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center justify-center bg-gray-900 text-white p-3 rounded-xl hover:bg-primary-600 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed group/btn"
          >
            <ShoppingCart className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
