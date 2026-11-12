import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { toast } from 'sonner'

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            toast.error('Bạn cần đăng nhập đê tiếp tục')
            if (typeof window !== "undefined") {
                redirect("/auth/signin")
            }
        }
        if (error.response?.status === 403) {
            toast.error('Bạn không có quyền thao tác này')
        }
        if (!error.response) {
            toast.error('Không thể kết nối với máy chủ, vui lòng thử lại sau')
        }

        return Promise.reject(error)
    }
)

export default axiosInstance;