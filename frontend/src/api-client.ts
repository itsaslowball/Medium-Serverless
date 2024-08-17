import {SignInInput, SignUpInput} from '@priyans34/medium-common'

const url = import.meta.env.VITE_BACKEND_URL

export type UpdateBlogType = {
        title?: string;
        content?: string;
        published?: boolean;
}

export const signup = async (formData: SignUpInput) => {
        try {
                const response = await fetch(`${url}/api/v1/user/signup`, {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formData),
                        credentials: 'include',
                });
                const res = await response.json();
                return res;
        } catch (error) {
                console.error(error);
        }
}

export const signin = async (formData: SignInInput) => {
        try {
                const response = await fetch(`${url}/api/v1/user/signin`, {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formData),
                        credentials: 'include'
                });
                const res = await response.json();
                return res;
        } catch (error) {
                console.error(error);
        }
}

export const logout = async () => {
        try {
                const response = await fetch(`${url}/api/v1/user/signout`, {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json"
                        },
                        credentials: 'include'
                });
                const res = await response.json();
                return res;
        } catch (error) {
                throw new Error("Failed to logout");
        }
}

export const fetchBlogs = async (pg: any) => {
        const res = await fetch(`${url}/api/v1/blog/allblogs?pg=${pg}`, {
                method: "GET",
        });
        const data = await res.json();
        return data;
}

export const fetchBlogById = async (id: string) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${url}/api/v1/blog/${id}`, {
                method: "GET",
                headers: {
                        authorization: `Bearer ${token}`
                }
        });
        const data = await res.json();
        return data;
}

export const fetchMyBlogs = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${url}/api/v1/blog/myblogs`, {
                method: "GET",
                headers: {
                        authorization: `Bearer ${token}`
                }
        });
        const data = await res.json();
        return data;
}

export const updateBlog = async (id: string, data: any) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${url}/api/v1/blog/${id}`, {
                method: "PUT",
                headers: {
                        "Content-Type": "application/json", 
                        authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
        });

        if (!res.ok) {
                throw new Error("Failed to update blog"); 
        }

        const result = await res.json();
        return result;
};
