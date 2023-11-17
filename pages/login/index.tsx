import Logo from "@/components/Logo";
import { endpoints } from "@/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillCheckCircle, AiFillEye, AiFillEyeInvisible, AiOutlineExclamationCircle } from "react-icons/ai";
import { BiShowAlt } from "react-icons/bi";
import { GETALL } from "@/redux/modules/employees-slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { LOGIN } from "@/redux/modules/auth-slice";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import { CreateAuthDto } from "@/types";
import Loader from "@/components/Loader";

const Login = () => {
    const [isVisible, setIiVisible] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: any) => state.loaderReducer);

    const handleSubmit = async (e: any) => {
        // setLoader(true);
        dispatch(SHOW_LOADER())
        e.preventDefault();
        const formData = new FormData(e.target);
        // data
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberme = formData.get('rememberme');
        // console.log(email, password, rememberme)

        // Start fetching
        try {
            const response = await fetch(endpoints.login, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({ email, password, rememberme })
            });
            console.log("res", response);

            if (response.ok) {
                //dispatch the user to the store
                let user = await response.json();
                dispatch(LOGIN({ user }));
                router.push('/employees');
                // dispatch(HIDE_LOADER());
            } else {
                setIsError(true);
                dispatch(HIDE_LOADER());
                console.log("in else error");
            }

        } catch (e) {
            console.log("error", e)
            setIsError(true);
            dispatch(HIDE_LOADER());

        }

    }
    // console.log(someValue)
    const validateEmail = (e: any) => {
        const pattern: RegExp = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/;
        const value: string = e.target.value;
        setIsEmailValid(pattern.test(value));
    }
    return (
        <>

            {isLoading ? (<Loader />) : (


                <div className="w-screen h-screen bg-no-repeat bg-cover relative">

                    <Image src={"/login.png"} fill alt="login image" priority objectFit="cover" objectPosition="top" />

                    <div className=" w-screen h-screen bg-[rgba(0,0,0,0.4)] absolute">
                        {/* Slogan */}
                        <h2 className="flex flex-col absolute bottom-[14%] left-[10%] font-bold text-white text-[45px] capitalize border-l-8 border-mainOrange p-5">
                            <span>It is all about making the best outcome</span>
                            <span>form the same resources</span>
                        </h2>

                        {/* login wrapper */}
                        <div className="flex flex-col justify-start items-start rounded-3xl bg-bgGray h-[630px] w-[600px] absolute right-[5%] top-[20%] shadow-xl p-14">
                            {/* Logo */}
                            <div className=" ">
                                <Logo classes="w-[120px] h-[120px]" />
                            </div>

                            {/* form */}
                            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col items-start justify-center mt-5 w-full">
                                <h2 className="font-semibold text-[30px]">Welcome Back!</h2>
                                <small className="text-mdGray font-light text-[16px] tracking-wider">Enter your credentials to login  ito administrator area.</small>
                                <small className={`text-red-500 ${isError ? 'block' : 'hidden'}`}>Credentials seems to be invalid</small>
                                <div className="flex flex-col mt-10 w-full gap-3">
                                    <div className="flex flex-col w-full gap-3">
                                        <label className="text-lg text-mdGray" htmlFor="email">Email</label>
                                        <div className="relative">
                                            <input onChange={(e) => validateEmail(e)} type="text" name="email" id="email" className="w-full h-12 rounded-md outline-lightGray border border-lightGray shadow-sm relative  px-2 " />
                                            <span className={` ${isEmailValid ? 'block' : 'hidden'} absolute top-1/2 right-4 -translate-y-1/2 text-green-500 text-2xl`}>
                                                < AiFillCheckCircle />
                                            </span>

                                            <span className={` ${!isEmailValid ? 'block' : 'hidden'} absolute top-1/2 right-4 -translate-y-1/2 text-green-500 text-2xl`}>
                                                < AiOutlineExclamationCircle />
                                            </span>
                                        </div>
                                    </div>

                                    {/* password */}
                                    <div className="flex flex-col w-full gap-3">
                                        <label className="text-lg text-mdGray" htmlFor="password">Password</label>
                                        <div className="relative">
                                            <input autoComplete="off" type={`${isVisible ? 'text' : 'password'}`} name="password" id="password" className="w-full h-12 rounded-md outline-lightGray border border-lightGray shadow-sm relative  px-2 " />
                                            <span className="absolute top-1/2 right-5 -translate-y-1/2 text-gray-500 text-2xl cursor-pointer"
                                                onMouseUp={() => setIiVisible(false)} onMouseDown={() => setIiVisible(true)}>
                                                <span className={`${isVisible ? 'hidden' : 'block'}`}>
                                                    < AiFillEyeInvisible />
                                                </span>

                                                <span className={`${isVisible ? 'block' : 'hidden'}`}>
                                                    < AiFillEye />
                                                </span>

                                            </span>
                                        </div>
                                    </div>

                                    {/* control */}
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex gap-3 ">

                                            <input type="checkbox" name="rememberme" value="true" id="rememberme" />
                                            <label htmlFor="rememberme">Remember Me?</label>
                                        </div>
                                    </div>

                                    {/* submit */}
                                    <input type="submit" value="Login" disabled={!isEmailValid} className={` w-full bg-mainBlue rounded-xl text-white p-4 mt-5 ${!isEmailValid ? '!bg-lightGray' : 'bg-mainBlue '} `} />

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

export default Login;