import { useFormik } from "formik";
import * as Yup from "yup";

import React, { useState } from "react";
import { confirmationSalesType } from "@/types";
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
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees } from "@/http/employeeHttp";
import { useRouter } from "next/navigation";
import { SHOW_LOADER } from "@/redux/modules/loader-slice";
import { AppDispatch } from "@/redux/store";
import PerformaModal from "@/components/PerformaModal";
export const getServerSideProps = async (context: any) => {
  const productFetch = async () => {
    return await getAllProducts();
  };
  const employeeFetch = async () => {
    return await getAllEmployees();
  };
  const accountFetch = async () => {
    return await getAllAccounts();
  };

  const [products, employees, accounts] = await Promise.all([
    productFetch(),
    employeeFetch(),
    accountFetch(),
  ]);

  return {
    props: {
      products,
      employees,
      accounts,

      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};
export default function ConfirmationPage({
  products,
  accounts,
  employees,
}: {
  products: any;
  accounts: any;
  employees: any;
}) {
  console.log(products, accounts);
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });
  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [show, setShow] = useState(false);

  const validationSchema: any = Yup.object().shape({});

  const formik = useFormik<confirmationSalesType>({
    initialValues: {
      orderItems: [{ totalWeight: "", product: "", specifications: {} }],
      finalPrice: "",
      currency: "",
      percent: "",
      deposit: "",
      paymentPlan: "",
      exportManager: "",
      incoTerms: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission
      dispatch(SHOW_LOADER());
      try {
      } catch (e) {
      } finally {
      }
    },
  });

  const addInput = () => {
    formik.setValues({
      ...formik.values,
      orderItems: [
        ...formik.values.orderItems,
        { totalWeight: "", product: "", specifications: {} },
      ],
    });
  };

  const removeInput = (index: any) => {
    const updatedInputs = [...formik.values.orderItems];
    updatedInputs.splice(index, 1);

    formik.setValues({
      ...formik.values,
      orderItems: updatedInputs,
    });
  };
  const arr = [
    {
      name: "Initial",
      url: "/sales/new/inital",
      active: false,
    },
    {
      name: "Confirmation",
      url: "/sales/new/confirmation",

      active: true,
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
            <div
              className={`arrow arrow-back active`}
              onClick={() => {
                router.push("/sales/new/inital");
              }}
            >
              Prev
            </div>
            <div
              className={`arrow arrow-right active `}
              onClick={() => {
                router.push("/sales/new/supply");
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
              </div>
              {formik.values.orderItems.map((input, index) => (
                <>
                  <div className="flex justify-start w-full">
                    <h2 className="text-2xl text-darkGray border-b-[1px] w-full py-3">
                      Item {index + 1}
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 w-full text-darkGray gap-5">
                    <div
                      key={index}
                      className="flex flex-col w-full gap-3 relative mb-2"
                    >
                      <label htmlFor={`orderItems.${index}.totalWeight`}>
                        Total Weight
                      </label>
                      <input
                        type="text"
                        id={`orderItems.${index}.totalWeight`}
                        name={`orderItems.${index}.totalWeight`}
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2  `}
                        onChange={formik.handleChange}
                        value={input.totalWeight}
                      />
                    </div>
                    <div
                      key={index}
                      className="flex flex-col w-full gap-3 relative mb-2"
                    >
                      <label htmlFor={`orderItems.${index}.product`}>
                        Product
                      </label>
                      <SelectField
                        options={products?.map((res: any) => {
                          return { value: res._id, label: res.name };
                        })}
                        onChange={(value: any) =>
                          formik.setFieldValue(
                            `orderItems.${index}.product`,
                            value.value
                          )
                        }
                        isValid={
                          formik.touched.product && formik.errors.product
                            ? false
                            : true
                        }
                        value={`orderItems.${index}.product`}
                      />
                    </div>
                    {
                      //specifications
                      products
                        .find(
                          (res: any) =>
                            res._id == formik.values.orderItems[index].product
                        )
                        ?.specifications.map((res: any) => (
                          <div className="flex flex-col w-full gap-3 relative mb-2">
                            <label className="text-lg h-12" htmlFor="product">
                              {res.key}
                            </label>
                            <SelectField
                              options={res.values?.map((res: any) => {
                                return { value: res, label: res };
                              })}
                              value={`orderItems.${index}.specifications[${res.key}]`}
                              onChange={(value: any) =>
                                formik.setFieldValue(
                                  `orderItems.${index}.specifications.${res.key}`,
                                  value.value
                                )
                              }
                              isValid={
                                formik.touched[res.key] &&
                                formik.errors[res.key]
                                  ? false
                                  : true
                              }
                            />
                          </div>
                        ))
                    }

                    {/* <Button
                                    type="button"
                                    icon={
                                        <span className="text-red-500 transition group-hover:text-white text-xl">
                                            <MdDelete />
                                        </span>
                                    }
                                    title={t("")}
                                    classes=" hover:bg-red-500 group hover:text-[white] transition "
                                    handleOnClick={() => removeInput(index)}
                                /> */}
                  </div>
                </>
              ))}

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
                      className={`w-full h-12 rounded-md border border-r-0 rounded-r-none	 border-lightGray   px-2 ${
                        formik.touched.finalPrice && formik.errors.finalPrice
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } `}
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
                      className={`w-full h-12 rounded-md border border-r-0 rounded-r-none	 border-lightGray   px-2 ${
                        formik.touched.percent && formik.errors.percent
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } `}
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
                      className={`w-full h-12 rounded-md border border-r-0 rounded-r-none	 border-lightGray   px-2 ${
                        formik.touched.deposit && formik.errors.deposit
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                      } `}
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
                      } `}
                    >
                      <option value="usd">USD</option>
                      <option value="euro">EURO</option>
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
                  <label className="text-lg h-12" htmlFor="incoTerms">
                    Inco Terms<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={[]?.map((res: any) => {
                      return { value: res._id, label: res.name };
                    })}
                    onChange={(value: any) =>
                      formik.setFieldValue(`incoTerms`, value.value)
                    }
                    isValid={
                      formik.touched.incoTerms && formik.errors.incoTerms
                        ? false
                        : true
                    }
                    value={formik.values.incoTerms}
                  />
                  {formik.touched.incoTerms && formik.errors.incoTerms && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.incoTerms}
                    </small>
                  )}
                </div>
              </div>
              <div className="text-2xl text-darkGray border-b-[1px] w-full py-3  flex gap-3 items-center">
                <h2>Export Manager</h2>
              </div>
              <div className="grid grid-cols-1 w-full text-darkGray gap-5">
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="exportManager">
                    Employees<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={employees?.map((res: any) => {
                      return {
                        value: res._id,
                        label: `${res.firstName} ${res.lastName}`,
                      };
                    })}
                    onChange={(value: any) =>
                      formik.setFieldValue(`exportManager`, value.value)
                    }
                    isValid={
                      formik.touched.exportManager &&
                      formik.errors.exportManager
                        ? false
                        : true
                    }
                    value={formik.values.exportManager}
                  />
                  {formik.touched.exportManager &&
                    formik.errors.exportManager && (
                      <small
                        className={`text-red-500 absolute -bottom-6 left-2 `}
                      >
                        {formik.errors.exportManager}
                      </small>
                    )}
                </div>
              </div>
              <Button
                type="button"
                title={"Generate Performa"}
                classes=" bg-[#0F8BFD] text-white p-4 text-bold hover:bg-red-500 group hover:text-[white] transition "
                handleOnClick={() => {
                  setShow(true);
                }}
              />

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
          <PerformaModal
            show={show}
            onHide={() => {
              setShow(false);
            }}
          />
        </div>
      )}
    </>
  );
}
