import { useDispatch } from "react-redux";
import { checkLogIn, logout } from "../app/authSlice";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import * as api from "../api-client";

export const Navbar = () => {

        const dispatch = useDispatch();
        const navigate = useNavigate();

        dispatch(checkLogIn());

        let isLoggedIn = useSelector((state: any) =>
                state.auth.isLoggedIn
        ); 

        const mutation = useMutation({
                mutationFn: api.logout,
                onSuccess: () => { 
                        dispatch(logout());
                        isLoggedIn = false;
                        navigate('/');
                },
                onError: (error) => {
                        console.error(error);
                }

        })

        const handleLogout = () => {
                mutation.mutate();
        };


        return (
                <div className='flex flex-row items-center min-h-16 border-b-2 border-slate-300 justify-between'>
                        <Link to='/'>
                                <div className="text-3xl font-extrabold">Medium</div>
                        </Link>

                        <div>
                                <ul className='flex flex-row gap-5'>
                                        {isLoggedIn &&
                                                <>
                                                <Link to='/myblogs'><li>My Blogs</li></Link>
                                                <button onClick={handleLogout} className="pointer" >Logout</button>
                                                <Link to='/write'><li>Write</li></Link>
                                        </>
                                        }
                                        {!isLoggedIn && <>
                                                <Link to='/signin'><li>SignIn</li></Link>
                                                <Link to='/signup'><li>SignUp</li></Link>
                                        </>}
                                </ul>
                        </div>
                </div>
        )
}
