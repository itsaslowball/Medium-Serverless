import { useNavigate } from 'react-router-dom'

export const Published = ({ blogs }:any) => {
        if (!blogs || blogs.length === 0) { 
                return <div>No blogs found.</div>
        }
        const navigate = useNavigate();
        const handleClick = (id: string) => {
                navigate(`/blog/${id}`, {
                        state: { from: location.pathname },
                })
        }
        return (
                <div className="space-y-8">
                        {blogs.map((blog: any) => (
                                <div key={blog.id} className="p-6 border rounded-lg shadow-md bg-white">
                                        <div 
                                                key={blog.id}
                                                onClick={() => handleClick(blog.id)}
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
        )
}
