import Button from "@/components/Button";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MdOutlineAdd } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { inStockProductsInitalType } from "@/types";
import SelectField from "@/components/ReactSelect/SelectField";
import { getAllSuppliers } from "@/http/supplierHttp";
import { getAllProducts } from "@/http/productsHttp";
import { SHOW_LOADER } from "@/redux/modules/loader-slice";
import { AppDispatch } from "@/redux/store";
import { getAllEmployees } from "@/http/employeeHttp";
import { getAllStations } from "@/http/stationsHttp";
import { createpatch } from "@/http/patchesHttp";
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
const NewPatch = ({ supplier, products, employees, stations }: any) => {
  console.log(supplier, products, employees, stations);

  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const router = useRouter();

  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const user = useSelector((state: any) => state.authReducer);
  const dispatch = useDispatch<AppDispatch>();

  //#region initialization

  const validationSchema: any = Yup.object().shape({
    suppliers: Yup.array().min(1, "Supplier is required"),
    packingDate: Yup.string().required("Packing Date is required"),
    products: Yup.array().min(1, "Product is required"),
    station: Yup.string().required("Station is required"),
    totalPallets: Yup.string().required("Total Pallets is required"),
    description: Yup.string().required("Description is required"),

    // Dynamically added email fields validation
  });

  const formik = useFormik<inStockProductsInitalType>({
    initialValues: {
      packingDate: "",
      suppliers: [],
      station: "",
      products: [],
      totalPallets: "",
      qualitySpecialist: "",
      operation: "",
      salesCases: [],
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission


      console.log(values);

      dispatch(SHOW_LOADER());
      try {
        await createpatch({
          ...values,
        });
        router.push("/inventory/products/in-stock");
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
                  <label className="text-lg h-12" htmlFor="suppliers">
                    Suppliers<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={supplier?.map((res: any) => {
                      return {
                        value: res._id,
                        label: `${res.firstName} ${res.lastName}`,
                      };
                    })}
                    value={formik.values.suppliers}
                    onChange={(value: any) =>
                      formik.setFieldValue("suppliers", value)
                    }
                    isValid={
                      formik.touched.suppliers && formik.errors.suppliers
                        ? false
                        : true
                    }
                    isMulti={true}
                  />

                  {formik.touched.suppliers && formik.errors.suppliers && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.suppliers}
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
                        label: res.englishName,
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
                  <label className="text-lg h-12" htmlFor="products">
                    Products<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={products?.map((res: any) => {
                      return { value: res._id, label: res.name };
                    })}
                    value={formik.values.products}
                    onChange={(value: any) =>
                      formik.setFieldValue("products", value)
                    }
                    isValid={
                      formik.touched.products && formik.errors.products
                        ? false
                        : true
                    }
                    isMulti={true}
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
                      formik.setFieldValue("salesCases", value)
                    }
                    isValid={
                      formik.touched.salesCases && formik.errors.salesCases
                        ? false
                        : true
                    }
                    isMulti={true}
                  />
                  {formik.touched.salesCases && formik.errors.salesCases && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.salesCases}
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

export default NewPatch;
