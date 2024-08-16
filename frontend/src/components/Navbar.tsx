import { useDispatch } from "react-redux";
import { checkLogIn } from "../app/authSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const Navbar = () => {

        const dispatch = useDispatch();

        dispatch(checkLogIn());

        const isLoggedIn = useSelector((state: any) =>
                state.auth.isLoggedIn
        ); 

        console.log("isLoggedIN...",isLoggedIn);

        return (
                <div className='flex flex-row items-center min-h-16 border-b-2 border-slate-300 justify-between'>
                        <div className="text-3xl font-extrabold">Medium</div>

                        <div>
                                <ul className='flex flex-row gap-5'>
                                        {isLoggedIn &&
                                        <>
                                                <Link to=''><li>Logout</li></Link>
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
