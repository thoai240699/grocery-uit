import { ENVConstants } from '@/constant/env.constants'
import axios from 'axios'


export const axiosClient =axios.create({
    baseURL: ENVConstants.VITE_APP_BACKEND_URI || 'http://127.0.0.1:8000/api/v1',
}) 