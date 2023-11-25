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
import {
  productType,
  returnRequestsInitalType,
  returnRequestsType,
} from "@/types";
import { createSupplyOrder, getAllSupplyOrders } from "@/http/supplyOrderHttp";
import Select from "react-select";
import { StylesConfig } from "react-select";
import { SelectInput } from "@/components/ReactSelect/SelectInput";
import SelectField from "@/components/ReactSelect/SelectField";
import { useEffect } from "react";
import { getAllSuppliers } from "@/http/supplierHttp";
import { getAllProducts } from "@/http/productsHttp";
import { createReturnRequests } from "@/http/returnRequestHttp";
export const getServerSideProps = async (context: any) => {
  const supplyOrders = async () => {
    return await getAllSupplyOrders();
  };
  const supplierFetch = async () => {
    return await getAllSuppliers();
  };
  const productFetch = async () => {
    return await getAllProducts();
  };

  const [supplyOrder, supplier, products] = await Promise.all([
    supplyOrders(),
    supplierFetch(),
    productFetch(),
  ]);

  // console.log(employee, accounts)

  return {
    props: {
      supplyOrder,
      supplier,
      products,

      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};
const NewReturnRequest = ({ supplier, products, supplyOrder }: any) => {
  console.log(supplier, products);

  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const router = useRouter();

  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const user = useSelector((state: any) => state.authReducer);

  //#region initialization

  const validationSchema: any = Yup.object().shape({
    supplyOrder: Yup.string().required("Supply Order is required"),
    supplier: Yup.string().required("Supplier is required"),
    createdOn: Yup.string().required("Created On is required"),
    product: Yup.string().required("Product is required"),
    price: Yup.string().required("Price is required"),
    description: Yup.string().required("Description is required"),

    // Dynamically added email fields validation
  });

  const formik = useFormik<returnRequestsInitalType>({
    initialValues: {
      supplyOrder: "",
      supplier: "",
      createdOn: "",
      createdBy: user._id,
      product: "",
      price: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission

      await createReturnRequests({
        ...values,
      });
      router.push("/return-requests");
      console.log(values);
    },
  });
  console.log(formik.values, formik.errors);

  //#region modules

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-start my-5 pb-10  h-[83vh] bg-white rounded-xl shadow-md overflow-auto">
          {/* personal-data-section */}
          <div className="flex flex-col items-start justify-start w-full p-5 gap-3">
            {/* title */}
            <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
              <h2>Personal Information</h2>
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
                  <label className="text-lg h-12" htmlFor="supplyOrder">
                    Supply Order<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={supplyOrder?.map((res: any) => {
                      return {
                        value: res._id,
                        label: res._id,
                      };
                    })}
                    value={formik.values.supplyOrder}
                    onChange={(value: any) =>
                      formik.setFieldValue("supplyOrder", value.value)
                    }
                  />
                  {formik.touched.supplyOrder && formik.errors.supplyOrder && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.supplyOrder}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="createdOn">
                    Created On<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    name="createdOn"
                    id="createdOn"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.createdOn && formik.errors.createdOn
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.createdOn}
                  />
                  {formik.touched.createdOn && formik.errors.createdOn && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.createdOn}
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
                  />
                  {/* <select
                    name="supplier"
                    id="supplier"
                    className={`w-full h-12 rounded-md shadow-md  px-2 border ${
                      formik.touched.supplier && formik.errors.supplier
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.supplier}
                  >
                    <option selected disabled value={""}>
                      Select
                    </option>
                    {[].map((res: any) => {
                      return <option value={res}>{res}</option>;
                    })}
                  </select> */}
                  {formik.touched.supplier && formik.errors.supplier && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.supplier}
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
                  />

                  {formik.touched.product && formik.errors.product && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.product}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="price">
                    Price<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="price"
                    id="price"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.price && formik.errors.price
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.price}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.price}
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
                    className={`w-full rounded-md border border-lightGray shadow-md  px-2 `}
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

export default NewReturnRequest;
