import { useFormik } from "formik";
import * as Yup from "yup";

import React, { useState } from "react";
import { intialSalesType } from "@/types";
import Button from "@/components/Button";
import { MdDelete, MdOutlineAdd } from "react-icons/md";
import SelectField from "@/components/ReactSelect/SelectField";
import { useTranslation } from "react-i18next";
import { getAllProducts } from "@/http/productsHttp";
import { getAllAccounts } from "@/http/accountsHttp";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Loader from "@/components/Loader";
import { useDispatch, useSelector } from "react-redux";
import StepButton from "@/components/StepButton";
import { useRouter } from "next/navigation";
export const getServerSideProps = async (context: any) => {
  const productFetch = async () => {
    return await getAllProducts();
  };

  const accountFetch = async () => {
    return await getAllAccounts();
  };

  const [products, accounts] = await Promise.all([
    productFetch(),
    accountFetch(),
  ]);
  return {
    props: {
      products,
      accounts,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};
export default function IntialPage({
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

  const validationSchema: any = Yup.object().shape({
    account: Yup.string().required("account is required"),
    email: Yup.string().required("email is required"),
    whatsapp: Yup.string().required("whatsapp is required"),
    port: Yup.string().required("port is required"),
    packaging: Yup.string().required("packaging is required"),
    totalWeight: Yup.string().required("totalWeight is required"),
    unit: Yup.string().required("unit is required"),
    currency: Yup.string().required("currency is required"),
    totalUnits: Yup.string().required("totalUnits is required"),
    rate: Yup.string().required("rate is required"),
    total: Yup.string().required("total is required"),
    description: Yup.string().required("description is required"),

    products: Yup.array().min(1, "Please Choose products!"),
  });

  const formik = useFormik<intialSalesType>({
    initialValues: {
      account: "",
      email: "",
      whatsapp: "",
      country: "",
      port: "",
      products: [],
      packaging: "",
      totalWeight: "",
      unit: "ton",
      currency: "",
      totalUnits: "",
      rate: "",
      total: "",
      description: "",
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

  // const addInput = () => {
  //     formik.setValues({
  //         ...formik.values,
  //         variants: [...formik.values.variants, { title: '', value: '' }],
  //     });
  // };

  // const removeInput = (index: any) => {
  //     const updatedInputs = [...formik.values.variants];
  //     updatedInputs.splice(index, 1);

  //     formik.setValues({
  //         ...formik.values,
  //         variants: updatedInputs,
  //     });
  // };
  const arr = [
    {
      name: "Initial",
      url: "/sales/new/inital",
      active: true,
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
            <div className={`arrow arrow-back`}>Prev</div>
            <div
              className={`arrow arrow-right active `}
              onClick={() => {
                router.push("/sales/new/confirmation");
              }}
            >
              Next
            </div>
          </div>
          <div className="flex flex-col items-start justify-start w-full p-5 gap-3">
            {/* title */}
            <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
              <h2>General Requirements</h2>
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
                  <label className="text-lg h-12" htmlFor="account">
                    Account<span className="text-red-500">*</span>
                  </label>

                  <SelectField
                    options={accounts?.map((res: any) => {
                      return { value: res._id, label: res.englishName, ...res };
                    })}
                    onChange={(value: any) => {
                      formik.setFieldValue("account", value.value);
                      formik.setFieldValue("email", value.emails[0]);
                      formik.setFieldValue("whatsapp", value.telephones[0]);
                      formik.setFieldValue("country", value.countries[0]);
                      formik.setFieldValue("port", value.ports[0]);
                    }}
                    isValid={
                      formik.touched.account && formik.errors.account
                        ? false
                        : true
                    }
                  />
                  {formik.touched.account && formik.errors.account && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.account}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="email">
                    Email<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="email"
                    id="email"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.email}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="whatsapp">
                    Whatsapp<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="whatsapp"
                    id="whatsapp"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.whatsapp && formik.errors.whatsapp
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.whatsapp}
                  />
                  {formik.touched.whatsapp && formik.errors.whatsapp && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.whatsapp}
                    </small>
                  )}
                </div>

                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="country">
                    Country<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.country && formik.errors.country
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.country}
                  />
                  {formik.touched.country && formik.errors.country && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.country}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="port">
                    Port<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="port"
                    id="port"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.port && formik.errors.port
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.port}
                  />
                  {formik.touched.port && formik.errors.port && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.port}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="products">
                    products<span className="text-red-500">*</span>
                  </label>

                  <SelectField
                    options={products?.map((res: any) => {
                      return { value: res._id, label: res.name };
                    })}
                    onChange={(value: any) =>
                      formik.setFieldValue("products", value)
                    }
                    isMulti={true}
                    isValid={
                      formik.touched.products && formik.errors.products
                        ? false
                        : true
                    }
                    value={formik.values.products}
                  />
                  {formik.touched.products && formik.errors.products && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.products}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="packaging">
                    Packaging<span className="text-red-500">*</span>
                  </label>
                  <div className="flex shadow-md">
                    <input
                      type="text"
                      name="packaging"
                      id="packaging"
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        formik.touched.packaging && formik.errors.packaging
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } `}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.packaging}
                    />
                  </div>
                  {formik.touched.packaging && formik.errors.packaging && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.packaging}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="totalWeight">
                    Total Weight<span className="text-red-500">*</span>
                  </label>
                  <div className="flex shadow-md">
                    <input
                      type="text"
                      name="totalWeight"
                      id="totalWeight"
                      className={`w-full h-12 rounded-md border border-r-0 rounded-r-none	 border-lightGray   px-2 ${
                        formik.touched.totalWeight && formik.errors.totalWeight
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } `}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.totalWeight}
                    />
                    <select
                      id="unit"
                      name="unit"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.unit}
                      className={`w-[15%] h-12 rounded-md rounded-l-none border border-l-0  bg-lightGray	 border-lightGray   px-2 ${
                        formik.touched.unit && formik.errors.unit
                          ? "bg-red-500"
                          : "border-lightGray outline-lightGray"
                      } `}
                    >
                      <option value="ton">Ton</option>
                      <option value="kg">Kg</option>
                      {/* Add more currency options as needed */}
                    </select>
                  </div>
                  {formik.touched.totalWeight && formik.errors.totalWeight && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.totalWeight}
                    </small>
                  )}
                  {formik.touched.unit && formik.errors.unit && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.unit}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="totalUnits">
                    Total Units<span className="text-red-500">*</span>
                  </label>
                  <div className="flex shadow-md">
                    <input
                      type="text"
                      name="totalUnits"
                      id="totalUnits"
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        formik.touched.totalUnits && formik.errors.totalUnits
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } `}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.totalUnits}
                    />
                  </div>
                  {formik.touched.totalUnits && formik.errors.totalUnits && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.totalUnits}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="rate">
                    Rate<span className="text-red-500">*</span>
                  </label>
                  <div className="flex shadow-md">
                    <input
                      type="text"
                      name="rate"
                      id="rate"
                      className={`w-full h-12 rounded-md border border-r-0 rounded-r-none	 border-lightGray   px-2 ${
                        formik.touched.rate && formik.errors.rate
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } `}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.rate}
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
                      } `}
                    >
                      <option value="usd">USD</option>
                      <option value="euro">EURO</option>
                      {/* Add more currency options as needed */}
                    </select>
                  </div>
                  {formik.touched.rate && formik.errors.rate && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.rate}
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
                  <label className="text-lg h-12" htmlFor="total">
                    Total<span className="text-red-500">*</span>
                  </label>
                  <div className="flex shadow-md">
                    <input
                      type="text"
                      name="total"
                      id="total"
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        formik.touched.total && formik.errors.total
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } `}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.total}
                    />
                  </div>
                  {formik.touched.total && formik.errors.total && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.total}
                    </small>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 w-full text-darkGray gap-5">
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="description">
                    Description
                  </label>

                  <textarea
                    name="description"
                    id="description"
                    rows={7}
                    className={`w-full rounded-md border border-lightGray shadow-md  px-2 `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                  />
                </div>
              </div>
              {/* <div className="text-2xl text-darkGray border-b-[1px] w-full py-3  flex gap-3 items-center">
                <h2>Order Item</h2>
                <Button
                    type="button"
                    icon={
                        <span className="text-[#00733B] transition group-hover:text-white text-xl">
                            <MdOutlineAdd />
                        </span>
                    }
                    title="Add"
                    classes=" hover:bg-[#00733B] group hover:text-[white] transition "
                    handleOnClick={() => addInput()}
                />
            </div> */}
              {/* <div className="grid grid-cols-1 w-full text-darkGray gap-5">
                {formik.values.variants.map((input, index) => (
                    <div key={index} className="flex items-center w-full gap-3">
                        <label htmlFor={`variants.${index}.totalQuantity`}>Total Quantity</label>
                        <input
                            type="text"
                            id={`variants.${index}.totalQuantity`}
                            name={`variants.${index}.totalQuantity`}
                            className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2  `}
                            onChange={formik.handleChange}
                            value={input.totalQuantity}
                        />
                        <label htmlFor={`variants.${index}.value`}>Value</label>
                        <input
                            type="text"
                            id={`variants.${index}.value`}
                            name={`variants.${index}.value`}
                            className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2  `}
                            onChange={formik.handleChange}
                            value={input.value}
                        />
                        <Button
                            type="button"
                            icon={
                                <span className="text-red-500 transition group-hover:text-white text-xl">
                                    <MdDelete />
                                </span>
                            }
                            title={t("")}
                            classes=" hover:bg-red-500 group hover:text-[white] transition "
                            handleOnClick={() => removeInput(index)}
                        />

                    </div>
                ))}

            </div> */}

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
