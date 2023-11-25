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
    color: "text-purple-600",
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

const NavLink = ({ link, openMenu, opened, subMenuOpened, openSubMenu, selected, isActive, }: any) => {
  // console.log(link);
  // const pathName = useRouter().pathname.slice(1);
  // console.log(pathName)
  // console.log(link.title.toLowerCase())
  // if()

  return (
    <div
      className={`gray-wrapper flex flex-col w-full p-2 my-2 text-darkGray text-[18px] rounded-xl ${opened == link.title && " bg-linkBgGray"
        } border-b-[1px] ${isActive && "bg-mainBlue"} `}
    >
      {/* if simple link */}
      {!link.children && (
        <Link
          href={link.target ? link.target : "not"}
          className={`blue-wrapper flex w-full py-3 pl-5 gap-5 text-darkGray text-[18px] rounded-xl ${link.title == opened && " bg-mainBlue text-white "
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
          className={`blue-wrapper w-full rounded-xl pl-5 flex items-center justify-between ${link.title == "Employees" && " bg-mainBlue text-white"
            } `}
        >
          <div
            onClick={() => openMenu(link.title)}
            className=" cursor-pointer w-full flex items-center justify-between"
          >
            <div className="name-icon flex justify-center items-center gap-3 my-5 ">
              {/* first level title */}
              <i className=" text-3xl ">{link.icon && icons[link.icon].icon}</i>
              {link.title}
            </div>
            <span
              className={`${link.children ? "block" : "hidden"} ${opened == link.title ? "rotate-90" : "rotate-0"
                } transition-all`}
            >
              {" "}
              <MdKeyboardArrowRight />{" "}
            </span>
          </div>
        </div>
      )}

      <div
        className={` flex flex-col w-full gap-10 ${opened == link.title ? " block " : " hidden h-0"
          } transition-all origin-bottom`}
      >
        {link.children &&
          Object.keys(link.children).map((directChild: any) =>
            // if not dropdown
            !link.children[directChild].children ? (
              // second level title as a link
              <Link
                href={link.children[directChild].target}
                className=" pl-1 cursor-pointer"
                key={Math.random() * Math.random() + Math.random()}
              >
                <span
                  className={`mx-5 opacity-0 ${selected == link.children[directChild].title &&
                    "opacity-100 text-mainBlue"
                    }`}
                >
                  |
                </span>
                <span
                  className={` ${selected == link.children[directChild].title
                      ? "hidden"
                      : "inline"
                    }`}
                >
                  -
                </span>
                <span
                  className={`${selected == link.children[directChild].title &&
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
                      openSubMenu(link.children[directChild].title)
                    }
                  >
                    <div className="flex justify-center items-center">
                      <span
                        className={`mx-4 ${subMenuOpened == link.children[directChild].title
                            ? "text-mainBlue"
                            : "text-darkGray"
                          }`}
                      >
                        |
                      </span>
                      <span
                        className={`${subMenuOpened == link.children[directChild].title
                            ? "text-mainBlue"
                            : "text-darkGray"
                          }`}
                      >
                        {link.children[directChild].title}
                      </span>
                    </div>
                    <span
                      className={` ${subMenuOpened == link.children[directChild].title
                          ? "rotate-90"
                          : "rotate-0"
                        } transition-all`}
                    >
                      {" "}
                      <MdKeyboardArrowRight />{" "}
                    </span>
                  </div>
                  <div
                    className={`latest-menu-wrapper flex flex-col ${subMenuOpened == link.children[directChild].title
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
                              className={`mx-5 ${selected ==
                                  link.children[directChild].children[latestChild]
                                    .title
                                  ? "text-mainBlue"
                                  : "text-darkGray"
                                }`}
                            >
                              -
                            </span>
                            <span
                              className={`${selected ==
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
