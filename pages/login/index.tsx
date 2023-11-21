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
            // const response = await fetch("https://islamabdelhakiim.xyz/employees/login", {
            const response = await fetch("http://localhost:3002/employees/login", {
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
                        <h2 className="flex flex-col absolute xl:bottom-[14%] bottom-[20%] left-[2%] xl:left-[10%] font-bold text-white text-[45px] capitalize border-l-8 border-mainOrange p-5 fs-md ">
                            <span>It is all about making the best outcome</span>
                            <span>form the same resources</span>
                        </h2>

                        {/* login wrapper */}
                        <div className="flex flex-col justify-start items-start rounded-3xl bg-bgGray absolute shadow-xl
                         xl:h-[700px] xl:w-[600px] xl:right-[5%] xl:top-[20%] xl:p-14 h-[500px] w-[400px] right-[5%] bottom-[5vh] p-6">
                            {/* Logo */}
                            <div className=" ">
                                <Logo classes="xl:w-[120px] xl:h-[120px] w-[80px] h-[80px]" textClasses=" text-[30px] xl:text-[40px]" />
                            </div>

                            {/* form */}
                            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col items-start justify-center w-full xl:mt-5 fs-md">
                                <h2 className="font-semibold  xl:text-[30px]">Welcome Back!</h2>
                                <small className="text-mdGray font-light fs-sm xl:text-[16px] tracking-wider">Enter your credentials to login  ito administrator area.</small>
                                <small className={`text-red-500 ${isError ? 'block' : 'hidden'}`}>Credentials seems to be invalid</small>
                                <div className="flex flex-col mt-4 xl:mt-10 w-full gap-3">
                                    <div className="flex flex-col w-full xl:gap-3 gap-1">
                                        <label className="xl:text-lg fs-sm  text-mdGray" htmlFor="email">Email</label>
                                        <div className="relative">
                                            <input onChange={(e) => validateEmail(e)} type="text" name="email" id="email" className="w-full h-12 rounded-md outline-lightGray border border-lightGray shadow-sm relative fs-sm  px-2 " />
                                            <span className={` ${isEmailValid ? 'block' : 'hidden'} absolute top-1/2 right-4 -translate-y-1/2 text-green-500 text-2xl`}>
                                                < AiFillCheckCircle />
                                            </span>

                                            <span className={` ${!isEmailValid ? 'block' : 'hidden'} absolute top-1/2 right-4 -translate-y-1/2 text-green-500 text-2xl`}>
                                                < AiOutlineExclamationCircle />
                                            </span>
                                        </div>
                                    </div>

                                    {/* password */}
                                    <div className="flex flex-col w-full xl:gap-3 gap-1">
                                        <label className="xl:text-lg text-mdGray fs-sm"  htmlFor="password">Password</label>
                                        <div className="relative">
                                            <input autoComplete="off" type={`${isVisible ? 'text' : 'password'}`} name="password" id="password" className="w-full h-12 rounded-md outline-lightGray fs-sm border border-lightGray shadow-sm relative  px-2 " />
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
                                    <div className="flex justify-between items-center xl:mt-2 mt-1">
                                        <div className="flex xl:gap-3 gap-1 fs-sm ">

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