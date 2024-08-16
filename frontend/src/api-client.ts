import {SignInInput, SignUpInput} from '@priyans34/medium-common'

const url = import.meta.env.VITE_BACKEND_URL

export const signup = async (formData: SignUpInput) => {
        try {
                const response = await fetch(`${url}/api/v1/user/signup`, {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formData)
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
                        body: JSON.stringify(formData)
                });
                const res = await response.json();
                return res;
        } catch (error) {
                console.error(error);
        }
}

export const fetchBlogs = async (pg: any) => {
        console.log(pg);
        const res = await fetch(`${url}/api/v1/blog/allblogs?${pg}`, {
                method: "GET",
        });
        const data = await res.json();
        console.log(data);
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
        console.log(data);
        return data;
}