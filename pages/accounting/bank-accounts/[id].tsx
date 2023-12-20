import Button from "@/components/Button";
import MyModal from "@/components/MyModal";
import { bankAccountType } from "@/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbArrowsSort } from "react-icons/tb";
import { SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getAllSegments } from "@/http/segmentsHttp";
import { getAllProducts } from "@/http/productsHttp";
import { getSupplierById } from "@/http/supplierHttp";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
export const getServerSideProps = async (context: any) => {
  const id = context.params.id;

  const supplierFetch = async () => {
    return await getSupplierById(id);
  };

  const [details] = await Promise.all([supplierFetch()]);

  return {
    props: {
      details,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};

const BankAccount = ({ details }: { details: any }) => {
  // State
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProfile, setIsProfile] = useState<boolean>(true);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalBody, setModalBody] = useState<string>();
  const [ifTrue, setIfTrue] = useState<() => void>(() => {});

  // Hooks
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { isLoading } = useSelector((state: any) => state.loaderReducer);

  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  // useEffect for routing in edit mode
  useEffect(() => {
    setIsEdit(searchParams.get("isEdit") !== "true");
  }, [searchParams]);

  // Form validation
  const validationSchema: any = Yup.object().shape({
    bankName: Yup.string().required("Required"),
    holder: Yup.string().required("Required"),
    account: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    available: Yup.string().required("Required"),
  });

  // Formik initial values
  const initialValues = {
    id: details?._id || "",
    bankName: details?.bankName || "",
    holder: details?.holder || "",
    account: details?.account || "",
    address: details?.address || "",
    available: details?.available || "",
  };
  // Formik setup
  const formik = useFormik<bankAccountType>({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setModalTitle(`Are you sure?`);
      setModalBody(
        `Are you sure you want to Save all the updates ${details.bankName}`
      );
      setIfTrue(() => save);
      setIsOpen(true);
    },
  });

  const deleteAccount = (name: string, _id: any) => {
    setModalTitle(`Are you sure?`);
    setModalBody(
      `Are you sure you want to delete ${name} from Hitac database?`
    );
    setIsOpen(true);
    setIfTrue(() => () => deleteAcc(name, _id));
  };

  const deleteAcc = async (name: string, _id: any) => {
    dispatch(SHOW_LOADER());
    try {
      // Delete account logic
    } catch (e) {
      // Handle error
    } finally {
      // Cleanup
    }
  };

  // Save function
  const save = async () => {
    dispatch(SHOW_LOADER());
    try {
      // Save logic
    } catch (e) {
      // Handle error
    } finally {
      // Cleanup
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-start mt-5  bg-white rounded-xl shadow-md px-5 gap-3">
          {/* header- wrapper */}

          <div className="flex flex-col justify-center items-center w-full border-b-[1px] py-3 relative">
            {/* Control */}
            <Link
              href="/accounting/bank-accounts"
              className="absolute top-5 left-5 text-3xl text-mainBlue"
            >
              <IoMdArrowRoundBack />
            </Link>
            <h2 className=" font-light text-3xl my-4">{`${details?.bankName}`}</h2>
            <h2 className=" font-light text-3xl my-4">{`${details?.account}`}</h2>

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
                  handleOnClick={() =>
                    deleteAccount(details?.bankName, details?._id)
                  }
                />
              </div>
            </div>

            {/* Page tabs */}
            <div className="flex flex-row gap-3 justify-center items-center">
              <div
                className={`w-[150px] h-[50px] cursor-pointer transition rounded-lg ${
                  isProfile
                    ? "bg-mainBlue text-white"
                    : "bg-lightGray text-black"
                } shadow-md flex justify-center items-center text-xl font-light capitalize `}
                onClick={() => setIsProfile(true)}
              >
                Information
              </div>
              <div
                className={`w-[150px] h-[50px] cursor-pointer transition rounded-lg ${
                  !isProfile
                    ? "bg-mainBlue text-white"
                    : "bg-lightGray text-black"
                } shadow-md flex justify-center items-center text-xl font-light capitalize `}
                onClick={() => setIsProfile(false)}
              >
                Transactions
              </div>
            </div>
          </div>

          {/* personal-data-section */}
          {isProfile && (
            <>
              <div className="flex flex-col items-start justify-start w-full p-5 gap-3 border rounded-xl mt-2">
                {/* title */}
                <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
                  <h2>Email Information</h2>
                </div>

                {/* data-form */}
                <form
                  className="flex flex-col justify-start items-center w-full gap-10 py-5 text-darkGray"
                  onSubmit={formik.handleSubmit}
                  autoComplete="off"
                >
                  <div className="grid grid-cols-2 w-full text-darkGray gap-5">
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="bankName">
                        Bank Name<span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="bankName"
                        id="bankName"
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2  ${
                          formik.touched.bankName && formik.errors.bankName
                            ? "border-red-500 outline-red-500"
                            : "border-lightGray outline-lightGray"
                        } ${!isEdit ? "bg-white " : "bg-lightGray"} `}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.bankName}
                        disabled={isEdit}
                      />
                      {formik.touched.bankName && formik.errors.bankName && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.bankName}
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="holder">
                        Holder<span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="holder"
                        id="holder"
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                          formik.touched.holder && formik.errors.holder
                            ? "border-red-500 outline-red-500"
                            : "border-lightGray outline-lightGray"
                        } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.holder}
                        disabled={isEdit}
                      />
                      {formik.touched.holder && formik.errors.holder && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.holder}
                        </small>
                      )}
                    </div>

                    <div className="flex flex-col w-full gap-3 relative">
                      <label className="text-lg h-12" htmlFor="account">
                        Account<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="account"
                        id="account"
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                          formik.touched.account && formik.errors.account
                            ? "border-red-500 outline-red-500"
                            : "border-lightGray outline-lightGray"
                        } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
                        disabled={isEdit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.account}
                      />
                      {formik.touched.account && formik.errors.account && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.account}
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col w-full gap-3 relative">
                      <label className="text-lg h-12" htmlFor="address">
                        Address<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                          formik.touched.address && formik.errors.address
                            ? "border-red-500 outline-red-500"
                            : "border-lightGray outline-lightGray"
                        } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
                        disabled={isEdit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                      />
                      {formik.touched.address && formik.errors.address && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.address}
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col w-full gap-3 relative">
                      <label className="text-lg h-12" htmlFor="available">
                        Available<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="available"
                        id="available"
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                          formik.touched.available && formik.errors.available
                            ? "border-red-500 outline-red-500"
                            : "border-lightGray outline-lightGray"
                        } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
                        disabled={isEdit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.available}
                      />
                      {formik.touched.available && formik.errors.available && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.available}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* edit */}
                  {isEdit && (
                    <div
                      className={`flex justify-center items-center p-5 w-full`}
                    >
                      <Button
                        title="Update"
                        handleOnClick={(e) => {
                          e.stopPropagation();
                          setIsEdit(!isEdit);
                        }}
                        icon={
                          <span className="text-3xl">
                            <MdModeEdit />
                          </span>
                        }
                        classes="px-5 py-2 bg-lightGray text-mainBlue text-xl hover:bg-mainBlue hover:text-white transition"
                      />
                    </div>
                  )}

                  {/* Submit */}
                  {!isEdit && (
                    <div
                      className={`flex justify-center items-center p-5 w-full `}
                    >
                      <Button
                        title="Save"
                        type="submit"
                        icon={
                          <span className="text-3xl">
                            <AiOutlineSave />
                          </span>
                        }
                        classes="px-5 py-2 bg-mainOrange text-white text-xl hover:bg-mainOrange"
                      />
                    </div>
                  )}
                </form>
              </div>
            </>
          )}

          {/* Account History */}
          {!isProfile && (
            <>
              <div className="flex flex-col items-start justify-start w-full p-5 gap-3 border rounded-xl mt-2">
                {/* title */}
                <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
                  <h2>Account History</h2>
                </div>

                <div className="flex flex-col justify-start items-center w-full gap-10 py-5 text-darkGray">
                  <div className="grid grid-cols-1 w-full text-darkGray gap-5">
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

export default BankAccount;
