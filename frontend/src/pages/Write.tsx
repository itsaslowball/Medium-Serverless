import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import * as api from '../api-client';
import { useNavigate } from 'react-router-dom';

export const Write = () => {
        const [title, setTitle] = useState('');
        const [content, setContent] = useState('');
        const [error, setError] = useState('');

        const queryClient = useQueryClient()
        const navigate = useNavigate();;

        const mutation = useMutation({
                mutationFn: api.writeBlog,
                onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ['myBlogs'] });
                        queryClient.invalidateQueries({ queryKey: ['allBlogs1'] });
                        navigate('/myblogs');
                },
        })


        const handleSubmit = (e: React.FormEvent, action:"Draft" | "Publish") => {
                e.preventDefault();

                if (!title || !content) {
                        setError('Please fill in both the title and content.');
                        return;
                }

                let blogData = {
                        title,
                        content,
                        published: action === "Publish"? true: false
                };

                mutation.mutate(blogData);

                setTitle('');
                setContent('');
                setError('');
        };

        return (
                <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
                        <h1 className="text-2xl font-bold mb-6">Write a New Blog</h1>

                        {error && <div className="mb-4 text-red-500">{error}</div>}

                        <form >
                                <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                                Title
                                        </label>
                                        <input
                                                id="title"
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                placeholder="Enter blog title"
                                        />
                                </div>

                                <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                                                Content
                                        </label>
                                        <textarea
                                                id="content"
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                rows={15}
                                                placeholder="Write your blog content here..."
                                        ></textarea>
                                </div>
                                <div className='flex flex-row justify-end gap-5'>
                                        <button
                                                type="submit"
                                                className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                                                onClick={(e) => handleSubmit(e, 'Draft')}
                                        >
                                                Save to Draft
                                        </button>

                                        <button
                                                type="submit"
                                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                                onClick={(e) => handleSubmit(e, 'Publish')}
                                        >
                                                Publish
                                        </button>
                                </div>

                        </form>
                </div>
        );
};
