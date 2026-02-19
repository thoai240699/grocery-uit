// import React, { useState, useEffect } from 'react'
// import { toast } from 'react-toastify'
// import { axiosClient } from '@/utils/axiosClient'
// import LoaderComponent from '@/components/ui/LoaderComponent'
// import { IoMdSearch, IoMdAdd, IoMdPricetag, IoMdEye, IoMdCreate, IoMdTrash, IoMdImage } from 'react-icons/io'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'

// const AllProducts2 = () => {
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [totalProducts, setTotalProducts] = useState(0)
//   const [selectedProducts, setSelectedProducts] = useState([])
//   const itemsPerPage = 10

//   // Fetch products data
//   const fetchProducts = async (page = 1, search = '') => {
//     try {
//       setLoading(true)
//       const params = {
//         page,
//         limit: itemsPerPage
//       }
      
//       if (search.trim()) {
//         params.search = search.trim()
//       }

//       const response = await axiosClient.get('/admin/products', {
//         params,
//         headers: {
//           'Authorization': 'Bearer ' + localStorage.getItem("token")
//         }
//       })

//       const data = response.data
//       setProducts(data.items || [])
//       setTotalProducts(data.total || 0)
//       setTotalPages(Math.ceil((data.total || 0) / itemsPerPage))
      
//     } catch (error) {
//       console.error('Error fetching products:', error)
//       toast.error('Không thể tải danh sách sản phẩm: ' + (error?.response?.data?.detail || error.message))
//       setProducts([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Handle search with debouncing
//   const handleSearch = (value) => {
//     setSearchTerm(value)
//     setCurrentPage(1) // Reset to page 1 when searching
//   }

//   // Handle pagination
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages && page !== currentPage) {
//       setCurrentPage(page)
//     }
//   }

//   // Handle delete product
//   const handleDeleteProduct = async (productId, productName) => {
//     if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}"?`)) {
//       return
//     }

//     try {
//       await axiosClient.delete(`/admin/products/${productId}`, {
//         headers: {
//           'Authorization': 'Bearer ' + localStorage.getItem("token")
//         }
//       })
//       toast.success(`Đã xóa sản phẩm "${productName}"`)
//       fetchProducts(currentPage, searchTerm) // Refresh data
//     } catch (error) {
//       console.error('Error deleting product:', error)
//       toast.error('Không thể xóa sản phẩm: ' + (error?.response?.data?.detail || error.message))
//     }
//   }

//   // Handle status toggle
//   const handleToggleStatus = async (productId, currentStatus) => {
//     try {
//       const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
//       await axiosClient.put(`/admin/products/${productId}/status`, 
//         { status: newStatus },
//         {
//           headers: {
//             'Authorization': 'Bearer ' + localStorage.getItem("token")
//           }
//         }
//       )
//       toast.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'ẩn'} sản phẩm`)
//       fetchProducts(currentPage, searchTerm) // Refresh data
//     } catch (error) {
//       console.error('Error toggling product status:', error)
//       toast.error('Không thể thay đổi trạng thái sản phẩm')
//     }
//   }

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('vi-VN', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit'
//     })
//   }

//   // Format price
//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND'
//     }).format(price)
//   }

//   // Handle select all
//   const handleSelectAll = (checked) => {
//     if (checked) {
//       setSelectedProducts(products.map(product => product.id))
//     } else {
//       setSelectedProducts([])
//     }
//   }

//   // Handle individual selection
//   const handleSelectProduct = (productId, checked) => {
//     if (checked) {
//       setSelectedProducts(prev => [...prev, productId])
//     } else {
//       setSelectedProducts(prev => prev.filter(id => id !== productId))
//     }
//   }

//   // useEffect hooks
//   useEffect(() => {
//     fetchProducts(1, '')
//   }, [])

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchProducts(currentPage, searchTerm)
//     }, 500)
//     return () => clearTimeout(timer)
//   }, [searchTerm])

//   useEffect(() => {
//     fetchProducts(currentPage, searchTerm)
//   }, [currentPage])

//   if (loading && products.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoaderComponent />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//                 <div className="bg-blue-100 p-2 rounded-lg">
//                   <IoMdPricetag className="text-2xl text-blue-600" />
//                 </div>
//                 Quản lý Sản phẩm
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 Tổng cộng <span className="font-semibold text-blue-600">{totalProducts}</span> sản phẩm
//               </p>
//             </div>
            
//             <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
//               <IoMdAdd className="text-xl" />
//               Thêm sản phẩm
//             </button>
//           </div>

//           {/* Search */}
//           <div className="mt-6">
//             <div className="relative max-w-md">
//               <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
//               <input
//                 type="text"
//                 placeholder="Tìm kiếm sản phẩm..."
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Product Table */}
//         <div className="bg-white rounded-lg border">
//           {products.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-6xl mb-4">📦</div>
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">
//                 Không tìm thấy sản phẩm
//               </h3>
//               <p className="text-gray-500">
//                 {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy thêm sản phẩm đầu tiên'}
//               </p>
//             </div>
//           ) : (
//             <>
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-muted/50">
//                     <TableHead className="w-12">
//                       <Checkbox 
//                         checked={selectedProducts.length === products.length}
//                         onCheckedChange={handleSelectAll}
//                       />
//                     </TableHead>
//                     <TableHead className="font-medium">Sản phẩm</TableHead>
//                     <TableHead className="font-medium">Danh mục</TableHead>
//                     <TableHead className="font-medium">Giá</TableHead>
//                     <TableHead className="font-medium">Tồn kho</TableHead>
//                     <TableHead className="font-medium">Trạng thái</TableHead>
//                     <TableHead className="font-medium">Ngày tạo</TableHead>
//                     <TableHead className="font-medium text-right">Thao tác</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {products.map((product) => (
//                     <TableRow key={product.id} className="hover:bg-muted/50">
//                       <TableCell>
//                         <Checkbox 
//                           checked={selectedProducts.includes(product.id)}
//                           onCheckedChange={(checked) => handleSelectProduct(product.id, checked)}
//                         />
//                       </TableCell>
                      
//                       <TableCell className="font-medium">
//                         <div className="flex items-center gap-3">
//                           {product.image_uri ? (
//                             <img 
//                               className="h-10 w-10 rounded object-cover" 
//                               src={product.image_uri} 
//                               alt={product.name}
//                             />
//                           ) : (
//                             <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
//                               <IoMdImage className="h-5 w-5 text-muted-foreground" />
//                             </div>
//                           )}
//                           <div>
//                             <span className="font-medium">{product.name || 'Chưa có tên'}</span>
//                             {product.description && (
//                               <p className="text-sm text-muted-foreground line-clamp-1">
//                                 {product.description}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </TableCell>
                      
//                       <TableCell>
//                         <Badge variant="outline">
//                           {product.category?.name || 'Chưa phân loại'}
//                         </Badge>
//                       </TableCell>
                      
//                       <TableCell className="font-medium">
//                         {formatPrice(product.price || 0)}
//                       </TableCell>
                      
//                       <TableCell>
//                         <span className={`font-medium ${
//                           (product.stock || 0) > 10 ? 'text-green-600' : 
//                           (product.stock || 0) > 0 ? 'text-yellow-600' : 'text-red-600'
//                         }`}>
//                           {product.stock || 0}
//                         </span>
//                       </TableCell>
                      
//                       <TableCell>
//                         <Badge variant={product.status === 'active' ? 'default' : 'destructive'}>
//                           {product.status === 'active' ? '● Đang bán' : '● Đã ẩn'}
//                         </Badge>
//                       </TableCell>
                      
//                       <TableCell className="text-muted-foreground">
//                         {formatDate(product.created_at)}
//                       </TableCell>
                      
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-1">
//                           <Button 
//                             variant="ghost" 
//                             size="sm"
//                             className="h-8 w-8 p-0"
//                             title="Xem chi tiết"
//                           >
//                             <IoMdEye className="h-4 w-4" />
//                           </Button>
//                           <Button 
//                             variant="ghost" 
//                             size="sm"
//                             className="h-8 w-8 p-0"
//                             title="Chỉnh sửa"
//                           >
//                             <IoMdCreate className="h-4 w-4" />
//                           </Button>
//                           <Button 
//                             variant="ghost" 
//                             size="sm"
//                             className="h-8 w-8 p-0"
//                             onClick={() => handleToggleStatus(product.id, product.status || 'active')}
//                             title={product.status === 'active' ? 'Ẩn sản phẩm' : 'Hiển thị sản phẩm'}
//                           >
//                             {product.status === 'active' ? '👁️‍🗨️' : '👁️'}
//                           </Button>
//                           <Button 
//                             variant="ghost" 
//                             size="sm"
//                             className="h-8 w-8 p-0 text-destructive hover:text-destructive"
//                             onClick={() => handleDeleteProduct(product.id, product.name)}
//                             title="Xóa sản phẩm"
//                           >
//                             <IoMdTrash className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>

//               {/* Table Footer */}
//               <div className="flex items-center justify-between px-4 py-4 border-t">
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   {selectedProducts.length > 0 && (
//                     <span className="mr-4">
//                       {selectedProducts.length} of {products.length} row(s) selected.
//                     </span>
//                   )}
//                   <span>
//                     Hiển thị{' '}
//                     <span className="font-medium text-foreground">
//                       {(currentPage - 1) * itemsPerPage + 1}
//                     </span>{' '}
//                     đến{' '}
//                     <span className="font-medium text-foreground">
//                       {Math.min(currentPage * itemsPerPage, totalProducts)}
//                     </span>{' '}
//                     trong tổng số{' '}
//                     <span className="font-medium text-foreground">{totalProducts}</span> sản phẩm
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                   >
//                     ← Trước
//                   </Button>
                  
//                   <div className="flex items-center text-sm text-muted-foreground">
//                     Trang {currentPage} / {totalPages}
//                   </div>
                  
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                   >
//                     Tiếp →
//                   </Button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AllProducts2