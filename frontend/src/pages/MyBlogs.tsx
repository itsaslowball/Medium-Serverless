import { useState } from "react";
import { Published } from "../components/Published";
import { Draft } from "../components/Draft";
import * as api from "../api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


interface UpdateBlogParams {
        id: string;
        data: { published: boolean };
}

export const MyBlogs = () => {
        const [tab, setTab] = useState<'published' | 'draft'>('published');
        const queryClient = useQueryClient()
        const { data, isLoading, isError, refetch } = useQuery({
                queryKey: ["myBlogs"],
                queryFn: api.fetchMyBlogs,
                staleTime: 60000,
        });

        const mutation = useMutation<any, Error, UpdateBlogParams>({
                mutationFn: ({ id, data }) => api.updateBlog(id, data),
                onSuccess: () => {
                        refetch(); 
                        queryClient.invalidateQueries({ queryKey: ['allBlogs1'] });
                },
        });

        const handlePublish = (id: string) => {
                mutation.mutate({ id, data: { published: true } });
        };

        if (isLoading) return <div>Loading...</div>;
        if (isError) return <div>Error loading blogs.</div>;

        const publishedBlogs = data?.blogs.filter((blog:any) => blog.published) || [];
        const draftBlogs = data?.blogs.filter((blog: any) => !blog.published) || [];
        


        return (
                <div className="w-full max-w-3xl mx-auto p-4">
                        {/* Tab Buttons */}
                        <div className="flex justify-center gap-8 mb-6">
                                <button
                                        onClick={() => setTab('published')}
                                        className={`px-4 py-2 font-semibold rounded-lg transition-colors duration-300 ${tab === 'published'
                                                        ? 'bg-blue-500 text-white shadow-lg'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                >
                                        Published
                                </button>
                                <button
                                        onClick={() => setTab('draft')}
                                        className={`px-4 py-2 font-semibold rounded-lg transition-colors duration-300 ${tab === 'draft'
                                                        ? 'bg-blue-500 text-white shadow-lg'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                >
                                        Draft
                                </button>
                        </div>

                        {/* Tab Content */}
                        <div>
                                {tab === 'published' ? (
                                        <Published blogs={publishedBlogs} />
                                ) : (
                                        <Draft blogs={draftBlogs} handlePublish={handlePublish} />
                                )}
                        </div>
                </div>
        );
};
