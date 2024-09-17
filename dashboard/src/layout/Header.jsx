import { FaList } from "react-icons/fa";
import { useSelector } from "react-redux";

const Header = ({ showSidebar, setShowSidebar }) => {
    const { userInfo } = useSelector((state) => state.auth);

    return (
        <div className="fixed top-0 left-0 w-full py-5 px-2 lg:px-7 z-40">
            <div className="ml-0 lg:ml-[260px] rounded-md h-[65px] flex justify-between items-center bg-primary px-5 transition-all">
                <div
                    className="w-[35px]  flex lg:hidden h-[35px] rounded-sm shadow-lg bg-[#e09f3e] hover:shadow-indigo-500/50 justify-center items-center cursor-pointer"
                    onClick={() => setShowSidebar(!showSidebar)}
                >
                    <span>
                        <FaList />
                    </span>
                </div>

                <div className="hidden md:block ">
                    <input
                        className="px-5 py-2 outline-none border bg-transparent border-slate-700 rounded-md text-[#cdcae9] focus:border-indigo-300 overflow-hidden"
                        type="text"
                        name="search"
                        placeholder="Search..."
                        id=""
                    />
                </div>

                <div className="flex justify-center items-center gap-8 relative">
                    <div className="flex justify-center items-center">
                        <div className="flex justify-center items-center gap-3">
                            <div className="flex flex-col text-white flex-col-text-end">
                                <h2 className="text-md font-bold">
                                    {userInfo.name}
                                </h2>
                                <span className="text-[1.4rem] text-end w-full font-semibold">
                                    {userInfo.role}
                                </span>
                            </div>
                            {userInfo.role === "admin" ? (
                                <img
                                    className="w-[45px] h-[45px] rounded-full overflow-hidden"
                                    src="http://localhost:3000/images/admin.jpg"
                                    alt=""
                                />
                            ) : (
                                <img
                                    className="w-[45px] h-[45px] rounded-full overflow-hidden"
                                    src={userInfo.image}
                                    alt=""
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
