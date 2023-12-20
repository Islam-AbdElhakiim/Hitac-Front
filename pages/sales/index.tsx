import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import Search from "@/components/Search";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MdModeEdit, MdOutlineAdd } from "react-icons/md";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbArrowsSort, TbTextDirectionLtr } from "react-icons/tb";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  Account,
  EmployeeType,
  salesType,
  segmentType,
  supplierType,
} from "@/types";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import MyModal from "@/components/MyModal";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";

export const getServerSideProps = async ({ locale }: any) => {
  const data = await [
    {
      _id: "qqq",
      account: { englishName: "qqq" },
      origin: "aa",
      port: "ss",
      segment: { englishName: "qqq" },
      createdOn: "12-12-2022",
      status: "Initial",
    },
  ];
  return {
    props: {
      sales: data,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
const statusColor: any = {
  Initial: {
    bgColor: "#E3FFDC",
    textColor: "#489B33",
  },
  Station: {
    bgColor: "#FFEFB4",
    textColor: "#C8A424",
  },
  Packing: {
    bgColor: "#CF5C5C",
    textColor: "#FFFFFF",
  },
  Pending: {
    bgColor: "#F59BD7",
    textColor: "#8E3047",
  },
  Logistics: {
    bgColor: "#DCBBF5",
    textColor: "#8E3047",
  },
  Performa: {
    bgColor: "#ACFFFF",
    textColor: "#515B61",
  },
  Swift: {
    bgColor: "#FFEFB4",
    textColor: "#515B61",
  },
  Success: {
    bgColor: "#33EE7E",
    textColor: "#515B61",
  },
};
export default function SalesCases({ sales }: { sales: salesType[] }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const user = useSelector((state: any) => state.authReducer);
  const { isLoading } = useSelector((state: any) => state.loaderReducer);

  // const [allEmployees, setAllEmployees] = useState<EmployeeType[]>(employees);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesales, setPagesales] = useState(sales?.slice());

  const [selectedsales, setSelectedsales] = useState(new Array());

  // modal
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalBody, setModalBody] = useState<string>();
  const [modalTrue, setModalTrue] = useState<() => void>(() => {});

  useEffect(() => {
    dispatch(HIDE_LOADER());
  }, []);

  //#region dispatch employees to the store
  // if (stations && stations?.length > 0) {
  //   dispatch(GETALLACCOUNTS({ stations }));
  // }
  //#endregion

  //#region pagination
  let startingIndex = currentPage == 1 ? 0 : (currentPage - 1) * 10;
  const handlePrevPagination = () => {
    if (currentPage > 1) setCurrentPage((prev: number) => prev - 1);
  };
  const handleNextPagination = () => {
    if (10 * currentPage < sales?.length)
      setCurrentPage((prev: number) => prev + 1);
  };
  //#endregion

  //#region handle selecting employee Account
  const handleClick = (seg: any) => {
    if (!selectedsales.includes(seg._id)) {
      setSelectedsales([...selectedsales, seg._id]);
    } else {
      setSelectedsales(selectedsales.filter((segment) => segment != seg._id));
    }
  };
  //selecting all emplyee
  const selectAll = () => {
    setSelectedsales(sales.map((seg: any) => seg._id));
    if (selectedsales?.length == sales?.length) {
      setSelectedsales([]);
    }
  };
  //#endregion

  //#region handle interna search method
  const handleSearch = (value: string) => {
    // console.log(value)
    if (value) {
      setPagesales(pagesales.filter((seg: any) => seg.name.startsWith(value)));
    } else {
      setPagesales(sales?.slice());
    }
  };
  //#endregion

  //#region handleDelete
  const handleDelete = async () => {
    const deleteStations = async () => {
      dispatch(SHOW_LOADER());
      try {
        selectedsales
          .filter((id) => id != user._id)
          .forEach(async (_id) => {
            // await deletesalesById(_id);
          });
        setPagesales((prev: salesType[]) =>
          prev.filter((seg) => !selectedsales.includes(seg._id))
        );
      } catch (e) {
        console.log("error in deleting station", e);
      } finally {
        dispatch(HIDE_LOADER());

        setSelectedsales([]);
      }
    };

    setModalTitle("Are you sure?");
    setModalBody(
      "Deleteing the selected account/s will ERASE THEM FOREVER from the database! "
    );
    setModalTrue(() => deleteStations);
    setIsOpen(true);
    //#endregion
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col justify-center items-center px-5 h-full ">
          <PageHeader pageTitle="pages.sales" newUrl={`sales/new/inital`} />

          {/* Page Body */}
          <div className="flex flex-col justify-cstart enter items-center  bg-white rounded-2xl shadow-lg w-full h-full px-10 ">
            {/* top control row */}
            <div className="flex justify-center items-center w-full  py-3">
              {/* top pagination
                    <div className="flex justify-center items-center gap-2 font-light">
                        <p>Showing</p>
                        <div className="flex p-2 rounded-lg border border-lightGray gap-2">
                            <select name="count" id="count" className="bg-transparent w-[60px] outline-none" onChange={(e) => setPerPage(+e.target.value)}>
                                <option value="3">03</option>
                                <option value="5" selected>05</option>
                                <option value="7">07</option>
                            </select>
                            {/* <BiArrowToBottom /> 
                        </div>
                        <p>entries</p>

                    </div> */}

              {/* page Control */}
              <div className="flex justify-center items-center">
                {/* Search */}
                <Search
                  classes="rounded-lg w-[180px]"
                  onSearch={handleSearch}
                />

                {/* CRUD Operations */}
                <Button
                  icon={
                    <span className="text-[#00733B] transition group-hover:text-white text-2xl">
                      <MdOutlineAdd />
                    </span>
                  }
                  title="Create"
                  classes=" hover:bg-[#00733B] group hover:text-[white] transition"
                  isLink={true}
                  href={"/sales/new/inital"}
                />
                <Button
                  icon={
                    <span
                      className={` text-2xl transition ${
                        selectedsales.length != 1
                          ? " text-darkGray group-hover:!text-darkGray pointer-events-none"
                          : "text-mainBlue group-hover:!text-white pointer-events-auto"
                      } `}
                    >
                      <MdModeEdit />
                    </span>
                  }
                  title="Update"
                  classes={`${
                    selectedsales.length != 1
                      ? " !bg-bgGray hover:!bg-bgGray pointer-events-none "
                      : "!bg-lightGray hover:!bg-mainBlue hover:text-white pointer-events-auto"
                  }  group `}
                  isDisabled={selectedsales.length != 1}
                  handleOnClick={() =>
                    router.push(`sales/${selectedsales[0]}?isEdit=true`)
                  }
                />
                <Button
                  icon={
                    <span
                      className={` text-2xl transition ${
                        selectedsales.length < 1
                          ? " text-darkGray group-hover:!text-darkGray pointer-events-none"
                          : "!text-[#E70C0C] group-hover:!text-white pointer-events-auto"
                      } `}
                    >
                      {" "}
                      <RiDeleteBin6Line />
                    </span>
                  }
                  title="Delete"
                  classes={`${
                    selectedsales.length < 1
                      ? " !bg-bgGray hover:!bg-bgGray pointer-events-none"
                      : "!bg-lightGray hover:!bg-red-500 hover:text-white pointer-events-auto"
                  }  group `}
                  isDisabled={selectedsales.length < 1}
                  handleOnClick={handleDelete}
                />
              </div>
            </div>

            {/* Table */}
            <div className="main-table w-full h-[80%] overflow-auto">
              <table className={` w-full`}>
                <thead className=" bg-bgGray ">
                  <tr className="  text-left ">
                    <th className="">
                      <input
                        type="checkbox"
                        className=" cursor-pointer"
                        checked={selectedsales?.length == sales?.length}
                        onClick={() => selectAll()}
                        readOnly
                      />
                    </th>

                    <th className="">
                      <span className=" inline-block relative top-1  mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>ID</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Account</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Origin</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Port</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Segment</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Created On</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Status</span>
                    </th>
                    <th className="">
                      <span className="  text-darkGray text-[26px]">
                        <PiDotsThreeCircleLight />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="main-table overflow-auto">
                  {pagesales
                    ?.filter((sales: salesType) => !sales.isDeleted)
                    .map((sales: salesType, index: number) => {
                      if (index >= startingIndex && index < currentPage * 10) {
                        return (
                          <tr key={sales._id} className=" text-left h-full">
                            <td
                              className="check"
                              onClick={() => handleClick(sales)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedsales.includes(sales._id)}
                                readOnly
                              />
                            </td>
                            <td className="cursor-pointer">{sales._id}</td>
                            <td className="cursor-pointer">{`${sales.account?.englishName}`}</td>
                            <td className="cursor-pointer">{`${sales.origin}`}</td>
                            <td className="cursor-pointer">{`${sales.port}`}</td>
                            <td className="cursor-pointer">
                              <div className="flex justify-center items-center p-2 bg-[#E3FFDC] rounded-full text-[#489B33]">{`${sales.segment?.englishName}`}</div>
                            </td>
                            <td className="cursor-pointer">{`${sales.createdOn}`}</td>
                            <td className="cursor-pointer">
                              <div
                                className={`flex justify-center items-center p-2 bg-[${
                                  statusColor[sales.status].bgColor
                                }] rounded-full text-[${
                                  statusColor[sales.status].textColor
                                }]`}
                              >{`${sales?.status}`}</div>
                            </td>
                            <td>
                              <Link href={`/sales/${sales._id}`}>
                                <span className=" text-[26px] text-mainBlue cursor-pointer">
                                  <IoArrowForward />
                                </span>
                              </Link>
                            </td>
                          </tr>
                        );
                      }
                    })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-wrapper">
              <div className="flex gap-5 justify-center items-center my-3">
                <span className=" text-[#9A9A9A]  ">
                  Showing {startingIndex == 0 ? 1 : startingIndex} to{" "}
                  {currentPage * 10 > pagesales?.length
                    ? pagesales?.length
                    : currentPage * 10}{" "}
                  of {pagesales?.length} entries
                </span>
                <button onClick={() => handlePrevPagination()}>&lt;</button>
                <div className="pages">
                  <div className="bg-[#F0F3F5] py-1 px-4 rounded-lg">
                    {currentPage}
                  </div>
                </div>
                <button onClick={() => handleNextPagination()}>&gt;</button>
              </div>
            </div>
          </div>
          {/* Modal */}
          <MyModal
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            title={modalTitle}
            body={modalBody}
            ifTrue={modalTrue}
          />
        </div>
      )}
    </>
  );
}
