import { useFormik } from "formik";
import * as Yup from "yup";

import React from "react";
import {
  confirmationSalesType,
  intialSalesType,
  supplySalesType,
  transportingSalesType,
} from "@/types";
import Button from "@/components/Button";
import { MdDelete, MdOutlineAdd } from "react-icons/md";
import SelectField from "@/components/ReactSelect/SelectField";
import { useTranslation } from "react-i18next";
import { getAllProducts } from "@/http/productsHttp";
import { getAllAccounts } from "@/http/accountsHttp";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DownloadIcon from "@/assets/icons/DownloadIcon";

import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";
import TextEdit from "@/components/TextEdit";
import Loader from "@/components/Loader";
import StepButton from "@/components/StepButton";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
export const getServerSideProps = async (context: any) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};
export default function TransportingPage({
  products,
  accounts,
}: {
  products: any;
  accounts: any;
}) {
  console.log(products, accounts);
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });
  const router = useRouter();

  const { isLoading } = useSelector((state: any) => state.loaderReducer);

  const validationSchema: any = Yup.object().shape({});

  const formik = useFormik<transportingSalesType>({
    initialValues: {
      pot: "",
      shippingName: "",
      cutOff: "",
      bookingNumber: "",
      transportingDate: "",
      arrivingDate: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission
      // dispatch(SHOW_LOADER());
      // try {
      //     await createSupplier({
      //         ...values,
      //     });
      //     router.push("/suppliers");
      // } catch (e) {
      // } finally {
      //     // dispatch(HIDE_LOADER());
      // }
    },
  });
  const arr = [
    {
      name: "Initial",
      url: "/sales/new/inital",
      active: false,
    },
    {
      name: "Confirmation",
      url: "/sales/new/confirmation",

      active: false,
    },
    {
      name: "Supply",
      url: "/sales/new/supply",

      active: false,
    },
    {
      name: "Operation",
      url: "/sales/new/transporting",

      active: true,
    },
    {
      name: "Logistics",
      url: "/sales/new/transporting",

      active: true,
    },
    {
      name: "Shipped",
      url: "/sales/new/shipping",

      active: false,
    },
    {
      name: "Succeed",
      url: "/sales/new/succeed",

      active: false,
    },
  ];
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-start my-5 p-10 bg-white rounded-xl shadow-md w-full ">
          {/* Tabs */}
          <StepButton arr={arr} />
          <div className="flex justify-between px-5 w-full py-5">
            <div
              className={`arrow arrow-back active`}
              onClick={() => {
                router.push("/sales/new/supply");
              }}
            >
              Prev
            </div>
            <div
              className={`arrow arrow-right active `}
              onClick={() => {
                router.push("/sales/new/shipping");
              }}
            >
              Next
            </div>
          </div>
          <div className="flex flex-col items-start justify-start w-full p-5 gap-3">
            {/* data-form */}
            <form
              className="flex flex-col justify-start items-center w-full gap-10 py-5 text-darkGray"
              onSubmit={formik.handleSubmit}
              autoComplete="off"
            >
              <div className="text-2xl text-darkGray border-b-[1px] w-full py-3  flex gap-3 items-center">
                <h2>Transporting Infomation</h2>
              </div>
              <div className="grid grid-cols-2 w-full text-darkGray gap-5">
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="pot">
                    POT<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={products?.map((res: any) => {
                      return { value: res._id, label: res.name };
                    })}
                    onChange={(value: any) =>
                      formik.setFieldValue(`pot`, value.value)
                    }
                    isValid={
                      formik.touched.pot && formik.errors.pot ? false : true
                    }
                    value={formik.values.pot}
                  />
                  {formik.touched.pot && formik.errors.pot && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.pot}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="shippingName">
                    Shipping Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shippingName"
                    id="shippingName"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.shippingName && formik.errors.shippingName
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.shippingName}
                  />
                  {formik.touched.shippingName &&
                    formik.errors.shippingName && (
                      <small
                        className={`text-red-500 absolute -bottom-6 left-2 `}
                      >
                        {formik.errors.shippingName}
                      </small>
                    )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="cutOff">
                    Cut Off<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="cutOff"
                    id="cutOff"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.cutOff && formik.errors.cutOff
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.cutOff}
                  />
                  {formik.touched.cutOff && formik.errors.cutOff && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.cutOff}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="bookingNumber">
                    Booking Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bookingNumber"
                    id="bookingNumber"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.bookingNumber &&
                      formik.errors.bookingNumber
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.bookingNumber}
                  />
                  {formik.touched.bookingNumber &&
                    formik.errors.bookingNumber && (
                      <small
                        className={`text-red-500 absolute -bottom-6 left-2 `}
                      >
                        {formik.errors.bookingNumber}
                      </small>
                    )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="transportingDate">
                    Transporting Date<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="transportingDate"
                    id="transportingDate"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.transportingDate &&
                      formik.errors.transportingDate
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.transportingDate}
                  />
                  {formik.touched.transportingDate &&
                    formik.errors.transportingDate && (
                      <small
                        className={`text-red-500 absolute -bottom-6 left-2 `}
                      >
                        {formik.errors.transportingDate}
                      </small>
                    )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="arrivingDate">
                    Arriving Date<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="arrivingDate"
                    id="arrivingDate"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.arrivingDate && formik.errors.arrivingDate
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.arrivingDate}
                  />
                  {formik.touched.arrivingDate &&
                    formik.errors.arrivingDate && (
                      <small
                        className={`text-red-500 absolute -bottom-6 left-2 `}
                      >
                        {formik.errors.arrivingDate}
                      </small>
                    )}
                </div>
              </div>

              <div className="text-2xl text-darkGray border-b-[1px] w-full pt-3  flex gap-3 items-center">
                <h4>Case Documents</h4>
              </div>
              {[1].map((res, index) => {
                return (
                  <div
                    className="text-lg text-darkGray border-b-[1px] w-full  flex flex-col gap-3 "
                    key={index}
                  >
                    <h2>Performa Invoice</h2>
                    <div className="text-[14px] text-[#0F8BFD] flex justify-between  bg-[#EEEEF9] py-[12px] px-[12px]">
                      <div>Performa-32165465</div>
                      <div className="flex items-center gap-3">
                        <div className="cursor-pointer">
                          <DownloadIcon />
                        </div>

                        <div className="text-red-500 transition group-hover:text-white text-4xl cursor-pointer">
                          <MdDelete />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Submit */}
              {/* <div className="flex justify-center items-center p-5 w-full">
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
                </div> */}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
