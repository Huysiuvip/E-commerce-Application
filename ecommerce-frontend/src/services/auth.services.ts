import { getAuthClient } from "@/lib/auth/auth-client";
import { AuthResponse, SignUpDto, User } from "@/types/api.type";

function mapAuthUser(u: {
    id: string,
    email: string,
    name: string,
    image ?: string | null,
    emailVerified: boolean,
    createdAt: Date,
    updatedAt: Date,
}) : User {
    return {
        id: u.id,
        email: u.email,
        name: u.name,
        image: u.image ?? undefined,
        emailVerified: u.emailVerified,
        createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
        updatedAt: u.updatedAt instanceof Date ? u.updatedAt.toISOString() : String(u.updatedAt)
    }
}

async function readSessionToken(): Promise<string> {
    const s = await getAuthClient().getSession();
    return s.data?.session?.token ?? '';
}

export const authService = {
    signUp: async (data: SignUpDto): Promise<AuthResponse> => {
        const res = await getAuthClient().signUp.email({
            email: data.email,
            password: data.password,
            name: data.name,
        })
        if(res.error) {
            throw Object.assign(
                new Error(res.error.message || "Đăng kí thất bại"), {
                    response: {data : {message: res.error.message}}
                }
            )
        }

        const raw = res.data?.user;
        if(!raw) {
            throw Object.assign(new Error('Đăng kí thất bại'), {
                response : { data : {message: "Không lấy được thông tin user"}}
            })
        }

        const user = mapAuthUser(raw)
        const token = await readSessionToken();

        return {
            success: true,
            user,
            token,
        }
    }
}