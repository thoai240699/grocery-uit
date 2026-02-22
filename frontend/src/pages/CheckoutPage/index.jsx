import LoaderComponent from '@/components/ui/LoaderComponent'
import { useAuthContext } from '@/context/AuthContext'
import { axiosClient } from '@/utils/axiosClient'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'

const formatVnd = (value = 0) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
}).format(Number(value) || 0)

const getItemId = (item) => item?.id || item?.PROVINCE_ID || item?.DISTRICT_ID || item?.WARDS_ID || item?.provinceId || item?.districtId || item?.wardId || ''
const getItemName = (item) => item?.name || item?.PROVINCE_NAME || item?.DISTRICT_NAME || item?.WARDS_NAME || item?.provinceName || item?.districtName || item?.wardName || ''

const validationSchema = yup.object({
    phone_no: yup.string().required('Số điện thoại là bắt buộc'),
    street: yup.string().required('Vui lòng nhập địa chỉ chi tiết'),
    province_id: yup.string().required('Vui lòng chọn tỉnh/thành phố'),
    district_id: yup.string().required('Vui lòng chọn quận/huyện'),
    ward_id: yup.string().required('Vui lòng chọn phường/xã'),
    payment_method: yup.string().oneOf(['momo_qr', 'cod', 'mock']).required('Vui lòng chọn phương thức thanh toán'),
})

const CheckoutPage = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [addressLoading, setAddressLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const { user } = useAuthContext()
    const [cartData, setCartData] = useState(null)

    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    const [pendingPayment, setPendingPayment] = useState(null)

    const initialValues = useMemo(() => ({
        name: user?.name || '',
        email: user?.email || '',
        phone_no: '',
        street: '',
        province_id: '',
        district_id: '',
        ward_id: '',
        payment_method: 'momo_qr',
    }), [user])

    const fetchAllProducts = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return
            const response = await axiosClient.get('/cart/get', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            setCartData(response.data)
        } catch (error) {
            toast.error(error?.response?.data?.detail || error.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchProvinces = async () => {
        try {
            setAddressLoading(true)
            const response = await axiosClient.get('/address/viettel-post/provinces')
            setProvinces(response?.data?.items || [])
        } catch (error) {
            toast.error(error?.response?.data?.detail || 'Không tải được danh sách tỉnh/thành phố')
        } finally {
            setAddressLoading(false)
        }
    }

    const fetchDistricts = async (provinceId) => {
        if (!provinceId) {
            setDistricts([])
            return
        }
        try {
            setAddressLoading(true)
            const response = await axiosClient.get(`/address/viettel-post/districts/${provinceId}`)
            setDistricts(response?.data?.items || [])
        } catch (error) {
            toast.error(error?.response?.data?.detail || 'Không tải được danh sách quận/huyện')
        } finally {
            setAddressLoading(false)
        }
    }

    const fetchWards = async (districtId) => {
        if (!districtId) {
            setWards([])
            return
        }
        try {
            setAddressLoading(true)
            const response = await axiosClient.get(`/address/viettel-post/wards/${districtId}`)
            setWards(response?.data?.items || [])
        } catch (error) {
            toast.error(error?.response?.data?.detail || 'Không tải được danh sách phường/xã')
        } finally {
            setAddressLoading(false)
        }
    }

    const onSubmitHandler = async (values) => {
        try {
            setSubmitting(true)
            const token = localStorage.getItem('token')
            if (!token) {
                toast.error('Vui lòng đăng nhập')
                return
            }

            const province = provinces.find((item) => String(getItemId(item)) === String(values.province_id))
            const district = districts.find((item) => String(getItemId(item)) === String(values.district_id))
            const ward = wards.find((item) => String(getItemId(item)) === String(values.ward_id))

            const fullAddress = [
                values.street,
                ward ? getItemName(ward) : '',
                district ? getItemName(district) : '',
                province ? getItemName(province) : '',
            ].filter(Boolean).join(', ')

            const response = await axiosClient.post('/checkout/create', {
                phone_no: values.phone_no,
                address: fullAddress,
                payment_method: values.payment_method,
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })

            const data = response?.data || {}

            if (data.status === 'confirmed') {
                toast.success(data.message || 'Đặt hàng thành công')
                navigate(`/checkout/success?orderId=${data.orderId || ''}`)
                return
            }

            setPendingPayment({
                orderId: data.orderId,
                amount: data.amount,
                qrUrl: data.qrUrl,
                transferContent: data.transferContent,
                receiverName: data.receiverName,
                receiverPhone: data.receiverPhone,
                payment_method: data.payment_method,
                status: data.status,
            })
            toast.info(data.message || 'Đã tạo phiên thanh toán')
        } catch (error) {
            toast.error(error?.response?.data?.detail || error.message)
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        fetchAllProducts()
        fetchProvinces()
    }, [])

    if (loading) {
        return <div className='min-h-44 flex items-center justify-center'>
            <LoaderComponent />
        </div>
    }

    return (
        <>
            <section className="bg-white py-8 antialiased container md:py-16">
                {cartData && cartData.total === 0 ? <>
                    <h4 className='text-3xl font-bold text-center'>Chưa có sản phẩm trong giỏ hàng</h4>
                </> : <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmitHandler}
                    enableReinitialize
                >
                    {({ values, setFieldValue }) => {
                        return <>
                            <Form className="mx-auto px-4 2xl:px-0">
                                <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
                                    <div className="p-10 flex-1 space-y-8">
                                        <div className="space-y-4">
                                            <h2 className="text-xl font-semibold text-gray-900">Thông tin giao hàng</h2>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label htmlFor="your_name" className="mb-2 block text-sm font-medium text-gray-900">Họ và tên</label>
                                                    <Field name="name" type="text" id="your_name" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900" disabled />
                                                </div>
                                                <div>
                                                    <label htmlFor="your_email" className="mb-2 block text-sm font-medium text-gray-900">Email</label>
                                                    <Field disabled name="email" type="email" id="your_email" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900" />
                                                </div>

                                                <div className='sm:col-span-2'>
                                                    <label htmlFor="your_phone" className="mb-2 block text-sm font-medium text-gray-900">Số điện thoại</label>
                                                    <Field
                                                        name="phone_no"
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/[^+0-9]/g, '')
                                                        }}
                                                        type="text"
                                                        id="your_phone"
                                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                                                        placeholder="09xxxxxxxx"
                                                    />
                                                    <ErrorMessage className='text-red-500 text-sm mt-1' name="phone_no" component={'p'} />
                                                </div>

                                                <div>
                                                    <label htmlFor="province_id" className="mb-2 block text-sm font-medium text-gray-900">Tỉnh/Thành phố</label>
                                                    <Field
                                                        as="select"
                                                        id="province_id"
                                                        name="province_id"
                                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                                                        onChange={async (e) => {
                                                            const provinceId = e.target.value
                                                            setFieldValue('province_id', provinceId)
                                                            setFieldValue('district_id', '')
                                                            setFieldValue('ward_id', '')
                                                            setDistricts([])
                                                            setWards([])
                                                            await fetchDistricts(provinceId)
                                                        }}
                                                    >
                                                        <option value="">Chọn tỉnh/thành phố</option>
                                                        {provinces.map((item) => (
                                                            <option key={String(getItemId(item))} value={String(getItemId(item))}>{getItemName(item)}</option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage className='text-red-500 text-sm mt-1' name="province_id" component={'p'} />
                                                </div>

                                                <div>
                                                    <label htmlFor="district_id" className="mb-2 block text-sm font-medium text-gray-900">Quận/Huyện</label>
                                                    <Field
                                                        as="select"
                                                        id="district_id"
                                                        name="district_id"
                                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                                                        disabled={!values.province_id || addressLoading}
                                                        onChange={async (e) => {
                                                            const districtId = e.target.value
                                                            setFieldValue('district_id', districtId)
                                                            setFieldValue('ward_id', '')
                                                            setWards([])
                                                            await fetchWards(districtId)
                                                        }}
                                                    >
                                                        <option value="">Chọn quận/huyện</option>
                                                        {districts.map((item) => (
                                                            <option key={String(getItemId(item))} value={String(getItemId(item))}>{getItemName(item)}</option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage className='text-red-500 text-sm mt-1' name="district_id" component={'p'} />
                                                </div>

                                                <div className='sm:col-span-2'>
                                                    <label htmlFor="ward_id" className="mb-2 block text-sm font-medium text-gray-900">Phường/Xã</label>
                                                    <Field
                                                        as="select"
                                                        id="ward_id"
                                                        name="ward_id"
                                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                                                        disabled={!values.district_id || addressLoading}
                                                    >
                                                        <option value="">Chọn phường/xã</option>
                                                        {wards.map((item) => (
                                                            <option key={String(getItemId(item))} value={String(getItemId(item))}>{getItemName(item)}</option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage className='text-red-500 text-sm mt-1' name="ward_id" component={'p'} />
                                                </div>

                                                <div className='sm:col-span-2'>
                                                    <label htmlFor="street" className="mb-2 block text-sm font-medium text-gray-900">Số nhà, tên đường</label>
                                                    <Field
                                                        name="street"
                                                        type="text"
                                                        id="street"
                                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                                                        placeholder="Ví dụ: 123 Nguyễn Trãi"
                                                    />
                                                    <ErrorMessage className='text-red-500 text-sm mt-1' name="street" component={'p'} />
                                                </div>

                                                <div className='sm:col-span-2'>
                                                    <label htmlFor="payment_method" className="mb-2 block text-sm font-medium text-gray-900">Phương thức thanh toán</label>
                                                    <Field
                                                        as="select"
                                                        id="payment_method"
                                                        name="payment_method"
                                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                                                    >
                                                        <option value="momo_qr">Quét mã QR MoMo</option>
                                                        <option value="cod">COD - Thanh toán khi nhận hàng</option>
                                                        <option value="mock">Mock - Giả lập thanh toán</option>
                                                    </Field>
                                                    <ErrorMessage className='text-red-500 text-sm mt-1' name="payment_method" component={'p'} />
                                                </div>

                                                {pendingPayment?.payment_method === 'momo_qr' && pendingPayment?.qrUrl ? (
                                                    <div className='sm:col-span-2 border rounded-xl p-4 bg-gray-50'>
                                                        <p className='font-semibold mb-3'>Quét mã QR MoMo để thanh toán</p>
                                                        <img src={pendingPayment.qrUrl} alt="MoMo QR" className='w-72 max-w-full mx-auto rounded-lg border' />
                                                        <p className='text-sm mt-3 text-gray-700'>Nội dung thanh toán: <span className='font-semibold'>{pendingPayment.transferContent}</span></p>
                                                        {pendingPayment.receiverName ? <p className='text-sm text-gray-700'>Người nhận: <span className='font-semibold'>{pendingPayment.receiverName}</span></p> : null}
                                                        {pendingPayment.receiverPhone ? <p className='text-sm text-gray-700'>SĐT MoMo: <span className='font-semibold'>{pendingPayment.receiverPhone}</span></p> : null}
                                                        <p className='text-sm text-gray-700'>Số tiền: <span className='font-semibold'>{formatVnd(pendingPayment.amount)}</span></p>
                                                        <p className='text-sm mt-4 text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3'>
                                                            Sau khi chuyển khoản, đơn hàng sẽ ở trạng thái chờ và được nhân viên xác nhận thanh toán.
                                                        </p>
                                                    </div>
                                                ) : null}

                                                {pendingPayment?.payment_method === 'mock' ? (
                                                    <div className='sm:col-span-2 border rounded-xl p-4 bg-gray-50'>
                                                        <p className='text-sm text-gray-700'>Đơn mock đã được tạo và đang chờ nhân viên xác nhận thanh toán.</p>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-10 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
                                        <div className="flow-root">
                                            <div className="-my-3 divide-y divide-gray-200">
                                                <dl className="flex items-center justify-between gap-4 py-3">
                                                    <dt className="text-base font-normal text-gray-500">Xem giỏ hàng</dt>
                                                    <dd className="text-base font-medium text-gray-900">
                                                        <Link to={'/cart'}>Giỏ hàng</Link>
                                                    </dd>
                                                </dl>
                                                <dl className="flex items-center justify-between gap-4 py-3">
                                                    <dt className="text-base font-normal text-gray-500">Tạm tính</dt>
                                                    <dd className="text-base font-medium text-gray-900">{formatVnd(cartData?.total)}</dd>
                                                </dl>
                                                <dl className="flex items-center justify-between gap-4 py-3">
                                                    <dt className="text-base font-normal text-gray-500">Giảm giá</dt>
                                                    <dd className="text-base font-medium text-green-600">{formatVnd(0)}</dd>
                                                </dl>
                                                <dl className="flex items-center justify-between gap-4 py-3">
                                                    <dt className="text-base font-normal text-gray-500">Phí vận chuyển</dt>
                                                    <dd className="text-base font-medium text-gray-900">{formatVnd(0)}</dd>
                                                </dl>
                                                <dl className="flex items-center justify-between gap-4 py-3">
                                                    <dt className="text-base font-bold text-gray-900">Tổng thanh toán</dt>
                                                    <dd className="text-base font-bold text-gray-900">{formatVnd(cartData?.total)}</dd>
                                                </dl>
                                                <dl className='w-full'>
                                                    <button type='submit' disabled={submitting} className="py-2 text-white rounded-md text-center w-full bg-black hover:bg-black/80 disabled:opacity-50">
                                                        {values.payment_method === 'momo_qr' ? 'Tạo mã QR MoMo' : 'Đặt hàng'}
                                                    </button>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </>
                    }}
                </Formik>}
            </section>
        </>
    )
}

export default CheckoutPage
