import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Search,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  Grid,
  List,
  Eye,
  Tag,
  Truck,
  Shield,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

type ProductType = {
  _id: string;
  name: string;
  category: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  year?: number;
  price: number;
  originalPrice: number | null;
  status:
    | "In Stock"
    | "Out of Stock"
    | "Limited Stock"
    | "Pre-Order"
    | "Discontinued";
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  badge: string | null;
  description: string;
  specifications?: {
    weight?: string;
    dimensions?: string;
    material?: string;
    color?: string;
    warranty?: string;
    compatibility?: string[];
    partNumber?: string;
    origin?: string;
  };
  stock?: number;
  discount?: number;
  tags?: string[];
  featured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const categories = [
  "All Categories",
  "Braking System",
  "Engine Components",
  "Lighting",
  "Suspension",
  "Exhaust System",
  "Interior",
  "Exterior",
  "Tires & Wheels",
  "Electrical",
  "Cooling System",
  "Transmission",
  "Tools & Equipment"
];

const statusColors = {
  "In Stock": "bg-green-600/20 text-green-400",
  "Limited Stock": "bg-yellow-600/20 text-yellow-400",
  "Out of Stock": "bg-red-600/20 text-red-400",
  "Pre-Order": "bg-blue-600/20 text-blue-400",
  Discontinued: "bg-gray-600/20 text-gray-400"
};

const badgeColors = {
  "Best Seller": "bg-yellow-600",
  "New Arrival": "bg-blue-600",
  "Hot Deal": "bg-orange-600",
  Premium: "bg-purple-600",
  "Limited Edition": "bg-pink-600",
  Sale: "bg-red-600",
  Trending: "bg-green-600"
};

const socket = io("http://localhost:5000");

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "name" | "price-low" | "price-high" | "rating" | "newest" | "featured"
  >("name");
  const [filterCategory, setFilterCategory] =
    useState<string>("All Categories");
  const [filterBrand, setFilterBrand] = useState<string>("All Brands");
  const [filterStatus, setFilterStatus] = useState<string>("All Status");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFeaturedOnly, setShowFeaturedOnly] = useState<boolean>(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchProducts();
    fetchBrands();

    socket.on("productCreated", (newProduct: ProductType) => {
      setProducts((prev) => [...prev, newProduct]);
    });

    socket.on("productUpdated", (updatedProduct: ProductType) => {
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
    });

    socket.on("productDeleted", (id: string) => {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    });

    return () => {
      socket.off("productCreated");
      socket.off("productUpdated");
      socket.off("productDeleted");
    };
  }, []);

  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(filterCategory !== "All Categories" && {
          category: filterCategory
        }),
        ...(filterBrand !== "All Brands" && { brand: filterBrand }),
        ...(filterStatus !== "All Status" && { status: filterStatus }),
        ...(searchTerm && { search: searchTerm }),
        ...(showFeaturedOnly && { featured: "true" }),
        sortBy:
          sortBy === "newest"
            ? "createdAt"
            : sortBy === "price-low"
            ? "price"
            : sortBy === "price-high"
            ? "price"
            : sortBy === "featured"
            ? "featured"
            : "name",
        sortOrder:
          sortBy === "price-high"
            ? "desc"
            : sortBy === "featured"
            ? "desc"
            : sortBy === "newest"
            ? "desc"
            : "asc"
      });

      const res = await fetch(
        `http://localhost:5000/api/products?${queryParams}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      if (data.products) {
        setProducts(data.products);
        setTotalPages(data.pagination?.pages || 1);
        setCurrentPage(data.pagination?.current || 1);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/brands");
      if (res.ok) {
        const brands = await res.json();
        setAvailableBrands(brands.map((b: any) => b.name));
      }
    } catch (error) {
      console.error("Fetch brands error:", error);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    setCurrentPage(1);
  }, [
    filterCategory,
    filterBrand,
    filterStatus,
    searchTerm,
    sortBy,
    showFeaturedOnly
  ]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesPrice;
  });

  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  const clearFilters = () => {
    setFilterCategory("All Categories");
    setFilterBrand("All Brands");
    setFilterStatus("All Status");
    setPriceRange([0, 100000]);
    setSearchTerm("");
    setShowFeaturedOnly(false);
    setSortBy("name");
  };

  type ProductCardProps = {
    product: ProductType;
    isListView?: boolean;
  };

  const ProductCard: React.FC<ProductCardProps> = ({
    product,
    isListView = false
  }) => (
    <div
      className={`group bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:border-red-600/50 transition-all duration-300 transform hover:-translate-y-2 ${
        isListView ? "flex items-center gap-6 p-6" : "p-6"
      }`}
    >
      <div
        className={`relative ${
          isListView ? "w-48 h-48 flex-shrink-0" : "mb-4"
        }`}
      >
        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          className={`w-full ${
            isListView ? "h-48" : "h-60"
          } object-cover rounded-xl group-hover:scale-105 transition-transform duration-300`}
        />

        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                badgeColors[product.badge as keyof typeof badgeColors] ||
                "bg-red-600"
              } text-white`}
            >
              {product.badge}
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
              Featured
            </span>
          )}
          {product.discount && product.discount > 0 && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-600 text-white">
              -{product.discount}%
            </span>
          )}
        </div>

        <button
          onClick={() => toggleFavorite(product._id)}
          aria-label={`Toggle favorite for ${product.name}`}
          className="absolute top-2 right-2 p-2 bg-slate-900/70 rounded-full hover:bg-slate-800 transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${
              favorites.has(product._id)
                ? "fill-red-500 text-red-500"
                : "text-white"
            }`}
          />
        </button>

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Quick View
          </button>
        </div>
      </div>

      <div className={`${isListView ? "flex-1" : ""}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="text-red-400 font-mono">{product.category}</span>
              {product.subcategory && (
                <>
                  <span>•</span>
                  <span>{product.subcategory}</span>
                </>
              )}
            </div>
            {product.brand && (
              <p className="text-sm text-slate-300 font-semibold">
                {product.brand} {product.model && `- ${product.model}`}
              </p>
            )}
            {product.year && (
              <p className="text-xs text-slate-500">Year: {product.year}</p>
            )}
          </div>
          {!isListView && (
            <span
              className={`px-3 py-1 text-xs rounded-full font-semibold ${
                statusColors[product.status as keyof typeof statusColors]
              }`}
            >
              {product.status}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-400">
            ({product.reviews} reviews)
          </span>
          {product.rating > 4.5 && (
            <TrendingUp className="w-4 h-4 text-green-400" />
          )}
        </div>

        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Product specifications */}
        {product.specifications && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {product.specifications.warranty && (
                <div className="flex items-center gap-1 text-xs bg-slate-700/50 px-2 py-1 rounded">
                  <Shield className="w-3 h-3" />
                  <span>{product.specifications.warranty}</span>
                </div>
              )}
              {product.specifications.origin && (
                <div className="flex items-center gap-1 text-xs bg-slate-700/50 px-2 py-1 rounded">
                  <Truck className="w-3 h-3" />
                  <span>{product.specifications.origin}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="text-xs text-slate-500 px-2 py-1">
                  +{product.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              {product.price.toLocaleString()} LKR
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-500 line-through">
                {product.originalPrice.toLocaleString()} LKR
              </span>
            )}
            {product.originalPrice && (
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                Save{" "}
                {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )}
                %
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {product.stock !== undefined && product.stock > 0 && (
              <span className="text-xs text-slate-400">
                {product.stock} in stock
              </span>
            )}
            <button
              disabled={
                product.status === "Out of Stock" ||
                product.status === "Discontinued"
              }
              className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {product.status === "Pre-Order" ? "Pre-Order" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 mt-12">
          <h1
            className="text-5xl md:text-6xl text-white drop-shadow-lg"
            style={{ fontFamily: "Magenta, Arial Black, sans-serif" }}
          >
            AutoNexus <span className="text-red-600">Parts</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Premium automotive parts and components for all makes and models
          </p>
        </div>

        {/* Filter/Search Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search parts by name, brand, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:border-red-500 focus:outline-none transition-colors"
                aria-label="Search products"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-xl transition-colors ${
                viewMode === "grid"
                  ? "bg-red-600/80"
                  : "bg-slate-800/50 hover:bg-slate-700/50"
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <Grid className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-xl transition-colors ${
                viewMode === "list"
                  ? "bg-red-600/80"
                  : "bg-slate-800/50 hover:bg-slate-700/50"
              }`}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-colors flex items-center gap-2"
              aria-label="Toggle filters"
            >
              <Filter className="w-5 h-5 text-red-500" />
              <span className="hidden sm:inline text-sm">Filters</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-80 bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 h-fit`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-red-500">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-slate-400 hover:text-white underline"
              >
                Clear All
              </button>
            </div>

            {/* Featured Toggle */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="w-5 h-5 text-red-600 bg-slate-800 border-slate-600 rounded focus:ring-red-500"
                />
                <span className="text-sm font-semibold text-slate-300">
                  Featured Products Only
                </span>
              </label>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Categories
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-xl transition-colors text-sm ${
                      filterCategory === category
                        ? "bg-red-600/80 text-white"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    }`}
                    type="button"
                    aria-pressed={filterCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            {availableBrands.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Brands
                </h3>
                <select
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                >
                  <option value="All Brands">All Brands</option>
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Stock Status
              </h3>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
              >
                <option value="All Status">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Limited Stock">Limited Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Pre-Order">Pre-Order</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Price Range
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Min</span>
                  <input
                    type="number"
                    min={0}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([
                        Math.min(Number(e.target.value), priceRange[1]),
                        priceRange[1]
                      ])
                    }
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder-slate-400 focus:border-red-500 focus:outline-none transition-colors"
                    aria-label="Minimum price"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Max</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    max={500000}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        Math.max(Number(e.target.value), priceRange[0])
                      ])
                    }
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder-slate-400 focus:border-red-500 focus:outline-none transition-colors"
                    aria-label="Maximum price"
                  />
                </div>
                <div className="text-sm text-center text-slate-400">
                  {priceRange[0].toLocaleString()} -{" "}
                  {priceRange[1].toLocaleString()} LKR
                </div>
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                aria-label="Sort products"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest First</option>
                <option value="featured">Featured First</option>
              </select>
            </div>
          </aside>

          {/* Products Section */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-400 text-xl mb-4">
                  No products found matching your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-slate-400">
                    Showing {filteredProducts.length} of {products.length}{" "}
                    products
                  </p>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        isListView
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-slate-800/50 text-white rounded-xl hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Previous
                    </button>

                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      const page = Math.max(1, currentPage - 2) + index;
                      if (page > totalPages) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-xl ${
                            currentPage === page
                              ? "bg-red-600/80 text-white"
                              : "bg-slate-800/50 text-white hover:bg-slate-700/50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    {currentPage + 2 < totalPages && totalPages > 5 && (
                      <span className="px-2 text-slate-400">...</span>
                    )}

                    {currentPage + 2 < totalPages && (
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-4 py-2 rounded-xl ${
                          currentPage === totalPages
                            ? "bg-red-600/80 text-white"
                            : "bg-slate-800/50 text-white hover:bg-slate-700/50"
                        }`}
                      >
                        {totalPages}
                      </button>
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-slate-800/50 text-white rounded-xl hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
