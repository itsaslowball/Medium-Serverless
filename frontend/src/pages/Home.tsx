import * as api from '../api-client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Home = () => {
        const [page, setPage] = useState(1);

        const { data, isLoading, isError } = useQuery({
                queryKey: [`allBlogs${page}`, page],
                queryFn: () => api.fetchBlogs(page),
                staleTime: 60000
        });

        const handleNextPage = () => {
                setPage(prevPage => prevPage + 1);
        };

        const handlePreviousPage = () => {
                setPage(prevPage => Math.max(prevPage - 1, 1));
        };

        const navigate = useNavigate();
        const handleClick = (id: string) => {
                navigate(`/blog/${id}`, {
                        state: { from: location.pathname },
                })
        }

        if (isError) {
                return <div className="text-red-500 text-center mt-10">Something went wrong</div>;
        }


        const blogData = data?.blogs || [];
        const totalPages = data?.pagination.totalPage || 1;

        return (
                <div className="container mx-auto px-4 py-8">
                        {isLoading ? (
                                <div className="text-center text-gray-600">Loading...</div>
                        ) : (
                                <div className="space-y-8">
                                        {blogData.map((blog: any) => (
                                                <div key={blog.id} className="p-6 border rounded-lg shadow-md bg-white">
                                                        <div
                                                                onClick={() => handleClick(blog.id)}
                                                                key={blog.id}
                                                                style={{ cursor: 'pointer' }}

                                                        >
                                                                <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                                                                <p className="text-gray-500 text-sm mb-4">Written On: {new Date(blog.createdAt).toLocaleDateString()}</p>
                                                                <p className="text-gray-700">{blog.content}</p>
                                                                <hr className="my-4 border-gray-200" />
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        )}

                        <div className="flex justify-between mt-8">
                                <button
                                        onClick={handlePreviousPage}
                                        disabled={page === 1}
                                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                                >
                                        Previous
                                </button>
                                <span className="self-center">Page {page} of {totalPages}</span>
                                <button
                                        onClick={handleNextPage}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                                >
                                        Next
                                </button>
                        </div>
                </div>
        );
};
