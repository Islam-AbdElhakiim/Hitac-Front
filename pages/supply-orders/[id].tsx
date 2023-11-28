import Button from "@/components/Button";
import MyModal from "@/components/MyModal";
import Search from "@/components/Search";
import {
  departments,
  employeeBase,
  excludeProperty,
  segments,
} from "@/constants";
import {
  Account,
  CreateEmployeeDTO,
  Department,
  DepartmentTitles,
  EmployeeType,
  Segment,
  ValidationObject,
  accountType,
  accountsValidationKeys,
  accountsValidationObject,
  contactType,
  contactsValidationKeys,
  contactsValidationObject,
  stationType,
  supplierType,
  supplyOrderInitalType,
  supplyOrderType,
  validationKeys,
} from "@/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { BsCloudUpload } from "react-icons/bs";
import {
  MdModeEdit,
  MdOutlineAdd,
  MdOutlineRadioButtonUnchecked,
} from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbArrowsSort } from "react-icons/tb";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { getUserById, updateEmp } from "@/http/employeeHttp";
import {
  deleteAccountById,
  getAccountById,
  updateAccount,
} from "@/http/accountsHttp";
import { getAllSegments } from "@/http/segmentsHttp";
import { getAllProducts } from "@/http/productsHttp";
import {
  deleteSupplierById,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
} from "@/http/supplierHttp";
import countries from "@/constants/countries";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import {
  deleteStationById,
  getStationById,
  updateStation,
} from "@/http/stationsHttp";
import {
  deleteSupplyOrderById,
  getSupplyOrderById,
  updateSupplyOrder,
} from "@/http/supplyOrderHttp";
import SelectField from "@/components/ReactSelect/SelectField";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
export const getServerSideProps = async (context: any) => {
  const id = context.params.id;

  const supplyOrderFetch = async () => {
    return await getSupplyOrderById(id);
  };

  const supplierFetch = async () => {
    return await getAllSuppliers();
  };
  const productFetch = async () => {
    return await getAllProducts();
  };

  const [details, supplier, products] = await Promise.all([
    supplyOrderFetch(),
    supplierFetch(),
    productFetch(),
  ]);

  // console.log(employee, accounts)

  return {
    props: {
      details,
      supplier,
      products,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};

const SupplyOrder = ({
  details,
  supplier,
  products,
}: {
  details: any;
  supplier: any;
  products: any;
}) => {
  console.log(details);

  const searchParams = useSearchParams();
  const [isEdit, setIsEdit] = useState(false);
  const [isProfile, setIsProfile] = useState<boolean>(true);

  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const dispatch = useDispatch<AppDispatch>();
  const phoneRegex = /^(\+\d{1,2}\s?)?(\(\d{1,}\)|\d{1,})([-\s]?\d{1,})+$/;
  const countryList = Object.keys(countries);
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const router = useRouter();

  // modal
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalBody, setModalBody] = useState<string>();
  const [ifTrue, setIfTrue] = useState<() => void>(() => { });

  useEffect(() => {
    setIsEdit(searchParams.get("isEdit") === "true");
  }, [searchParams]);

  // Handle remove User

  const validationSchema: any = Yup.object().shape({
    salesOrder: Yup.string().required("Sales Order is required"),
    supplier: Yup.string().required("Supplier is required"),
    createdOn: Yup.string().required("Created On is required"),
    products: Yup.array().min(1, "Product is required"),
    price: Yup.string().required("Price is required"),
    description: Yup.string().required("Description is required"),

    // Dynamically added email fields validation
  });

  const initialValues = {
    id: details?._id || "",
    salesOrder: details?.salesOrder || "",
    supplier: details?.supplier._id || "",
    createdOn: details?.createdOn.split("T")[0] || "",
    products: [details?.products._id] || [],
    price: details?.price || "",

    description: details?.description || "",
  };

  const formik = useFormik<supplyOrderInitalType>({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission

      setModalTitle(`Are you sure?`);
      setModalBody(
        `Are you sure you want to Save all the updates ${details._id}`
      );
      setIfTrue(() => save);
      setIsOpen(true);
    },
  });
  console.log(formik.values);

  const deleteRow = (name: string, _id: any) => {
    //popup modal
    const Delete = async () => {
      dispatch(SHOW_LOADER());
      try {
        await deleteSupplyOrderById(_id);
        router.push("/supply-orders");
      } catch (e) {
      } finally {
        dispatch(HIDE_LOADER());
      }
    };
    setModalTitle(`Are you sure?`);
    setModalBody(
      `Are you sure you want to delete ${name} from Hitac database?`
    );
    setIsOpen(true);
    setIfTrue(() => Delete);
  };

  const save = async (e?: any) => {


    dispatch(SHOW_LOADER());
    try {
      await updateSupplyOrder(details._id, {
        ...formik.values,
      });
      router.push("/supply-orders");
    } catch (e) {
    } finally {
      // dispatch(HIDE_LOADER());
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-start mt-5  bg-white rounded-xl shadow-md  px-5 gap-3">
          {/* header- wrapper */}

          <div className="flex flex-col justify-center items-center w-full border-b-[1px] py-3 relative">
            <Link
              href="/supply-orders"
              className="absolute top-5 left-5 text-3xl text-mainBlue"
            >
              <IoMdArrowRoundBack />
            </Link>
            {/* Control */}
            <h2 className=" font-light text-3xl my-4">{`${details?._id}`}</h2>

            <div className="flex flex-col justify-center items-center">
              <div className="flex items-center justify-center">
                <Button
                  icon={
                    <span className="text-mainBlue text-2xl group-hover:text-white transition">
                      <MdModeEdit />
                    </span>
                  }
                  classes=" hover:bg-mainBlue group transition"
                  handleOnClick={() => setIsEdit(!isEdit)}
                />
                <Button
                  icon={
                    <span className="text-red-500 text-2xl group-hover:text-white transition">
                      <RiDeleteBin6Line />
                    </span>
                  }
                  classes="hover:bg-red-500 group transition"
                  handleOnClick={() => deleteRow(details._id, details?._id)}
                />
              </div>
            </div>
            <div className="flex flex-row gap-3 justify-center items-center">
              <div
                className={`w-[150px] h-[50px] cursor-pointer transition rounded-lg ${isProfile
                    ? "bg-mainBlue text-white"
                    : "bg-lightGray text-black"
                  } shadow-md flex justify-center items-center text-xl font-light capitalize `}
                onClick={() => setIsProfile(true)}
              >
                Order
              </div>
              <div
                className={`w-[150px] h-[50px] cursor-pointer transition rounded-lg ${!isProfile
                    ? "bg-mainBlue text-white"
                    : "bg-lightGray text-black"
                  } shadow-md flex justify-center items-center text-xl font-light capitalize `}
                onClick={() => setIsProfile(false)}
              >
                Transactions
              </div>
            </div>

            {/* username */}
          </div>

          {/* personal-data-section */}

          {isProfile && (
            <div className="flex flex-col items-start justify-start w-full p-5 gap-3">
              {/* title */}
              <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
                <h2>Order Information</h2>
              </div>

              {/* data-form */}
              <form
                className="flex flex-col justify-start items-center w-full gap-10 py-5 text-darkGray"
                onSubmit={formik.handleSubmit}
                autoComplete="off"
              >
                {/* disable autocomplete */}
                <input type="email" name="email" className="hidden" />
                <input type="password" className="hidden" />
                {/* first row */}
                <div className="grid grid-cols-2 w-full text-darkGray gap-5">
                  {/* left col */}
                  <div className="flex flex-col w-full gap-3 relative mb-2">
                    <label className="text-lg h-12" htmlFor="id">
                      Id<span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="id"
                      id="id"
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                        } ${isEdit ? "bg-white " : "bg-lightGray"}`}
                      value={formik.values.id}
                      disabled={true}
                    />
                    {formik.touched.id && formik.errors.id && (
                      <small
                        className={`text-red-500 absolute -bottom-6 left-2 `}
                      >
                        {formik.errors.id}
                      </small>
                    )}
                  </div>
                  <div className="flex flex-col w-full gap-3 relative mb-2">
                    <label className="text-lg h-12" htmlFor="salesOrder">
                      Sales Order<span className="text-red-500">*</span>
                    </label>
                    <SelectField
                      options={supplier?.map((res: any) => {
                        return {
                          value: res._id,
                          label: `${res.firstName} ${res.lastName}`,
                        };
                      })}
                      isDisabled={!isEdit}
                      value={formik.values.salesOrder}
                      onChange={(value: any) =>
                        formik.setFieldValue("salesOrder", value.value)
                      }
                      isValid={
                        formik.touched.salesOrder && formik.errors.salesOrder
                          ? false
                          : true
                      }
                    />
                    {formik.touched.salesOrder && formik.errors.salesOrder && (
                      <small
                        className={`text-red-500 absolute -bottom-6 left-2 `}
                      >
                        {formik.errors.salesOrder}
                      </small>
                    )}
                  </div>
                  <div className="flex flex-col w-full gap-3 relative mb-2">
                    <label className="text-lg h-12" htmlFor="createdOn">
                      Created On<span className="text-red-500">*</span>
                    </label>

                    <input
                      type="date"
                      name="createdOn"
                      id="createdOn"
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.createdOn && formik.errors.createdOn
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                        } ${isEdit ? "bg-white " : "bg-lightGray"}`}
                      disabled={!isEdit}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.createdOn}
                    />
                    {formik.touched.createdOn && formik.errors.createdOn && (
                      <small
                        className={`text-red-500 absolute -bottom-6 left-2 `}
                      >
                        {formik.errors.createdOn}
                      </small>
                    )}
                  </div>
                  <div className="flex flex-col w-full gap-3 relative mb-2">
                    <label className="text-lg h-12" htmlFor="supplier">
                      Supplier<span className="text-red-500">*</span>
                    </label>
                    <SelectField
                      options={supplier?.map((res: any) => {
                        return {
                          value: res._id,
                          label: `${res.firstName} ${res.lastName}`,
                        };
                      })}
                      isDisabled={!isEdit}
                      value={formik.values.supplier}
                      onChange={(value: any) =>
                        formik.setFieldValue("supplier", value.value)
                      }
                      isValid={
                        formik.touched.supplier && formik.errors.supplier
                          ? false
                          : true
                      }
                    />
                    {/* <select
                    name="supplier"
                    id="supplier"
                    className={`w-full h-12 rounded-md shadow-md  px-2 border ${
                      formik.touched.supplier && formik.errors.supplier
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.supplier}
                  >
                    <option selected disabled value={""}>
                      Select
                    </option>
                    {[].map((res: any) => {
                      return <option value={res}>{res}</option>;
                    })}
                  </select> */}
                    {formik.touched.supplier && formik.errors.supplier && (
                      <small
                        className={`text-red-500 absolute -bottom-6 left-2 `}
                      >
                        {formik.errors.supplier}
                      </small>
                    )}
                  </div>
                  <div className="flex flex-col w-full gap-3 relative mb-2">
                    <label className="text-lg h-12" htmlFor="product">
                      Product<span className="text-red-500">*</span>
                    </label>
                    <SelectField
                      options={products?.map((res: any) => {
                        return { value: res._id, label: res.name };
                      })}
                      value={formik.values.products}
                      onChange={(value: any) =>
                        formik.setFieldValue("products", value)
                      }
                      isDisabled={!isEdit}
                      isMulti={true}
                      isValid={
                        formik.touched.products && formik.errors.products
                          ? false
                          : true
                      }
                    />

                    {formik.touched.products && formik.errors.products && (
                      <small
                        className={`text-red-500 absolute -bottom-6 left-2 `}
                      >
                        {formik.errors.products}
                      </small>
                    )}
                  </div>
                  <div className="flex flex-col w-full gap-3 relative mb-2">
                    <label className="text-lg h-12" htmlFor="price">
                      Price<span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="price"
                      id="price"
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.price && formik.errors.price
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                        } ${isEdit ? "bg-white " : "bg-lightGray"}`}
                      disabled={!isEdit}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.price}
                    />
                    {formik.touched.price && formik.errors.price && (
                      <small
                        className={`text-red-500 absolute -bottom-6 left-2 `}
                      >
                        {formik.errors.price}
                      </small>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 w-full text-darkGray gap-5">
                  <div className="flex flex-col w-full gap-3 relative mb-2">
                    <label className="text-lg h-12" htmlFor="description">
                      Description<span className="text-red-500">*</span>
                    </label>

                    <textarea
                      name="description"
                      id="description"
                      rows={7}
                      disabled={!isEdit}
                      className={`w-full rounded-md border border-lightGray shadow-md  px-2 ${isEdit ? "bg-white " : "bg-lightGray"
                        }`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.description}
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.description}
                        </small>
                      )}
                  </div>
                </div>

                {/* Submit */}
                {/* Edit */}
                {!isEdit && (
                  <div
                    className={`flex justify-center items-center p-5 w-full`}
                  >
                    {/* <input type="submit" value="Create User" className="px-10 py-4 rounded-md bg-mainOrange text-white shadow-md text-center" /> */}
                    <Button
                      title="Update"
                      handleOnClick={() => setIsEdit(!isEdit)}
                      icon={
                        <span className="text-3xl">
                          <MdModeEdit />{" "}
                        </span>
                      }
                      classes="px-5 py-2 bg-lightGray text-mainBlue text-xl hover:bg-mainBlue hover:text-white transition"
                    />
                  </div>
                )}

                {/* Submit */}
                {isEdit && (
                  <div
                    className={`flex justify-center items-center p-5 w-full `}
                  >
                    {/* <input type="submit" value="Create User" className="px-10 py-4 rounded-md bg-mainOrange text-white shadow-md text-center" /> */}
                    <Button
                      title="Save"
                      type="submit"
                      icon={
                        <span className="text-3xl">
                          <AiOutlineSave />{" "}
                        </span>
                      }
                      classes="px-5 py-2 bg-mainOrange text-white text-xl hover:bg-mainOrange"
                    />
                  </div>
                )}
              </form>
            </div>
          )}
          {!isProfile && (
            <>
              <div className="flex flex-col items-start justify-start w-full p-5 gap-3 border rounded-xl mt-2">
                {/* title */}
                <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
                  <h2>Account History</h2>
                </div>

                {/* data-form */}
                <div className="flex flex-col justify-start items-center w-full gap-10 py-5 text-darkGray">
                  {/* first row */}
                  <div className="grid grid-cols-1 w-full text-darkGray gap-5">
                    {/* left col */}
                    <div className="flex flex-col w-full gap-3 relative">
                      <label className="text-lg" htmlFor="firstname">
                        Total Debt:
                      </label>

                      <div
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 flex items-center 
                         `}
                      >
                        20000 L.E
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
                  <h2>Transactions</h2>
                </div>

                {/* data-form */}
                <div className="flex flex-col justify-start items-center w-full gap-10 py-5 text-darkGray">
                  {/* Table */}
                  <div className="w-full h-[80%] overflow-auto">
                    <table className={` w-full`}>
                      <thead className=" bg-bgGray ">
                        <tr className="  text-left ">
                          <th className="">
                            <span className=" inline-block relative top-1  mr-1 ">
                              {" "}
                              <TbArrowsSort />{" "}
                            </span>
                            <span>Type</span>
                          </th>
                          <th className="">
                            <span className=" inline-block relative top-1 mr-1 ">
                              {" "}
                              <TbArrowsSort />{" "}
                            </span>
                            <span>Order</span>
                          </th>
                          <th className="">
                            <span className=" inline-block relative top-1 mr-1 ">
                              {" "}
                              <TbArrowsSort />{" "}
                            </span>
                            <span>Total Before</span>
                          </th>
                          <th className="">
                            <span className=" inline-block relative top-1 mr-1 ">
                              {" "}
                              <TbArrowsSort />{" "}
                            </span>
                            <span>Amount</span>
                          </th>

                          <th className="">
                            <span className=" inline-block relative top-1 mr-1 ">
                              {" "}
                              <TbArrowsSort />{" "}
                            </span>
                            <span>Total After</span>
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
                            <span>Notes</span>
                          </th>
                          <th className="">
                            <span className="  text-darkGray text-[26px]">
                              <PiDotsThreeCircleLight />
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="  h-[200px] border border-green-500 overflow-auto">
                        {[]
                          ?.filter((acc: any) => !acc.isDeleted)
                          .map((acc: any, index: number) => {
                            if (true) {
                              return (
                                <tr key={acc._id} className=" text-left h-full">
                                  <td
                                    className="check"
                                  // onClick={() => handleClick(acc)}
                                  >
                                    <input type="checkbox" readOnly />
                                  </td>
                                  <td>{acc._id}</td>
                                  <td>
                                    <div className="flex justify-center items-center gap-3 w-full">
                                      <div className=" w-1/2">
                                        <p className="text-xl text-darkGray  overflow-hidden max-w-full">
                                          {acc.englishName}
                                        </p>
                                      </div>
                                    </div>
                                  </td>

                                  <td>{acc.countries[0]}</td>
                                  <td>{acc.telephones}</td>
                                  <td>{acc.emails[0]}</td>
                                </tr>
                              );
                            }
                          })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {/* <div className="pagination-wrapper">
                    <div className="flex gap-5 justify-center items-center my-3">
                      <span className=" text-[#9A9A9A]  ">
                        Showing {startingIndex == 0 ? 1 : startingIndex} to{" "}
                        {currentPage * 10 > pageSuplliers?.length
                          ? pageSuplliers?.length
                          : currentPage * 10}{" "}
                        of {pageSuplliers?.length} entries
                      </span>
                      <button onClick={() => handlePrevPagination()}>
                        &lt;
                      </button>
                      <div className="pages">
                        <div className="bg-[#F0F3F5] py-1 px-4 rounded-lg">
                          {currentPage}
                        </div>
                      </div>
                      <button onClick={() => handleNextPagination()}>
                        &gt;
                      </button>
                    </div>
                  </div> */}
                </div>
              </div>
            </>
          )}

          {/* Modal */}
          <MyModal
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            title={modalTitle}
            body={modalBody}
            ifTrue={ifTrue}
          />
        </div>
      )}
    </>
  );
};

export default SupplyOrder;
