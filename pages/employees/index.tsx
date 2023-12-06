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
import { GETALL } from "@/redux/modules/employees-slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { EmployeeType } from "@/types";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import MyModal from "@/components/MyModal";
import Link from "next/link";
import { getRequest } from "@/http/requests";
import { deleteUserById, getAllEmployees } from "@/http/employeeHttp";
import { IoArrowForward } from "react-icons/io5";

export const getServerSideProps = async ({ locale }: any) => {
  const response = await fetch("http://127.0.0.1:3002/employees");
  const data = await response.json();
  return {
    props: {
      employees: data,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default function Employees({ employees }: any) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const user = useSelector((state: any) => state.authReducer);
  const { isLoading } = useSelector((state: any) => state.loaderReducer);

  // const [allEmployees, setAllEmployees] = useState<EmployeeType[]>(employees);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageEmployees, setPageEmployees] = useState(employees.slice());
  const [selectedEmployees, setSelectedEmployees] = useState(new Array());

  // modal
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalBody, setModalBody] = useState<string>();
  const [modalTrue, setModalTrue] = useState<() => void>(() => { });

  useEffect(() => {
    dispatch(HIDE_LOADER());
  }, []);

  //#region dispatch employees to the store
  if (employees && employees.length > 0) {
    dispatch(GETALL({ employees }));
  }
  //#endregion

  //#region pagination
  let startingIndex = currentPage == 1 ? 0 : (currentPage - 1) * 10;
  const handlePrevPagination = () => {
    if (currentPage > 1) setCurrentPage((prev: number) => prev - 1);
  };
  const handleNextPagination = () => {
    if (10 * currentPage < employees.length)
      setCurrentPage((prev: number) => prev + 1);
  };
  //#endregion

  //#region handle selecting employee
  const handleClick = (emp: any) => {
    if (!selectedEmployees.includes(emp._id)) {
      setSelectedEmployees([...selectedEmployees, emp._id]);
    } else {
      setSelectedEmployees(
        selectedEmployees.filter((employee) => employee != emp._id)
      );
    }
  };
  //selecting all emplyee
  const selectAll = () => {
    setSelectedEmployees(employees.map((emp: any) => emp._id));
    if (selectedEmployees.length == employees.length) {
      setSelectedEmployees([]);
    }
  };
  //#endregion

  //#region handle interna search method
  const handleSearch = (value: string) => {
    // console.log(value)
    if (value) {
      setPageEmployees(
        pageEmployees.filter((emp: { firstName: string }) =>
          emp.firstName.startsWith(value)
        )
      );
    } else {
      setPageEmployees(employees.slice());
    }
  };
  //#endregion

  //#region handleDelete
  const handleDelete = async () => {
    const deleteUsers = async () => {
      dispatch(SHOW_LOADER());
      try {
        selectedEmployees
          .filter((id) => id != user._id)
          .forEach(async (_id) => {
            await deleteUserById(_id);
          });
        setPageEmployees((prev: EmployeeType[]) =>
          prev.filter((emp) => !selectedEmployees.includes(emp._id))
        );
      } catch (e) {
        console.log("error in deleting user", e);
      } finally {
        dispatch(HIDE_LOADER());
      }
    };

    setModalTitle("Are you sure?");
    setModalBody(
      "Deleteing the selected employee/s will ERASE THEM FOREVER from the database! "
    );
    setModalTrue(() => deleteUsers);
    setIsOpen(true);
    //#endregion
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center px-5 h-[92%]">
          <PageHeader pageTitle="pages.emp" newUrl={`employees/new`} />
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
                  href={"/employees/new"}
                />
                <Button
                  icon={
                    <span
                      className={` text-2xl transition ${selectedEmployees.length != 1
                        ? " text-darkGray group-hover:!text-darkGray pointer-events-none"
                        : "text-mainBlue group-hover:!text-white pointer-events-auto"
                        } `}
                    >
                      <MdModeEdit />
                    </span>
                  }
                  title="Update"
                  classes={`${selectedEmployees.length != 1
                    ? " !bg-bgGray hover:!bg-bgGray pointer-events-none "
                    : "!bg-lightGray hover:!bg-mainBlue hover:text-white pointer-events-auto"
                    }  group `}
                  isDisabled={selectedEmployees.length != 1}
                  handleOnClick={() =>
                    router.push(`employees/${selectedEmployees[0]}?isEdit=true`)
                  }
                />
                <Button
                  icon={
                    <span
                      className={` text-2xl transition ${selectedEmployees.length < 1
                        ? " text-darkGray group-hover:!text-darkGray pointer-events-none"
                        : "!text-[#E70C0C] group-hover:!text-white pointer-events-auto"
                        } `}
                    >
                      {" "}
                      <RiDeleteBin6Line />
                    </span>
                  }
                  title="Delete"
                  classes={`${selectedEmployees.length < 1
                    ? " !bg-bgGray hover:!bg-bgGray pointer-events-none"
                    : "!bg-lightGray hover:!bg-red-500 hover:text-white pointer-events-auto"
                    }  group `}
                  isDisabled={selectedEmployees.length < 1}
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
                        checked={selectedEmployees.length == employees.length}
                        onClick={() => selectAll()}
                        readOnly
                      />
                    </th>

                    <th className="" >
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
                      <span>Role</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Email</span>
                    </th>
                    <th className="">
                      <span className="  text-darkGray text-[26px]">
                        <PiDotsThreeCircleLight />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="main-table overflow-auto">
                  {pageEmployees
                    .filter(
                      (emp: EmployeeType) =>
                        !emp.isDeleted && emp._id != user._id
                    )
                    .map((emp: EmployeeType, index: number) => {
                      if (index >= startingIndex && index < currentPage * 10) {
                        return (
                          <tr key={emp._id} className=" text-left h-full">
                            <td
                              className="check"
                              onClick={() => handleClick(emp)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedEmployees.includes(emp._id)}
                                readOnly
                              />
                            </td>
                            <td title={emp._id}>{emp._id}</td>
                            <td >
                              <div className="flex justify-center items-center gap-3">
                                <div className="image-wrapper w-16 h-16 overflow-hidden rounded-full relative border bg-darkGray">
                                  <Image
                                    src={`${emp.image
                                      ? emp.image
                                      : "/uploads/avatar.png"
                                      }`}
                                    fill
                                    alt="user image"
                                  />
                                </div>
                                <div className=" w-1/2">
                                  <p className="text-xl text-darkGray max-w-full">
                                    {emp.firstName}
                                  </p>
                                  <p className="text-sm text-lightGray">
                                    {emp.lastName}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td title={emp.role}>{emp.role}</td>
                            <td title={emp.email}>{emp.email}</td>

                            <td>
                              <Link href={`/employees/${emp._id}`}>
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
                  {currentPage * 10 > pageEmployees.length
                    ? pageEmployees.length - 1
                    : currentPage * 10}{" "}
                  of {pageEmployees.length - 1} entries
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
