import React from 'react';
import { axiosClient } from '@/utils/axiosClient';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const initialValues = {
    name: '',
    description: '',
};

const validationSchema = Yup.object({
    name: Yup.string().required('Tên danh mục là bắt buộc').max(100, 'Tên không được vượt quá 100 ký tự'),
    description: Yup.string(),
});

const onSubmitHandler = async (values, { resetForm }) => {
    try {
        await axiosClient.post('/categories/add', values, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
        resetForm();
    } catch (error) {
        console.error('Lỗi khi thêm danh mục:', error);
    }
};

function AddProductCategories() {
    return (
        <div className="py-8 rounded bg-gradient-to-b from-sky-300 to-sky-100">
            <h3 className="text-2xl font-semibold text-center">Thêm danh mục</h3>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmitHandler}
            >
                {() => (
                    <Form className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Tên danh mục</label>
                            <Field type="text" name="name" className="w-full p-2 border border-gray-300 rounded" placeholder="Nhập tên danh mục" />
                            <ErrorMessage name="name" component="p" className="text-red-500 mt-1" />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Mô tả</label>
                            <Field as="textarea" name="description" className="w-full p-2 border border-gray-300 rounded" placeholder="Nhập mô tả danh mục" />
                            <ErrorMessage name="description" component="p" className="text-red-500 mt-1" />
                        </div>

                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Thêm danh mục</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default AddProductCategories;