import Button from "@/components/Button";
import MyModal from "@/components/MyModal";

import { accountInitalType, contactInitalType } from "@/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { BsCloudUpload } from "react-icons/bs";
import { MdModeEdit, MdOutlineAdd } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";

import {
  deleteAccountById,
  getAccountById,
  getAllAccounts,
  updateAccount,
} from "@/http/accountsHttp";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllSegments } from "@/http/segmentsHttp";
import { getAllProducts } from "@/http/productsHttp";
import SelectField from "@/components/ReactSelect/SelectField";
import {
  deleteContactById,
  getAllContacts,
  getContactById,
  updateContact,
} from "@/http/contactsHttp";
import { FaBackspace } from "react-icons/fa";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
export const getServerSideProps = async (context: any) => {
  const id = context.params.id;

  const contactFetch = async () => {
    return await getContactById(id);
  };

  const segmentsFetch = async () => {
    return await getAllSegments();
  };
  const peoductsFetch = async () => {
    return await getAllProducts();
  };

  const accountsFetch = async () => {
    return await getAllAccounts();
  };

  const [details, segments, products, accounts] = await Promise.all([
    contactFetch(),
    segmentsFetch(),
    peoductsFetch(),
    accountsFetch(),
  ]);
  return {
    props: {
      details,
      segments,
      products,
      accounts,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};

const Account = ({
  details,
  segments,
  products,
  accounts,
}: {
  details: any;
  segments: any;
  products: any;
  accounts: any;
}) => {
  const searchParams = useSearchParams();
  const [isEdit, setIsEdit] = useState(false);

  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const dispatch = useDispatch<AppDispatch>();
  const phoneRegex = /^(\+\d{1,2}\s?)?(\(\d{1,}\)|\d{1,})([-\s]?\d{1,})+$/;

  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const router = useRouter();

  // modal
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalBody, setModalBody] = useState<string>();
  const [ifTrue, setIfTrue] = useState<() => void>(() => { });

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
  const telephones = details.telephones.reduce(
    (acc: any, currentValue: any, index: any) => {
      index == 0
        ? (acc["telephone"] = currentValue)
        : (acc[`telephone${index + 1}`] = currentValue);
      return acc;
    },
    {}
  );
  const emails = details.emails.reduce(
    (acc: any, currentValue: any, index: any) => {
      index == 0
        ? (acc["email"] = currentValue)
        : (acc[`email${index + 1}`] = currentValue);
      return acc;
    },
    {}
  );
  const ports = details.ports.reduce(
    (acc: any, currentValue: any, index: any) => {
      index == 0
        ? (acc["port"] = currentValue)
        : (acc[`port${index + 1}`] = currentValue);
      return acc;
    },
    {}
  );

  const websites = details.websites
    ? details.websites.reduce((acc: any, currentValue: any, index: any) => {
      index == 0
        ? (acc["website"] = currentValue)
        : (acc[`website${index + 1}`] = currentValue);
      return acc;
    }, {})
    : { website: "" };

  const initialValues = {
    firstName: details.firstName || "",
    lastName: details.lastName || "",
    note: details.note || "",
    account: details.account?._id || "",
    country: details.countries[0] || "",
    city: details.cities[0] || "",
    ...telephones,
    ...emails,
    ...websites,

    ...ports,
    segments: details.segments || [],
    products: details.products || [],
  };

  const formik = useFormik<contactInitalType>({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission
      console.log(values);

      setModalTitle(`Are you sure?`);
      setModalBody(
        `Are you sure you want to Save all the updates ${details.firstName}  ${details.lastName}`
      );
      setIfTrue(() => save);
      setIsOpen(true);
    },
  });
  console.log(formik.errors);

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

  useEffect(() => {
    setIsEdit(searchParams.get("isEdit") !== "true");
  }, [searchParams]);
  //#region modules

  //#endregion

  //#region handle Saving
  const save = async (e?: any) => {
    const emailFieldValues: any = Object.keys(formik.values)
      .filter((key) => key.startsWith("email"))
      .sort(
        (a, b) =>
          parseInt(a.replace("email", "")) - parseInt(b.replace("email", ""))
      )
      .map((key) => formik.values[key]);

    const telephoneFieldValues: any = Object.keys(formik.values)
      .filter((key) => key.startsWith("telephone"))
      .sort(
        (a, b) =>
          parseInt(a.replace("telephone", "")) -
          parseInt(b.replace("telephone", ""))
      )
      .map((key) => formik.values[key]);

    const portFieldValues: any = Object.keys(formik.values)
      .filter((key) => key.startsWith("port"))
      .sort(
        (a, b) =>
          parseInt(a.replace("port", "")) - parseInt(b.replace("port", ""))
      )
      .map((key) => formik.values[key]);
    const cityFieldValues: any = Object.keys(formik.values)
      .filter((key) => key.startsWith("city"))
      .sort(
        (a, b) =>
          parseInt(a.replace("city", "")) - parseInt(b.replace("city", ""))
      )
      .map((key) => formik.values[key]);
    const countryFieldValues: any = Object.keys(formik.values)
      .filter((key) => key.startsWith("country"))
      .sort(
        (a, b) =>
          parseInt(a.replace("country", "")) -
          parseInt(b.replace("country", ""))
      )
      .map((key) => formik.values[key]);
    const websiteFieldValues: any = Object.keys(formik.values)
      .filter((key) => key.startsWith("website"))
      .sort(
        (a, b) =>
          parseInt(a.replace("website", "")) -
          parseInt(b.replace("website", ""))
      )
      .map((key) => formik.values[key]);
    dispatch(SHOW_LOADER());

    try {
      await updateContact(details._id, {
        ...formik.values,
        emails: emailFieldValues,
        telephones: telephoneFieldValues,
        countries: countryFieldValues,
        cities: cityFieldValues,
        ports: portFieldValues,
        websites: websiteFieldValues,
      });
      router.push("/contacts");
    } catch (e) {
    } finally {
      // dispatch(HIDE_LOADER());
    }
  };





  //#endregion

  // Handle remove User
  const deleteAccount = (name: string, _id: any) => {
    //popup modal
    const deletes = async () => {
      dispatch(SHOW_LOADER());
      try {
        await deleteContactById(_id);
        router.push("/contacts");
      } catch (e) {
        console.log("error in deleting account", e);
      } finally {
        dispatch(HIDE_LOADER());
      }
    };
    setModalTitle(`Are you sure?`);
    setModalBody(
      `Are you sure you want to delete ${name} from Hitac database?`
    );
    setIsOpen(true);
    setIfTrue(() => deletes);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-start mt-5  bg-white rounded-xl shadow-md  px-5 gap-3">
          {/* header- wrapper */}

          <div className="flex flex-col justify-center items-center w-full border-b-[1px] py-3 relative">
            <Link
              href="/contacts"
              className="absolute top-5 left-5 text-3xl text-mainBlue"
            >
              <IoMdArrowRoundBack />
            </Link>
            {/* Control */}
            <h2 className=" font-light text-3xl my-4">
              {`${details?.firstName}`} {`${details?.lastName}`}
            </h2>

            <div className="flex flex-col justify-center items-center">
              <div className="flex items-center justify-center">
                <Button
                  icon={
                    <span className="text-mainBlue text-2xl group-hover:text-white transition">
                      <MdModeEdit />
                    </span>
                  }
                  classes=" hover:bg-mainBlue group transition"
                  handleOnClick={() => setIsEdit(!isEdit)}
                />
                <Button
                  icon={
                    <span className="text-red-500 text-2xl group-hover:text-white transition">
                      <RiDeleteBin6Line />
                    </span>
                  }
                  classes="hover:bg-red-500 group transition"
                  handleOnClick={() =>
                    deleteAccount(
                      `${`${details?.firstName}`} ${`${details?.lastName}`}`,
                      details?._id
                    )
                  }
                />
              </div>
            </div>

            {/* username */}
          </div>

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
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2  ${formik.touched.firstName && formik.errors.firstName
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                      }  ${!isEdit ? "bg-white " : "bg-lightGray"} `}
                    disabled={isEdit}
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
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.lastName && formik.errors.lastName
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                      }  ${!isEdit ? "bg-white " : "bg-lightGray"}`}
                    disabled={isEdit}
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
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.country && formik.errors.country
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                      }  ${!isEdit ? "bg-white " : "bg-lightGray"}`}
                    disabled={isEdit}
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
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.city && formik.errors.city
                        ? "border-red-500 outline-red-500"
                        : "border-lightGray outline-lightGray"
                      }  ${!isEdit ? "bg-white " : "bg-lightGray"}`}
                    disabled={isEdit}
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
                        {!isEdit && i === arr.length - 1 && i !== 3 && (
                          <div className="flex gap-1">
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
                            {i === 1 && <Button
                              icon={
                                <span className="text-red-500 text-2xl group-hover:text-white transition">
                                  <RiDeleteBin6Line />
                                </span>
                              }
                              classes="hover:bg-red-500 group transition"
                              handleOnClick={() =>
                                removeField("telephone")
                              }
                            />}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        id={key}
                        name={key}
                        disabled={isEdit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[key]}
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched[key] && formik.errors[key]
                            ? "border-red-500 outline-red-500"
                            : "border-lightGray outline-lightGray"
                          }  ${!isEdit ? "bg-white " : "bg-lightGray"}`}
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
                        {!isEdit && i === arr.length - 1 && i !== 3 && (
                          <div className="flex gap-1">
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
                            {i === 1 && <Button
                              icon={
                                <span className="text-red-500 text-2xl group-hover:text-white transition">
                                  <RiDeleteBin6Line />
                                </span>
                              }
                              classes="hover:bg-red-500 group transition"
                              handleOnClick={() =>
                                removeField("email")
                              }
                            />}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        id={key}
                        name={key}
                        disabled={isEdit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[key]}
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched[key] && formik.errors[key]
                            ? "border-red-500 outline-red-500"
                            : "border-lightGray outline-lightGray"
                          }  ${!isEdit ? "bg-white " : "bg-lightGray"}`}
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
                        {!isEdit && i === arr.length - 1 && i !== 3 && (
                          <div className="flex gap-1">
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
                            {i === 1 && <Button
                              icon={
                                <span className="text-red-500 text-2xl group-hover:text-white transition">
                                  <RiDeleteBin6Line />
                                </span>
                              }
                              classes="hover:bg-red-500 group transition"
                              handleOnClick={() =>
                                removeField("port")
                              }
                            />}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        id={key}
                        name={key}
                        disabled={isEdit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[key]}
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched[key] && formik.errors[key]
                            ? "border-red-500 outline-red-500"
                            : "border-lightGray outline-lightGray"
                          } ${!isEdit ? "bg-white " : "bg-lightGray"} `}
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
                        {!isEdit && i === arr.length - 1 && i !== 3 && (
                          <div className="flex gap-1">
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
                            {i === 1 && <Button
                              icon={
                                <span className="text-red-500 text-2xl group-hover:text-white transition">
                                  <RiDeleteBin6Line />
                                </span>
                              }
                              classes="hover:bg-red-500 group transition"
                              handleOnClick={() =>
                                removeField("website")
                              }
                            />}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        id={key}
                        name={key}
                        disabled={isEdit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[key]}
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched[key] && formik.errors[key]
                            ? "border-red-500 outline-red-500"
                            : "border-lightGray outline-lightGray"
                          }  ${!isEdit ? "bg-white " : "bg-lightGray"}`}
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
                    isDisabled={isEdit}
                    value={formik.values.account}
                    onChange={(value: any) =>
                      formik.setFieldValue("account", value.value)
                    }
                    isLink={true}
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
                    className={`w-full rounded-md border border-lightGray shadow-md  px-2   ${!isEdit ? "bg-white " : "bg-lightGray"
                      }`}
                    disabled={isEdit}
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
                  className={`flex justify-center items-center w-full gap-10 p-10 border ${formik.touched.segments && formik.errors.segments
                      ? " border-red-500"
                      : " border-lightGray "
                    }`}
                >
                  {segments?.map((segment: any, index: any) => (
                    <label
                      key={segment.title}
                      className={`w-[250px] h-[100px] transition rounded-lg ${formik.values.segments.includes(segment._id)
                          ? "bg-mainBlue text-white"
                          : "bg-bgGray text-black"
                        } shadow-md flex justify-center items-center text-xl font-light capitalize ${!isEdit && "cursor-pointer"
                        }`}
                    // onClick={() => handleSegments(segment)}
                    >
                      {segment.name}{" "}
                      <input
                        type="checkbox"
                        name="segments"
                        id={`segments${index}`}
                        value={segment._id}
                        disabled={isEdit}
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
                  className={`flex justify-center items-center w-full gap-10 p-10 border ${formik.touched.products && formik.errors.products
                      ? " border-red-500"
                      : " border-lightGray "
                    }`}
                >
                  {products?.map((product: any, index: any) => (
                    <label
                      key={product.title}
                      className={`w-[182px] h-[65px] transition rounded-lg ${formik.values.products.includes(product._id)
                          ? "bg-mainBlue text-white"
                          : "bg-bgGray text-black"
                        } shadow-md flex justify-center items-center text-xl font-light capitalize ${!isEdit && "cursor-pointer"
                        }`}
                    // onClick={() => handleproducts(product)}
                    >
                      {product.name}{" "}
                      <input
                        type="checkbox"
                        name="products"
                        id={`products${index}`}
                        value={product._id}
                        disabled={isEdit}
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

              {/* Edit */}
              {isEdit && (
                <div className={`flex justify-center items-center p-5 w-full `}>
                  {/* <input type="submit" value="Create User" className="px-10 py-4 rounded-md bg-mainOrange text-white shadow-md text-center" /> */}
                  <Button
                    title="Update"
                    handleOnClick={() => setIsEdit(!isEdit)}
                    icon={
                      <span className="text-3xl">
                        <MdModeEdit />{" "}
                      </span>
                    }
                    classes="px-5 py-2 bg-lightGray text-mainBlue text-xl hover:bg-mainBlue hover:text-white transition"
                  />
                </div>
              )}

              {/* Submit */}
              {!isEdit && (
                <div className={`flex justify-center items-center p-5 w-full `}>
                  {/* <input type="submit" value="Create User" className="px-10 py-4 rounded-md bg-mainOrange text-white shadow-md text-center" /> */}
                  <Button
                    title="Save"
                    type="submit"
                    icon={
                      <span className="text-3xl">
                        <AiOutlineSave />{" "}
                      </span>
                    }
                    classes="px-5 py-2 bg-mainOrange text-white text-xl hover:bg-mainOrange"
                  />
                </div>
              )}
            </form>
          </div>

          {/* Modal */}
          <MyModal
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            title={modalTitle}
            body={modalBody}
            ifTrue={ifTrue}
          />
        </div>
      )}
    </>
  );
};

export default Account;
