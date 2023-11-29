import Link from "next/link";
import { CgOrganisation } from "react-icons/cg";
import { BiSolidContact, BiSolidPackage } from "react-icons/bi";
import { IoIosPersonAdd, IoMdContacts } from "react-icons/io";
import {
  MdAddShoppingCart,
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { RiBankLine, RiOrderPlayFill } from "react-icons/ri";
import { FaWarehouse } from "react-icons/fa";
import { FcAdvertising, FcSalesPerformance } from "react-icons/fc";
import { useState } from "react";
import { useRouter } from "next/router";
import { NavigationLink } from "@/types";

const icons: any = {
  employees: {
    icon: <IoMdContacts />,
    color: "text-mainBlue",
  },
  accounts: {
    icon: <CgOrganisation />,
    color: "text-orange-500",
  },
  contacts: {
    icon: <BiSolidContact />,
    color: "text-pink-400",
  },
  suppliers: {
    icon: <IoIosPersonAdd />,
    color: "text-yellow-300",
  },
  stations: {
    icon: <BiSolidPackage />,
    color: "text-green-300",
  },
  products: {
    icon: <BiSolidPackage />,
    color: "text-gray-400",
  },
  supply: {
    icon: <RiOrderPlayFill />,
    color: "text-amber-800",
  },
  inventory: {
    icon: <FaWarehouse />,
    color: "text-pink-500",
  },
  sales: {
    icon: <FcSalesPerformance />,
    color: "text-gray-400",
  },
  marketing: {
    icon: <FcAdvertising />,
    color: "text-amber-800",
  },
  accounting: {
    icon: <RiBankLine />,
    color: "text-teal-700",
  },

  // sales: <span>< FcSalesPerformance /> </span>,
  // marketing: <span><FcAdvertising /> </span>,
  // accounting: <span className=" text-teal-700">< RiBankLine /> </span>
};

const NavLink = ({ link, secondLevelMenuOpened, thirdLevelMenuOpened, openSecondLevelMenu, openThirdLevelMenu, pathName, isActive }: NavigationLink) => {

  return (
    <div
      className={`gray-wrapper flex flex-col w-full p-2 my-2 text-darkGray text-[18px] rounded-xl ${secondLevelMenuOpened == link.title && " bg-linkBgGray"
        } border-b-[1px] ${isActive && "bg-mainBlue"} `}
    >
      {/* if simple link */}
      {!link.children && (
        <Link
          href={link.target ? link.target : "not"}
          className={`blue-wrapper flex w-full py-3 pl-5 gap-5 text-darkGray text-[18px] rounded-xl ${link.urlTitle?.toLowerCase() == pathName && " bg-mainBlue text-white "
            }`}
        >
          <i
            className={` text-3xl ${icons[link?.icon]?.color} ${isActive && " !text-white"
              } `}
          >
            {link.icon && icons[link.icon].icon}
          </i>
          <span className={`${isActive && "text-white"} `}>{link?.title}</span>
        </Link>
      )}
      {/* if dropdown */}
      {link.children && (
        <div
          className={`blue-wrapper w-full rounded-xl pl-5 flex items-center justify-between ${secondLevelMenuOpened == `second-${link.title.toLowerCase()}` && " bg-mainBlue text-white mt-2 mb-5"
            } `}
        >
          <div
            onClick={() => openSecondLevelMenu(link.title.toLowerCase())}
            className=" cursor-pointer w-full flex items-center justify-between"
          >
            <div className="name-icon flex justify-center items-center gap-3 my-5 ">
              {/* first level title */}
              <i className=" text-3xl ">{link.icon && icons[link.icon].icon}</i>
              {link.title}
            </div>
            <span
              className={`${link.children ? "block" : "hidden"} ${secondLevelMenuOpened == `second-${link.title?.toLowerCase() }` ? "rotate-90" : "rotate-0"
                } transition-all`}
            >
              {" "}
              <MdKeyboardArrowRight />{" "}
            </span>
          </div>
        </div>
      )}

      <div
        className={` flex flex-col w-full gap-10 ${secondLevelMenuOpened == `second-${link.title?.toLowerCase()}` ? " block " : " hidden h-0"
          } transition-all origin-bottom`}
      >
        {link.children &&
          Object.keys(link.children).map((directChild: any) =>
            // if not dropdown
            !link.children[directChild].children ? (
              // second level title as a link
              <Link
                href={link.children[directChild].target}
                className={`pl-1 cursor-pointer ${pathName == link.children[directChild].urlTitle?.toLowerCase() && 'text-mainBlue'}`}
                key={Math.random() * Math.random() + Math.random()}
              >
                <span
                  className={`mx-5 opacity-0 ${pathName == link.children[directChild].title &&
                    "opacity-100 text-mainBlue"
                    }`}
                >
                  |
                </span>
                <span
                  className={` ${pathName == link.children[directChild].title
                    ? "hidden"
                    : "inline"
                    }`}
                >
                  -
                </span>
                <span
                  className={`${pathName == link.children[directChild].title &&
                    "text-mainBlue"
                    }`}
                >
                  {" "}
                  {link.children[directChild].title}
                </span>
              </Link>
            ) : (
              // if another dropdown
              <div className="2nd-level-wrapper flex flex-col">
                <div className="2nd-menu-wrapper">
                  {/* second level title as a button*/}
                  <div
                    className="flex justify-between pl-5 mt-3 items-center cursor-pointer"
                    onClick={() =>
                      openThirdLevelMenu(link.children[directChild].title.toLowerCase())
                    }
                  >
                    <div className="flex justify-center items-center">
                      <span
                          className={`mx-4 ${thirdLevelMenuOpened == link.children[directChild].title.toLowerCase()
                          ? "text-mainBlue"
                          : "text-darkGray"
                          }`}
                      >
                        |
                      </span>
                      <span
                        className={`${thirdLevelMenuOpened == link.children[directChild].title.toLowerCase()
                          ? "text-mainBlue"
                          : "text-darkGray"
                          }`}
                      >
                        {link.children[directChild].title}
                      </span>
                    </div>
                    <span
                        className={` ${thirdLevelMenuOpened == link.children[directChild].title.toLowerCase()
                        ? "rotate-90"
                        : "rotate-0"
                        } transition-all`}
                    >
                      {" "}
                      <MdKeyboardArrowRight />{" "}
                    </span>
                  </div>
                  <div
                    className={`latest-menu-wrapper flex flex-col ${thirdLevelMenuOpened == `third-${link.children[directChild].title.toLowerCase()}`
                      ? "block"
                      : "hidden"
                      }`}
                  >
                    {link.children[directChild].children &&
                      Object.keys(link.children[directChild].children).map(
                        (latestChild: any) => (
                          // third level title
                          <Link
                            key={Math.random() * Math.random() + Math.random()}
                            href={
                              link.children[directChild].children[latestChild]
                                .target
                            }
                            className="pl-6 py-3"
                          >
                            <span
                              className={`mx-5 ${pathName ==
                                link.children[directChild].children[latestChild]
                                  .title
                                ? "text-mainBlue"
                                : "text-darkGray"
                                }`}
                            >
                              -
                            </span>
                            <span
                              className={`${pathName ==
                                link.children[directChild].children[latestChild]
                                  .title
                                ? "text-mainBlue"
                                : "text-darkGray"
                                } `}
                            >
                              {
                                link.children[directChild].children[latestChild]
                                  .title
                              }
                            </span>
                          </Link>
                        )
                      )}
                  </div>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default NavLink;
