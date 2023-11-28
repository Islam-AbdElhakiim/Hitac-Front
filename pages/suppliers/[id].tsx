import Button from "@/components/Button";
import MyModal from "@/components/MyModal";
import Search from "@/components/Search";
import {
  departments,
  employeeBase,
  excludeProperty,
  segments,
} from "@/constants";
import {
  Account,
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
  supplierType,
  validationKeys,
} from "@/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { BsCloudUpload } from "react-icons/bs";
import {
  MdModeEdit,
  MdOutlineAdd,
  MdOutlineRadioButtonUnchecked,
} from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbArrowsSort } from "react-icons/tb";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { getUserById, updateEmp } from "@/http/employeeHttp";
import {
  deleteAccountById,
  getAccountById,
  updateAccount,
} from "@/http/accountsHttp";
import { getAllSegments } from "@/http/segmentsHttp";
import { getAllProducts } from "@/http/productsHttp";
import {
  deleteSupplierById,
  getSupplierById,
  updateSupplier,
} from "@/http/supplierHttp";
import countries from "@/constants/countries";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
export const getServerSideProps = async (context: any) => {
  const id = context.params.id;

  const supplierFetch = async () => {
    return await getSupplierById(id);
  };
  const segmentsFetch = async () => {
    return await getAllSegments();
  };
  const peoductsFetch = async () => {
    return await getAllProducts();
  };

  const [details, segments, products] = await Promise.all([
    supplierFetch(),
    segmentsFetch(),
    peoductsFetch(),
  ]);

  // console.log(employee, accounts)

  return {
    props: {
      details,
      segments,
      products,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};

const Supplier = ({
  details,
  segments,
  products,
}: {
  details: any;
  segments: any[];
  products: any[];
}) => {
  console.log(details);

  const searchParams = useSearchParams();
  const [isEdit, setIsEdit] = useState(false);

  const [contact, setContact] = useState<contactType>(details);
  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const dispatch = useDispatch<AppDispatch>();
  const phoneRegex = /^(\+\d{1,2}\s?)?(\(\d{1,}\)|\d{1,})([-\s]?\d{1,})+$/;
  const countryList = Object.keys(countries);
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const router = useRouter();

  // modal
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProfile, setIsProfile] = useState<boolean>(true);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalBody, setModalBody] = useState<string>();
  const [ifTrue, setIfTrue] = useState<() => void>(() => { });

  useEffect(() => {
    setIsEdit(searchParams.get("isEdit") !== "true");
  }, [searchParams]);

  // Handle remove User

  const validationSchema: any = Yup.object().shape({
    firstName: Yup.string()
      .min(3, "First Name should be between 3 and 20 letters!")
      .max(20, "First Name should be between 3 and 20 letters!")
      .required("First Name is required"),
    lastName: Yup.string()
      .min(3, "Last Name should be between 3 and 20 letters!")
      .max(20, "Last Name should be between 3 and 20 letters!")
      .required("Last Name is required"),
    countries: Yup.string().required("Country is required"),
    cities: Yup.string().required("City is required"),
    segments: Yup.array().min(1, "Please Choose segments!"),
    products: Yup.array().min(1, "Please Choose products!"),
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
  const telephones = details.telephones.reduce(
    (acc: any, currentValue: any, index: any) => {
      index == 0
        ? (acc["telephones"] = currentValue)
        : (acc[`telephones${index + 1}`] = currentValue);
      return acc;
    },
    {}
  );
  const emails = details.emails.reduce(
    (acc: any, currentValue: any, index: any) => {
      index == 0
        ? (acc["emails"] = currentValue)
        : (acc[`emails${index + 1}`] = currentValue);
      return acc;
    },
    {}
  );

  const initialValues = {
    firstName: details.firstName || "",
    lastName: details.lastName || "",
    countries: details.countries[0] || "",
    cities: details.cities[0] || "",
    ...telephones,
    ...emails,
    note: details.note || "",
    segments: details.segments._id || [],
    products: details.products._id || [],
  };

  const formik = useFormik<supplierType>({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission

      setModalTitle(`Are you sure?`);
      setModalBody(
        `Are you sure you want to Save all the updates ${details.firstName}`
      );
      setIfTrue(() => save);
      setIsOpen(true);
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
  const deleteAccount = (name: string, _id: any) => {
    //popup modal
    const deleteAcc = async () => {
      dispatch(SHOW_LOADER());
      try {
        await deleteSupplierById(_id);
        router.push("/suppliers");
      } catch (e) {
      } finally {
        dispatch(HIDE_LOADER());
      }
    };
    setModalTitle(`Are you sure?`);
    setModalBody(
      `Are you sure you want to delete ${name} from Hitac database?`
    );
    setIsOpen(true);
    setIfTrue(() => deleteAcc);
  };

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
    const countriesFieldValues: any = Object.keys(formik.values)
      .filter((key) => key.startsWith("countries"))
      .sort(
        (a, b) =>
          parseInt(a.replace("countries", "")) -
          parseInt(b.replace("countries", ""))
      )
      .map((key) => formik.values[key]);
    const citiesFieldValues: any = Object.keys(formik.values)
      .filter((key) => key.startsWith("cities"))
      .sort(
        (a, b) =>
          parseInt(a.replace("cities", "")) - parseInt(b.replace("cities", ""))
      )
      .map((key) => formik.values[key]);


    dispatch(SHOW_LOADER());
    try {
      await updateSupplier(details._id, {
        ...formik.values,
        emails: emailFieldValues,
        telephones: telephoneFieldValues,
        countries: countriesFieldValues,
        cities: citiesFieldValues,
      });

      router.push("/suppliers");
    } catch (e) {
    } finally {
      // dispatch(HIDE_LOADER());
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-start mt-5  bg-white rounded-xl shadow-md px-5 gap-3">
          {/* header- wrapper */}

          <div className="flex flex-col justify-center items-center w-full border-b-[1px] py-3 relative">
            {/* Control */}
            <Link
              href="/suppliers"
              className="absolute top-5 left-5 text-3xl text-mainBlue"
            >
              <IoMdArrowRoundBack />
            </Link>
            <h2 className=" font-light text-3xl my-4">{`${details?.firstName} ${details?.lastName}`}</h2>

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
                    deleteAccount(details.englishName, details?._id)
                  }
                />
              </div>
            </div>
            <div className="flex flex-row gap-3 justify-center items-center">
              <div
                className={`w-[150px] h-[50px] cursor-pointer transition rounded-lg ${isProfile
                  ? "bg-mainBlue text-white"
                  : "bg-lightGray text-black"
                  } shadow-md flex justify-center items-center text-xl font-light capitalize `}
                onClick={() => setIsProfile(true)}
              >
                Profile
              </div>
              <div
                className={`w-[150px] h-[50px] cursor-pointer transition rounded-lg ${!isProfile
                  ? "bg-mainBlue text-white"
                  : "bg-lightGray text-black"
                  } shadow-md flex justify-center items-center text-xl font-light capitalize `}
                onClick={() => setIsProfile(false)}
              >
                Transactions
              </div>
            </div>

            {/* username */}
          </div>

          {/* personal-data-section */}
          {isProfile && (
            <>
              <div className="flex flex-col items-start justify-start w-full p-5 gap-3 border rounded-xl mt-2">
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
                      <label className="text-lg h-12" htmlFor="firstname">
                        First Name<span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2  ${formik.touched.firstName && formik.errors.firstName
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                          } ${!isEdit ? "bg-white " : "bg-lightGray"} `}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstName}
                        disabled={isEdit}
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
                          } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                        disabled={isEdit}
                      />
                      {formik.touched.lastName && formik.errors.lastName && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.lastName}
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
                          } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
                        disabled={isEdit}
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
                          } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
                        disabled={isEdit}
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
                            disabled={isEdit}
                            className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched[key] && formik.errors[key]
                              ? "border-red-500 outline-red-500"
                              : "border-lightGray outline-lightGray"
                              } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
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
                            disabled={isEdit}
                            className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched[key] && formik.errors[key]
                              ? "border-red-500 outline-red-500"
                              : "border-lightGray outline-lightGray"
                              } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
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
                        className={`w-full rounded-md border border-lightGray shadow-md  px-2 ${!isEdit ? "bg-white " : "bg-lightGray"
                          }`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.note}
                        disabled={isEdit}
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
                      {segments?.map((segment: any, index) => (
                        <label
                          key={segment.title}
                          className={`w-[250px] h-[100px]  transition rounded-lg ${formik.values.segments.includes(segment._id)
                            ? "bg-mainBlue text-white"
                            : "bg-bgGray text-black"
                            } shadow-md flex justify-center items-center text-xl font-light capitalize ${!isEdit && "cursor-pointer"
                            } `}
                        // onClick={() => handleSegments(segment)}
                        >
                          {segment.name}{" "}
                          <input
                            type="checkbox"
                            name="segments"
                            id={`segments${index}`}
                            value={segment._id}
                            checked={formik.values.segments.includes(
                              segment._id
                            )}
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
                            disabled={isEdit}
                          />
                        </label>
                      ))}
                    </div>
                    {formik.touched.segments && formik.errors.segments && (
                      <small
                        className={`text-red-500 absolute -bottom-2 left-10 `}
                      >
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
                      {products?.map((product: any, index) => (
                        <label
                          key={product.title}
                          className={`w-[182px] h-[65px]  transition rounded-lg ${formik.values.products.includes(product._id)
                            ? "bg-mainBlue text-white"
                            : "bg-bgGray text-black"
                            } shadow-md flex justify-center items-center text-xl font-light capitalize  ${!isEdit && "cursor-pointer"
                            }`}
                        // onClick={() => handleproducts(product)}
                        >
                          {product.name}{" "}
                          <input
                            type="checkbox"
                            name="products"
                            id={`products${index}`}
                            value={product._id}
                            checked={formik.values.products.includes(
                              product._id
                            )}
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
                            disabled={isEdit}
                          />
                        </label>
                      ))}
                    </div>
                    {formik.touched.products && formik.errors.products && (
                      <small
                        className={`text-red-500 absolute -bottom-2 left-10 `}
                      >
                        {formik.errors.products}
                      </small>
                    )}
                  </div>

                  {/* Submit */}
                  {/* Edit */}
                  <div
                    className={`flex justify-center items-center p-5 w-full ${!isEdit ? "hidden" : "flex"
                      }`}
                  >
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

                  {/* Submit */}
                  <div
                    className={`flex justify-center items-center p-5 w-full ${!isEdit ? "flex" : "hidden"
                      }`}
                  >
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
                </form>
              </div>
            </>
          )}
          {!isProfile && (
            <>
              <div className="flex flex-col items-start justify-start w-full p-5 gap-3 border rounded-xl mt-2">
                {/* title */}
                <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
                  <h2>Account History</h2>
                </div>

                {/* data-form */}
                <div className="flex flex-col justify-start items-center w-full gap-10 py-5 text-darkGray">
                  {/* first row */}
                  <div className="grid grid-cols-1 w-full text-darkGray gap-5">
                    {/* left col */}
                    <div className="flex flex-col w-full gap-3 relative">
                      <label className="text-lg" htmlFor="firstname">
                        Total Debt:
                      </label>

                      <div
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 flex items-center 
                         `}
                      >
                        20000 L.E
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
                  <h2>Transactions</h2>
                </div>

                {/* data-form */}
                <div className="flex flex-col justify-start items-center w-full gap-10 py-5 text-darkGray">
                  {/* Table */}
                  <div className="w-full h-[80%] overflow-auto">
                    <table className={` w-full`}>
                      <thead className=" bg-bgGray ">
                        <tr className="  text-left ">
                          <th className="">
                            <span className=" inline-block relative top-1  mr-1 ">
                              {" "}
                              <TbArrowsSort />{" "}
                            </span>
                            <span>Type</span>
                          </th>
                          <th className="">
                            <span className=" inline-block relative top-1 mr-1 ">
                              {" "}
                              <TbArrowsSort />{" "}
                            </span>
                            <span>Order</span>
                          </th>
                          <th className="">
                            <span className=" inline-block relative top-1 mr-1 ">
                              {" "}
                              <TbArrowsSort />{" "}
                            </span>
                            <span>Total Before</span>
                          </th>
                          <th className="">
                            <span className=" inline-block relative top-1 mr-1 ">
                              {" "}
                              <TbArrowsSort />{" "}
                            </span>
                            <span>Amount</span>
                          </th>

                          <th className="">
                            <span className=" inline-block relative top-1 mr-1 ">
                              {" "}
                              <TbArrowsSort />{" "}
                            </span>
                            <span>Total After</span>
                          </th>
                          <th className="">
                            <span className=" inline-block relative top-1 mr-1 ">
                              {" "}
                              <TbArrowsSort />{" "}
                            </span>
                            <span>Date</span>
                          </th>
                          <th className="">
                            <span className=" inline-block relative top-1 mr-1 ">
                              {" "}
                              <TbArrowsSort />{" "}
                            </span>
                            <span>Notes</span>
                          </th>
                          <th className="">
                            <span className="  text-darkGray text-[26px]">
                              <PiDotsThreeCircleLight />
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="  h-[200px] border border-green-500 overflow-auto">
                        {[]
                          ?.filter((acc: any) => !acc.isDeleted)
                          .map((acc: any, index: number) => {
                            if (true) {
                              return (
                                <tr key={acc._id} className=" text-left h-full">
                                  <td
                                    className="check"
                                  // onClick={() => handleClick(acc)}
                                  >
                                    <input type="checkbox" readOnly />
                                  </td>
                                  <td>{acc._id}</td>
                                  <td>
                                    <div className="flex justify-center items-center gap-3 w-full">
                                      <div className=" w-1/2">
                                        <p className="text-xl text-darkGray  overflow-hidden max-w-full">
                                          {acc.englishName}
                                        </p>
                                      </div>
                                    </div>
                                  </td>

                                  <td>{acc.countries[0]}</td>
                                  <td>{acc.telephones}</td>
                                  <td>{acc.emails[0]}</td>
                                </tr>
                              );
                            }
                          })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {/* <div className="pagination-wrapper">
                    <div className="flex gap-5 justify-center items-center my-3">
                      <span className=" text-[#9A9A9A]  ">
                        Showing {startingIndex == 0 ? 1 : startingIndex} to{" "}
                        {currentPage * 10 > pageSuplliers?.length
                          ? pageSuplliers?.length
                          : currentPage * 10}{" "}
                        of {pageSuplliers?.length} entries
                      </span>
                      <button onClick={() => handlePrevPagination()}>
                        &lt;
                      </button>
                      <div className="pages">
                        <div className="bg-[#F0F3F5] py-1 px-4 rounded-lg">
                          {currentPage}
                        </div>
                      </div>
                      <button onClick={() => handleNextPagination()}>
                        &gt;
                      </button>
                    </div>
                  </div> */}
                </div>
              </div>
            </>
          )}

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

export default Supplier;
