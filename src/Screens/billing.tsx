import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  Receipt,
  Printer,
  Eye,
  Save,
  Trash2,
  Edit,
  FileText,
  Calculator,
  User,
  Phone,
  MapPin,
  Mail,
  Package,
  X,
  Check,
  AlertCircle,
  Download,
  RefreshCw,
  Database
} from "lucide-react";

// API configuration
const API_BASE_URL = "http://localhost:5000/api";

// Types (keeping your existing types)
type ProductType = {
  _id: string;
  name: string;
  category: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  price: number;
  originalPrice?: number;
  status: string;
  stock?: number;
  image: string;
  discount?: number;
};

type BillItem = {
  product: ProductType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

type BillType = {
  _id?: string;
  billNumber: string;
  customer: CustomerInfo;
  items: BillItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountAmount: number;
  total: number;
  status: "Draft" | "Pending" | "Paid" | "Cancelled";
  createdAt: string;
  notes?: string;
  pdfPath?: string;
  pdfGenerated?: boolean;
};

const AutoNexusBillingSystem: React.FC = () => {
  // State management
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [bills, setBills] = useState<BillType[]>([]);
  const [currentBill, setCurrentBill] = useState<BillType | null>(null);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [editingBill, setEditingBill] = useState<string | null>(null);
  const [taxRate, setTaxRate] = useState(0);
  const [billDiscount, setBillDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<"products" | "bills">(
    "products"
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBills();
  }, []);

  // Enhanced API functions
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setError("");

      const data = await apiCall("/products?limit=1000");
      const productList = data.products || data;

      if (Array.isArray(productList)) {
        const availableProducts = productList.filter(
          (product) =>
            product.isActive !== false &&
            product.status !== "Out of Stock" &&
            product.status !== "Discontinued"
        );
        setProducts(availableProducts);
      } else {
        throw new Error("Invalid products data format");
      }
    } catch (error) {
      setError(
        "Failed to fetch products. Please check your server connection."
      );
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await apiCall("/categories");
      const categoryNames = [
        "All Categories",
        ...categoriesData.map((cat: any) => cat.name)
      ];
      setCategories(categoryNames);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([
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
      ]);
    }
  };

  const fetchBills = async () => {
    try {
      const data = await apiCall("/bills?limit=100");
      setBills(data.bills || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  // Enhanced bill operations
  const saveBill = async (status: "Draft" | "Pending" | "Paid" = "Draft") => {
    console.log("Saving bill with status:", status); // Debug log

    if (billItems.length === 0) {
      setError("Please add items to the bill");
      return false;
    }

    if (!customer.name.trim() || !customer.phone.trim()) {
      setError("Please fill in customer name and phone");
      return false;
    }

    try {
      setLoading(true);
      setError("");

      const billData = {
        customer,
        items: billItems,
        taxRate,
        discount: billDiscount,
        notes,
        status
      };

      console.log("Sending bill data:", billData); // Debug log

      let savedBill;
      if (editingBill) {
        savedBill = await apiCall(`/bills/${editingBill}`, {
          method: "PUT",
          body: JSON.stringify(billData)
        });
      } else {
        savedBill = await apiCall("/bills", {
          method: "POST",
          body: JSON.stringify(billData)
        });
      }

      console.log("Bill saved successfully:", savedBill); // Debug log

      setCurrentBill(savedBill);
      await fetchBills(); // Refresh bills list
      setSuccess(`Bill ${editingBill ? "updated" : "saved"} successfully!`);

      if (status === "Pending" || status === "Paid") {
        setTimeout(() => {
          setShowBillPreview(true);
        }, 500); // Small delay to ensure state is updated
      }

      return true;
    } catch (error: any) {
      console.error("Error saving bill:", error); // Debug log
      setError(error.message || "Failed to save bill");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateAndDownloadPDF = async (billId: string) => {
    try {
      setLoading(true);
      setError("");

      // Generate PDF
      await apiCall(`/bills/${billId}/generate-pdf`, {
        method: "POST"
      });

      // Download PDF
      const downloadUrl = `${API_BASE_URL}/bills/${billId}/download-pdf`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${currentBill?.billNumber || "bill"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess("PDF generated and download started!");
      await fetchBills(); // Refresh to show PDF generated status
    } catch (error: any) {
      setError("Failed to generate PDF: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBill = async (billId: string) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await apiCall(`/bills/${billId}`, {
        method: "DELETE"
      });

      await fetchBills();
      setSuccess("Bill deleted successfully!");
    } catch (error: any) {
      setError("Failed to delete bill: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const editBill = async (billId: string) => {
    try {
      setLoading(true);
      setError("");

      const bill = await apiCall(`/bills/${billId}`);

      setBillItems(bill.items);
      setCustomer(bill.customer);
      setBillDiscount(bill.discount);
      setTaxRate(bill.taxRate);
      setNotes(bill.notes || "");
      setEditingBill(bill._id);
      setCurrentTab("products");

      setSuccess("Bill loaded for editing");
    } catch (error: any) {
      setError("Failed to load bill for editing: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add product to bill - FIXED VERSION
  const addToBill = (product: ProductType) => {
    console.log("Adding product to bill:", product); // Debug log

    // Clear any existing error first
    setError("");

    // Check if product has valid stock
    const productStock = product.stock || 0;
    if (productStock <= 0) {
      setError(`${product.name} is out of stock`);
      return;
    }

    // Find existing item in bill
    const existingItemIndex = billItems.findIndex(
      (item) => item.product._id === product._id
    );

    if (existingItemIndex >= 0) {
      // Product already exists, increase quantity
      const existingItem = billItems[existingItemIndex];
      if (existingItem.quantity >= productStock) {
        setError(`Cannot add more ${product.name}. Stock limit reached.`);
        return;
      }

      // Create new array with updated quantity
      const newBillItems = [...billItems];
      newBillItems[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
        totalPrice: existingItem.unitPrice * (existingItem.quantity + 1)
      };
      setBillItems(newBillItems);
      console.log("Updated existing item quantity:", newBillItems); // Debug log
    } else {
      // Product doesn't exist, add new item
      const newItem: BillItem = {
        product: { ...product }, // Create a copy to avoid reference issues
        quantity: 1,
        unitPrice: product.price,
        totalPrice: product.price
      };

      const newBillItems = [...billItems, newItem];
      setBillItems(newBillItems);
      console.log("Added new item:", newItem, "New bill items:", newBillItems); // Debug log
    }

    // Show success message
    setSuccess(`${product.name} added to bill`);
  };

  // Update item quantity - IMPROVED VERSION
  const updateQuantity = (productId: string, newQuantity: number) => {
    console.log(
      "Updating quantity for product:",
      productId,
      "to:",
      newQuantity
    ); // Debug log

    if (newQuantity <= 0) {
      removeFromBill(productId);
      return;
    }

    setBillItems((prevItems) => {
      const newItems = prevItems.map((item) => {
        if (item.product._id === productId) {
          const productStock = item.product.stock || 0;
          if (newQuantity > productStock) {
            setError(
              `Cannot exceed stock limit of ${productStock} for ${item.product.name}`
            );
            return item; // Return unchanged item
          }

          return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.unitPrice * newQuantity
          };
        }
        return item;
      });
      console.log("Updated bill items:", newItems); // Debug log
      return newItems;
    });
  };

  // Remove item from bill - IMPROVED VERSION
  const removeFromBill = (productId: string) => {
    console.log("Removing product from bill:", productId); // Debug log

    setBillItems((prevItems) => {
      const newItems = prevItems.filter(
        (item) => item.product._id !== productId
      );
      console.log("Removed item, new bill items:", newItems); // Debug log
      return newItems;
    });

    setSuccess("Item removed from bill");
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = billItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = (subtotal * billDiscount) / 100;
    const discountedSubtotal = subtotal - discountAmount;
    const tax = (discountedSubtotal * taxRate) / 100;
    const total = discountedSubtotal + tax;

    return {
      subtotal,
      discountAmount,
      tax,
      total,
      itemCount: billItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  };

  const { subtotal, discountAmount, tax, total, itemCount } = calculateTotals();

  // Generate bill - FIXED VERSION
  const generateBill = async () => {
    console.log("Generate bill clicked"); // Debug log

    if (billItems.length === 0) {
      setError("Please add items to the bill before generating");
      return;
    }

    if (!customer.name.trim() || !customer.phone.trim()) {
      setError("Please fill in customer name and phone number");
      return;
    }

    try {
      await saveBill("Pending");
      // If successful, show the bill preview
      if (currentBill) {
        setShowBillPreview(true);
      }
    } catch (error) {
      console.error("Error generating bill:", error);
      setError("Failed to generate bill. Please try again.");
    }
  };

  // Print bill
  const printBill = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>AutoNexus Bill - ${currentBill?.billNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .bill-container { max-width: 800px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #dc2626; padding-bottom: 20px; }
                .company-name { font-size: 32px; font-weight: bold; color: #dc2626; margin-bottom: 5px; }
                .company-tagline { color: #666; font-size: 14px; }
                .bill-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .customer-info, .bill-details { background: #f8f9fa; padding: 15px; border-radius: 8px; }
                .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                .table th { background-color: #dc2626; color: white; }
                .totals { text-align: right; }
                .total-row { font-weight: bold; font-size: 18px; background-color: #dc2626; color: white; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  // Clear current bill
  const clearBill = () => {
    setBillItems([]);
    setCustomer({ name: "", phone: "", email: "", address: "" });
    setBillDiscount(0);
    setNotes("");
    setCurrentBill(null);
    setEditingBill(null);
    setShowBillPreview(false);
    setError("");
    setSuccess("");
  };

  // Auto-hide messages - Enhanced
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 7000); // Increased to 7 seconds for better visibility
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Debug useEffect to log bill items changes
  useEffect(() => {
    console.log("Bill items changed:", billItems);
  }, [billItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden relative p-4 sm:p-8 md:p-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-700/15 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Error/Success Messages - Fixed positioning and z-index */}
        {error && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] bg-red-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-96 max-w-2xl">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <span className="flex-1 font-medium">{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-2 p-1 hover:bg-red-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] bg-green-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-96 max-w-2xl">
            <Check className="w-6 h-6 flex-shrink-0" />
            <span className="flex-1 font-medium">{success}</span>
            <button
              onClick={() => setSuccess("")}
              className="ml-2 p-1 hover:bg-green-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {loading && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] bg-blue-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span className="font-medium">Processing...</span>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1
            className="text-5xl md:text-7xl text-white drop-shadow-lg"
            style={{ fontFamily: "Magenta, Arial Black, sans-serif" }}
          >
            <span className="text-red-600">AutoNexus</span> Billing
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Professional order management and billing system for automotive
            parts
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            <div className="bg-slate-800/40 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50">
              <span className="text-sm text-slate-400">Items in Cart: </span>
              <span className="text-red-400 font-bold">{itemCount}</span>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50">
              <span className="text-sm text-slate-400">Total: </span>
              <span className="text-green-400 font-bold">
                {total.toLocaleString()} LKR
              </span>
            </div>
            <button
              onClick={fetchProducts}
              className="bg-slate-800/40 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 hover:bg-slate-700/40 transition-colors text-sm flex items-center gap-2"
              disabled={productsLoading || loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  productsLoading || loading ? "animate-spin" : ""
                }`}
              />
              {productsLoading ? "Loading..." : "Refresh"}
            </button>
            <button
              onClick={fetchBills}
              className="bg-slate-800/40 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 hover:bg-slate-700/40 transition-colors text-sm flex items-center gap-2"
              disabled={loading}
            >
              <Database className="w-4 h-4" />
              Sync Bills
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700/50 mb-8 overflow-x-auto">
          {[
            { id: "products", label: "Products & Billing", icon: ShoppingCart },
            { id: "bills", label: "Bills History", icon: Receipt }
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

        {currentTab === "products" ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Products Section */}
            <div className="xl:col-span-2 bg-slate-800/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-red-500">
                  Available Products ({products.length})
                </h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-red-500 focus:outline-none transition-all duration-300 w-64"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:border-red-500 focus:outline-none transition-all duration-300"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-slate-700"
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {productsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                  <span className="ml-4 text-slate-400">
                    Loading products...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 hover:border-red-500/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={`http://localhost:5000${product.image}`}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-xl"
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml;base64,${btoa(
                              '<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" fill="#374151"/><text x="50%" y="50%" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dy=".3em">No Image</text></svg>'
                            )}`;
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm mb-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {product.brand} - {product.category}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div>
                              <span className="text-lg font-bold text-white">
                                {product.price.toLocaleString()} LKR
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-slate-500 line-through ml-2">
                                  {product.originalPrice.toLocaleString()} LKR
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">
                                Stock: {product.stock || 0}
                              </span>
                              <button
                                onClick={() => {
                                  console.log(
                                    "Plus button clicked for product:",
                                    product._id
                                  );
                                  addToBill(product);
                                }}
                                className="bg-gradient-to-r from-red-600 to-red-700 text-white p-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!product.stock || product.stock === 0}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!productsLoading && filteredProducts.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-semibold text-slate-300 mb-2">
                    {products.length === 0
                      ? "No Products Available"
                      : "No Products Found"}
                  </p>
                  <p className="mb-4">
                    {products.length === 0
                      ? "Connect to your database or add products to get started."
                      : "No products match your search criteria."}
                  </p>
                  {products.length === 0 && (
                    <button
                      onClick={fetchProducts}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300"
                    >
                      Retry Loading Products
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bill Section */}
            <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-500">
                  {editingBill ? "Edit Bill" : "Current Bill"}
                </h2>
                <div className="flex items-center gap-2">
                  {billItems.length > 0 && (
                    <button
                      onClick={clearBill}
                      className="p-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="text"
                    placeholder="Customer Name *"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    className="p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-red-500 focus:outline-none transition-all duration-300"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    className="p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-red-500 focus:outline-none transition-all duration-300"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer({ ...customer, email: e.target.value })
                    }
                    className="p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-red-500 focus:outline-none transition-all duration-300"
                  />
                  <textarea
                    placeholder="Address"
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer({ ...customer, address: e.target.value })
                    }
                    rows={2}
                    className="p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-red-500 focus:outline-none transition-all duration-300 resize-none"
                  />
                </div>
              </div>

              {/* Bill Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Items ({itemCount})
                </h3>

                {billItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No items added to bill</p>
                    <p className="text-xs mt-1">
                      Click the + button next to products to add them
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {billItems.map((item) => (
                      <div
                        key={item.product._id}
                        className="bg-slate-700/30 rounded-xl p-3 border border-slate-600/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white text-sm truncate max-w-32">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromBill(item.product._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity - 1
                                )
                              }
                              className="p-1 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                item.quantity >= (item.product.stock || 0)
                              }
                              className="p-1 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-white">
                              {item.totalPrice.toLocaleString()} LKR
                            </div>
                            <div className="text-xs text-slate-400">
                              @ {item.unitPrice.toLocaleString()} LKR
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bill Settings */}
              {billItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Bill Settings
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        min="0"
                        max="100"
                        className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:border-red-500 focus:outline-none transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        value={billDiscount}
                        onChange={(e) =>
                          setBillDiscount(Number(e.target.value))
                        }
                        min="0"
                        max="100"
                        className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:border-red-500 focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>
                  <textarea
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full mt-3 p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-red-500 focus:outline-none transition-all duration-300 resize-none"
                  />
                </div>
              )}

              {/* Bill Totals */}
              {billItems.length > 0 && (
                <div className="mb-6 bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal:</span>
                      <span>{subtotal.toLocaleString()} LKR</span>
                    </div>
                    {billDiscount > 0 && (
                      <div className="flex justify-between text-red-400">
                        <span>Discount ({billDiscount}%):</span>
                        <span>-{discountAmount.toLocaleString()} LKR</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-300">
                      <span>Tax ({taxRate}%):</span>
                      <span>{tax.toLocaleString()} LKR</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-white border-t border-slate-600 pt-2">
                      <span>Total:</span>
                      <span>{total.toLocaleString()} LKR</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {billItems.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={async () => {
                      console.log("Save Draft clicked"); // Debug log
                      await saveBill("Draft");
                    }}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 transition-all duration-300 border border-slate-600/50 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {loading
                      ? "Saving..."
                      : editingBill
                      ? "Update"
                      : "Save"}{" "}
                    Draft
                  </button>
                  <button
                    onClick={async () => {
                      console.log("Generate Bill clicked"); // Debug log
                      await generateBill();
                    }}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                  >
                    <Receipt className="w-5 h-5" />
                    {loading ? "Generating..." : "Generate Bill"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Bills History Tab */
          <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-red-500">Bills History</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-400">
                  Total Bills: {bills.length}
                </div>
                <button
                  onClick={fetchBills}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 transition-all duration-300 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {bills.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Receipt className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  No Bills Found
                </h3>
                <p>Generate your first bill to see it here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/30 backdrop-blur-sm">
                    <tr>
                      <th className="p-4 text-left font-semibold text-slate-300">
                        Bill #
                      </th>
                      <th className="p-4 text-left font-semibold text-slate-300">
                        Customer
                      </th>
                      <th className="p-4 text-left font-semibold text-slate-300">
                        Items
                      </th>
                      <th className="p-4 text-left font-semibold text-slate-300">
                        Total
                      </th>
                      <th className="p-4 text-left font-semibold text-slate-300">
                        Status
                      </th>
                      <th className="p-4 text-left font-semibold text-slate-300">
                        Date
                      </th>
                      <th className="p-4 text-left font-semibold text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((bill) => (
                      <tr
                        key={bill._id}
                        className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-300"
                      >
                        <td className="p-4">
                          <div className="font-mono text-red-400 font-semibold">
                            {bill.billNumber}
                          </div>
                          {bill.pdfGenerated && (
                            <div className="text-xs text-green-400 mt-1">
                              PDF Available
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-semibold text-white">
                              {bill.customer.name}
                            </div>
                            <div className="text-sm text-slate-400">
                              {bill.customer.phone}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">
                          {bill.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}{" "}
                          items
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-white text-lg">
                            {bill.total.toLocaleString()} LKR
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                              bill.status === "Paid"
                                ? "bg-green-600/20 text-green-400"
                                : bill.status === "Pending"
                                ? "bg-yellow-600/20 text-yellow-400"
                                : bill.status === "Draft"
                                ? "bg-blue-600/20 text-blue-400"
                                : "bg-red-600/20 text-red-400"
                            }`}
                          >
                            {bill.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300">
                          {new Date(bill.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setCurrentBill(bill);
                                setShowBillPreview(true);
                              }}
                              className="p-2 bg-blue-600/80 text-white rounded-lg hover:bg-blue-700/80 transition-all duration-300"
                              title="View Bill"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => editBill(bill._id!)}
                              disabled={loading}
                              className="p-2 bg-yellow-600/80 text-white rounded-lg hover:bg-yellow-700/80 transition-all duration-300 disabled:opacity-50"
                              title="Edit Bill"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => generateAndDownloadPDF(bill._id!)}
                              disabled={loading}
                              className="p-2 bg-green-600/80 text-white rounded-lg hover:bg-green-700/80 transition-all duration-300 disabled:opacity-50"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteBill(bill._id!)}
                              disabled={loading}
                              className="p-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 transition-all duration-300 disabled:opacity-50"
                              title="Delete Bill"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Bill Preview Modal - Enhanced */}
        {showBillPreview && currentBill && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9998]">
            <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-red-500">
                    Bill Preview - {currentBill.billNumber}
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => {
                        console.log("Mark as Paid clicked"); // Debug log
                        await saveBill("Paid");
                      }}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {loading ? "Updating..." : "Mark as Paid"}
                    </button>
                    <button
                      onClick={printBill}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                    <button
                      onClick={() => {
                        if (currentBill._id) {
                          generateAndDownloadPDF(currentBill._id);
                        } else {
                          setError("Cannot generate PDF: Bill ID not found");
                        }
                      }}
                      disabled={loading || !currentBill._id}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      {loading ? "Generating..." : "Save PDF"}
                    </button>
                    <button
                      onClick={() => setShowBillPreview(false)}
                      className="p-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div ref={printRef} className="p-8">
                <div className="bill-container">
                  {/* Header */}
                  <div className="header text-center mb-8 border-b-2 border-red-600 pb-6">
                    <h1
                      className="text-[80px] text-white tracking-tight"
                      style={{ fontFamily: "Magenta, Arial Black, sans-serif" }}
                    >
                      Auto<span className="text-red-600">nexus</span>
                    </h1>
                    <div className="company-tagline text-slate-400 text-sm">
                      Premium Automotive Parts & Solutions
                    </div>
                    <div className="mt-4 text-slate-300 text-sm">
                      📧autonexuscarsolutions@gmail.com | 📞 +94 743361910 | 🌐
                      https://autonexus.netlify.app/
                    </div>
                  </div>

                  {/* Bill and Customer Info */}
                  <div className="bill-info grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bill-details bg-slate-700/30 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Bill Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Bill Number:</span>
                          <span className="font-mono font-bold text-white">
                            {currentBill.billNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Date:</span>
                          <span className="text-white">
                            {new Date(
                              currentBill.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Time:</span>
                          <span className="text-white">
                            {new Date(
                              currentBill.createdAt
                            ).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              currentBill.status === "Paid"
                                ? "bg-green-600/20 text-green-400"
                                : currentBill.status === "Pending"
                                ? "bg-yellow-600/20 text-yellow-400"
                                : currentBill.status === "Draft"
                                ? "bg-blue-600/20 text-blue-400"
                                : "bg-red-600/20 text-red-400"
                            }`}
                          >
                            {currentBill.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="customer-info bg-slate-700/30 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Customer Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-white">
                            {currentBill.customer.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-white">
                            {currentBill.customer.phone}
                          </span>
                        </div>
                        {currentBill.customer.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span className="text-white">
                              {currentBill.customer.email}
                            </span>
                          </div>
                        )}
                        {currentBill.customer.address && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                            <span className="text-white">
                              {currentBill.customer.address}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="table-container mb-8">
                    <table className="table w-full border-collapse">
                      <thead>
                        <tr className="bg-red-600 text-white">
                          <th className="border border-slate-300 p-3 text-left">
                            #
                          </th>
                          <th className="border border-slate-300 p-3 text-left">
                            Product
                          </th>
                          <th className="border border-slate-300 p-3 text-center">
                            Qty
                          </th>
                          <th className="border border-slate-300 p-3 text-right">
                            Unit Price
                          </th>
                          <th className="border border-slate-300 p-3 text-right">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBill.items.map((item, index) => (
                          <tr
                            key={item.product._id}
                            className="hover:bg-slate-50/5"
                          >
                            <td className="border border-slate-300 p-3 text-white">
                              {index + 1}
                            </td>
                            <td className="border border-slate-300 p-3">
                              <div className="text-white font-medium">
                                {item.product.name}
                              </div>
                              <div className="text-slate-400 text-sm">
                                {item.product.brand} - {item.product.category}
                              </div>
                            </td>
                            <td className="border border-slate-300 p-3 text-center text-white">
                              {item.quantity}
                            </td>
                            <td className="border border-slate-300 p-3 text-right text-white">
                              {item.unitPrice.toLocaleString()} LKR
                            </td>
                            <td className="border border-slate-300 p-3 text-right font-semibold text-white">
                              {item.totalPrice.toLocaleString()} LKR
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="totals">
                    <div className="bg-slate-700/30 p-6 rounded-xl">
                      <div className="space-y-3">
                        <div className="flex justify-between text-slate-300">
                          <span>Subtotal:</span>
                          <span className="font-medium">
                            {currentBill.subtotal.toLocaleString()} LKR
                          </span>
                        </div>
                        {currentBill.discount > 0 && (
                          <div className="flex justify-between text-red-400">
                            <span>Discount ({currentBill.discount}%):</span>
                            <span className="font-medium">
                              -{currentBill.discountAmount.toLocaleString()} LKR
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-300">
                          <span>Tax ({currentBill.taxRate}%):</span>
                          <span className="font-medium">
                            {currentBill.tax.toLocaleString()} LKR
                          </span>
                        </div>
                        <div className="total-row flex justify-between text-2xl font-bold text-white bg-red-600 p-4 rounded-xl">
                          <span>Total Amount:</span>
                          <span>{currentBill.total.toLocaleString()} LKR</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {currentBill.notes && (
                    <div className="mt-6 bg-slate-700/30 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-red-400 mb-2">
                        Notes:
                      </h4>
                      <p className="text-slate-300">{currentBill.notes}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="footer text-center mt-8 pt-6 border-t border-slate-600 text-slate-400 text-sm">
                    <p className="mb-2">Thank you for your business!</p>
                    <p>
                      For any queries, please contact us
                      atautonexuscarsolutions@gmail.com or +94 743361910
                    </p>
                    <p className="mt-4 text-xs">
                      This is a computer-generated bill and does not require a
                      physical signature.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoNexusBillingSystem;
