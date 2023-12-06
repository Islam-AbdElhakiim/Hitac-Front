import Button from "@/components/Button";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MdOutlineAdd } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import countries from "@/constants/countries";
import { inStockProductsInitalType, productType, supplyOrderInitalType, supplyOrderType } from "@/types";
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
export const getServerSideProps = async (context: any) => {
  const supplierFetch = async () => {
    return await getAllSuppliers();
  };
  const productFetch = async () => {
    return await getAllProducts();
  };

  const [supplier, products] = await Promise.all([
    supplierFetch(),
    productFetch(),
  ]);

  // console.log(employee, accounts)

  return {
    props: {
      supplier,
      products,

      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};
const NewSupplyOrder = ({ supplier, products }: any) => {
  console.log(supplier, products);

  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const router = useRouter();

  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const user = useSelector((state: any) => state.authReducer);
  const dispatch = useDispatch<AppDispatch>();

  //#region initialization

  const validationSchema: any = Yup.object().shape({
    salesOrder: Yup.string().required("Sales Order is required"),
    supplier: Yup.string().required("Supplier is required"),
    packingDate: Yup.string().required("Packing Date is required"),
    product: Yup.string().required("Product is required"),
    qualitySpecialist: Yup.string().required("Quality Specialist is required"),
    opertaion: Yup.string().required("Opertaion is required"),
    station: Yup.string().required("Station is required"),
    totalPallets: Yup.string().required("Total Pallets is required"),
    description: Yup.string().required("Description is required"),

    // Dynamically added email fields validation
  });

  const formik = useFormik<inStockProductsInitalType>({
    initialValues: {
      packingDate: "",
      supplier: "",
      station: "",
      product: '',
      totalPallets: "",
      qualitySpecialist: "",
      opertaion: "",
      salesOrder: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission


      console.log(values);

      dispatch(SHOW_LOADER());
      try {
        // await createSupplyOrder({
        //   ...values,
        // });
        // router.push("/supply-orders");
      } catch (e) {
      } finally {
        // dispatch(HIDE_LOADER());
      }
    },
  });

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
              <h2>Patch Information</h2>
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
                  <label className="text-lg h-12" htmlFor="packingDate">
                    Packing date<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    name="packingDate"
                    id="packingDate"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.packingDate && formik.errors.packingDate
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.packingDate}
                  />
                  {formik.touched.packingDate && formik.errors.packingDate && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.packingDate}
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

                  {formik.touched.supplier && formik.errors.supplier && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.supplier}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="station">
                    Station<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={supplier?.map((res: any) => {
                      return {
                        value: res._id,
                        label: `${res.firstName} ${res.lastName}`,
                      };
                    })}
                    value={formik.values.station}
                    onChange={(value: any) =>
                      formik.setFieldValue("station", value.value)
                    }
                    isValid={
                      formik.touched.station && formik.errors.station
                        ? false
                        : true
                    }
                  />
                  {formik.touched.station && formik.errors.station && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.station}
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
                    value={formik.values.product}
                    onChange={(value: any) =>
                      formik.setFieldValue("products", value.value)
                    }
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
                  <label className="text-lg h-12" htmlFor="totalPallets">
                    Total Pallets<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="totalPallets"
                    id="totalPallets"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.totalPallets && formik.errors.totalPallets
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.totalPallets}
                  />
                  {formik.touched.totalPallets && formik.errors.totalPallets && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.totalPallets}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="qualitySpecialist">
                    Quality-Specialist<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={products?.map((res: any) => {
                      return { value: res._id, label: res.name };
                    })}
                    value={formik.values.qualitySpecialist}
                    onChange={(value: any) =>
                      formik.setFieldValue("qualitySpecialist", value.value)
                    }
                    isValid={
                      formik.touched.qualitySpecialist && formik.errors.qualitySpecialist
                        ? false
                        : true
                    }
                  />

                  {formik.touched.qualitySpecialist && formik.errors.qualitySpecialist && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.qualitySpecialist}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="opertaion">
                    Operation<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={products?.map((res: any) => {
                      return { value: res._id, label: res.name };
                    })}
                    value={formik.values.opertaion}
                    onChange={(value: any) =>
                      formik.setFieldValue("opertaion", value.value)
                    }
                    isValid={
                      formik.touched.opertaion && formik.errors.opertaion
                        ? false
                        : true
                    }
                  />

                  {formik.touched.opertaion && formik.errors.opertaion && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.opertaion}
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
                    className={`w-full rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.description && formik.errors.description
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.description}
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

export default NewSupplyOrder;
