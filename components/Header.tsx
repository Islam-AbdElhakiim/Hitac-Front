import Image from "next/image";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useState } from "react";
import Search from "./Search";
import Link from "next/link";
import { useSelector } from "react-redux";

const Header = () => {

    const [isNotificationOpened, setNotificationOpened] = useState(false);
    const [isProfileOpened, setIsProfileOpened] = useState(false);

    const [date, setDate] = useState(new Date());
    let dayOfWeak = date.toLocaleDateString("en-US", {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    let time = date.toLocaleTimeString("en-US", {
        hour: "2-digit", // 02
        minute: "2-digit", // 22
    });

    const user = useSelector((state: any) => state.authReducer);

    setInterval(() => {
        setDate(new Date());
    }, 60000)

    return (
        <header className="flex flex-col h-[10%] border-b mx-10">
            {/* first row => date & time */}
            <div className="flex self-end gap-3 text-darkGray text-xs">
                <span>{time}</span>
                |
                <span>{dayOfWeak}</span>
            </div>

            {/* seconde row left(hi & name) & right(search & notification) */}
            <div className="flex justify-between items-center">
                {/* left */}
                <div className="left flex flex-col items-start justify-center text-sm relative">
                    <div className="flex justify-center items-center gap-2 cursor-pointer" onClick={() => setIsProfileOpened(!isProfileOpened)}>
                        <div className="flex justify-center items-center p-3 overflow-hidden relative w-5 h-5 rounded-full bg-lightGray">
                            <Image src={`${user.image}`} alt="user-image" fill />
                        </div>
                        <span>Hi {user.firstName}</span>
                        <span className={` transition-all ${isProfileOpened && 'rotate-90'}`}> < MdKeyboardArrowRight /> </span>
                    </div>
                    <span className="text-lg font-medium">Welcome Back</span>

                    {/* profile popup box */}
                    <div className={`${!isProfileOpened && 'hidden'} absolute top-[50%] -right-[14%] flex flex-col items-start justify-center bg-lightGray border rounded-2xl px-5 w-[130px] h-[100px] after:absolute after:boder after:border-[10px] after:border-transparent after:border-b-lightGray after:right-[15px] after:-top-[18.5px] after:content shadow-md`}>
                        <Link href={'/profile'} className="text-lg font-light text-darkGray hover:text-mainBlue">Profile</Link>
                        <Link href={'/logout'} className="text-lg font-light text-darkGray hover:text-mainBlue">Logout</Link>
                    </div>
                </div>

                {/* right */}
                <div className="right flex justify-center items-center gap-3 ">
                    {/* Search */}
                    <Search placeHolder="Search everything" onSearch={() => console.log("header search")}/>
                    {/* notifications */}
                    <div className="notification-wrapper text-2xl">
                        <div className="relative">
                            <i className=" cursor-pointer" onClick={() => setNotificationOpened(!isNotificationOpened)}><IoMdNotificationsOutline /></i>
                            <span className={`w-2 h-2 bg-red-500 absolute top-0 right-0 rounded-full`}></span>

                            {/* Notification Box */}
                            <div className={`${isNotificationOpened ? 'absolute' : 'hidden'} notification-items absolute top-[180%] -right-[50%] w-[400px] h-[300px] bg-lightGray border rounded-2xl shadow-md after:absolute after:boder after:border-[10px] after:border-transparent after:border-b-lightGray after:right-[15px] after:-top-[18.5px] after:content flex flex-col justify-start items-center gap-3 py-5`}>

                                <div className="items-group  flex flex-col justify-start items-center w-full px-5 py-5 gap-3 overflow-auto">

                                    <div className="item-wrapper flex justify-between items-center text-xs cursor-pointer bg-bgGray w-full py-2 px-5 rounded-2xl">
                                        <div className="flex flex-col">
                                            <p><span className="font-bold">Mahmoud Helmy </span>created a new sales case</p>
                                            <span>{date.toLocaleDateString()}</span>
                                        </div>
                                        <span className={`w-3 h-3 rounded-full bg-mainBlue`}></span>
                                    </div>

                                    <div className="item-wrapper flex justify-between items-center text-xs cursor-pointer bg-bgGray w-full py-2 px-5 rounded-2xl">
                                        <div className="flex flex-col">
                                            <p><span className="font-bold">Mahmoud Helmy </span>created a new sales case</p>
                                            <span>{date.toLocaleDateString()}</span>
                                        </div>
                                        <span className={`w-3 h-3 rounded-full bg-mainBlue`}></span>
                                    </div>

                                    <div className="item-wrapper flex justify-between items-center text-xs cursor-pointer bg-bgGray w-full py-2 px-5 rounded-2xl">
                                        <div className="flex flex-col">
                                            <p><span className="font-bold">Mahmoud Helmy </span>created a new sales case</p>
                                            <span>{date.toLocaleDateString()}</span>
                                        </div>
                                        <span className={`w-3 h-3 rounded-full bg-mainBlue`}></span>
                                    </div>

                                    <div className="item-wrapper flex justify-between items-center text-xs cursor-pointer bg-bgGray w-full py-2 px-5 rounded-2xl">
                                        <div className="flex flex-col">
                                            <p><span className="font-bold">Mahmoud Helmy </span>created a new sales case</p>
                                            <span>{date.toLocaleDateString()}</span>
                                        </div>
                                        <span className={`w-3 h-3 rounded-full bg-mainBlue`}></span>
                                    </div>

                                    <div className="item-wrapper flex justify-between items-center text-xs cursor-pointer bg-bgGray w-full py-2 px-5 rounded-2xl">
                                        <div className="flex flex-col">
                                            <p><span className="font-bold">Mahmoud Helmy </span>created a new sales case</p>
                                            <span>{date.toLocaleDateString()}</span>
                                        </div>
                                        <span className={`w-3 h-3 rounded-full bg-mainBlue`}></span>
                                    </div>

                                    <div className="item-wrapper flex justify-between items-center text-xs cursor-pointer bg-bgGray w-full py-2 px-5 rounded-2xl">
                                        <div className="flex flex-col">
                                            <p><span className="font-bold">Mahmoud Helmy </span>created a new sales case</p>
                                            <span>{date.toLocaleDateString()}</span>
                                        </div>
                                        <span className={`w-3 h-3 rounded-full bg-mainBlue`}></span>
                                    </div>

                                    <div className="item-wrapper flex justify-between items-center text-xs cursor-pointer bg-bgGray w-full py-2 px-5 rounded-2xl">
                                        <div className="flex flex-col">
                                            <p><span className="font-bold">Mahmoud Helmy </span>created a new sales case</p>
                                            <span>{date.toLocaleDateString()}</span>
                                        </div>
                                        <span className={`w-3 h-3 rounded-full bg-mainBlue`}></span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;