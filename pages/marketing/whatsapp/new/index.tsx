import Button from "@/components/Button";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MdOutlineAdd } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import countries from "@/constants/countries";
import {
  emailInitalType,
  inStockProductsInitalType,
  palletsInitalType,
  productType,
  supplyOrderInitalType,
  supplyOrderType,
  whatsappInitalType,
} from "@/types";
import { createSupplyOrder } from "@/http/supplyOrderHttp";
import Select from "react-select";
import { StylesConfig } from "react-select";
import { SelectInput } from "@/components/ReactSelect/SelectInput";
import SelectField from "@/components/ReactSelect/SelectField";
import { useEffect } from "react";
import { getAllSuppliers } from "@/http/supplierHttp";
import { getAllProducts } from "@/http/productsHttp";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { SHOW_LOADER } from "@/redux/modules/loader-slice";
import { AppDispatch } from "@/redux/store";
import { getAllEmployees } from "@/http/employeeHttp";
import { getAllStations } from "@/http/stationsHttp";
import { createPallets } from "@/http/palletsHttp";
import { red } from "@mui/material/colors";
import TextEdit from "@/components/TextEdit";
export const getServerSideProps = async (context: any) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};
const NewWhatsapp = () => {
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const user = useSelector((state: any) => state.authReducer);

  //#region initialization

  const validationSchema: any = Yup.object().shape({
    to: Yup.string().required("To is required"),
    sentDate: Yup.string().required("Sent Date is required"),
    status: Yup.string().required("Status is required"),
    agent: Yup.string().required("Agent is required"),
    template: Yup.string().required("Template is required"),
    body: Yup.string().required("Body is required"),

    // Dynamically added email fields validation
  });
  const formik = useFormik<whatsappInitalType>({
    initialValues: {
      to: "",
      sentDate: "",
      status: "",
      agent: "",
      template: "",
      body: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission

      console.log(values);

      dispatch(SHOW_LOADER());
      try {
        // await createPallets({
        //   ...values,
        // });
        router.push(`/marketing/whatsapp`);
      } catch (e) {
      } finally {
        // dispatch(HIDE_LOADER());
      }
    },
  });
  console.log(formik.values);

  //#region modules

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-start my-5 pb-10 bg-white rounded-xl shadow-md ">
          {/* personal-data-section */}
          <div className="flex flex-col items-start justify-start w-full p-5 gap-3 relative">
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
              {/* disable autocomplete */}
              <input type="email" name="email" className="hidden" />
              <input type="password" className="hidden" />
              {/* first row */}
              <div className="grid grid-cols-2 w-full text-darkGray gap-5">
                {/* left col */}

                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="to">
                    To<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="to"
                    id="to"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.to && formik.errors.to
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.to}
                  />
                  {formik.touched.to && formik.errors.to && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.to}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="template">
                    Template<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="template"
                    id="template"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.template && formik.errors.template
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.template}
                  />
                  {formik.touched.template && formik.errors.template && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.template}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="sentDate">
                    Sent Date
                  </label>

                  <input
                    type="date"
                    name="sentDate"
                    id="sentDate"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.sentDate && formik.errors.sentDate
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.sentDate}
                  />
                  {formik.touched.sentDate && formik.errors.sentDate && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.sentDate}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="status">
                    Status
                  </label>

                  <SelectField
                    options={[]?.map((res: any) => {
                      return { value: res._id, label: res.name };
                    })}
                    value={formik.values.status}
                    onChange={(value: any) =>
                      formik.setFieldValue("status", value.value)
                    }
                    isValid={
                      formik.touched.status && formik.errors.status
                        ? false
                        : true
                    }
                  />
                  {formik.touched.status && formik.errors.status && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.status}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="agent">
                    Agent
                  </label>

                  <SelectField
                    options={[]?.map((res: any) => {
                      return { value: res._id, label: res.name };
                    })}
                    value={formik.values.agent}
                    onChange={(value: any) =>
                      formik.setFieldValue("agent", value.value)
                    }
                    isValid={
                      formik.touched.agent && formik.errors.agent ? false : true
                    }
                  />
                  {formik.touched.agent && formik.errors.agent && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.agent}
                    </small>
                  )}
                </div>
                <div className="flex flex-col col-span-2 w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="agent">
                    Body
                  </label>
                  <TextEdit
                    updateContent={(content) => {
                      console.log(content, "content");
                      formik.setFieldValue("body", content);
                    }}
                    placeholder="write your message here"
                  />
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

export default NewWhatsapp;
