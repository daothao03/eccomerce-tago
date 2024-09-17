import React, { useEffect, useState } from "react";

import { FaFacebookF } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { customer_login, messageClear } from "../store/reducers/authReducer";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../utils/utils";

const Login = () => {
    const dispatch = useDispatch();
    const { successMessage, errorMessage, loader, userInfo } = useSelector(
        (state) => state.auth
    );

    const navigate = useNavigate();

    const [state, setState] = useState({
        email: "",
        password: "",
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const login = (e) => {
        e.preventDefault();
        dispatch(customer_login(state));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (userInfo) {
            navigate("/");
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [errorMessage, successMessage]);

    return (
        <div>
            <div className='min-w-screen min-h-screen bg-[#edede9]'>
                <div className='relative bg-primary h-[60vh] rounded-custom '>
                    <h1 className='flex pt-[30px] justify-center font-roboto-slab text-[4.5rem] font-bold text-white'>
                        Welcome to TAGO.
                    </h1>
                    <div className='absolute top-[140px] -translate-x-1/2 left-1/2 p-12 rounded-2xl bg-white inline-block w-[500px]'>
                        <span className='flex justify-center text-[2rem] font-bold mb-8'>
                            Login
                        </span>
                        <form onSubmit={login}>
                            <div className='form-group'>
                                <label htmlFor='email'>Email:</label>
                                <input
                                    onChange={inputHandle}
                                    value={state.email}
                                    type='email'
                                    name='email'
                                    id='email'
                                    placeholder='Email'
                                    className='border-black border-none border-b-2 outline-none'
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='password'>Password:</label>
                                <input
                                    onChange={inputHandle}
                                    value={state.password}
                                    type='password'
                                    name='password'
                                    id='password'
                                    placeholder='Password'
                                    className='border-black border-none border-b-2'
                                />
                            </div>

                            <button
                                disabled={loader ? true : false}
                                type='submit'
                                className='mt-5 bg-primary w-[100%] text-white font-semibold p-3'
                            >
                                {loader ? (
                                    <PropagateLoader
                                        color='#fff'
                                        cssOverride={overrideStyle}
                                    />
                                ) : (
                                    "Login"
                                )}
                            </button>

                            <div className='flex items-center mt-5 gap-3 justify-center'>
                                <p>
                                    Don't have an account?{" "}
                                    <Link
                                        className='font-bold'
                                        to={"/register"}
                                    >
                                        Register
                                    </Link>
                                </p>
                            </div>
                            <div className='w-full flex justify-center items-center mt-3'>
                                <div className='w-[45%] bg-slate-700 h-[1px]'></div>
                                <div className='w-[10%] flex justify-center items-center '>
                                    <span className='pb-1'>Or</span>
                                </div>
                                <div className='w-[45%] bg-slate-700 h-[1px]'></div>
                            </div>
                            <div className='flex justify-center mt-5 items-center gap-3'>
                                <div className='w-[135px] h-[25px] flex rounded-md bg-orange-700 shadow-lg hover:shadow-orange-700/50 justify-center cursor-pointer items-center overflow-hidden'>
                                    <span>
                                        <FaGoogle />
                                    </span>
                                </div>
                                <div className='w-[135px] h-[25px] flex rounded-md bg-blue-700 shadow-lg hover:shadow-blue-700/50 justify-center cursor-pointer items-center overflow-hidden'>
                                    <span>
                                        <FaFacebookF />
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
};
export default Login;
