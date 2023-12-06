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
import { inStockProductsInitalType, palletsInitalType, productType, supplyOrderInitalType, supplyOrderType } from "@/types";
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
export const getServerSideProps = async (context: any) => {
  const supplierFetch = async () => {
    return await getAllSuppliers();
  };
  const productFetch = async () => {
    return await getAllProducts();
  };
  const employeeFetch = async () => {
    return await getAllEmployees();
  };
  const stationFetch = async () => {
    return await getAllStations();
  };

  const [supplier, products, employees, stations] = await Promise.all([
    supplierFetch(),
    productFetch(),
    employeeFetch(),
    stationFetch(),
  ]);

  // console.log(employee, accounts)

  return {
    props: {
      supplier,
      products,
      employees,
      stations,

      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};
const NewSupplyOrder = ({ supplier, products, employees, stations }: any) => {
  console.log(supplier, products);

  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const user = useSelector((state: any) => state.authReducer);
  const dispatch = useDispatch<AppDispatch>();

  //#region initialization

  const validationSchema: any = Yup.object().shape({
    packingDate: Yup.string().required("Packing Date is required"),
    supplier: Yup.string().required("Supplier is required"),
    station: Yup.string().required("Station is required"),
    product: Yup.string().required("Product is required"),
    boxWeight: Yup.string().required("Box Size is required"),
    boxesPerBase: Yup.string().required("Boxes Per Base is required"),
    boxesPerColumn: Yup.string().required("Boxes Per Column is required"),
    totalBoxes: Yup.string().required("Total Boxes is required"),
    palletGrossWeight: Yup.string().required("Pallet Gross Weight is required"),
    palletNetWeight: Yup.string().required("Pallet Net Weight is required"),
    containerSpot: Yup.string().required("Container Spot is required"),
    qualitySpecialist: Yup.string().required("Quality Specialist is required"),
    operation: Yup.string().required("Opertaion is required"),

    // Dynamically added email fields validation
  });
  const patch: any = searchParams.get("patch")
  const formik = useFormik<palletsInitalType>({
    initialValues: {
      patch: patch,
      supplier: '',
      station: '',
      packingDate: '',
      product: '',
      brand: '',
      boxWeight: '',
      boxesPerBase: '',
      boxesPerColumn: '',
      totalBoxes: '',
      palletGrossWeight: '',
      palletNetWeight: '',
      containerSpot: '',
      qualitySpecialist: '',
      operation: '',
      specifications: {}
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission


      console.log(values);

      dispatch(SHOW_LOADER());
      try {
        await createPallets({
          ...values,
        });
        router.push(`/inventory/products/in-stock/${patch}?isEdit=true`);
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
              <h2>Pallet Information</h2>
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
                    options={stations?.map((res: any) => {
                      return {
                        value: res._id,
                        label: `${res.englishName}`,
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
                      formik.setFieldValue("product", value.value)
                    }
                    isValid={
                      formik.touched.product && formik.errors.product
                        ? false
                        : true
                    }
                  />

                  {formik.touched.product && formik.errors.product && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.product}
                    </small>
                  )}
                </div>

                {
                  //specifications
                  products.find((res: any) => res._id == formik.values.product)?.specifications.map((res: any) => (
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="product">
                        {res.key}
                      </label>
                      <SelectField
                        options={res.values?.map((res: any) => {
                          return { value: res, label: res };
                        })}
                        value={formik.values.specifications[res.key]}
                        onChange={(value: any) =>
                          formik.setFieldValue(`specifications.${res.key}`, value.value)
                        }
                        isValid={
                          formik.touched[res.key] && formik.errors[res.key]
                            ? false
                            : true
                        }
                      />
                    </div>
                  ))
                }

                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="brand">
                    Brand
                  </label>

                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}

                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.brand}
                  />
                  {formik.touched.brand && formik.errors.brand && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.brand}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="boxWeight">
                    Box Weight
                  </label>

                  <input
                    type="text"
                    name="boxWeight"
                    id="boxWeight"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}

                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.boxWeight}
                  />
                  {formik.touched.boxWeight && formik.errors.boxWeight && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.boxWeight}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="boxesPerBase">
                    Boxes Per Base
                  </label>

                  <input
                    type="text"
                    name="boxesPerBase"
                    id="boxesPerBase"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}

                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.boxesPerBase}
                  />
                  {formik.touched.boxesPerBase && formik.errors.boxesPerBase && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.boxesPerBase}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="boxesPerColumn">
                    Boxes Per Column
                  </label>

                  <input
                    type="text"
                    name="boxesPerColumn"
                    id="boxesPerColumn"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}

                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.boxesPerColumn}
                  />
                  {formik.touched.boxesPerColumn && formik.errors.boxesPerColumn && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.boxesPerColumn}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="totalBoxes">
                    Totol Boxes
                  </label>

                  <input
                    type="text"
                    name="totalBoxes"
                    id="totalBoxes"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}

                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.totalBoxes}
                  />
                  {formik.touched.totalBoxes && formik.errors.totalBoxes && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.totalBoxes}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="palletGrossWeight">
                    Pallet Gross Weight
                  </label>

                  <input
                    type="text"
                    name="palletGrossWeight"
                    id="palletGrossWeight"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}

                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.palletGrossWeight}
                  />
                  {formik.touched.palletGrossWeight && formik.errors.palletGrossWeight && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.palletGrossWeight}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="palletNetWeight">
                    Pallet Net Weight
                  </label>

                  <input
                    type="text"
                    name="palletNetWeight"
                    id="palletNetWeight"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}

                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.palletNetWeight}
                  />
                  {formik.touched.palletNetWeight && formik.errors.palletNetWeight && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.palletNetWeight}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="salesCases">
                    Sales Order<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={supplier?.map((res: any) => {
                      return {
                        value: res._id,
                        label: `${res.firstName} ${res.lastName}`,
                      };
                    })}
                    value={formik.values.salesCases}
                    onChange={(value: any) =>
                      formik.setFieldValue("salesCases", value.value)
                    }
                    isValid={
                      formik.touched.salesCases && formik.errors.salesCases
                        ? false
                        : true
                    }
                  />
                  {formik.touched.salesCases && formik.errors.salesCases && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.salesCases}
                    </small>
                  )}
                </div>
                {
                  //qrcode
                }



                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="containerSpot">
                    Container Spot<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="containerSpot"
                    id="containerSpot"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.containerSpot && formik.errors.containerSpot
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}

                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.containerSpot}
                  />
                  {formik.touched.containerSpot && formik.errors.containerSpot && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.containerSpot}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="operation">
                    Operation<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={employees?.map((res: any) => {
                      return { value: res._id, label: `${res.firstName} ${res.lastName}` };
                    })}
                    value={formik.values.operation}
                    onChange={(value: any) =>
                      formik.setFieldValue("operation", value.value)
                    }
                    isValid={
                      formik.touched.operation && formik.errors.operation
                        ? false
                        : true
                    }
                  />

                  {formik.touched.operation && formik.errors.operation && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.operation}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="qualitySpecialist">
                    Quality-Specialist<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={employees?.map((res: any) => {
                      return { value: res._id, label: `${res.firstName} ${res.lastName}` };
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
