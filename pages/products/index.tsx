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
  productType,
  segmentType,
  supplierType,
} from "@/types";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import MyModal from "@/components/MyModal";
import Link from "next/link";
import { deleteSegmentsById, getAllSegments } from "@/http/segmentsHttp";
import { deleteProductsById, getAllProducts } from "@/http/productsHttp";

export const getServerSideProps = async ({ locale }: any) => {
  const data = await getAllProducts();
  return {
    props: {
      products: data,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default function Products({ products }: { products: productType[] }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const user = useSelector((state: any) => state.authReducer);
  const { isLoading } = useSelector((state: any) => state.loaderReducer);

  // const [allEmployees, setAllEmployees] = useState<EmployeeType[]>(employees);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageProducts, setPageProducts] = useState(products?.slice());

  const [selectedProducts, setSelectedProducts] = useState(new Array());

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
    if (10 * currentPage < products?.length)
      setCurrentPage((prev: number) => prev + 1);
  };
  //#endregion

  //#region handle selecting employee Account
  const handleClick = (prod: any) => {
    if (!selectedProducts.includes(prod._id)) {
      setSelectedProducts([...selectedProducts, prod._id]);
    } else {
      setSelectedProducts(
        selectedProducts.filter((product) => product != prod._id)
      );
    }
  };
  //selecting all emplyee
  const selectAll = () => {
    setSelectedProducts(products.map((prod: any) => prod._id));
    if (selectedProducts?.length == products?.length) {
      setSelectedProducts([]);
    }
  };
  //#endregion

  //#region handle interna search method
  const handleSearch = (value: string) => {
    // console.log(value)
    if (value) {
      setPageProducts(
        pageProducts.filter((prod: any) => prod.name.startsWith(value))
      );
    } else {
      setPageProducts(products?.slice());
    }
  };
  //#endregion

  //#region handleDelete
  const handleDelete = async () => {
    const deleteProducts = async () => {
      dispatch(SHOW_LOADER());
      try {
        selectedProducts
          .filter((id) => id != user._id)
          .forEach(async (_id) => {
            await deleteProductsById(_id);
          });
        setPageProducts((prev: productType[]) =>
          prev.filter((prod) => !selectedProducts.includes(prod._id))
        );
      } catch (e) {
        console.log("error in deleting station", e);
      } finally {
        dispatch(HIDE_LOADER());

        setSelectedProducts([]);
      }
    };

    setModalTitle("Are you sure?");
    setModalBody(
      "Deleteing the selected product will ERASE THEM FOREVER from the database! "
    );
    setModalTrue(() => deleteProducts);
    setIsOpen(true);
    //#endregion
  };
  const navigate = (id: any) => {
    router.push(`/products/${id}`);
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col justify-center items-center px-10 ">
          <PageHeader pageTitle="pages.products" />
          {/* Page Body */}
          <div className="flex flex-col justify-cstart enter items-center  bg-white rounded-2xl shadow-lg w-full h-[770px] px-10 ">
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
                  href={"/products/new"}
                />
                <Button
                  icon={
                    <span
                      className={` text-2xl transition ${
                        selectedProducts.length != 1
                          ? " text-darkGray group-hover:!text-darkGray"
                          : "text-mainBlue group-hover:!text-white"
                      } `}
                    >
                      <MdModeEdit />
                    </span>
                  }
                  title="Update"
                  classes={`${
                    selectedProducts.length != 1
                      ? " !bg-bgGray hover:!bg-bgGray "
                      : "!bg-lightGray hover:!bg-mainBlue hover:text-white"
                  }  group `}
                  isDisabled={selectedProducts.length != 1}
                  handleOnClick={() =>
                    router.push(`products/${selectedProducts[0]}?isEdit=true`)
                  }
                />
                <Button
                  icon={
                    <span
                      className={` text-2xl transition ${
                        selectedProducts.length < 1
                          ? " text-darkGray group-hover:!text-darkGray"
                          : "!text-[#E70C0C] group-hover:!text-white"
                      } `}
                    >
                      {" "}
                      <RiDeleteBin6Line />
                    </span>
                  }
                  title="Delete"
                  classes={`${
                    selectedProducts.length < 1
                      ? " !bg-bgGray hover:!bg-bgGray "
                      : "!bg-lightGray hover:!bg-red-500 hover:text-white"
                  }  group `}
                  isDisabled={selectedProducts.length < 1}
                  handleOnClick={handleDelete}
                />
              </div>
            </div>

            {/* Table */}
            <div className="w-full h-[80%] overflow-auto">
              <table className={` w-full`}>
                <thead className=" bg-bgGray ">
                  <tr className="  text-left ">
                    <th className="">
                      <input
                        type="checkbox"
                        className=" cursor-pointer"
                        checked={selectedProducts?.length == products?.length}
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
                      <span>Description</span>
                    </th>
                    <th className="">
                      <span className=" inline-block relative top-1 mr-1 ">
                        {" "}
                        <TbArrowsSort />{" "}
                      </span>
                      <span>Segment</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="  h-[200px] border border-green-500 overflow-auto">
                  {pageProducts
                    ?.filter((product: productType) => !product.isDeleted)
                    .map((product: productType, index: number) => {
                      if (index >= startingIndex && index < currentPage * 10) {
                        return (
                          <tr key={product._id} className=" text-left h-full">
                            <td
                              className="check"
                              onClick={() => handleClick(product)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product._id)}
                                readOnly
                              />
                            </td>
                            <td
                              className="cursor-pointer"
                              onClick={() => navigate(product._id)}
                            >
                              {product._id}
                            </td>
                            <td
                              className="cursor-pointer"
                              onClick={() => navigate(product._id)}
                            >{`${product.name}`}</td>
                            <td
                              className="cursor-pointer"
                              onClick={() => navigate(product._id)}
                            >{`${product.description}`}</td>
                            <td
                              className="cursor-pointer"
                              onClick={() => navigate(product._id)}
                            >{`${product.segment}`}</td>
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
                  {currentPage * 10 > pageProducts?.length
                    ? pageProducts?.length
                    : currentPage * 10}{" "}
                  of {pageProducts?.length} entries
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