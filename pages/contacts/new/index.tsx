import Button from "@/components/Button";
import {
  CreateEmployeeDTO,
  Department,
  DepartmentTitles,
  EmployeeType,
  Segment,
  ValidationObject,
  accountInitalType,
  accountType,
  accountsValidationKeys,
  accountsValidationObject,
  contactInitalType,
  contactType,
  segmentType,
  validationKeys,
} from "@/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MdOutlineAdd } from "react-icons/md";
import { departments, employeeBase, segments } from "@/constants";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { BsCloudUpload } from "react-icons/bs";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useRouter as useNextRouter } from "next/router";
import { log } from "console";
import { createAccount, getAllAccounts } from "@/http/accountsHttp";
import { useFormik } from "formik";
import * as Yup from "yup";
import { use } from "i18next";
import { createSupplier } from "@/http/supplierHttp";
import countries from "@/constants/countries";
import { getAllSegments } from "@/http/segmentsHttp";
import { getAllProducts } from "@/http/productsHttp";
import SelectField from "@/components/ReactSelect/SelectField";
import { createContact, getAllContacts } from "@/http/contactsHttp";
export const getServerSideProps = async ({ locale }: any) => {
  const segmentsFetch = async () => {
    return await getAllSegments();
  };
  const productsFetch = async () => {
    return await getAllProducts();
  };
  const accountFetch = async () => {
    return await getAllAccounts();
  };

  const [segments, products, accounts] = await Promise.all([
    segmentsFetch(),
    productsFetch(),
    accountFetch(),
  ]);
  // console.log(segments);

  return {
    props: {
      segments,
      products,
      accounts,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

const NewAccount = ({
  segments,
  products,
  accounts,
}: {
  segments: segmentType[];
  products: any[];
  accounts: any[];
}) => {
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const router = useRouter();

  const phoneRegex = /^(\+\d{1,2}\s?)?(\(\d{1,}\)|\d{1,})([-\s]?\d{1,})+$/;

  const { isLoading } = useSelector((state: any) => state.loaderReducer);

  //#region initialization

  const validationSchema: any = Yup.object().shape({
    firstName: Yup.string()
      .min(3, "First Name should be between 3 and 20 letters!")
      .max(20, "First Name should be between 3 and 20 letters!")
      .required("First Name is required"),
    lastName: Yup.string()
      .min(3, "Last Name should be between 3 and 20 letters!")
      .max(20, "Last Name should be between 3 and 20 letters!")
      .required("Last Name is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    account: Yup.string().required("Account is required"),
    website: Yup.string().required("Website is required"),
    port: Yup.string().required("port is required"),
    segments: Yup.array().min(1, "Please Choose segments!"),
    products: Yup.array().min(1, "Please Choose products!"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    email2: Yup.string().when("email", (value: any, schema: any) => {
      const i = Object.keys(formik.values).filter((key) =>
        key.startsWith("email")
      ).length;
      if (i >= 2) {
        return schema.email("Invalid email").required("Email is required");
      }
    }),
    email3: Yup.string().when("email", (value: any, schema: any) => {
      const i = Object.keys(formik.values).filter((key) =>
        key.startsWith("email")
      ).length;
      if (i >= 3) {
        return schema.email("Invalid email").required("Email is required");
      }
    }),
    email4: Yup.string().when("email", (value: any, schema: any) => {
      const i = Object.keys(formik.values).filter((key) =>
        key.startsWith("email")
      ).length;
      if (i >= 4) {
        return schema.email("Invalid email").required("Email is required");
      }
    }),

    telephone: Yup.string()
      .matches(phoneRegex, {
        message: "Invalid telephone",
        excludeEmptyString: true,
      })
      .required("telephone is required"),
    telephone2: Yup.string().when("telephone", (value: any, schema: any) => {
      const i = Object.keys(formik.values).filter((key) =>
        key.startsWith("telephone")
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
    telephone3: Yup.string().when("telephone", (value: any, schema: any) => {
      const i = Object.keys(formik.values).filter((key) =>
        key.startsWith("telephone")
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
    telephone4: Yup.string().when("telephone", (value: any, schema: any) => {
      const i = Object.keys(formik.values).filter((key) =>
        key.startsWith("telephone")
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

  const formik = useFormik<contactInitalType>({
    initialValues: {
      firstName: "",
      lastName: "",
      website: "",
      country: "",
      city: "",
      telephone: "",
      email: "",
      port: "",
      note: "",
      account: "",
      segments: [],
      products: [],
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

      const portFieldValues: any = Object.keys(values)
        .filter((key) => key.startsWith("port"))
        .sort(
          (a, b) =>
            parseInt(a.replace("port", "")) - parseInt(b.replace("port", ""))
        )
        .map((key) => values[key]);
      const cityFieldValues: any = Object.keys(values)
        .filter((key) => key.startsWith("city"))
        .sort(
          (a, b) =>
            parseInt(a.replace("city", "")) - parseInt(b.replace("city", ""))
        )
        .map((key) => values[key]);
      const countryFieldValues: any = Object.keys(values)
        .filter((key) => key.startsWith("country"))
        .sort(
          (a, b) =>
            parseInt(a.replace("country", "")) -
            parseInt(b.replace("country", ""))
        )
        .map((key) => values[key]);
      const websiteFieldValues: any = Object.keys(values)
        .filter((key) => key.startsWith("website"))
        .sort(
          (a, b) =>
            parseInt(a.replace("website", "")) -
            parseInt(b.replace("website", ""))
        )
        .map((key) => values[key]);

      await createContact({
        ...values,
        emails: emailFieldValues,
        telephones: telephoneFieldValues,
        countries: countryFieldValues,
        cities: cityFieldValues,
        ports: portFieldValues,
        websites: websiteFieldValues,
      });
      router.push("/contacts");
      console.log(values);
    },
  });

  const addField = (field: any) => {
    const currentIndex =
      Object.keys(formik.values).filter((key) => key.startsWith(field)).length +
      1;

    const newKey = `${field}${currentIndex}`;
    // Extend the validation schema dynamically
    if (field === "email") {
      console.log(currentIndex);

      validationSchema.fields[newKey] = Yup.string()
        .email("Invalid email")
        .required("Email is required");
    } else if (field === "telephone") {
      validationSchema.fields[newKey] = Yup.string()
        .matches(phoneRegex, {
          message: "Invalid telephone",
          excludeEmptyString: true,
        })
        .required("telephone is required");
    } else {
      validationSchema.fields[newKey] = Yup.string().required(
        `${field} is required`
      );
    }

    currentIndex < 5 &&
      formik.setValues({
        ...formik.values,
        [newKey]: "",
      });
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
                  <label className="text-lg h-12" htmlFor="firstName">
                    First Name<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2  ${
                      formik.touched.firstName && formik.errors.firstName
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    }} `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.firstName}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="lastName">
                    Last Name<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.lastName && formik.errors.lastName
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.lastName}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
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
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="city">
                    City<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="city"
                    id="city"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      formik.touched.city && formik.errors.city
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                    } `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.city}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.city}
                    </small>
                  )}
                </div>
                {Object.keys(formik.values)
                  .filter((key) => key.startsWith("telephone"))
                  .sort(
                    (a, b) =>
                      parseInt(a.replace("telephone", "")) -
                      parseInt(b.replace("telephone", ""))
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
                          <Button
                            icon={
                              <span className="text-[#00733B] transition group-hover:text-white text-xl">
                                <MdOutlineAdd />
                              </span>
                            }
                            title="Add"
                            classes=" hover:bg-[#00733B] group hover:text-[white] transition "
                            handleOnClick={() => addField("telephone")}
                          />
                        )}
                      </div>
                      <input
                        type="text"
                        id={key}
                        name={key}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[key]}
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                          formik.touched[key] && formik.errors[key]
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
                  .filter((key) => key.startsWith("email"))
                  .sort(
                    (a, b) =>
                      parseInt(a.replace("email", "")) -
                      parseInt(b.replace("email", ""))
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
                          <Button
                            icon={
                              <span className="text-[#00733B] transition group-hover:text-white text-xl">
                                <MdOutlineAdd />
                              </span>
                            }
                            title="Add"
                            classes=" hover:bg-[#00733B] group hover:text-[white] transition "
                            handleOnClick={() => addField("email")}
                          />
                        )}
                      </div>
                      <input
                        type="text"
                        id={key}
                        name={key}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[key]}
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                          formik.touched[key] && formik.errors[key]
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

                {Object.keys(formik.values)
                  .filter((key) => key.startsWith("port"))
                  .sort(
                    (a, b) =>
                      parseInt(a.replace("port", "")) -
                      parseInt(b.replace("port", ""))
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
                          <Button
                            icon={
                              <span className="text-[#00733B] transition group-hover:text-white text-xl">
                                <MdOutlineAdd />
                              </span>
                            }
                            title="Add"
                            classes=" hover:bg-[#00733B] group hover:text-[white] transition "
                            handleOnClick={() => addField("port")}
                          />
                        )}
                      </div>
                      <input
                        type="text"
                        id={key}
                        name={key}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[key]}
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                          formik.touched[key] && formik.errors[key]
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
                  .filter((key) => key.startsWith("website"))
                  .sort(
                    (a, b) =>
                      parseInt(a.replace("website", "")) -
                      parseInt(b.replace("website", ""))
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
                          <Button
                            icon={
                              <span className="text-[#00733B] transition group-hover:text-white text-xl">
                                <MdOutlineAdd />
                              </span>
                            }
                            title="Add"
                            classes=" hover:bg-[#00733B] group hover:text-[white] transition "
                            handleOnClick={() => addField("website")}
                          />
                        )}
                      </div>
                      <input
                        type="text"
                        id={key}
                        name={key}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[key]}
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                          formik.touched[key] && formik.errors[key]
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
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg h-12" htmlFor="account">
                    Account<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={accounts?.map((res: any) => {
                      return {
                        value: res._id,
                        label: res.englishName,
                      };
                    })}
                    value={formik.values.account}
                    onChange={(value: any) =>
                      formik.setFieldValue("account", value.value)
                    }
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
              {/* Accessed Segments */}
              <div className="flex flex-col justify-center items-start w-full p-5 relative">
                {/* title */}
                <div className="text-darkGray border-b-[1px] w-full py-3">
                  <h2 className="text-2xl">
                    Segments
                    <span className="text-red-500 text-lg">*</span>
                  </h2>
                </div>

                {/* segments selection */}
                <div
                  className={`flex justify-center items-center w-full gap-10 p-10 border ${
                    formik.touched.segments && formik.errors.segments
                      ? " border-red-500"
                      : " border-lightGray "
                  }`}
                >
                  {segments?.map((segment: any, index) => (
                    <label
                      key={segment.title}
                      className={`w-[250px] h-[100px] cursor-pointer transition rounded-lg ${
                        formik.values.segments.includes(segment._id)
                          ? "bg-mainBlue text-white"
                          : "bg-bgGray text-black"
                      } shadow-md flex justify-center items-center text-xl font-light capitalize `}
                      // onClick={() => handleSegments(segment)}
                    >
                      {segment.name}{" "}
                      <input
                        type="checkbox"
                        name="segments"
                        id={`segments${index}`}
                        value={segment._id}
                        checked={formik.values.segments.includes(segment._id)}
                        onBlur={formik.handleBlur}
                        onChange={(event) => {
                          if (event.target.checked) {
                            formik.setFieldValue("segments", [
                              ...formik.values.segments,
                              segment._id,
                            ]);
                          } else {
                            formik.setFieldValue(
                              "segments",
                              formik.values.segments.filter(
                                (item) => item !== segment._id
                              )
                            );
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  ))}
                </div>
                {formik.touched.segments && formik.errors.segments && (
                  <small className={`text-red-500 absolute -bottom-2 left-10 `}>
                    {formik.errors.segments}
                  </small>
                )}
              </div>

              <div className="flex flex-col justify-center items-start w-full p-5 relative">
                {/* title */}
                <div className="text-darkGray border-b-[1px] w-full py-3">
                  <h2 className="text-2xl">
                    Products
                    <span className="text-red-500 text-lg">*</span>
                  </h2>
                </div>

                {/* poducts selection */}
                <div
                  className={`flex justify-center items-center w-full gap-10 p-10 border ${
                    formik.touched.products && formik.errors.products
                      ? " border-red-500"
                      : " border-lightGray "
                  }`}
                >
                  {products?.map((product: any, index) => (
                    <label
                      key={product.title}
                      className={`w-[182px] h-[65px] cursor-pointer transition rounded-lg ${
                        formik.values.products.includes(product._id)
                          ? "bg-mainBlue text-white"
                          : "bg-bgGray text-black"
                      } shadow-md flex justify-center items-center text-xl font-light capitalize `}
                      // onClick={() => handleproducts(product)}
                    >
                      {product.name}{" "}
                      <input
                        type="checkbox"
                        name="products"
                        id={`products${index}`}
                        value={product._id}
                        checked={formik.values.products.includes(product._id)}
                        onChange={(event) => {
                          if (event.target.checked) {
                            formik.setFieldValue("products", [
                              ...formik.values.products,
                              product._id,
                            ]);
                          } else {
                            formik.setFieldValue(
                              "products",
                              formik.values.products.filter(
                                (item) => item !== product._id
                              )
                            );
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  ))}
                </div>
                {formik.touched.products && formik.errors.products && (
                  <small className={`text-red-500 absolute -bottom-2 left-10 `}>
                    {formik.errors.products}
                  </small>
                )}
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

export default NewAccount;
