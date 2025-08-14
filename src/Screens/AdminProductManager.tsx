import React, { useState, useEffect } from "react";
import {
  Save,
  X,
  Edit,
  Trash2,
  Plus,
  Upload,
  Star,
  Package,
  Tag,
  Calendar,
  Truck,
  Shield,
  Palette,
  Ruler,
  Weight,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RotateCcw
} from "lucide-react";

type ProductType = {
  _id?: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  year: number | null;
  price: number;
  originalPrice: number | null;
  status: string;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  badge: string;
  description: string;
  specifications: {
    weight: string;
    dimensions: string;
    material: string;
    color: string;
    warranty: string;
    compatibility: string[];
    partNumber: string;
    origin: string;
  };
  stock: number;
  discount: number;
  tags: string[];
  featured: boolean;
  isActive: boolean;
};

type CategoryType = {
  _id: string;
  name: string;
  description: string;
  subcategories: { name: string; description: string }[];
};

type BrandType = {
  _id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
};

const initialFormState: ProductType = {
  name: "",
  category: "Braking System",
  subcategory: "",
  brand: "",
  model: "",
  year: null,
  price: 0,
  originalPrice: null,
  status: "In Stock",
  rating: 0,
  reviews: 0,
  image: "",
  images: [],
  badge: "",
  description: "",
  specifications: {
    weight: "",
    dimensions: "",
    material: "",
    color: "",
    warranty: "",
    compatibility: [],
    partNumber: "",
    origin: ""
  },
  stock: 0,
  discount: 0,
  tags: [],
  featured: false,
  isActive: true
};

const statusOptions = [
  "In Stock",
  "Out of Stock",
  "Limited Stock",
  "Pre-Order",
  "Discontinued"
];
const badgeOptions = [
  "",
  "Best Seller",
  "New Arrival",
  "Hot Deal",
  "Premium",
  "Limited Edition",
  "Sale",
  "Trending"
];

const ADMIN_EMAIL = "autonexuscarsolutions@gmail.com";

interface AdminProductManagerProps {
  user: any;
}

const AdminProductManager: React.FC<AdminProductManagerProps> = ({ user }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [form, setForm] = useState<ProductType>(initialFormState);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<
    "basic" | "specifications" | "media"
  >("basic");
  const [tagInput, setTagInput] = useState("");
  const [compatibilityInput, setCompatibilityInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      fetchProducts();
      fetchCategories();
      fetchBrands();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products?limit=100");
      const data = await res.json();
      setProducts(data.products || data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/brands");
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ProductType] as object),
          [child]: value
        }
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : [
                "price",
                "originalPrice",
                "rating",
                "reviews",
                "year",
                "stock",
                "discount"
              ].includes(name)
            ? Number(value) ||
              (name === "originalPrice" || name === "year" ? null : 0)
            : value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }));
  };

  const handleCompatibilityAdd = () => {
    if (
      compatibilityInput.trim() &&
      !form.specifications.compatibility.includes(compatibilityInput.trim())
    ) {
      setForm((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          compatibility: [
            ...prev.specifications.compatibility,
            compatibilityInput.trim()
          ]
        }
      }));
      setCompatibilityInput("");
    }
  };

  const handleCompatibilityRemove = (itemToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        compatibility: prev.specifications.compatibility.filter(
          (item) => item !== itemToRemove
        )
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Add all form fields
      Object.entries(form).forEach(([key, val]) => {
        if (key === "specifications" || key === "tags") {
          formData.append(key, JSON.stringify(val));
        } else if (val !== null && val !== undefined) {
          formData.append(key, val.toString());
        }
      });

      // Add images
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const url = editingId
        ? `http://localhost:5000/api/products/${editingId}`
        : "http://localhost:5000/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData
      });

      if (res.ok) {
        alert(`Product ${editingId ? "updated" : "added"} successfully!`);
        resetForm();
        fetchProducts();
      } else {
        const error = await res.json();
        alert(`Failed to save product: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error saving product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: ProductType) => {
    setForm({
      ...product,
      specifications: product.specifications || initialFormState.specifications,
      tags: product.tags || [],
      images: product.images || []
    });
    setEditingId(product._id || null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("Product deleted successfully!");
        fetchProducts();
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting product.");
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setImageFiles([]);
    setEditingId(null);
    setTagInput("");
    setCompatibilityInput("");
    setCurrentTab("basic");
  };

  const getCurrentCategorySubcategories = () => {
    const category = categories.find((cat) => cat.name === form.category);
    return category?.subcategories || [];
  };

  // Filter and search products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product._id &&
          product._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.brand &&
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        filterStatus === "" || product.status === filterStatus;
      const matchesCategory =
        filterCategory === "" || product.category === filterCategory;
      const matchesBrand = filterBrand === "" || product.brand === filterBrand;

      return matchesSearch && matchesStatus && matchesCategory && matchesBrand;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "stock":
          aValue = a.stock || 0;
          bValue = b.stock || 0;
          break;
        case "category":
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case "brand":
          aValue = (a.brand || "").toLowerCase();
          bValue = (b.brand || "").toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterCategory("");
    setFilterBrand("");
    setSortBy("name");
    setSortOrder("asc");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden relative p-4 sm:p-8 md:p-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-700/15 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1
            className="text-5xl md:text-7xl text-white drop-shadow-lg"
            style={{ fontFamily: "Magenta, Arial Black, sans-serif" }}
          >
            <span className="text-red-600">AutoNexus</span> Admin
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Manage your premium automotive parts catalog with precision and
            style.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="bg-slate-800/40 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50">
              <span className="text-sm text-slate-400">Total Products: </span>
              <span className="text-red-400 font-bold">{products.length}</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 mb-8 border border-slate-700/50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-red-500">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <div className="flex items-center gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 transition-all duration-300 border border-slate-600/50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700/50 mb-8 overflow-x-auto">
            {[
              { id: "basic", label: "Basic Info", icon: Package },
              { id: "specifications", label: "Specifications", icon: Ruler },
              { id: "media", label: "Media & Tags", icon: Upload }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={`flex items-center gap-3 px-6 py-3 border-b-2 transition-all duration-300 whitespace-nowrap ${
                    currentTab === tab.id
                      ? "border-red-500 text-red-500 bg-red-500/5"
                      : "border-transparent text-slate-400 hover:text-white hover:border-slate-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Tab */}
            {currentTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Product Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white"
                  >
                    {categories.map((cat) => (
                      <option
                        key={cat._id}
                        value={cat.name}
                        className="bg-slate-700"
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Subcategory
                  </label>
                  <select
                    name="subcategory"
                    value={form.subcategory}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white"
                  >
                    <option value="" className="bg-slate-700">
                      Select Subcategory
                    </option>
                    {getCurrentCategorySubcategories().map((subcat) => (
                      <option
                        key={subcat.name}
                        value={subcat.name}
                        className="bg-slate-700"
                      >
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Brand
                  </label>
                  <select
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white"
                  >
                    <option value="" className="bg-slate-700">
                      Select Brand
                    </option>
                    {brands.map((brand) => (
                      <option
                        key={brand._id}
                        value={brand.name}
                        className="bg-slate-700"
                      >
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Model
                  </label>
                  <input
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="Product model"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={form.year || ""}
                    onChange={handleChange}
                    placeholder="e.g. 2023"
                    min="1900"
                    max="2030"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Price (LKR) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    min="0"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Original Price (LKR)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={form.originalPrice || ""}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={form.discount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white"
                  >
                    {statusOptions.map((status) => (
                      <option
                        key={status}
                        value={status}
                        className="bg-slate-700"
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Badge
                  </label>
                  <select
                    name="badge"
                    value={form.badge}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white"
                  >
                    {badgeOptions.map((badge) => (
                      <option
                        key={badge}
                        value={badge}
                        className="bg-slate-700"
                      >
                        {badge || "No Badge"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    <Star className="w-4 h-4 inline mr-2" />
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Number of Reviews
                  </label>
                  <input
                    type="number"
                    name="reviews"
                    value={form.reviews}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div className="lg:col-span-3 flex items-center gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                      className="w-5 h-5 text-red-600 bg-slate-700 border-slate-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-slate-300">
                      Featured Product
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      className="w-5 h-5 text-red-600 bg-slate-700 border-slate-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-slate-300">
                      Active
                    </span>
                  </label>
                </div>

                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Product description..."
                    rows={4}
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {currentTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    <Weight className="w-4 h-4 inline mr-2" />
                    Weight
                  </label>
                  <input
                    name="specifications.weight"
                    value={form.specifications.weight}
                    onChange={handleChange}
                    placeholder="e.g. 2.5kg"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    <Ruler className="w-4 h-4 inline mr-2" />
                    Dimensions
                  </label>
                  <input
                    name="specifications.dimensions"
                    value={form.specifications.dimensions}
                    onChange={handleChange}
                    placeholder="e.g. 25x15x10 cm"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Material
                  </label>
                  <input
                    name="specifications.material"
                    value={form.specifications.material}
                    onChange={handleChange}
                    placeholder="e.g. Steel, Aluminum"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    <Palette className="w-4 h-4 inline mr-2" />
                    Color
                  </label>
                  <input
                    name="specifications.color"
                    value={form.specifications.color}
                    onChange={handleChange}
                    placeholder="e.g. Black, Silver"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Warranty
                  </label>
                  <input
                    name="specifications.warranty"
                    value={form.specifications.warranty}
                    onChange={handleChange}
                    placeholder="e.g. 2 years"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Part Number
                  </label>
                  <input
                    name="specifications.partNumber"
                    value={form.specifications.partNumber}
                    onChange={handleChange}
                    placeholder="e.g. ABC-123-XYZ"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    <Truck className="w-4 h-4 inline mr-2" />
                    Country of Origin
                  </label>
                  <input
                    name="specifications.origin"
                    value={form.specifications.origin}
                    onChange={handleChange}
                    placeholder="e.g. Japan, Germany, USA"
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                  />
                </div>

                {/* Vehicle Compatibility */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Vehicle Compatibility
                  </label>
                  <div className="flex gap-3 mb-3">
                    <input
                      value={compatibilityInput}
                      onChange={(e) => setCompatibilityInput(e.target.value)}
                      placeholder="e.g. Toyota Camry 2018-2023"
                      className="flex-1 p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleCompatibilityAdd())
                      }
                    />
                    <button
                      type="button"
                      onClick={handleCompatibilityAdd}
                      className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {form.specifications.compatibility.map((item, index) => (
                      <span
                        key={index}
                        className="bg-slate-600/50 backdrop-blur-sm px-4 py-2 rounded-xl text-sm flex items-center gap-2 border border-slate-500/30"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => handleCompatibilityRemove(item)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Media & Tags Tab */}
            {currentTab === "media" && (
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Product Images
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white backdrop-blur-sm file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-red-600 file:to-red-700 file:text-white hover:file:from-red-700 hover:file:to-red-800 file:transition-all file:duration-300"
                  />
                  <p className="text-sm text-slate-400 mt-2">
                    Select up to 5 images. First image will be the main product
                    image.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    <Tag className="w-4 h-4 inline mr-2" />
                    Product Tags
                  </label>
                  <div className="flex gap-3 mb-3">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      className="flex-1 p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleTagAdd())
                      }
                    />
                    <button
                      type="button"
                      onClick={handleTagAdd}
                      className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {form.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-red-600/20 text-red-400 px-4 py-2 rounded-xl text-sm flex items-center gap-2 border border-red-500/30 backdrop-blur-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-8 border-t border-slate-700/50">
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-4 bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 transition-all duration-300 flex items-center gap-2 border border-slate-600/50 backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {editingId ? "Update Product" : "Add Product"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Products List */}
        <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl border border-slate-700/50 shadow-2xl">
          <div className="p-6 sm:p-8 border-b border-slate-700/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-red-500">
                  Products Catalog ({filteredProducts.length})
                </h2>
                <p className="text-slate-400 mt-2">
                  Manage and organize your automotive parts inventory
                </p>
              </div>

              {/* Search and Filters Section */}
              <div className="flex items-center gap-3">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-600/50 transition-all duration-300 flex items-center gap-2 border border-slate-600/50 backdrop-blur-sm"
                  title="Clear all filters"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>

            {/* Advanced Search and Filter Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              {/* Search Input */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by product name, ID, or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-slate-400"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white appearance-none"
                >
                  <option value="" className="bg-slate-700">
                    All Status
                  </option>
                  {statusOptions.map((status) => (
                    <option
                      key={status}
                      value={status}
                      className="bg-slate-700"
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white text-sm"
                >
                  <option value="name" className="bg-slate-700">
                    Name
                  </option>
                  <option value="price" className="bg-slate-700">
                    Price
                  </option>
                  <option value="stock" className="bg-slate-700">
                    Stock
                  </option>
                  <option value="category" className="bg-slate-700">
                    Category
                  </option>
                  <option value="brand" className="bg-slate-700">
                    Brand
                  </option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="px-3 py-3 bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 transition-all duration-300 border border-slate-600/50 backdrop-blur-sm"
                  title={`Sort ${
                    sortOrder === "asc" ? "Descending" : "Ascending"
                  }`}
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Additional Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white"
                >
                  <option value="" className="bg-slate-700">
                    All Categories
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category.name}
                      className="bg-slate-700"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div className="relative">
                <select
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white"
                >
                  <option value="" className="bg-slate-700">
                    All Brands
                  </option>
                  {brands.map((brand) => (
                    <option
                      key={brand._id}
                      value={brand.name}
                      className="bg-slate-700"
                    >
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || filterStatus || filterCategory || filterBrand) && (
              <div className="flex flex-wrap gap-2 mb-6 p-4 bg-slate-700/20 rounded-xl border border-slate-600/30">
                <span className="text-sm text-slate-400">Active filters:</span>
                {searchTerm && (
                  <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-lg text-sm flex items-center gap-2 border border-red-500/30">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterStatus && (
                  <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-sm flex items-center gap-2 border border-blue-500/30">
                    Status: {filterStatus}
                    <button
                      onClick={() => setFilterStatus("")}
                      className="hover:text-blue-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterCategory && (
                  <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-sm flex items-center gap-2 border border-green-500/30">
                    Category: {filterCategory}
                    <button
                      onClick={() => setFilterCategory("")}
                      className="hover:text-green-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterBrand && (
                  <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-lg text-sm flex items-center gap-2 border border-purple-500/30">
                    Brand: {filterBrand}
                    <button
                      onClick={() => setFilterBrand("")}
                      className="hover:text-purple-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/30 backdrop-blur-sm">
                <tr>
                  <th className="p-6 text-left font-semibold text-slate-300">
                    Product
                  </th>
                  <th className="p-6 text-left font-semibold text-slate-300">
                    Category
                  </th>
                  <th className="p-6 text-left font-semibold text-slate-300">
                    Brand
                  </th>
                  <th className="p-6 text-left font-semibold text-slate-300">
                    Price
                  </th>
                  <th className="p-6 text-left font-semibold text-slate-300">
                    Stock
                  </th>
                  <th className="p-6 text-left font-semibold text-slate-300">
                    Status
                  </th>
                  <th className="p-6 text-left font-semibold text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-300"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-1 rounded-2xl bg-gradient-to-br from-red-600/30 to-slate-800/30">
                          <img
                            src={`http://localhost:5000${product.image}`}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-xl"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white truncate max-w-xs text-lg">
                            {product.name}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {product.subcategory || product.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-slate-300">{product.category}</td>
                    <td className="p-6 text-slate-300">
                      {product.brand || "N/A"}
                    </td>
                    <td className="p-6">
                      <div className="text-white font-semibold text-lg">
                        {product.price.toLocaleString()} LKR
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-slate-400 line-through">
                          {product.originalPrice.toLocaleString()} LKR
                        </div>
                      )}
                    </td>
                    <td className="p-6 text-slate-300 text-lg">
                      {product.stock || 0}
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-4 py-2 text-xs rounded-xl font-medium backdrop-blur-sm ${
                          product.status === "In Stock"
                            ? "bg-green-600/20 text-green-400 border border-green-500/30"
                            : product.status === "Limited Stock"
                            ? "bg-yellow-600/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-red-600/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-xl hover:from-yellow-700 hover:to-yellow-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                          title="Edit Product"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id!)}
                          className="p-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                {searchTerm || filterStatus || filterCategory || filterBrand ? (
                  <>
                    <div className="bg-slate-700/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <Search className="w-12 h-12 opacity-50" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">
                      No Products Found
                    </h3>
                    <p className="text-slate-400 mb-4">
                      No products match your current search and filter criteria.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
                    >
                      Clear Filters
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-slate-700/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <Package className="w-12 h-12 opacity-50" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">
                      No Products Found
                    </h3>
                    <p className="text-slate-400">
                      Add your first product using the form above to get
                      started.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductManager;
