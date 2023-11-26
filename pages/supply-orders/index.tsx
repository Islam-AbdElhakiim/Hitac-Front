import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import Search from "@/components/Search";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MdModeEdit, MdOutlineAdd } from "react-icons/md";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbArrowsSort, TbTextDirectionLtr } from "react-icons/tb";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import MyModal from "@/components/MyModal";
import Link from "next/link";
import {
  deleteSupplyOrderById,
  getAllSupplyOrders,
} from "@/http/supplyOrderHttp";
import { supplyOrderType } from "@/types";
import { IoArrowForward } from "react-icons/io5";

export const getServerSideProps = async ({ locale }: any) => {
  const data = await getAllSupplyOrders();
  return {
    props: {
      orders: data,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default function SupplyOrders({ orders }: any) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });
  console.log(orders);

  const user = useSelector((state: any) => state.authReducer);
  const { isLoading } = useSelector((state: any) => state.loaderReducer);

  // const [allEmployees, setAllEmployees] = useState<EmployeeType[]>(employees);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageRows, setPageRows] = useState(orders?.slice());

  const [selectedRow, setSelectedRow] = useState(new Array());

  // modal
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalBody, setModalBody] = useState<string>();
  const [modalTrue, setModalTrue] = useState<() => void>(() => {});

  useEffect(() => {
    dispatch(HIDE_LOADER());
  }, []);

  //#region dispatch employees to the store
  // if (supply-orders && supply-orders?.length > 0) {
  //   dispatch(GETALLACCOUNTS({ supply-orders }));
  // }
  //#endregion

  //#region pagination
  let startingIndex = currentPage == 1 ? 0 : (currentPage - 1) * 10;
  const handlePrevPagination = () => {
    if (currentPage > 1) setCurrentPage((prev: number) => prev - 1);
  };
  const handleNextPagination = () => {
    if (10 * currentPage < orders?.length)
      setCurrentPage((prev: number) => prev + 1);
  };
  //#endregion

  //#region handle selecting employee Account
  const handleClick = (res: any) => {
    if (!selectedRow.includes(res._id)) {
      setSelectedRow([...selectedRow, res._id]);
    } else {
      setSelectedRow(selectedRow.filter((prod) => prod != res._id));
    }
  };
  //selecting all emplyee
  const selectAll = () => {
    setSelectedRow(orders.map((res: any) => res._id));
    if (selectedRow?.length == orders?.length) {
      setSelectedRow([]);
    }
  };
  //#endregion

  //#region handle interna search method
  const handleSearch = (value: string) => {
    // console.log(value)
    if (value) {
      setPageRows(
        pageRows.filter((res: { name: string }) => res.name.startsWith(value))
      );
    } else {
      setPageRows(orders?.slice());
    }
  };
  //#endregion

  //#region handleDelete
  const handleDelete = async () => {
    const deletesupplyOrders = async () => {
      dispatch(SHOW_LOADER());
      try {
        selectedRow
          .filter((id) => id != user._id)
          .forEach(async (_id) => {
            await deleteSupplyOrderById(_id);
          });
        setPageRows((prev: supplyOrderType[]) =>
          prev.filter((res) => !selectedRow.includes(res._id))
        );
      } catch (e) {
        console.log("error in deleting station", e);
      } finally {
        dispatch(HIDE_LOADER());

        setSelectedRow([]);
      }
    };

    setModalTitle("Are you sure?");
    setModalBody(
      "Deleteing the selected account/s will ERASE THEM FOREVER from the database! "
    );
    setModalTrue(() => deletesupplyOrders);
    setIsOpen(true);
    //#endregion
  };
  const navigate = (id: any) => {
    router.push(`/supply-orders/${id}`);
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col justify-center items-center px-5 h-full ">
          <PageHeader
            pageTitle="pages.supply-orders"
            newUrl={`supply-orders/new`}
          />

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
                  href={"/supply-orders/new"}
                />
                <Button
                  icon={
                    <span
                      className={` text-2xl transition ${
                        selectedRow.length != 1
                          ? " text-darkGray group-hover:!text-darkGray pointer-events-none"
                          : "text-mainBlue group-hover:!text-white pointer-events-auto"
                      } `}
                    >
                      <MdModeEdit />
                    </span>
                  }
                  title="Update"
                  classes={`${
                    selectedRow.length != 1
                      ? " !bg-bgGray hover:!bg-bgGray pointer-events-none "
                      : "!bg-lightGray hover:!bg-mainBlue hover:text-white pointer-events-auto"
                  }  group `}
                  isDisabled={selectedRow.length != 1}
                  handleOnClick={() =>
                    router.push(`supply-orders/${selectedRow[0]}?isEdit=true`)
                  }
                />
                <Button
                  icon={
                    <span
                      className={` text-2xl transition ${
                        selectedRow.length < 1
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
                    selectedRow.length < 1
                      ? " !bg-bgGray hover:!bg-bgGray pointer-events-none"
                      : "!bg-lightGray hover:!bg-red-500 hover:text-white pointer-events-auto"
                  }  group `}
                  isDisabled={selectedRow.length < 1}
                  handleOnClick={handleDelete}
                />
              </div>
            </div>

            {/* Table */}
            <div className=" main-table w-full h-[80%] overflow-auto">
              <table className={` w-full`}>
                <thead className=" bg-bgGray ">
                  <tr className="  text-left ">
                    <th className="">
                      <input
                        type="checkbox"
                        className=" cursor-pointer"
                        checked={selectedRow?.length == orders?.length}
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
                      <span>Case</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Price</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Product</span>
                    </th>

                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Supplier</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Date</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Specifications</span>
                    </th>
                    <th className="">
                      <span className="  text-darkGray text-[26px]">
                        <PiDotsThreeCircleLight />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="main-table overflow-auto">
                  {pageRows
                    ?.filter((order: supplyOrderType) => !order.isDeleted)
                    .map((order: supplyOrderType, index: number) => {
                      if (index >= startingIndex && index < currentPage * 10) {
                        return (
                          <tr key={order._id} className=" text-left h-full">
                            <td
                              className="check"
                              onClick={() => handleClick(order)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedRow.includes(order._id)}
                                readOnly
                              />
                            </td>
                            <td>{order._id}</td>
                            <td>{`${order.salesOrder}`}</td>

                            <td>{`${order.price}`}</td>
                            <td>{`${order.products?.name}`}</td>
                            <td>{`${order.supplier.firstName} ${order.supplier.lastName}`}</td>
                            <td>{`${order.createdOn}`}</td>
                            <td>{order.description}</td>
                            <td>
                              <Link href={`/supply-orders/${order._id}`}>
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
                  {currentPage * 10 > pageRows?.length
                    ? pageRows?.length
                    : currentPage * 10}{" "}
                  of {pageRows?.length} entries
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
