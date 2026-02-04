import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import AuthButton from '@/components/ui/AuthButton';
import { axiosClient } from '@/utils/axiosClient';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get("/categories");
        if (response.data && Array.isArray(response.data.items)) {
          const categoryNames = response.data.items.map((category) => category.name);
          setCategories(categoryNames);
        } else {
          throw new Error("Không có dữ liệu danh mục");
        }
      } catch (error) {
        console.error("Error:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const validationSchema = yup.object({
    name: yup.string().required("Tên sản phẩm là bắt buộc").max(150, "Tên sản phẩm không được vượt quá 150 ký tự"),
    category_id: yup.string().required("Danh mục là bắt buộc"),
    image_url: yup.string().url("Phải là một URL hợp lệ").required("URL hình ảnh là bắt buộc"),
    price: yup.number().required("Giá là bắt buộc").min(0, "Giá không được âm"),
    stock: yup.number().default(0).min(0, "Số lượng không được âm"),
  });

  const initialValues = {
    name: '',
    category_id: '',
    image_url: '',
    price: '',
    stock: 0,
  };

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      const response = await axiosClient.post("/products/add", values, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      });
      const data = await response.data;
      toast.success(data.msg);
      helpers.resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.detail || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="py-10 rounded px-4 bg-gradient-to-b from-sky-300 to-sky-200">
        <h3 className="text-3xl font-semibold">Thêm sản phẩm</h3>

        <Formik
          onSubmit={onSubmitHandler}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({ values }) => (
            <Form className='py-10'>
              <div className="mb-3">
                <label> Tên sản phẩm
                  <Field type="text" className="w-full py-2 px-3 rounded bg-white border border-gray-200 outline-none" placeholder='Nhập tên sản phẩm' name='name' />
                  <ErrorMessage className='text-red-500' name='name' component={'p'} />
                </label>
              </div>

              <div className="mb-3">
                <label> Danh mục
                  <Field as="select" className="w-full py-2 px-3 rounded bg-white border border-gray-200 outline-none" name='category_id'>
                    <option value="">Chọn danh mục</option>
                    {Array.isArray(categories) && categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Field>
                  <ErrorMessage className='text-red-500' name='category_id' component={'p'} />
                </label>
              </div>

              <div className="mb-3">
                <label> URL hình ảnh
                  <Field type="text" className="w-full py-2 px-3 rounded bg-white border border-gray-200 outline-none" placeholder='Nhập URL hình ảnh' name='image_url' />
                  <ErrorMessage className='text-red-500' name='image_url' component={'p'} />
                </label>
              </div>

              <div className="mb-3">
                <label> Giá (VND)
                  <Field
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    type="text" className="w-full py-2 px-3 rounded bg-white border border-gray-200 outline-none" placeholder='Nhập giá sản phẩm' name='price' />
                  <ErrorMessage className='text-red-500' name='price' component={'p'} />
                </label>
              </div>

              <div className="mb-3">
                <label> Số lượng
                  <Field
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    type="text" className="w-full py-2 px-3 rounded bg-white border border-gray-200 outline-none" placeholder='Nhập số lượng' name='stock' />
                  <ErrorMessage className='text-red-500' name='stock' component={'p'} />
                </label>
              </div>

              <div className="mb-3">
                <AuthButton isLoading={loading} text={'Thêm sản phẩm'} />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddProduct;