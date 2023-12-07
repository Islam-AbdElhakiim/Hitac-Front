import Button from "@/components/Button";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MdDelete, MdOutlineAdd } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { FieldArray, useFormik } from "formik";
import * as Yup from "yup";
import countries from "@/constants/countries";
import { Attribute, inStockProductsInitalType, productType, supplyOrderInitalType, supplyOrderType, variant, variantInitalType } from "@/types";
import { createSupplyOrder } from "@/http/supplyOrderHttp";
import Select from "react-select";
import { StylesConfig } from "react-select";
import { SelectInput } from "@/components/ReactSelect/SelectInput";
import SelectField from "@/components/ReactSelect/SelectField";
import { useEffect, useState } from "react";
import { getAllSuppliers } from "@/http/supplierHttp";
import { getAllProducts } from "@/http/productsHttp";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import { AppDispatch } from "@/redux/store";
import { createVaraint, getAllEquipments } from "@/http/equipmentsHttp";
export const getServerSideProps = async (context: any) => {
  const supplierFetch = async () => {
    return await getAllSuppliers();
  };
  const equipmentFetch = async () => {
    return await getAllEquipments();
  };

  const [supplier, equipments] = await Promise.all([
    supplierFetch(),
    equipmentFetch(),
  ]);

  // console.log(employee, accounts)

  return {
    props: {
      supplier,
      equipments,

      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};
const NewVariant = ({ supplier, equipments }: any) => {
  console.log(supplier, equipments);

  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const router = useRouter();

  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const user = useSelector((state: any) => state.authReducer);
  const dispatch = useDispatch<AppDispatch>();

  //#region initialization
  const searchParams = useSearchParams();

  const equipId: any = searchParams.get("id")

  const validationSchema: any = Yup.object().shape({
    equipmentsType: Yup.string().required("Equipment Type is required"),
    supplier: Yup.string().required("Supplier is required"),
    totalCount: Yup.string().required("Total Count is required"),

    // Dynamically added email fields validation
  });

  const formik = useFormik<variantInitalType>({
    initialValues: {
      title: "s",
      equipmentsType: equipId || "",
      totalCount: "",
      supplier: "",
      variants: [{ title: '', value: '' }],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission


      console.log(values);

      dispatch(SHOW_LOADER());
      try {
        await createVaraint({
          ...values,
        });
        router.push("/inventory/equipments/in-stock/details/" + equipId);
      } catch (e) {
        dispatch(HIDE_LOADER());
      } finally {
      }
    },
  });


  const [attributes, setAttributes] = useState<variant[]>([]);

  const addAttribute = () => {
    let temp = new variant();
    setAttributes((prev) => [...prev, temp]);
  }

  const deleteAttribute = (_index: number) => {
    setAttributes(prev => prev.filter((val, index) => index != _index));
  }
  const updateOptionValue = (_attributeIndex: number, _valueIndex: number, e: any) => {

    setAttributes((prev: any) => {
      let newValue = prev.map((attr: any, attributeIndex: any) => {
        // find attribute
        if (attributeIndex == _attributeIndex) {
          attr.values.map((value: any, valueIndex: any) => {
            // find option value
            if (valueIndex == _valueIndex) {
              // update it
              attr.values[valueIndex] = e.target.value
            }
          })
        }
        return attr;
      })
      // console.log(newValue);
      return newValue;
    })

  }
  //#region modules
  const addInput = () => {
    formik.setValues({
      ...formik.values,
      variants: [...formik.values.variants, { title: '', value: '' }],
    });
  };

  const removeInput = (index: any) => {
    const updatedInputs = [...formik.values.variants];
    updatedInputs.splice(index, 1);

    formik.setValues({
      ...formik.values,
      variants: updatedInputs,
    });
  };
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
              <h2>Variant Information</h2>
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
                  <label className="text-lg h-12" htmlFor="equipmentsType">
                    Equipment Type<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={equipments?.map((res: any) => {
                      return {
                        value: res._id,
                        label: res.title,
                      };
                    })}
                    value={formik.values.equipmentsType}
                    onChange={(value: any) =>
                      formik.setFieldValue("equipmentsType", value.value)
                    }
                    isValid={
                      formik.touched.equipmentsType && formik.errors.equipmentsType
                        ? false
                        : true
                    }
                  />

                  {formik.touched.equipmentsType && formik.errors.equipmentsType && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.equipmentsType}
                    </small>
                  )}
                </div>

                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="totalCount">
                    Total Count<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="totalCount"
                    id="totalCount"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.totalCount && formik.errors.totalCount
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.totalCount}
                  />
                  {formik.touched.totalCount && formik.errors.totalCount && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.totalCount}
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

              </div>
              <div className="text-2xl text-darkGray border-b-[1px] w-full py-3  flex gap-3 items-center">
                <h2>Specifications</h2>
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
              <div className="grid grid-cols-1 w-full text-darkGray gap-5">
                {formik.values.variants.map((input, index) => (
                  <div key={index} className="flex items-center w-full gap-3">
                    <label htmlFor={`variants.${index}.title`}>Title</label>
                    <input
                      type="text"
                      id={`variants.${index}.title`}
                      name={`variants.${index}.title`}
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2  `}
                      onChange={formik.handleChange}
                      value={input.title}
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

export default NewVariant;
