import { useFormik } from "formik";
import * as Yup from "yup";

import React from "react";
import {
  confirmationSalesType,
  intialSalesType,
  supplySalesType,
} from "@/types";
import Button from "@/components/Button";
import { MdDelete, MdOutlineAdd } from "react-icons/md";
import SelectField from "@/components/ReactSelect/SelectField";
import { useTranslation } from "react-i18next";
import { getAllProducts } from "@/http/productsHttp";
import { getAllAccounts } from "@/http/accountsHttp";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import { getAllSuppliers } from "@/http/supplierHttp";
import { getAllEmployees } from "@/http/employeeHttp";
import { getAllStations } from "@/http/stationsHttp";
import Loader from "@/components/Loader";
import StepButton from "@/components/StepButton";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getAllSupplyOrders } from "@/http/supplyOrderHttp";
export const getServerSideProps = async (context: any) => {
  const supplierFetch = async () => {
    return await getAllSuppliers();
  };
  const supplyorderFetch = async () => {
    return await getAllSupplyOrders();
  };
  const employeeFetch = async () => {
    return await getAllEmployees();
  };
  const stationFetch = async () => {
    return await getAllStations();
  };

  const [supplier, supplyOrders, employees, stations] = await Promise.all([
    supplierFetch(),
    supplyorderFetch(),
    employeeFetch(),
    stationFetch(),
  ]);

  return {
    props: {
      supplier,
      supplyOrders,
      employees,
      stations,

      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};
export default function SupplyPage({
  supplier,
  supplyOrders,
  employees,
  stations,
}: {
  supplier: any;
  supplyOrders: any;
  employees: any;
  stations: any;
}) {
  console.log(supplier, supplyOrders, employees, stations);

  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });
  const router = useRouter();

  const { isLoading } = useSelector((state: any) => state.loaderReducer);

  const validationSchema: any = Yup.object().shape({});

  const formik = useFormik<supplySalesType>({
    initialValues: {
      supplyOrder: "",
      supplier: "",
      station: "",
      operation: "",
      qualitySpecialist: "",
      logistics: "",
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

      active: true,
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
                router.push("/sales/new/confirmation");
              }}
            >
              Prev
            </div>
            <div
              className={`arrow arrow-right active `}
              onClick={() => {
                router.push("/sales/new/transporting");
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
                <h2>Supply Order Infomation</h2>
              </div>
              <div className="grid grid-cols-2 w-full text-darkGray gap-5">
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="supplyOrder">
                    Supply Order<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={supplyOrders?.map((res: any) => {
                      return { value: res._id, label: res._id };
                    })}
                    onChange={(value: any) =>
                      formik.setFieldValue(`supplyOrder`, value.value)
                    }
                    isValid={
                      formik.touched.supplyOrder && formik.errors.supplyOrder
                        ? false
                        : true
                    }
                    value={formik.values.supplyOrder}
                  />
                  {formik.touched.supplyOrder && formik.errors.supplyOrder && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.supplyOrder}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
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
                    onChange={(value: any) =>
                      formik.setFieldValue(`supplier`, value.value)
                    }
                    isValid={
                      formik.touched.supplier && formik.errors.supplier
                        ? false
                        : true
                    }
                    value={formik.values.supplier}
                  />
                  {formik.touched.supplier && formik.errors.supplier && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.supplier}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="station">
                    Station<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={stations?.map((res: any) => {
                      return { value: res._id, label: res.englishName };
                    })}
                    onChange={(value: any) =>
                      formik.setFieldValue(`station`, value.value)
                    }
                    isValid={
                      formik.touched.station && formik.errors.station
                        ? false
                        : true
                    }
                    value={formik.values.station}
                  />
                  {formik.touched.station && formik.errors.station && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.station}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="operation">
                    Operation<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={employees?.map((res: any) => {
                      return {
                        value: res._id,
                        label: `${res.firstName} ${res.lastName}`,
                      };
                    })}
                    onChange={(value: any) =>
                      formik.setFieldValue(`operation`, value.value)
                    }
                    isValid={
                      formik.touched.operation && formik.errors.operation
                        ? false
                        : true
                    }
                    value={formik.values.operation}
                  />
                  {formik.touched.operation && formik.errors.operation && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.operation}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="qualitySpecialist">
                    Quality Specialist<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={employees?.map((res: any) => {
                      return {
                        value: res._id,
                        label: `${res.firstName} ${res.lastName}`,
                      };
                    })}
                    onChange={(value: any) =>
                      formik.setFieldValue(`qualitySpecialist`, value.value)
                    }
                    isValid={
                      formik.touched.qualitySpecialist &&
                      formik.errors.qualitySpecialist
                        ? false
                        : true
                    }
                    value={formik.values.qualitySpecialist}
                  />
                  {formik.touched.qualitySpecialist &&
                    formik.errors.qualitySpecialist && (
                      <small
                        className={`text-red-500 absolute -bottom-6 left-2 `}
                      >
                        {formik.errors.qualitySpecialist}
                      </small>
                    )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="logistics">
                    Logistics<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={employees?.map((res: any) => {
                      return {
                        value: res._id,
                        label: `${res.firstName} ${res.lastName}`,
                      };
                    })}
                    onChange={(value: any) =>
                      formik.setFieldValue(`logistics`, value.value)
                    }
                    isValid={
                      formik.touched.logistics && formik.errors.logistics
                        ? false
                        : true
                    }
                    value={formik.values.logistics}
                  />
                  {formik.touched.logistics && formik.errors.logistics && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.logistics}
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
