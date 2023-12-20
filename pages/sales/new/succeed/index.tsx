import { useFormik } from "formik";
import * as Yup from "yup";

import React from "react";
import {
  confirmationSalesType,
  intialSalesType,
  successSalesType,
} from "@/types";
import Button from "@/components/Button";
import { MdDelete, MdOutlineAdd } from "react-icons/md";
import SelectField from "@/components/ReactSelect/SelectField";
import { useTranslation } from "react-i18next";
import { getAllProducts } from "@/http/productsHttp";
import { getAllAccounts } from "@/http/accountsHttp";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DownloadIcon from "@/assets/icons/DownloadIcon";
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
export default function SucceedPage({
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
  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const router = useRouter();

  const validationSchema: any = Yup.object().shape({});

  const formik = useFormik<successSalesType>({
    initialValues: {
      finalPrice: "",
      currency: "",
      percent: "",
      deposit: "",
      paymentPlan: "",
      remaining: "",
      fulfillment: "",
      fulfillmentDate: "",
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

      active: false,
    },
    {
      name: "Logistics",
      url: "/sales/new/transporting",

      active: false,
    },
    {
      name: "Shipped",
      url: "/sales/new/shipping",

      active: false,
    },
    {
      name: "Succeed",
      url: "/sales/new/succeed",

      active: true,
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
                router.push("/sales/new/shipping");
              }}
            >
              Prev
            </div>
            <div className={`arrow arrow-right `}>Next</div>
          </div>
          <div className="flex flex-col items-start justify-start w-full p-5 gap-3">
            {/* data-form */}
            <form
              className="flex flex-col justify-start items-center w-full gap-10 py-5 text-darkGray"
              onSubmit={formik.handleSubmit}
              autoComplete="off"
            >
              <div className="text-2xl text-darkGray border-b-[1px] w-full py-3  flex gap-3 items-center">
                <h2>Payment Infomation</h2>
              </div>
              <div className="grid grid-cols-2 w-full text-darkGray gap-5">
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="finalPrice">
                    Final Price<span className="text-red-500">*</span>
                  </label>
                  <div className="flex shadow-md">
                    <input
                      type="text"
                      name="finalPrice"
                      id="finalPrice"
                      disabled={true}
                      className={`w-full h-12 rounded-md border border-r-0 rounded-r-none	 border-lightGray   px-2 ${
                        formik.touched.finalPrice && formik.errors.finalPrice
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } bg-lightGray`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.finalPrice}
                    />
                    <select
                      id="currency"
                      name="currency"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.currency}
                      disabled={true}
                      className={`w-[15%] h-12 rounded-md rounded-l-none border border-l-0  bg-lightGray	 border-lightGray   px-2 ${
                        formik.touched.currency && formik.errors.currency
                          ? "bg-red-500"
                          : "border-lightGray outline-lightGray"
                      } bg-lightGray`}
                    >
                      <option value="usd">USD</option>
                      <option value="euro">EURO</option>
                      {/* Add more currency options as needed */}
                    </select>
                  </div>
                  {formik.touched.finalPrice && formik.errors.finalPrice && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.finalPrice}
                    </small>
                  )}
                  {formik.touched.currency && formik.errors.currency && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.currency}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="percent">
                    Deposit Percentage<span className="text-red-500">*</span>
                  </label>
                  <div className="flex shadow-md">
                    <input
                      type="text"
                      name="percent"
                      id="percent"
                      disabled={true}
                      className={`w-full h-12 rounded-md border border-r-0 rounded-r-none	 border-lightGray   px-2 ${
                        formik.touched.percent && formik.errors.percent
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } bg-lightGray`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.percent}
                    />
                    <span
                      className={`w-[15%] h-12 rounded-md rounded-l-none border border-l-0  bg-lightGray	 border-lightGray   px-2
                                flex items-center justify-center
                                `}
                    >
                      %
                    </span>
                  </div>
                  {formik.touched.percent && formik.errors.percent && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.percent}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="deposit">
                    Deposit<span className="text-red-500">*</span>
                  </label>
                  <div className="flex shadow-md">
                    <input
                      type="text"
                      name="deposit"
                      id="deposit"
                      disabled={true}
                      className={`w-full h-12 rounded-md border border-r-0 rounded-r-none	 border-lightGray   px-2 ${
                        formik.touched.deposit && formik.errors.deposit
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } bg-lightGray`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.deposit}
                    />
                    <select
                      id="currency"
                      name="currency"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.currency}
                      className={`w-[15%] h-12 rounded-md rounded-l-none border border-l-0  bg-lightGray	 border-lightGray   px-2 ${
                        formik.touched.currency && formik.errors.currency
                          ? "bg-red-500"
                          : "border-lightGray outline-lightGray"
                      } bg-lightGray`}
                    >
                      <option value="usd">USD</option>
                      <option value="euro">EURO</option>
                      {/* Add more currency options as needed */}
                    </select>
                  </div>
                  {formik.touched.deposit && formik.errors.deposit && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.deposit}
                    </small>
                  )}
                  {formik.touched.currency && formik.errors.currency && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.currency}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="paymentPlan">
                    Payment Plan<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={products?.map((res: any) => {
                      return { value: res._id, label: res.name };
                    })}
                    onChange={(value: any) =>
                      formik.setFieldValue(`paymentPlan`, value.value)
                    }
                    isDisabled={true}
                    isValid={
                      formik.touched.paymentPlan && formik.errors.paymentPlan
                        ? false
                        : true
                    }
                    value={formik.values.paymentPlan}
                  />
                  {formik.touched.paymentPlan && formik.errors.paymentPlan && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.paymentPlan}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="remaining">
                    Remaining<span className="text-red-500">*</span>
                  </label>
                  <div className="flex shadow-md">
                    <input
                      type="text"
                      name="remaining"
                      id="remaining"
                      disabled={true}
                      className={`w-full h-12 rounded-md border border-r-0 rounded-r-none	 border-lightGray   px-2 ${
                        formik.touched.remaining && formik.errors.remaining
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } bg-lightGray`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.remaining}
                    />
                    <select
                      id="currency"
                      name="currency"
                      disabled={true}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.currency}
                      className={`w-[15%] h-12 rounded-md rounded-l-none border border-l-0  bg-lightGray	 border-lightGray   px-2 ${
                        formik.touched.currency && formik.errors.currency
                          ? "bg-red-500"
                          : "border-lightGray outline-lightGray"
                      } `}
                    >
                      <option value="usd">USD</option>
                      <option value="euro">EURO</option>
                      {/* Add more currency options as needed */}
                    </select>
                  </div>
                  {formik.touched.remaining && formik.errors.remaining && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.remaining}
                    </small>
                  )}
                  {formik.touched.currency && formik.errors.currency && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.currency}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="fulfillment">
                    Payment FulFilled<span className="text-red-500">*</span>
                  </label>
                  <div className="flex shadow-md">
                    <input
                      type="text"
                      name="fulfillment"
                      id="fulfillment"
                      className={`w-full h-12 rounded-md border border-r-0 rounded-r-none	 border-lightGray   px-2 ${
                        formik.touched.fulfillment && formik.errors.fulfillment
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } `}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.fulfillment}
                    />
                  </div>
                  {formik.touched.fulfillment && formik.errors.fulfillment && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.fulfillment}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="fulfillmentDate">
                    FulfillmentDate Date<span className="text-red-500">*</span>
                  </label>
                  <div className="flex shadow-md">
                    <input
                      type="text"
                      name="fulfillmentDate"
                      id="fulfillmentDate"
                      className={`w-full h-12 rounded-md border border-r-0 rounded-r-none	 border-lightGray   px-2 ${
                        formik.touched.fulfillmentDate &&
                        formik.errors.fulfillmentDate
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } `}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.fulfillmentDate}
                    />
                  </div>
                  {formik.touched.fulfillmentDate &&
                    formik.errors.fulfillmentDate && (
                      <small
                        className={`text-red-500 absolute -bottom-6 left-2 `}
                      >
                        {formik.errors.fulfillmentDate}
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
