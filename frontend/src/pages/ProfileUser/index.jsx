import AvatarComponent from "@/components/AvatarComponent";
import { useAuthContext } from "@/context/AuthContext";
import { axiosClient } from "@/utils/axiosClient";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const ProfileUser = () => {
  const { user, fetchUserProfile } = useAuthContext();
  const [isSaving, setIsSaving] = useState(false);

  const initialForm = useMemo(() => {
    const dob = user?.dob ? String(user.dob).slice(0, 10) : "";
    return {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
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
    form.address !== initialForm.address ||
    form.dob !== initialForm.dob;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token") || "";
      if (!token) throw new Error("Vui lòng đăng nhập");

      // chỉ gửi field có dữ liệu (tránh overwrite thành "")
      const payload = {};
      if (form.name.trim() && form.name.trim() !== initialForm.name) payload.name = form.name.trim();
      if (form.phone.trim() && form.phone.trim() !== initialForm.phone) payload.phone = form.phone.trim();
      if (form.address.trim() && form.address.trim() !== initialForm.address) payload.address = form.address.trim();
      if (form.dob) payload.dob = form.dob; // yyyy-mm-dd

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-emerald-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col gap-3 mb-5">
          <div>
            <h2 className="text-2xl font-semibold text-emerald-800">Thông tin người dùng</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Left: Avatar card */}
          <div>
            <div className="bg-white border border-emerald-100 shadow-sm rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Ảnh đại diện</h3>
                  <p className="text-sm text-slate-600">Nhấn vào ảnh để tải lên.</p>
                </div>
              </div>
              <div className="flex justify-center py-3">
                <AvatarComponent />
              </div>
            </div>
          </div>

          {/* Right: Form card */}
          <div>
            <div className="bg-white border border-sky-100 shadow-sm rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <h3 className="font-semibold text-sky-900">Thông tin cá nhân</h3>
                  <p className="text-sm text-sky-700">Thông tin này sẽ hiển thị trên tài khoản của bạn.</p>
                </div>
                {isDirty ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                    Có thay đổi chưa lưu
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Đã đồng bộ
                  </span>
                )}
              </div>

              <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-800 mb-1">
                    Họ tên <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full py-3 px-3 rounded-xl bg-white border border-slate-200 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Tối thiểu 3 ký tự.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-800 mb-1">Số điện thoại</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="Nhập số điện thoại..."
                    className="w-full py-3 px-3 rounded-xl bg-white border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-800 mb-1">Địa chỉ</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                    className="w-full py-3 px-3 rounded-xl bg-white border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-800 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={onChange}
                    className="w-full py-3 px-3 rounded-xl bg-white border border-slate-200 outline-none"
                  />
                </div>

                <div className="flex flex-col items-stretch justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setForm(initialForm)}
                    className="px-4 py-2 rounded-xl border border-sky-200 bg-white text-sky-800 cursor-pointer"
                    disabled={isSaving || !isDirty}
                  >
                    Hoàn tác
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || !isDirty}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white cursor-pointer"
                  >
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser