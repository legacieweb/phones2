import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || searchParams.get('brand') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    if (brand || search) setSearchTerm(brand || search || '');
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  const categories = ['smartphones', 'tablets', 'accessories'];

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchTerm, selectedCategory, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Product Catalog</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 md:hidden"
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center uppercase tracking-tight">
              <Filter className="h-5 w-5 mr-2 text-primary-600" />
              Refine
            </h3>
            
            <div className="mb-8">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Category</h4>
              <div className="space-y-3">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 mr-3"
                  />
                  <span className="text-sm font-bold text-gray-600 group-hover:text-primary-600 transition-colors">All Categories</span>
                </label>
                {categories.map(cat => (
                  <label key={cat} className="flex items-center group cursor-pointer capitalize">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 mr-3"
                    />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-primary-600 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Price Limit</h4>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="1500"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-xs font-black text-gray-400">$0</span>
                  <span className="text-sm font-black text-primary-600">${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}