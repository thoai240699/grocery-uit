import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { axiosClient } from '@/utils/axiosClient'
import LoaderComponent from '@/components/ui/LoaderComponent'
import { IoMdSearch, IoMdAdd, IoMdPeople, IoMdMail, IoMdCalendar, IoMdEye, IoMdCreate, IoMdTrash, IoMdCard } from 'react-icons/io'
import { IoLocation } from 'react-icons/io5'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const itemsPerPage = 10

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

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(customers.map(customer => customer.id))
    } else {
      setSelectedCustomers([])
    }
  }

  // Handle individual selection
  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId])
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId))
    }
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

        {/* Customer Table */}
        <div className="bg-white rounded-lg border">
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Không tìm thấy khách hàng
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy thêm khách hàng đầu tiên'}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedCustomers.length === customers.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="font-medium">Khách hàng</TableHead>
                    <TableHead className="font-medium">Vai trò</TableHead>
                    <TableHead className="font-medium">Trạng thái</TableHead>
                    <TableHead className="font-medium">Email</TableHead>
                    <TableHead className="font-medium">Điện thoại</TableHead>
                    <TableHead className="font-medium">Ngày tham gia</TableHead>
                    <TableHead className="font-medium text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox 
                          checked={selectedCustomers.includes(customer.id)}
                          onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked)}
                        />
                      </TableCell>
                      
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {customer.avatar_image_uri ? (
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={customer.avatar_image_uri} 
                              alt={customer.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-muted-foreground font-semibold text-sm">
                                {customer.name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                          )}
                          <span className="font-medium">{customer.name || 'Chưa cập nhật'}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {customer.role === 'customer' ? 'Khách hàng' : customer.role}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant={customer.status === 'active' ? 'default' : 'destructive'}>
                          {customer.status === 'active' ? '● Hoạt động' : '● Tạm khóa'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-muted-foreground">
                        {customer.email}
                      </TableCell>
                      
                      <TableCell className="text-muted-foreground">
                        {customer.phone || '-'}
                      </TableCell>
                      
                      <TableCell className="text-muted-foreground">
                        {formatDate(customer.created_at)}
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Xem chi tiết"
                          >
                            <IoMdEye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Chỉnh sửa"
                          >
                            <IoMdCreate className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleToggleStatus(customer.id, customer.status || 'active')}
                            title={customer.status === 'active' ? 'Tạm khóa' : 'Kích hoạt'}
                          >
                            {customer.status === 'active' ? '🔒' : '🔓'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                            title="Xóa khách hàng"
                          >
                            <IoMdTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              
              {/* Table Footer */}
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="flex items-center text-sm text-muted-foreground">
                  {selectedCustomers.length > 0 && (
                    <span className="mr-4">
                      {selectedCustomers.length} of {customers.length} row(s) selected.
                    </span>
                  )}
                  <span>
                    Hiển thị{' '}
                    <span className="font-medium text-foreground">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{' '}
                    đến{' '}
                    <span className="font-medium text-foreground">
                      {Math.min(currentPage * itemsPerPage, totalCustomers)}
                    </span>{' '}
                    trong tổng số{' '}
                    <span className="font-medium text-foreground">{totalCustomers}</span> khách hàng
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Trước
                  </Button>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Tiếp →
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Customers