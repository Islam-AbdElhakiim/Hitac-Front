import Button from "@/components/Button";
import { bankAccountType } from "@/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MdOutlineAdd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

import { useFormik } from "formik";
import * as Yup from "yup";

export const getServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

const NewBank = () => {
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  // Hooks
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: any) => state.loaderReducer);

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
    id: "",
    bankName: "",
    holder: "",
    account: "",
    address: "",
    available: "",
  };

  // Formik setup
  const formik = useFormik<bankAccountType>({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission

      dispatch(SHOW_LOADER());
      try {
        // Save logic
      } catch (e) {
        // Handle error
      } finally {
        // Cleanup
      }
    },
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-start my-5 pb-10 bg-white rounded-xl shadow-md ">
          {/* personal-data-section */}
          <div className="flex flex-col items-start justify-start w-full p-5 gap-3">
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
                    }} `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.bankName}
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
                    Holder Name<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="holder"
                    id="holder"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.holder && formik.errors.holder
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.holder}
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
                    } `}
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
                    } `}
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
                    type="date"
                    name="available"
                    id="available"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.available && formik.errors.available
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
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

              {/* Submit */}
              <div className="flex justify-center items-center p-5 w-full">
                <Button
                  type="submit"
                  title="Create"
                  icon={
                    <span className="text-3xl">
                      <MdOutlineAdd />{" "}
                    </span>
                  }
                  classes="px-10 py-4 bg-mainOrange text-white text-xl hover:bg-mainOrange"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewBank;
