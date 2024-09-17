import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { admin_login, messageClear } from "../../store/Reducers/authReducer";
import { PropagateLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { overrideStyle } from "../../utils/utils";

const AdminLogin = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { loader, errorMessage, successMessage } = useSelector(
        (state) => state.auth
    );

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

    const submit = (e) => {
        e.preventDefault();
        dispatch(admin_login(state));
        // console.log(state);
    };

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate("/");
        }
    }, [errorMessage, successMessage]);

    return (
        <div className="min-w-screen min-h-screen bg-[#edede9]">
            <div className="relative bg-primary h-[60vh] rounded-custom ">
                <h1 className="flex pt-[50px] justify-center font-roboto-slab text-[5rem] font-bold text-white">
                    TAGO. ADMIN
                </h1>
                <div className="absolute top-[210px] -translate-x-1/2 left-1/2 p-12 rounded-2xl bg-white inline-block w-[500px]">
                    <span className="flex justify-center text-[2rem] font-bold mb-8">
                        Login
                    </span>
                    <form onSubmit={submit}>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                onChange={inputHandle}
                                value={state.email}
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                className="border-black border-none border-b-2"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                onChange={inputHandle}
                                value={state.password}
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                className="border-black border-none border-b-2"
                            />
                        </div>

                        <button
                            disabled={loader ? true : false}
                            type="submit"
                            className="mt-14 bg-primary w-[100%] text-white font-semibold p-3"
                        >
                            {loader ? (
                                <PropagateLoader
                                    color="#fff"
                                    cssOverride={overrideStyle}
                                />
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
