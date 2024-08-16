import { useParams, useNavigate } from "react-router-dom";
import * as api from '../api-client';
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: blog, isError, isLoading } = useQuery({
    queryKey: [`blog${id}`, id],
    queryFn: () => (id ? api.fetchBlogById(id) : null),
    staleTime: 10 * 60000,
  });

  // const deleteMutation = useMutation(api.deleteBlog, {
  //   onSuccess: () => {
  //     // Invalidate the query to refetch the blog list (if applicable)
  //     queryClient.invalidateQueries('blogs');
  //     navigate('/'); // Redirect to home or another suitable page
  //   },
  // });

  const handleDelete = async () => {
    if (!id) return; // Handle case where id is undefined

    setIsDeleting(true);
    try {
      // await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting blog:", error);
      // Handle error appropriately (e.g., show an error message to the user)
    } finally {
      setIsDeleting(false);
    }
  };

  const post = blog?.post || null;

  if (isError) {
    return <div className="text-red-500 text-center mt-10">Something went wrong</div>;
  }

  return (
    <div className="px-4 py-8 space-y-8">
      {isLoading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        post && (
          <div className="p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-500 text-sm mb-4">
              Written On: {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-700">{post.content}</p>
            <hr className="my-4 border-gray-200" />


              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="border-2 border-black hover:bg-red-700 hover:border-red-700 text-black font-bold py-2 px-4 rounded"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
          </div>
        )
      )}
    </div>
  );
};