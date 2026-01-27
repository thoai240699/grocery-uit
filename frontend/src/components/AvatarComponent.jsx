import { useAuthContext } from '@/context/AuthContext';
import { axiosClient } from '@/utils/axiosClient';
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CgSpinner } from 'react-icons/cg';
import { FaCameraRetro } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import { toast } from 'react-toastify';
import avatar from '@/assets/avatar.png'

const AvatarComponent = () => {
    const { user, fetchUserProfile } = useAuthContext()
    const [loading, setLoading] = useState(false)
    
    const avatarUrl = user?.avatar_image_uri
        ? user.avatar_image_uri + '?t=' + Date.now()
        : avatar;
    
    const onDrop = useCallback(async (acceptedFiles) => {

        if (acceptedFiles && acceptedFiles.length > 0) {

            try {
                setLoading(true)
                const formData = new FormData();
                formData.append("avatar", acceptedFiles[0])

                const response = await axiosClient.put("/auth/update-avatar", formData, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    }
                })
                const data = await response.data
                await fetchUserProfile()
                toast.success(data.msg)
            } catch (error) {
                toast.error(error?.response?.data?.detail || error.message)
            } finally {
                setLoading(false)
            }

        }


        // Do something with the files

    }, [fetchUserProfile])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
        }
    })
    return (
        <>
            <div {...getRootProps()} className='w-[200px] relative h-[200px] border border-gray-200 rounded-full p-1 mx-auto flex justify-center items-center'>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <>
                            <div className="flex items-center flex-col gap-y-2 ">
                                <FiUploadCloud className='text-2xl' />
                                <p>Cập nhật hình</p>
                            </div>
                        </> :
                        <>

                            {
                                loading ? <>
                                    <CgSpinner className='text-4xl animate-spin' />
                                </> :
                                    <img src={avatarUrl} className='w-full h-full rounded-full' alt="avatar" />
                            }

                        </>
                }
                <button type='button' className='p-2 text-xl rounded-full bg-blue-600 absolute -right-2 bottom-10  text-white'>
                    <FaCameraRetro />
                </button>
            </div>
        </>
    )
}

export default AvatarComponent