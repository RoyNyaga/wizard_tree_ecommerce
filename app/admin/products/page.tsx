'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchCompanyProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  DbProduct 
} from '@/lib/supabase/products';
import { 
  fetchCompanyCategories, 
  DbProductCategory 
} from '@/lib/supabase/categories';
import { uploadProductImage } from '@/lib/image-utils';
import { ImageCropperModal } from '@/components/admin/ImageCropperModal';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Sparkles, 
  Upload, 
  Star,
  Tag,
  Dna,
  Eye,
  CheckCircle2
} from 'lucide-react';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);

  // Drawer inspection states
  const [selectedProduct, setSelectedProduct] = useState<DbProduct | null>(null);
  const [activeDrawerImage, setActiveDrawerImage] = useState(0);

  // Cropper states
  const [cropperFileSrc, setCropperFileSrc] = useState<string | null>(null);

  // Form input states
  const [formData, setFormData] = useState({
    name: '',
    lineage: '',
    category_id: null as string | null,
    category: 'flower',
    price: 65,
    quantity: 100,
    rating: 5.0,
    status: 'published' as 'draft' | 'published',
    description: '',
    images: [] as string[],
  });

  // Query categories
  const { data: categories = [] } = useQuery({
    queryKey: ['admin_categories'],
    queryFn: fetchCompanyCategories,
  });

  // Query products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin_products', categoryFilter],
    queryFn: () => fetchCompanyProducts({ category: categoryFilter, status: 'all' }),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_products'] });
      closeForm();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => updateProduct(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_products'] });
      closeForm();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_products'] });
    },
  });

  const openCreateForm = () => {
    setEditingProduct(null);
    const firstCat = categories[0];
    setFormData({
      name: '',
      lineage: '',
      category_id: firstCat?.id || null,
      category: firstCat?.slug || 'flower',
      price: 65,
      quantity: 100,
      rating: 5.0,
      status: 'published',
      description: '',
      images: [],
    });
    setIsFormOpen(true);
  };

  const openEditForm = (prod: DbProduct) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      lineage: prod.lineage || '',
      category_id: prod.category_id || null,
      category: prod.category,
      price: Number(prod.price),
      quantity: prod.quantity,
      rating: Number(prod.rating || 5.0),
      status: prod.status,
      description: prod.description || '',
      images: prod.images || [],
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  // Trigger file selection for 1:1 cropper
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setCropperFileSrc(reader.result?.toString() || null);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Called when cropper finishes 1:1 compression
  const handleCropConfirm = async (compressedBlob: Blob) => {
    try {
      const publicUrl = await uploadProductImage(compressedBlob);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, publicUrl],
      }));
      setCropperFileSrc(null);
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
        input: formData,
      });
    } else {
      createMutation.mutate({
        ...formData,
        availability: formData.quantity > 0,
        currency: 'EUR',
      });
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-white">
            Products Catalog
          </h1>
          <p className="font-mono text-xs text-wizard-muted mt-1">
            Manage published cultivars, merchandise, categories, and photos
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="rounded-xl bg-white text-black px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-wizard-purple-glow hover:text-white transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Toolbar: Category tabs and search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
              categoryFilter === 'all'
                ? 'bg-purple-950/60 border border-purple-500/50 text-white font-bold'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.slug)}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
                categoryFilter === cat.slug
                  ? 'bg-purple-950/60 border border-purple-500/50 text-white font-bold'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 font-mono text-xs text-white placeholder-white/30 focus:outline-none focus:border-wizard-purple-glow"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0c14] overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-xs font-mono text-wizard-muted">
            Loading products from Supabase...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-wizard-muted flex flex-col items-center justify-center space-y-4">
            <p>No products found in this category.</p>
            <button
              onClick={openCreateForm}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-wizard-purple-glow hover:text-white transition shadow-lg shadow-purple-950/50"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Product</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-white/[0.02] border-b border-white/10 text-white/40 uppercase">
                <tr>
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden border border-white/10 bg-black/60 relative flex-shrink-0">
                          {prod.images?.[0] ? (
                            <Image
                              src={prod.images[0]}
                              alt={prod.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-white/30">
                              No pic
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{prod.name}</p>
                          {prod.lineage && (
                            <p className="text-[11px] text-purple-300 font-mono flex items-center gap-1">
                              <Dna className="w-3 h-3 text-wizard-purple-glow" />
                              <span>{prod.lineage}</span>
                            </p>
                          )}
                          <p className="text-[11px] text-white/40 truncate max-w-xs">
                            {prod.description || 'No description'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 uppercase text-white/70">
                      <span className="inline-flex items-center gap-1">
                        <Tag className="w-3 h-3 text-wizard-purple-glow" />
                        <span>{prod.category_data?.name || prod.category}</span>
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">€{Number(prod.price).toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`font-bold ${
                          prod.quantity <= 5 ? 'text-amber-400' : 'text-white'
                        }`}
                      >
                        {prod.quantity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{Number(prod.rating || 5.0).toFixed(1)}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                          prod.status === 'published'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/10 text-white/50 border border-white/10'
                        }`}
                      >
                        {prod.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedProduct(prod);
                            setActiveDrawerImage(0);
                          }}
                          className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
                          title="View Product Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditForm(prod)}
                          className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${prod.name}?`)) {
                              deleteMutation.mutate(prod.id);
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition"
                          title="Delete Product"
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

      {/* ======================================================== */}
      {/* ADD / EDIT PRODUCT MODAL                                 */}
      {/* ======================================================== */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0c0b14] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-display font-bold text-lg uppercase text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeForm} className="text-white/60 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. ZOAP Craft Flower"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-wizard-purple-glow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                    Lineage / Genetics (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.lineage}
                    onChange={(e) => setFormData({ ...formData, lineage: e.target.value })}
                    placeholder="e.g. Rainbow Sherbet #11 x Pink Guava"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-wizard-purple-glow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                    Category (Linked Table) *
                  </label>
                  <select
                    value={formData.category_id || ''}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const matchedCat = categories.find((c) => c.id === selectedId);
                      setFormData({
                        ...formData,
                        category_id: selectedId || null,
                        category: matchedCat ? matchedCat.slug : 'flower',
                      });
                    }}
                    className="w-full rounded-xl border border-white/10 bg-[#12111b] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-wizard-purple-glow"
                  >
                    {categories.length === 0 ? (
                      <>
                        <option value="">Flower</option>
                        <option value="">Seeds</option>
                        <option value="">Other</option>
                      </>
                    ) : (
                      categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.slug})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                    Price (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-wizard-purple-glow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                    Inventory Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-wizard-purple-glow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                    Rating (Stars 1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5.0 })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-wizard-purple-glow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                    Visibility Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-xl border border-white/10 bg-[#12111b] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-wizard-purple-glow"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden from Store)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Terpene notes, lineage, and product specifics..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-wizard-purple-glow"
                />
              </div>

              {/* Photos & 1:1 Aspect Cropper Trigger */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase text-white/70">
                    Product Photos (1:1 Cropped & Auto-Compressed)
                  </label>
                  <label className="cursor-pointer text-xs font-mono text-wizard-purple-glow hover:underline flex items-center gap-1 font-bold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Crop Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Uploaded images previews */}
                <div className="flex flex-wrap gap-3 p-3 bg-black/40 rounded-xl border border-white/10 min-h-[90px] items-center">
                  {formData.images.length === 0 ? (
                    <p className="text-xs text-white/40 font-mono mx-auto">
                      No photos added. Upload photos to crop 1:1 square.
                    </p>
                  ) : (
                    formData.images.map((imgUrl, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20 group">
                        <Image src={imgUrl} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute inset-0 bg-red-950/80 text-red-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 font-mono text-xs uppercase text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-wizard-purple-glow hover:text-white transition disabled:opacity-50"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1:1 Image Cropper Modal */}
      {cropperFileSrc && (
        <ImageCropperModal
          imageSrc={cropperFileSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropperFileSrc(null)}
        />
      )}

      {/* ======================================================== */}
      {/* PRODUCT DETAILS INSPECTION DRAWER                        */}
      {/* ======================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedProduct(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-[#0c0b14] border-l border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs uppercase text-wizard-purple-glow font-bold">
                        {selectedProduct.category_data?.name || selectedProduct.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                          selectedProduct.status === 'published'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/10 text-white/50 border border-white/10'
                        }`}
                      >
                        {selectedProduct.status}
                      </span>
                    </div>
                    <h2 className="font-display font-black text-2xl text-white">
                      {selectedProduct.name}
                    </h2>
                    {selectedProduct.lineage && (
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/30 px-2.5 py-1 text-xs font-mono text-purple-200">
                        <Dna className="w-3.5 h-3.5 text-wizard-purple-glow" />
                        <span>Lineage: <strong className="text-white">{selectedProduct.lineage}</strong></span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Photos Gallery */}
                <div>
                  <label className="block text-xs font-mono uppercase text-white/50 mb-2">
                    Product Photos ({selectedProduct.images?.length || 0})
                  </label>
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <div className="space-y-3">
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-lg">
                        <Image
                          src={selectedProduct.images[activeDrawerImage] || selectedProduct.images[0]}
                          alt={selectedProduct.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {selectedProduct.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {selectedProduct.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveDrawerImage(idx)}
                              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                                activeDrawerImage === idx
                                  ? 'border-wizard-purple-glow shadow-md shadow-purple-500/40'
                                  : 'border-white/10 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <Image src={img} alt="" fill className="object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video w-full rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center font-mono text-xs text-white/40">
                      No photos uploaded for this product
                    </div>
                  )}
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                    <span className="text-[10px] uppercase text-white/50 block">Retail Price</span>
                    <span className="text-xl font-bold text-white mt-1 block">
                      €{Number(selectedProduct.price).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-white/40">{selectedProduct.currency || 'EUR'}</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                    <span className="text-[10px] uppercase text-white/50 block">Inventory Stock</span>
                    <span
                      className={`text-xl font-bold mt-1 block ${
                        selectedProduct.quantity <= 5 ? 'text-amber-400' : 'text-white'
                      }`}
                    >
                      {selectedProduct.quantity} units
                    </span>
                    <span className="text-[10px] text-white/40">
                      {selectedProduct.quantity > 5
                        ? 'In Stock'
                        : selectedProduct.quantity > 0
                        ? 'Low Stock Warning'
                        : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                    <span className="text-[10px] uppercase text-white/50 block">Customer Rating</span>
                    <span className="text-xl font-bold text-amber-300 mt-1 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{Number(selectedProduct.rating || 5.0).toFixed(1)}</span>
                    </span>
                    <span className="text-[10px] text-white/40">Out of 5.0</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                    <span className="text-[10px] uppercase text-white/50 block">Store Availability</span>
                    <span className="text-sm font-bold text-white mt-1 block">
                      {selectedProduct.availability ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active in Store
                        </span>
                      ) : (
                        <span className="text-red-400">Disabled</span>
                      )}
                    </span>
                    <span className="text-[10px] text-white/40">Customer visibility</span>
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 font-mono text-xs space-y-1.5">
                  <h3 className="font-bold uppercase text-white/60 text-[11px]">Product Description</h3>
                  <p className="text-white/80 leading-relaxed font-sans text-sm">
                    {selectedProduct.description || 'No description provided.'}
                  </p>
                </div>

                {/* System Identifiers */}
                <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3.5 font-mono text-[11px] text-white/50 space-y-1">
                  <div className="flex justify-between">
                    <span>Product ID:</span>
                    <span className="text-white/70 font-mono select-all truncate max-w-[200px]">{selectedProduct.id}</span>
                  </div>
                  {selectedProduct.category_id && (
                    <div className="flex justify-between">
                      <span>Category ID:</span>
                      <span className="text-white/70 font-mono select-all truncate max-w-[200px]">{selectedProduct.category_id}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="text-white/70">{new Date(selectedProduct.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span className="text-white/70">{new Date(selectedProduct.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="pt-6 border-t border-white/10 flex items-center gap-3 font-mono text-xs">
                <a
                  href={`/products/${selectedProduct.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3.5 rounded-xl border border-white/20 text-white hover:bg-white hover:text-black transition font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                  title="View on Storefront"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Live</span>
                </a>
                <button
                  onClick={() => {
                    const prodToEdit = selectedProduct;
                    setSelectedProduct(null);
                    openEditForm(prodToEdit);
                  }}
                  className="flex-1 py-3 rounded-xl bg-white text-black font-bold uppercase tracking-wider hover:bg-wizard-purple-glow hover:text-white transition flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Product</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${selectedProduct.name}?`)) {
                      deleteMutation.mutate(selectedProduct.id);
                      setSelectedProduct(null);
                    }
                  }}
                  className="py-3 px-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-950/40 transition font-bold uppercase tracking-wider"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
