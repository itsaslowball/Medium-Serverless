import { useDispatch } from "react-redux";
import { checkLogIn, logout } from "../app/authSlice";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {

        const dispatch = useDispatch();
        const navigate = useNavigate();

        dispatch(checkLogIn());

        let isLoggedIn = useSelector((state: any) =>
                state.auth.isLoggedIn
        ); 

        const handleLogout = () => {
                dispatch(logout());
                isLoggedIn = false;
                navigate('/');
        };


        return (
                <div className='flex flex-row items-center min-h-16 border-b-2 border-slate-300 justify-between'>
                        <div className="text-3xl font-extrabold">Medium</div>

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
