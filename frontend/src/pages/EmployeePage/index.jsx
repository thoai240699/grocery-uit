import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { axiosClient } from '@/utils/axiosClient'
import LoaderComponent from '@/components/ui/LoaderComponent'
import { IoMdSearch, IoMdAdd, IoMdPerson, IoMdMail, IoMdCalendar, IoMdEye, IoMdCreate, IoMdTrash } from 'react-icons/io'

const Employees= () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEmployees, setTotalEmployees] = useState(0)
  const itemsPerPage = 10

  // Fetch employees data
  const fetchEmployees = async (page = 1, search = '') => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: itemsPerPage,
        role: 'staff' // Lọc chỉ lấy nhân viên
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
      setEmployees(data.items || [])
      setTotalEmployees(data.total || 0)
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage))
      
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast.error('Không thể tải danh sách nhân viên: ' + (error?.response?.data?.detail || error.message))
      setEmployees([])
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

  // Handle delete employee
  const handleDeleteEmployee = async (employeeId, employeeName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${employeeName}"?`)) {
      return
    }

    try {
      await axiosClient.delete(`/admin/users/${employeeId}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      toast.success('Xóa nhân viên thành công')
      fetchEmployees(currentPage, searchTerm) // Refresh data
    } catch (error) {
      console.error('Error deleting employee:', error)
      toast.error('Không thể xóa nhân viên: ' + (error?.response?.data?.detail || error.message))
    }
  }

  // Handle status toggle
  const handleToggleStatus = async (employeeId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await axiosClient.put(`/admin/users/${employeeId}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          }
        }
      )
      toast.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} nhân viên`)
      fetchEmployees(currentPage, searchTerm) // Refresh data
    } catch (error) {
      console.error('Error toggling employee status:', error)
      toast.error('Không thể thay đổi trạng thái nhân viên')
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
    fetchEmployees(1, '')
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(currentPage, searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchEmployees(currentPage, searchTerm)
  }, [currentPage])

  if (loading && employees.length === 0) {
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
                <div className="bg-blue-100 p-2 rounded-lg">
                  <IoMdPerson className="text-2xl text-blue-600" />
                </div>
                Quản lý Nhân viên
              </h1>
              <p className="text-gray-600 mt-2">
                Tổng cộng <span className="font-semibold text-blue-600">{totalEmployees}</span> nhân viên
              </p>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <IoMdAdd className="text-xl" />
              Thêm nhân viên
            </button>
          </div>

          {/* Search */}
          <div className="mt-6">
            <div className="relative max-w-md">
              <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {employees.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Không tìm thấy nhân viên
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy thêm nhân viên đầu tiên'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nhân viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Liên hệ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tham gia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {employee.avatar_image_uri ? (
                                <img 
                                  className="h-12 w-12 rounded-full object-cover" 
                                  src={employee.avatar_image_uri} 
                                  alt={employee.name}
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold text-lg">
                                    {employee.name?.charAt(0)?.toUpperCase() || '?'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.name || 'Chưa cập nhật'}
                              </div>
                              <div className="text-sm text-gray-500 capitalize">
                                {employee.role}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900 flex items-center gap-2">
                              <IoMdMail className="text-gray-400" />
                              {employee.email}
                            </div>
                            {employee.phone && (
                              <div className="text-sm text-gray-500">
                                📞 {employee.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center gap-2">
                            <IoMdCalendar className="text-gray-400" />
                            {formatDate(employee.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(employee.status || 'active')}>
                            {employee.status === 'active' ? 'Đang hoạt động' : 'Tạm khóa'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="Xem chi tiết"
                          >
                            <IoMdEye className="text-lg" />
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                            title="Chỉnh sửa"
                          >
                            <IoMdCreate className="text-lg" />
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(employee.id, employee.status || 'active')}
                            className={`p-1 rounded ${
                              employee.status === 'active' 
                                ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' 
                                : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                            }`}
                            title={employee.status === 'active' ? 'Tạm khóa' : 'Kích hoạt'}
                          >
                            {employee.status === 'active' ? '🔒' : '🔓'}
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(employee.id, employee.name)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            title="Xóa nhân viên"
                          >
                            <IoMdTrash className="text-lg" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
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
                            {Math.min(currentPage * itemsPerPage, totalEmployees)}
                          </span>{' '}
                          trong tổng số{' '}
                          <span className="font-medium">{totalEmployees}</span> nhân viên
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
                                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Employees