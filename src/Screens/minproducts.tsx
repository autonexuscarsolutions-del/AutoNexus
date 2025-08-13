import React, { useState, useEffect } from "react";
import {
  Package,
  ArrowRight,
  Star,
  TrendingUp,
  Wrench,
  Settings
} from "lucide-react";

type ProductType = {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  status: string;
  rating: number;
  reviews: number;
  image: string;
  badge: string;
  stock: number;
  discount: number;
  featured: boolean;
  isActive: boolean;
};

const MiniProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentProducts();
  }, []);

  const fetchRecentProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/products?limit=6&sort=-createdAt"
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || data);
      }
    } catch (error) {
      console.error("Error fetching recent products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllClick = () => {
    // Force page refresh with products route
    window.location.href = "/products";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-600/20 text-green-400";
      case "Limited Stock":
        return "bg-yellow-600/20 text-yellow-400";
      case "Out of Stock":
        return "bg-red-600/20 text-red-400";
      case "Pre-Order":
        return "bg-blue-600/20 text-blue-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden relative p-4 sm:p-8 md:p-12">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-700/15 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-slate-700/50 rounded w-1/3 mb-8 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800/40 backdrop-blur-md rounded-2xl h-80 border border-slate-700/50"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden relative p-4 sm:p-8 md:p-12">
      {/* Background Effects */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url('./src/assets/modern-car-driving-city.jpg')`
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-700/15 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1
            className="text-5xl md:text-7xl text-white drop-shadow-lg mb-4"
            style={{ fontFamily: "Magenta, Arial Black, sans-serif" }}
          >
            Featured <span className="text-red-600">Products</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Discover our latest premium automotive parts and performance
            upgrades
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-slate-400">
              <Package className="w-5 h-5 text-red-500" />
              <span className="text-sm">
                Latest {products.length} items added
              </span>
            </div>
            <div className="w-px h-6 bg-slate-600"></div>
            <button
              onClick={handleViewAllClick}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-red-600/25 group"
            >
              <span className="font-medium">View All Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:border-red-600/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-600/10 group overflow-hidden"
              >
                {/* Product Image & Badge */}
                <div className="relative">
                  <div className="aspect-video bg-slate-700/50 overflow-hidden">
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMDAgNDBMMTIwIDcwSDgwTDEwMCA0MFoiIGZpbGw9IiM2Mzc2OEMiLz4KPC9zdmc+";
                      }}
                    />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.badge && (
                      <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                        {product.badge}
                      </span>
                    )}
                    {product.featured && (
                      <span className="bg-yellow-600 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 backdrop-blur-sm">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </div>

                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-1 bg-green-600/20 backdrop-blur-sm text-green-400 text-sm px-3 py-1 rounded-full">
                        <TrendingUp className="w-4 h-4" />
                        {product.discount}% OFF
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Content */}
                <div className="p-6 space-y-4">
                  {/* Brand & Category */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="bg-slate-700/50 p-2 rounded-lg">
                      <Wrench className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-red-400 font-mono">
                      {product.brand && `${product.brand} • `}
                      {product.subcategory || product.category}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-red-400 transition-colors">
                    {product.name}
                  </h3>

                  {/* Price Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-white">
                        {product.price.toLocaleString()}{" "}
                        <span className="text-lg text-slate-400">LKR</span>
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="text-sm text-slate-400 line-through">
                            {product.originalPrice.toLocaleString()} LKR
                          </span>
                        )}
                    </div>

                    {/* Rating & Reviews */}
                    {product.rating > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < product.rating
                                  ? "fill-current"
                                  : "text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-400">
                          ({product.reviews} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stock & Status */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-400">
                        Stock:{" "}
                        <span className="text-white font-medium">
                          {product.stock || 0}
                        </span>
                      </span>
                    </div>

                    {!product.isActive && (
                      <span className="text-red-400 text-sm font-medium bg-red-600/20 px-2 py-1 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/40 backdrop-blur-md rounded-full flex items-center justify-center border border-slate-700/50">
              <Package className="w-12 h-12 text-slate-500" />
            </div>
            <h3
              className="text-3xl font-bold text-slate-300 mb-4"
              style={{ fontFamily: "Magenta, Arial Black, sans-serif" }}
            >
              No Products Yet
            </h3>
            <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
              Start adding premium automotive parts to see them featured here.
            </p>
            <button
              onClick={handleViewAllClick}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-red-600/25 font-medium"
            >
              Browse All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniProducts;
