import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { axiosClient } from '@/utils/axiosClient'
import LoaderComponent from '@/components/ui/LoaderComponent'
import { IoMdSearch, IoMdAdd, IoMdPeople, IoMdMail, IoMdCalendar, IoMdEye, IoMdCreate, IoMdTrash, IoMdCard } from 'react-icons/io'
import { IoLocation } from 'react-icons/io5'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const itemsPerPage = 12

  // Fetch customers data
  const fetchCustomers = async (page = 1, search = '') => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: itemsPerPage,
        role: 'customer' // Lọc chỉ lấy khách hàng
      }
      
      if (search.trim()) {
        params.search = search.trim()
      }

      const response = await axiosClient.get('/admin/users', {
        params,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })

      const data = response.data
      setCustomers(data.items || [])
      setTotalCustomers(data.total || 0)
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage))
      
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('Không thể tải danh sách khách hàng: ' + (error?.response?.data?.detail || error.message))
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Handle delete customer
  const handleDeleteCustomer = async (customerId, customerName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customerName}"?`)) {
      return
    }

    try {
      await axiosClient.delete(`/admin/users/${customerId}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      toast.success('Xóa khách hàng thành công')
      fetchCustomers(currentPage, searchTerm) // Refresh data
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast.error('Không thể xóa khách hàng: ' + (error?.response?.data?.detail || error.message))
    }
  }

  // Handle status toggle
  const handleToggleStatus = async (customerId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await axiosClient.put(`/admin/users/${customerId}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          }
        }
      )
      toast.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} khách hàng`)
      fetchCustomers(currentPage, searchTerm) // Refresh data
    } catch (error) {
      console.error('Error toggling customer status:', error)
      toast.error('Không thể thay đổi trạng thái khách hàng')
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  // Get status badge style
  const getStatusBadge = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold'
      : 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold'
  }

  // useEffect hooks
  useEffect(() => {
    fetchCustomers(1, '')
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(currentPage, searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchCustomers(currentPage, searchTerm)
  }, [currentPage])

  if (loading && customers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderComponent />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <IoMdPeople className="text-2xl text-green-600" />
                </div>
                Quản lý Khách hàng
              </h1>
              <p className="text-gray-600 mt-2">
                Tổng cộng <span className="font-semibold text-green-600">{totalCustomers}</span> khách hàng
              </p>
            </div>
            
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <IoMdAdd className="text-xl" />
              Thêm khách hàng
            </button>
          </div>

          {/* Search */}
          <div className="mt-6">
            <div className="relative max-w-md">
              <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Customer Grid */}
        {customers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Không tìm thấy khách hàng
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy thêm khách hàng đầu tiên'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {customers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                {/* Avatar & Basic Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    {customer.avatar_image_uri ? (
                      <img 
                        className="h-12 w-12 rounded-full object-cover" 
                        src={customer.avatar_image_uri} 
                        alt={customer.name}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-lg">
                          {customer.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {customer.name || 'Chưa cập nhật'}
                    </h3>
                    <span className={getStatusBadge(customer.status || 'active')}>
                      {customer.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <IoMdMail className="mr-2 text-gray-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  
                  {customer.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📞</span>
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  
                  {customer.address && (
                    <div className="flex items-start text-sm text-gray-600">
                      <IoLocation className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span className="line-clamp-2">{customer.address}</span>
                    </div>
                  )}
                </div>

                {/* Join Date */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <IoMdCalendar className="mr-2 text-gray-400" />
                  <span>Tham gia: {formatDate(customer.created_at)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <IoMdEye className="text-lg" />
                    </button>
                    <button 
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <IoMdCreate className="text-lg" />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(customer.id, customer.status || 'active')}
                      className={`p-2 rounded-lg transition-colors ${
                        customer.status === 'active' 
                          ? 'text-orange-600 hover:bg-orange-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={customer.status === 'active' ? 'Tạm khóa' : 'Kích hoạt'}
                    >
                      {customer.status === 'active' ? '🔒' : '🔓'}
                    </button>
                  </div>
                  <button 
                    onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa khách hàng"
                  >
                    <IoMdTrash className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Trước
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị{' '}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{' '}
                    đến{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalCustomers)}
                    </span>{' '}
                    trong tổng số{' '}
                    <span className="font-medium">{totalCustomers}</span> khách hàng
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span
                            key={page}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        )
                      }
                      return null
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Customers