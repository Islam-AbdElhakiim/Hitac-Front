import React, { Component, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import { LOGIN } from "@/redux/modules/auth-slice";
import { checkCookie, endpoints } from "@/constants";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import { getUserById } from "@/http/employeeHttp";

const Layout = ({
  children,
}: {
  children: React.ReactComponentElement<any>;
}) => {
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });
  const [direction, setDirection] = useState("ltr");
  const component = children.type.name;
  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: any) => state.authReducer);
  // console.log(user)
  // middleware => check if the user is logged in by session cookie

  useEffect(() => {
    if (isLoading) {
      dispatch(HIDE_LOADER());
    }

        //check if the user is logged in by session cookie
        const sessionCookie = document.cookie.includes('session');
        console.log(document.cookie.split(";"), "cookies");
        console.log("session", sessionCookie);

    if (!sessionCookie && component != "Login") {
      dispatch(SHOW_LOADER());
      setIsLocalLoading(true);
      router.push("/login");
    }

    //closing the loader
    if (component == "Login") {
      dispatch(HIDE_LOADER());
      setIsLocalLoading(false);
    }

        //check for store user data, if not exists fetch him
        //if not exists fetch it 
        if (component != "Login") {

            if (Object.keys(user).length < 1 && component != "Login") {
                let fetchUser = async () => {
                    try {
                        // setLoader(true)
                        // setIsLocalLoading(true)
                        const userSession = checkCookie('user');
                        console.log("session2", userSession);
                        if (userSession) {
                            const user = await getUserById(userSession);
                            // console.log(user)
                            if (user) {
                                dispatch(LOGIN({ user }));
                                return setIsLocalLoading(false);
                            } else {
                                throw new Error(" couldn't fetch the user at layout fetchUser method");
                            }

                        } else {
                            console.log("can't find sessin")
                            router.push('/login')
                        }
                    } catch (e) {
                        console.log(e)
                        router.push('/login')

                    } finally {
                        setIsLocalLoading(false)
                    }
                }
                fetchUser();
            } else {
                setIsLocalLoading(false);
            }
        }

    }, [])






  return (
    <div className="div">
      {isLocalLoading ? (
        <Loader />
      ) : (
        <>
          {component != "Login" ? (
            <section
              className={` w-full h-screen rounded-3xl flex justify-center items-center px-10 gap-10 bg-bgGray ${
                direction == "rtl" && "rtl-rdirection"
              }`}
            >
              <Navigation />
              <section className="flex-[4.5] rounded-2xl h-[95vh]">
                <Header />
                <main>{children}</main>
              </section>
            </section>
          ) : (
            <main>{children}</main>
          )}{" "}
        </>
      )}
    </div>
  );
};

export default Layout;
