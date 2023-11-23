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
import { createAccount } from "@/http/accountsHttp";

export const getServerSideProps = async ({ locale }: any) => {
  return {
    props: { ...(await serverSideTranslations(locale, ["common"])) },
  };
};

const NewAccount = (props: any) => {
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });
  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { action, id } = useNextRouter().query;
  console.log(action, id);

  // const { isLoading } = useSelector((state: any) => state.loaderReducer);

  //#region initialization
  const initAccount = () => ({
    englishName: "",
    arabicName: "",
    website: "",
    countries: [{ name: "" }],
    emails: [{ name: "" }],
    telephones: [{ name: "" }],
    cities: [{ name: "" }],
    ports: [{ name: "" }],
    segments: [],
    addresses: [{ name: "" }],
    products: [],

    contacts: [],
  });

  const [newAccount, setNewAccount] = useState<accountType>(initAccount());

  const [validation, setValidation] = useState<accountsValidationObject>(
    () => ({
      englishName: {
        regex: /^.{3,20}$/,
        isValid: true,
      },
      arabicName: {
        regex: /^.{3,20}$/,
        isValid: true,
      },
      emails: {
        regex: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/,
        isValid: true,
      },
      telephones: {
        regex: /^(\+\d{1,2}\s?)?(\(\d{1,}\)|\d{1,})([-\s]?\d{1,})+$/,
        isValid: true,
      },
      countries: {
        isValid: true,
      },
      cities: {
        isValid: true,
      },
      ports: {
        isValid: true,
      },
      addresses: {
        isValid: true,
      },
      website: {
        isValid: true,
      },
      segments: {
        isValid: true,
      },
      products: {
        isValid: true,
      },
      contacts: {
        isValid: true,
      },
    })
  );
  //#endregion

  const handleInput = (
    key: accountsValidationKeys,
    value: string,
    index: number = 0
  ) => {
    if (Object.hasOwn(validation, key)) {
      if (
        [
          "countries",
          "cities",
          "ports",
          "addresses",
          "website",
          "segments",
          "products",
          "contacts",
        ].includes(key)
      ) {
        setValidation((prev: accountsValidationObject) => ({
          ...prev,
          [key]: { isValid: true },
        }));
      } else {
        //validate
        setValidation((prev: accountsValidationObject) => ({
          ...prev,
          [key]: { ...prev[key], isValid: prev[key].regex?.test(value) },
        }));
        console.log(validation);
      }
    }

    //update
    if (
      [
        "countries",
        "cities",
        "ports",
        "addresses",
        "emails",
        "telephones",
      ].includes(key)
    ) {
      let data: any = { ...newAccount };
      data[key][index] = { name: value };
      console.log(data);

      setNewAccount(data);
    } else {
      setNewAccount((prev: any) => ({ ...prev, [key]: value }));
    }
  };

  //#region modules
  const [selectedSegments, setSelectedSegments] = useState<Segment[]>(segments);

  const handleSegments = (seg: Segment) => {
    seg.selected = !seg.selected;
    setSelectedSegments([...segments]);
    setValidation((prev: any) => ({ ...prev, segments: { isValid: true } }));
    let segs = selectedSegments
      .map((seg) => seg.selected && seg.title)
      .filter(Boolean) as any;

    setNewAccount((prev) => ({ ...prev, segments: segs }));
  };
  const [selectedProducts, setSelectedProducts] = useState<Segment[]>(segments);

  const handleProducts = (prd: Segment) => {
    prd.selected = !prd.selected;
    setSelectedProducts([...segments]);
    setValidation((prev: any) => ({ ...prev, products: { isValid: true } }));
    let prds = selectedProducts
      .map((prd) => prd.selected && prd.title)
      .filter(Boolean) as any;

    setNewAccount((prev) => ({ ...prev, products: prds }));
  };

  //#endregion

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let data: any = { ...newAccount };
    console.log(data);

    // // e.target.preventDefault();
    let isFormError = Object.keys(newAccount).filter((key) => {
      if (
        !data[key] ||
        data[key] == "" ||
        (data[key]?.length == 0 &&
          data[key]?.filter((acc: any) => acc.name !== "")?.length == 0)
      ) {
        console.log(key);

        if (
          [
            "countries",
            "cities",
            "ports",
            "addresses",
            "emails",
            "telephones",
            "segments",
            "products",
            "website",
            "contacts",
          ].includes(key)
        ) {
          setValidation((prev) => ({ ...prev, [key]: { isValid: false } }));
        } else {
          handleInput(key as accountsValidationKeys, "");
        }

        return key;
      }
    });
    console.log(isFormError);
    if (isFormError.length <= 0) {
      dispatch(SHOW_LOADER());
      try {
        Object.keys(newAccount).forEach((key: any) => {
          if (
            [
              "countries",
              "cities",
              "ports",
              "addresses",
              "emails",
              "telephones",
            ].includes(key)
          ) {
            data[key] = data[key]?.map((item: any) => item.name);
            setNewAccount((prev: any) => ({ ...data }));
          }
        });
        console.log(data);
        createAccount(data);
        router.push("/accounts");
      } catch (e) {
        console.log(e);
      } finally {
        dispatch(HIDE_LOADER());
      }
    } else {
      return;
    }
  };
  function handleAdd(arg0: string) {
    setNewAccount((prev: any) => {
      console.log(prev[arg0]);
      return {
        ...prev,
        [arg0]: [...prev[arg0], { name: "" }],
      };
    });
    console.log(arg0);
  }

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
              onSubmit={(e) => handleSubmit(e)}
              autoComplete="off"
            >
              {/* disable autocomplete */}
              <input type="email" name="email" className="hidden" />
              <input type="password" className="hidden" />
              {/* first row */}
              <div className="grid grid-cols-2 w-full text-darkGray gap-5">
                {/* left col */}
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg" htmlFor="firstname">
                    English Name<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="englishName"
                    id="englishName"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      validation.englishName.isValid
                        ? "border-lightGray outline-lightGray"
                        : "border-red-500 outline-red-500"
                    } `}
                    value={newAccount?.englishName}
                    onChange={(e) => handleInput("englishName", e.target.value)}
                  />

                  <small
                    className={`text-red-500 absolute -bottom-6 left-2 ${
                      validation.englishName.isValid ? "hidden" : "block"
                    } `}
                  >
                    English Name is required and should be between 3 and 20
                    letters!
                  </small>
                </div>

                {/* right col */}
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg" htmlFor="lastname">
                    Arabic Name<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="arabicName"
                    id="arabicName"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      validation.arabicName.isValid
                        ? "border-lightGray outline-lightGray"
                        : "border-red-500 outline-red-500"
                    } `}
                    value={newAccount.arabicName}
                    onChange={(e) => handleInput("arabicName", e.target.value)}
                  />

                  <small
                    className={`text-red-500 absolute -bottom-6 left-2 ${
                      validation.arabicName.isValid ? "hidden" : "block"
                    } `}
                  >
                    Arabic Name is required and should be between 3 and 20
                    letters!
                  </small>
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg" htmlFor="lastname">
                    Website<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="website"
                    id="website"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      validation.website.isValid
                        ? "border-lightGray outline-lightGray"
                        : "border-red-500 outline-red-500"
                    } `}
                    value={newAccount.website}
                    onChange={(e) => handleInput("website", e.target.value)}
                  />

                  <small
                    className={`text-red-500 absolute -bottom-6 left-2 ${
                      validation.website.isValid ? "hidden" : "block"
                    } `}
                  >
                    Website is required
                  </small>
                </div>
                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg" htmlFor="contacts">
                    Contact<span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="contacts"
                    id="contacts"
                    className={`w-full h-12 rounded-md shadow-md  px-2 border ${
                      validation.contacts.isValid
                        ? "border-lightGray outline-lightGray"
                        : "border-red-500 outline-red-500"
                    }`}
                    onChange={(e) => {
                      handleInput("contacts", e.target.value);
                    }}
                  >
                    <option selected disabled>
                      Select
                    </option>
                    <option value="admin">Admin</option>
                    <option value="export-manager">Export Manager</option>
                    <option value="operation-specialist">
                      Operation Specialist
                    </option>
                    <option value="logistics-specialist">
                      Logistics-Specialist
                    </option>
                    <option value="accountant">Accountant</option>
                  </select>
                  <small
                    className={`text-red-500 absolute -bottom-6 left-2 ${
                      validation.contacts.isValid ? "hidden" : "block"
                    } `}
                  >
                    Please select a contacts!
                  </small>
                </div>
                {newAccount?.countries?.map((value, index, arr) => (
                  <div
                    className="flex flex-col w-full gap-3 relative"
                    key={index + value.name}
                  >
                    <label
                      className={`text-lg flex items-center	${
                        index !== arr.length - 1 && "pt-2.5 pb-3.5"
                      }`}
                      htmlFor="role"
                    >
                      Country<span className="text-red-500">*</span>
                      {index === arr.length - 1 && (
                        <Button
                          icon={
                            <span className="text-[#00733B] transition group-hover:text-white text-xl">
                              <MdOutlineAdd />
                            </span>
                          }
                          title="Add"
                          classes=" hover:bg-[#00733B] group hover:text-[white] transition mx-10"
                          handleOnClick={() => handleAdd("countries")}
                        />
                      )}
                    </label>
                    <select
                      value={value.name}
                      required
                      name={"country" + index}
                      id={"country" + index}
                      className={`w-full h-12 rounded-md shadow-md  px-2 border ${
                        validation.countries.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      }`}
                      onChange={(e) => {
                        handleInput("countries", e.target.value, index);
                      }}
                    >
                      <option selected disabled value="">
                        Select
                      </option>
                      <option value="admin">Admin</option>
                      <option value="export-manager">Export Manager</option>
                      <option value="operation-specialist">
                        Operation Specialist
                      </option>
                      <option value="logistics-specialist">
                        Logistics-Specialist
                      </option>
                      <option value="accountant">Accountant</option>
                    </select>
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 ${
                        validation.countries.isValid ? "hidden" : "block"
                      } `}
                    >
                      Please select a countries!
                    </small>
                  </div>
                ))}
                {newAccount?.cities?.map((value, index, arr) => (
                  <div
                    className="flex flex-col w-full gap-3 relative"
                    key={index + value.name}
                  >
                    <label
                      className={`text-lg flex items-center	${
                        index !== arr.length - 1 && "pt-2.5 pb-3.5"
                      }`}
                      htmlFor="role"
                    >
                      City<span className="text-red-500">*</span>
                      {index === arr.length - 1 && (
                        <Button
                          icon={
                            <span className="text-[#00733B] transition group-hover:text-white text-xl">
                              <MdOutlineAdd />
                            </span>
                          }
                          title="Add"
                          classes=" hover:bg-[#00733B] group hover:text-[white] transition mx-10"
                          handleOnClick={() => handleAdd("cities")}
                        />
                      )}
                    </label>
                    <select
                      value={value.name}
                      required
                      name={"country" + index}
                      id={"country" + index}
                      className={`w-full h-12 rounded-md shadow-md  px-2 border ${
                        validation.cities.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      }`}
                      onChange={(e) => {
                        handleInput("cities", e.target.value, index);
                      }}
                    >
                      <option selected disabled value="">
                        Select
                      </option>
                      <option value="admin">Admin</option>
                      <option value="export-manager">Export Manager</option>
                      <option value="operation-specialist">
                        Operation Specialist
                      </option>
                      <option value="logistics-specialist">
                        Logistics-Specialist
                      </option>
                      <option value="accountant">Accountant</option>
                    </select>
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 ${
                        validation.countries.isValid ? "hidden" : "block"
                      } `}
                    >
                      Please select a cities!
                    </small>
                  </div>
                ))}
                {newAccount?.addresses?.map((value, index, arr) => (
                  <div className="flex flex-col w-full gap-3 relative">
                    <label
                      className={`text-lg flex items-center	${
                        index !== arr.length - 1 && "pt-2.5 pb-3.5"
                      }`}
                      htmlFor="role"
                    >
                      Address<span className="text-red-500">*</span>
                      {index === arr.length - 1 && (
                        <Button
                          icon={
                            <span className="text-[#00733B] transition group-hover:text-white text-xl">
                              <MdOutlineAdd />
                            </span>
                          }
                          title="Add"
                          classes=" hover:bg-[#00733B] group hover:text-[white] transition mx-10"
                          handleOnClick={() => handleAdd("addresses")}
                        />
                      )}
                    </label>
                    <input
                      type="text"
                      name={"addresses" + index}
                      id={"addresses" + index}
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.addresses.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } `}
                      value={value?.name}
                      onChange={(e) =>
                        handleInput("addresses", e.target.value, index)
                      }
                    />

                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 ${
                        validation.addresses.isValid ? "hidden" : "block"
                      } `}
                    >
                      Address is required
                    </small>
                  </div>
                ))}
                {newAccount?.ports?.map((value, index, arr) => (
                  <div className="flex flex-col w-full gap-3 relative">
                    <label
                      className={`text-lg flex items-center	${
                        index !== arr.length - 1 && "pt-2.5 pb-3.5"
                      }`}
                      htmlFor="ports"
                    >
                      Port<span className="text-red-500">*</span>
                      {index === arr.length - 1 && (
                        <Button
                          icon={
                            <span className="text-[#00733B] transition group-hover:text-white text-xl">
                              <MdOutlineAdd />
                            </span>
                          }
                          title="Add"
                          classes=" hover:bg-[#00733B] group hover:text-[white] transition mx-10"
                          handleOnClick={() => handleAdd("ports")}
                        />
                      )}
                    </label>
                    <input
                      type="text"
                      name={"ports" + index}
                      id={"ports" + index}
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.ports.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } `}
                      value={value.name}
                      onChange={(e) =>
                        handleInput("ports", e.target.value, index)
                      }
                    />

                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 ${
                        validation.ports.isValid ? "hidden" : "block"
                      } `}
                    >
                      Port is required
                    </small>
                  </div>
                ))}
                {newAccount?.emails?.map((value, index, arr) => (
                  <div className="flex flex-col w-full gap-3 relative">
                    <label
                      className={`text-lg flex items-center	${
                        index !== arr.length - 1 && "pt-2.5 pb-3.5"
                      }`}
                      htmlFor="emails"
                    >
                      Email<span className="text-red-500">*</span>
                      {index === arr.length - 1 && (
                        <Button
                          icon={
                            <span className="text-[#00733B] transition group-hover:text-white text-xl">
                              <MdOutlineAdd />
                            </span>
                          }
                          title="Add"
                          classes=" hover:bg-[#00733B] group hover:text-[white] transition mx-10"
                          handleOnClick={() => handleAdd("emails")}
                        />
                      )}
                    </label>
                    <input
                      type="text"
                      name={"emails" + index}
                      id={"emails" + index}
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.emails.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } `}
                      value={value.name}
                      onChange={(e) =>
                        handleInput("emails", e.target.value, index)
                      }
                    />

                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 ${
                        validation.emails.isValid ? "hidden" : "block"
                      } `}
                    >
                      Please enter a valid email address!
                    </small>
                  </div>
                ))}
                {newAccount?.telephones?.map((value, index, arr) => (
                  <div className="flex flex-col w-full gap-3 relative">
                    <label
                      className={`text-lg flex items-center	${
                        index !== arr.length - 1 && "pt-2.5 pb-3.5"
                      }`}
                      htmlFor="telephones"
                    >
                      Telephone<span className="text-red-500">*</span>
                      {index === arr.length - 1 && (
                        <Button
                          icon={
                            <span className="text-[#00733B] transition group-hover:text-white text-xl">
                              <MdOutlineAdd />
                            </span>
                          }
                          title="Add"
                          classes=" hover:bg-[#00733B] group hover:text-[white] transition mx-10"
                          handleOnClick={() => handleAdd("telephones")}
                        />
                      )}
                    </label>
                    <input
                      type="text"
                      name={"telephones" + index}
                      id={"telephones" + index}
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.telephones.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } `}
                      value={value.name}
                      onChange={(e) =>
                        handleInput("telephones", e.target.value, index)
                      }
                    />

                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 ${
                        validation.telephones.isValid ? "hidden" : "block"
                      } `}
                    >
                      Please enter a valid Telephone Number!
                    </small>
                  </div>
                ))}

                {/* right col */}
                {/* <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg" htmlFor="telephone">
                    Telephone<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="telephone"
                    name="telephone"
                    id="telephone"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      validation.telephones.isValid
                        ? "border-lightGray outline-lightGray"
                        : "border-red-500 outline-red-500"
                    } `}
                    value={newAccount.telephones}
                    onChange={(e) => handleInput("telephones", e.target.value)}
                  />

                  <small
                    className={`text-red-500 absolute -bottom-6 left-2 ${
                      validation.telephones.isValid ? "hidden" : "block"
                    } `}
                  >
                    Please enter a valid Telephone Number!
                  </small>
                </div> */}
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

                {/* departments selection */}
                <div
                  className={`flex justify-center items-center w-full gap-10 p-10 border ${
                    validation.segments.isValid
                      ? " border-lightGray "
                      : " border-red-500"
                  }`}
                >
                  {selectedSegments.map((segment) => (
                    <div
                      key={segment.title}
                      className={`w-[250px] h-[100px] cursor-pointer transition rounded-lg ${
                        segment.selected == true
                          ? "bg-mainBlue text-white"
                          : "bg-bgGray text-black"
                      } shadow-md flex justify-center items-center text-xl font-light capitalize `}
                      onClick={() => handleSegments(segment)}
                    >
                      {segment.title}{" "}
                    </div>
                  ))}
                </div>
                <small
                  className={`text-red-500 absolute -bottom-2 left-10 ${
                    validation.segments.isValid ? "hidden" : "block"
                  } `}
                >
                  Please Choose segments!
                </small>
              </div>

              <div className="flex flex-col justify-center items-start w-full p-5 relative">
                {/* title */}
                <div className="text-darkGray border-b-[1px] w-full py-3">
                  <h2 className="text-2xl">
                    Products
                    <span className="text-red-500 text-lg">*</span>
                  </h2>
                </div>

                {/* departments selection */}
                <div
                  className={`flex justify-center items-center w-full gap-10 p-10 border ${
                    validation.products.isValid
                      ? " border-lightGray "
                      : " border-red-500"
                  }`}
                >
                  {selectedProducts.map((product) => (
                    <div
                      key={product.title}
                      className={`w-[250px] h-[100px] cursor-pointer transition rounded-lg ${
                        product.selected == true
                          ? "bg-mainBlue text-white"
                          : "bg-bgGray text-black"
                      } shadow-md flex justify-center items-center text-xl font-light capitalize `}
                      onClick={() => handleProducts(product)}
                    >
                      {product.title}{" "}
                    </div>
                  ))}
                </div>
                <small
                  className={`text-red-500 absolute -bottom-2 left-10 ${
                    validation.products.isValid ? "hidden" : "block"
                  } `}
                >
                  Please Choose products!
                </small>
              </div>

              {/* Submit */}
              <div className="flex justify-center items-center p-5 w-full">
                <Button
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
