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
import { Account, EmployeeType, stationType, supplierType } from "@/types";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import MyModal from "@/components/MyModal";
import Link from "next/link";
import { getRequest } from "@/http/requests";
import { deleteUserById, getAllEmployees } from "@/http/employeeHttp";
import { deleteAccountById, getAllAccounts } from "@/http/accountsHttp";
import { GETALLACCOUNTS } from "@/redux/modules/accounts-slice";
import { deleteSupplierById, getAllSuppliers } from "@/http/supplierHttp";
import { deleteStationById, getAllStations } from "@/http/stationsHttp";
import { IoArrowForward } from "react-icons/io5";

export const getServerSideProps = async ({ locale }: any) => {
  const data = await getAllStations();
  return {
    props: {
      stations: data,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default function Stations({ stations }: any) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const user = useSelector((state: any) => state.authReducer);
  const { isLoading } = useSelector((state: any) => state.loaderReducer);

  // const [allEmployees, setAllEmployees] = useState<EmployeeType[]>(employees);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageStations, setPageStations] = useState(stations?.slice());

  const [selectedStations, setSelectedStations] = useState(new Array());

  // modal
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalBody, setModalBody] = useState<string>();
  const [modalTrue, setModalTrue] = useState<() => void>(() => { });

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
    if (10 * currentPage < stations?.length)
      setCurrentPage((prev: number) => prev + 1);
  };
  //#endregion

  //#region handle selecting employee Account
  const handleClick = (stat: any) => {
    if (!selectedStations.includes(stat._id)) {
      setSelectedStations([...selectedStations, stat._id]);
    } else {
      setSelectedStations(
        selectedStations.filter((station) => station != stat._id)
      );
    }
  };
  //selecting all emplyee
  const selectAll = () => {
    setSelectedStations(stations.map((acc: any) => acc._id));
    if (selectedStations?.length == stations?.length) {
      setSelectedStations([]);
    }
  };
  //#endregion

  //#region handle interna search method
  const handleSearch = (value: string) => {
    // console.log(value)
    if (value) {
      setPageStations(
        pageStations.filter((stat: { name: string }) =>
          stat.name.startsWith(value)
        )
      );
    } else {
      setPageStations(stations?.slice());
    }
  };
  //#endregion

  //#region handleDelete
  const handleDelete = async () => {
    const deleteStations = async () => {
      dispatch(SHOW_LOADER());
      try {
        selectedStations
          .filter((id) => id != user._id)
          .forEach(async (_id) => {
            await deleteStationById(_id);
          });
        setPageStations((prev: stationType[]) =>
          prev.filter((acc) => !selectedStations.includes(acc._id))
        );
      } catch (e) {
        console.log("error in deleting station", e);
      } finally {
        dispatch(HIDE_LOADER());

        setSelectedStations([]);
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
          <PageHeader pageTitle="pages.station" newUrl={`stations/new`} />

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
                  href={"/stations/new"}
                />
                <Button
                  icon={
                    <span
                      className={` text-2xl transition ${selectedStations.length != 1
                        ? " text-darkGray group-hover:!text-darkGray pointer-events-none"
                        : "text-mainBlue group-hover:!text-white pointer-events-auto"
                        } `}
                    >
                      <MdModeEdit />
                    </span>
                  }
                  title="Update"
                  classes={`${selectedStations.length != 1
                    ? " !bg-bgGray hover:!bg-bgGray pointer-events-none "
                    : "!bg-lightGray hover:!bg-mainBlue hover:text-white pointer-events-auto"
                    }  group `}
                  isDisabled={selectedStations.length != 1}
                  handleOnClick={() =>
                    router.push(`stations/${selectedStations[0]}?isEdit=true`)
                  }
                />
                <Button
                  icon={
                    <span
                      className={` text-2xl transition ${selectedStations.length < 1
                        ? " text-darkGray group-hover:!text-darkGray pointer-events-none"
                        : "!text-[#E70C0C] group-hover:!text-white pointer-events-auto"
                        } `}
                    >
                      {" "}
                      <RiDeleteBin6Line />
                    </span>
                  }
                  title="Delete"
                  classes={`${selectedStations.length < 1
                    ? " !bg-bgGray hover:!bg-bgGray pointer-events-none"
                    : "!bg-lightGray hover:!bg-red-500 hover:text-white pointer-events-auto"
                    }  group `}
                  isDisabled={selectedStations.length < 1}
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
                        checked={selectedStations?.length == stations?.length}
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
                      <span>Name</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Location</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Debt</span>
                    </th>

                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Notes</span>
                    </th>

                    <th className="">
                      <span className="  text-darkGray text-[26px]">
                        <PiDotsThreeCircleLight />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="main-table overflow-auto">
                  {pageStations
                    ?.filter((station: stationType) => !station.isDeleted)
                    .map((station: stationType, index: number) => {
                      if (index >= startingIndex && index < currentPage * 10) {
                        return (
                          <tr key={station._id} className=" text-left h-full">
                            <td
                              className="check"
                              onClick={() => handleClick(station)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedStations.includes(station._id)}
                                readOnly
                              />
                            </td>
                            <td>{station._id}</td>
                            <td>{`${station.englishName}`}</td>

                            <td>{`${station.countries[0]}, ${station.address}`}</td>
                            <td>{station?.type || '-'}</td>
                            <td>{station.notes || '-'}</td>

                            <td>
                              <Link href={`/stations/${station._id}`}>
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
                  {currentPage * 10 > pageStations?.length
                    ? pageStations?.length
                    : currentPage * 10}{" "}
                  of {pageStations?.length} entries
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
