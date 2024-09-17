import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { FaFacebookF } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { customer_register, messageClear } from "../store/reducers/authReducer";
import { overrideStyle } from "../utils/utils";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { successMessage, errorMessage, loader, userInfo } = useSelector(
        (state) => state.auth
    );

    const [state, setState] = useState({
        name: "",
        email: "",
        password: "",
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const register = (e) => {
        e.preventDefault();
        // console.log(state);
        dispatch(customer_register(state));
        setState({
            name: "",
            email: "",
            password: "",
        });
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (userInfo) {
            navigate("/");
        }
    }, [errorMessage, successMessage]);

    return (
        <div className='min-w-screen min-h-screen bg-[#edede9]'>
            <div className='relative bg-primary h-[60vh] rounded-custom '>
                <h1 className='flex pt-[20px] justify-center font-roboto-slab text-[2.5rem] font-bold text-white'>
                    TAGO. | Welcome new members
                </h1>
                <div className='absolute top-[90px] -translate-x-1/2 left-1/2 p-8 rounded-2xl bg-white inline-block w-[500px]'>
                    <span className='flex text-[1.5rem] font-bold'>
                        Create your account
                    </span>
                    <form onSubmit={register}>
                        <div className='form-group'>
                            <label htmlFor='name'>Name:</label>
                            <input
                                onChange={inputHandle}
                                value={state.name}
                                type='text'
                                name='name'
                                id='name'
                                placeholder='Name'
                                className='border-black border-none border-b-2'
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='email'>Email:</label>
                            <input
                                onChange={inputHandle}
                                value={state.email}
                                type='email'
                                name='email'
                                id='email'
                                placeholder='Email'
                                className='border-black border-none border-b-2'
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

                        <div className='flex mt-7 items-center w-full gap-3 mb-3'>
                            <input
                                type='checkbox'
                                name='checkbox'
                                id='checkbox'
                                className='w-5 h-5 text-blue overflow-hidden rounded border-gray-300 focus:ring-blue-500 bg-gray-100'
                            />
                            <label htmlFor='checkbox'>
                                I agree to privacy policy
                            </label>
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
                                "Register"
                            )}
                        </button>
                        <div className='flex items-center mt-5 gap-3 justify-center'>
                            <p>
                                Already have an account?{" "}
                                <Link className='font-bold' to={"/login"}>
                                    Login
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
    );
};
export default Register;
