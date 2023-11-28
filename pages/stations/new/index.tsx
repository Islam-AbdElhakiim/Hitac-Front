import Button from "@/components/Button";
import {
  CreateEmployeeDTO,
  Department,
  DepartmentTitles,
  EmployeeType,
  Segment,
  ValidationObject,
  accountType,
  accountsValidationKeys,
  accountsValidationObject,
  contactType,
  contactsValidationKeys,
  contactsValidationObject,
  segmentType,
  stationType,
  supplierType,
  validationKeys,
} from "@/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MdOutlineAdd } from "react-icons/md";
import { departments, employeeBase, segments } from "@/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { BsCloudUpload } from "react-icons/bs";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useRouter as useNextRouter } from "next/router";
import { createAccount } from "@/http/accountsHttp";
import { useFormik } from "formik";
import * as Yup from "yup";
import { use } from "i18next";
import { createSupplier } from "@/http/supplierHttp";
import countries from "@/constants/countries";
import { getAllSegments } from "@/http/segmentsHttp";
import { getAllProducts } from "@/http/productsHttp";
import { createStation } from "@/http/stationsHttp";
import { RiDeleteBin6Line } from "react-icons/ri";

const NewStation = () => {
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const router = useRouter();

  const phoneRegex = /^(\+\d{1,2}\s?)?(\(\d{1,}\)|\d{1,})([-\s]?\d{1,})+$/;
  const countryList = Object.keys(countries);

  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const dispatch = useDispatch<AppDispatch>();

  //#region initialization

  const validationSchema: any = Yup.object().shape({
    englishName: Yup.string()
      .min(3, "English Name should be between 3 and 20 letters!")
      .max(20, "English Name should be between 3 and 20 letters!")
      .required("English Name is required"),
    arabicName: Yup.string()
      .min(3, "Arabic Name should be between 3 and 20 letters!")
      .max(20, "Arabic Name should be between 3 and 20 letters!")
      .required("Arabic Name is required"),
    address: Yup.string().required("Address is required"),
    countries: Yup.string().required("Country is required"),
    cities: Yup.string().required("City is required"),
    emails: Yup.string().email("Invalid email").required("Email is required"),
    emails2: Yup.string().when("emails", (value: any, schema: any) => {
      const i = Object.keys(formik.values).filter((key) =>
        key.startsWith("emails")
      ).length;
      if (i >= 2) {
        return schema.email("Invalid email").required("Email is required");
      }
    }),
    emails3: Yup.string().when("emails", (value: any, schema: any) => {
      const i = Object.keys(formik.values).filter((key) =>
        key.startsWith("emails")
      ).length;
      if (i >= 3) {
        return schema.email("Invalid email").required("Email is required");
      }
    }),
    emails4: Yup.string().when("emails", (value: any, schema: any) => {
      const i = Object.keys(formik.values).filter((key) =>
        key.startsWith("emails")
      ).length;
      if (i >= 4) {
        return schema.email("Invalid email").required("Email is required");
      }
    }),

    telephones: Yup.string()
      .matches(phoneRegex, {
        message: "Invalid telephone",
        excludeEmptyString: true,
      })
      .required("telephone is required"),
    telephones2: Yup.string().when("telephones", (value: any, schema: any) => {
      const i = Object.keys(formik.values).filter((key) =>
        key.startsWith("telephones")
      ).length;
      if (i >= 2) {
        return schema
          .matches(phoneRegex, {
            message: "Invalid telephone",
            excludeEmptyString: true,
          })
          .required("telephone is required");
      }
    }),
    telephones3: Yup.string().when("telephones", (value: any, schema: any) => {
      const i = Object.keys(formik.values).filter((key) =>
        key.startsWith("telephones")
      ).length;
      if (i >= 3) {
        return schema
          .matches(phoneRegex, {
            message: "Invalid telephone",
            excludeEmptyString: true,
          })
          .required("telephone is required");
      }
    }),
    telephones4: Yup.string().when("telephones", (value: any, schema: any) => {
      const i = Object.keys(formik.values).filter((key) =>
        key.startsWith("telephones")
      ).length;
      if (i >= 4) {
        return schema
          .matches(phoneRegex, {
            message: "Invalid telephone",
            excludeEmptyString: true,
          })
          .required("telephone is required");
      }
    }),

    // Dynamically added email fields validation
  });

  const formik = useFormik<stationType>({
    initialValues: {
      englishName: "",
      arabicName: "",
      address: "",
      countries: "",
      cities: "",
      telephones: [],
      emails: [],
      note: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission
      const emailFieldValues: any = Object.keys(values)
        .filter((key) => key.startsWith("email"))
        .sort(
          (a, b) =>
            parseInt(a.replace("email", "")) - parseInt(b.replace("email", ""))
        )
        .map((key) => values[key]);

      const telephoneFieldValues: any = Object.keys(values)
        .filter((key) => key.startsWith("telephone"))
        .sort(
          (a, b) =>
            parseInt(a.replace("telephone", "")) -
            parseInt(b.replace("telephone", ""))
        )
        .map((key) => values[key]);


      dispatch(SHOW_LOADER());
      try {
        await createStation({
          ...values,
          emails: emailFieldValues,
          telephones: telephoneFieldValues,
        });
        router.push("/stations");
      } catch (e) {
      } finally {
        // dispatch(HIDE_LOADER());
      }
      console.log(values);
    },
  });

  const addField = (field: any) => {
    const currentIndex =
      Object.keys(formik.values).filter((key) => key.startsWith(field)).length +
      1;

    const newKey = `${field}${currentIndex}`;
    // Extend the validation schema dynamically
    if (field === "emails") {
      console.log(currentIndex);

      validationSchema.fields[newKey] = Yup.string()
        .email("Invalid email")
        .required("Email is required");
    } else if (field === "telephones") {
      validationSchema.fields[newKey] = Yup.string()
        .matches(phoneRegex, {
          message: "Invalid telephone",
          excludeEmptyString: true,
        })
        .required("telephone is required");
    }

    currentIndex < 5 &&
      formik.setValues({
        ...formik.values,
        [newKey]: "",
      });
  };


  const removeField = (field: any) => {
    const keys = Object.keys(formik.values).filter((key) => key.startsWith(field));

    if (keys.length > 1) {
      const lastKey = keys[keys.length - 1];

      // Remove the last email field from the validation schema
      delete validationSchema.fields[lastKey];

      // Remove the last email field from formik values
      const newValues = { ...formik.values };
      delete newValues[lastKey];

      formik.setValues(newValues);
    }
  };

  //#region modules

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
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
                  <label className="text-lg h-12" htmlFor="englishName">
                    English Name<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="englishName"
                    id="englishName"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2  ${formik.touched.englishName && formik.errors.englishName
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      }} `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.englishName}
                  />
                  {formik.touched.englishName && formik.errors.englishName && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.englishName}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="arabicName">
                    Arabic Name<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="arabicName"
                    id="arabicName"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2  ${formik.touched.arabicName && formik.errors.arabicName
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      }} `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.arabicName}
                  />
                  {formik.touched.arabicName && formik.errors.arabicName && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.arabicName}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="address">
                    Address<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="address"
                    id="address"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.address && formik.errors.address
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                  />
                  {formik.touched.address && formik.errors.address && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.address}
                    </small>
                  )}
                </div>

                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="countries">
                    Country<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="countries"
                    id="countries"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.countries && formik.errors.countries
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.countries}
                  />
                  {formik.touched.countries && formik.errors.countries && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.countries}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="cities">
                    City<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cities"
                    id="cities"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.cities && formik.errors.cities
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.cities}
                  />
                  {formik.touched.cities && formik.errors.cities && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.cities}
                    </small>
                  )}
                </div>

                {Object.keys(formik.values)
                  .filter((key) => key.startsWith("telephones"))
                  .sort(
                    (a, b) =>
                      parseInt(a.replace("telephones", "")) -
                      parseInt(b.replace("telephones", ""))
                  )
                  .map((key: any, i, arr) => (
                    <div
                      key={key}
                      className="flex flex-col w-full gap-3 relative"
                    >
                      <div className={`flex gap-10	h-12`}>
                        <label
                          className={`text-lg flex items-center`}
                          htmlFor={key}
                        >
                          {capitalizeFirstLetter(key)}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {i === arr.length - 1 && i !== 3 && (
                          <div className="flex gap-1">
                            <Button
                              icon={
                                <span className="text-[#00733B] transition group-hover:text-white text-xl">
                                  <MdOutlineAdd />
                                </span>
                              }
                              title="Add"
                              classes=" hover:bg-[#00733B] group hover:text-[white] transition "
                              handleOnClick={() => addField("telephones")}
                            />
                            {i === 1 && <Button
                              icon={
                                <span className="text-red-500 text-2xl group-hover:text-white transition">
                                  <RiDeleteBin6Line />
                                </span>
                              }
                              classes="hover:bg-red-500 group transition"
                              handleOnClick={() =>
                                removeField("telephones")
                              }
                            />}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        id={key}
                        name={key}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[key]}
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched[key] && formik.errors[key]
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                          } `}
                      />
                      {formik.touched[key] && formik.errors[key] && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors[key]}
                        </small>
                      )}
                    </div>
                  ))}
                {Object.keys(formik.values)
                  .filter((key) => key.startsWith("emails"))
                  .sort(
                    (a, b) =>
                      parseInt(a.replace("emails", "")) -
                      parseInt(b.replace("emails", ""))
                  )
                  .map((key, i, arr) => (
                    <div
                      key={key}
                      className="flex flex-col w-full gap-3 relative"
                    >
                      <div className={`flex gap-10 h-12`}>
                        <label
                          className={`text-lg flex items-center`}
                          htmlFor={key}
                        >
                          {capitalizeFirstLetter(key)}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {i === arr.length - 1 && i !== 3 && (
                          <div className="flex gap-1">
                            <Button
                              icon={
                                <span className="text-[#00733B] transition group-hover:text-white text-xl">
                                  <MdOutlineAdd />
                                </span>
                              }
                              title="Add"
                              classes=" hover:bg-[#00733B] group hover:text-[white] transition "
                              handleOnClick={() => addField("emails")}
                            />
                            {i === 1 && <Button
                              icon={
                                <span className="text-red-500 text-2xl group-hover:text-white transition">
                                  <RiDeleteBin6Line />
                                </span>
                              }
                              classes="hover:bg-red-500 group transition"
                              handleOnClick={() =>
                                removeField("emails")
                              }
                            />}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        id={key}
                        name={key}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[key]}
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched[key] && formik.errors[key]
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                          } `}
                      />
                      {formik.touched[key] && formik.errors[key] && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors[key]}
                        </small>
                      )}
                      {formik.touched[key] && formik.errors[key] && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors[key]}
                        </small>
                      )}
                    </div>
                  ))}
              </div>
              <div className="grid grid-cols-1 w-full text-darkGray gap-5">
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="note">
                    Note
                  </label>

                  <textarea
                    name="note"
                    id="note"
                    rows={7}
                    className={`w-full rounded-md border border-lightGray shadow-md  px-2 `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.note}
                  />
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

export default NewStation;
