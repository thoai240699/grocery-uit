import AvatarComponent from "@/components/AvatarComponent";
import { useAuthContext } from "@/context/AuthContext";
import { axiosClient } from "@/utils/axiosClient";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";

const getItemId = (item) => item?.id || item?.PROVINCE_ID || item?.DISTRICT_ID || item?.WARDS_ID || item?.provinceId || item?.districtId || item?.wardId || "";
const getItemName = (item) => item?.name || item?.PROVINCE_NAME || item?.DISTRICT_NAME || item?.WARDS_NAME || item?.provinceName || item?.districtName || item?.wardName || "";

const ProfileUser = () => {
  const { user, fetchUserProfile } = useAuthContext();
  const [isSaving, setIsSaving] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const initialForm = useMemo(() => {
    const dob = user?.dob ? String(user.dob).slice(0, 10) : "";
    return {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      street: "",
      province_id: "",
      district_id: "",
      ward_id: "",
      dob,
    };
  }, [user?.address, user?.dob, user?.name, user?.phone]);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isDirty =
    form.name !== initialForm.name ||
    form.phone !== initialForm.phone ||
    form.street !== initialForm.street ||
    form.province_id !== initialForm.province_id ||
    form.district_id !== initialForm.district_id ||
    form.ward_id !== initialForm.ward_id ||
    form.dob !== initialForm.dob;

  const fetchProvinces = async () => {
    try {
      setAddressLoading(true);
      const response = await axiosClient.get("/address/viettel-post/provinces");
      setProvinces(response?.data?.items || []);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Không tải được danh sách tỉnh/thành phố");
    } finally {
      setAddressLoading(false);
    }
  };

  const fetchDistricts = async (provinceId) => {
    if (!provinceId) {
      setDistricts([]);
      return;
    }
    try {
      setAddressLoading(true);
      const response = await axiosClient.get(`/address/viettel-post/districts/${provinceId}`);
      setDistricts(response?.data?.items || []);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Không tải được danh sách quận/huyện");
    } finally {
      setAddressLoading(false);
    }
  };

  const fetchWards = async (districtId) => {
    if (!districtId) {
      setWards([]);
      return;
    }
    try {
      setAddressLoading(true);
      const response = await axiosClient.get(`/address/viettel-post/wards/${districtId}`);
      setWards(response?.data?.items || []);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Không tải được danh sách phường/xã");
    } finally {
      setAddressLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token") || "";
      if (!token) throw new Error("Vui lòng đăng nhập");

      const payload = {};
      if (form.name.trim() && form.name.trim() !== initialForm.name) payload.name = form.name.trim();
      if (form.phone.trim() && form.phone.trim() !== initialForm.phone) payload.phone = form.phone.trim();

      const hasAddressInput = form.street.trim() || form.province_id || form.district_id || form.ward_id;
      if (hasAddressInput) {
        if (!form.street.trim() || !form.province_id || !form.district_id || !form.ward_id) {
          toast.error("Vui lòng chọn đầy đủ tỉnh/quận/phường và nhập số nhà, tên đường");
          return;
        }

        const province = provinces.find((item) => String(getItemId(item)) === String(form.province_id));
        const district = districts.find((item) => String(getItemId(item)) === String(form.district_id));
        const ward = wards.find((item) => String(getItemId(item)) === String(form.ward_id));

        const fullAddress = [
          form.street.trim(),
          ward ? getItemName(ward) : "",
          district ? getItemName(district) : "",
          province ? getItemName(province) : "",
        ].filter(Boolean).join(", ");

        if (fullAddress && fullAddress !== initialForm.address) {
          payload.address = fullAddress;
        }
      }

      if (form.dob) payload.dob = form.dob;

      if (!Object.keys(payload).length) {
        toast.info("Không có thay đổi để lưu");
        return;
      }

      const response = await axiosClient.put("/auth/update-basic-details", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(response.data?.msg || "Cập nhật thông tin thành công");
      await fetchUserProfile();
    } catch (err) {
      toast.error(err?.response?.data?.detail || err.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <section className="relative pt-20 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Hồ Sơ Của Tôi
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Quản lý thông tin cá nhân và cập nhật tài khoản của bạn
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h3 className="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Ảnh Đại Diện
              </h3>
              <p className="text-sm text-gray-600 mb-6">Nhấn vào ảnh để tải lên hình mới</p>
              <div className="flex justify-center py-6">
                <AvatarComponent />
              </div>
              <p className="text-xs text-gray-500 text-center">Dung lượng tối đa: 5MB</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Thông Tin Cá Nhân</h3>
                  <p className="text-gray-600">Cập nhật thông tin hồ sơ của bạn</p>
                </div>
                {isDirty && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-medium text-amber-700">Có thay đổi chưa lưu</span>
                  </div>
                )}
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Họ và Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">Tối thiểu 3 ký tự, dùng cho liên hệ và nhận hàng</p>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Số Điện Thoại
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="09xxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Địa Chỉ
                  </label>
                  <div className="space-y-3">
                    <input
                      name="street"
                      value={form.street}
                      onChange={onChange}
                      placeholder="Số nhà, tên đường"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <select
                        name="province_id"
                        value={form.province_id}
                        onChange={async (e) => {
                          const provinceId = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            province_id: provinceId,
                            district_id: "",
                            ward_id: "",
                          }));
                          setDistricts([]);
                          setWards([]);
                          await fetchDistricts(provinceId);
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={addressLoading}
                      >
                        <option value="">Tỉnh/Thành phố</option>
                        {provinces.map((item) => (
                          <option key={String(getItemId(item))} value={String(getItemId(item))}>{getItemName(item)}</option>
                        ))}
                      </select>

                      <select
                        name="district_id"
                        value={form.district_id}
                        onChange={async (e) => {
                          const districtId = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            district_id: districtId,
                            ward_id: "",
                          }));
                          setWards([]);
                          await fetchWards(districtId);
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={!form.province_id || addressLoading}
                      >
                        <option value="">Quận/Huyện</option>
                        {districts.map((item) => (
                          <option key={String(getItemId(item))} value={String(getItemId(item))}>{getItemName(item)}</option>
                        ))}
                      </select>

                      <select
                        name="ward_id"
                        value={form.ward_id}
                        onChange={(e) => setForm((prev) => ({ ...prev, ward_id: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={!form.district_id || addressLoading}
                      >
                        <option value="">Phường/Xã</option>
                        {wards.map((item) => (
                          <option key={String(getItemId(item))} value={String(getItemId(item))}>{getItemName(item)}</option>
                        ))}
                      </select>
                    </div>

                    {initialForm.address ? (
                      <p className="text-xs text-gray-500">Địa chỉ hiện tại: <span className="font-medium text-gray-700">{initialForm.address}</span></p>
                    ) : null}

                  </div>
                </div>

                {/* Date of Birth Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ngày Sinh
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setForm(initialForm)}
                    disabled={isSaving || !isDirty}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <IoMdClose className="text-lg" />
                    Hoàn Tác
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || !isDirty}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <IoMdCheckmark className="text-lg" />
                    {isSaving ? "Đang Lưu..." : "Lưu Thay Đổi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileUser;
