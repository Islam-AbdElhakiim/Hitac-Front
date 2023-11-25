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

export const getServerSideProps = async (context: any) => {
  const id = context.params.id;

  const accountFetch = async () => {
    return await getAccountById(id);
  };

  const accountsFetch = async () => {
    return await (await fetch(`http://localhost:3002/accounts`)).json();
  };

  const [details, accounts] = await Promise.all([
    accountFetch(),
    accountsFetch(),
  ]);
  return {
    props: {
      details,
      accounts,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};

const Account = ({details,accounts,}: {details: any; accounts: Account[];}) => {
  console.log(details);
  console.log(accounts);
  
  const initAccount = () => ({
    englishName: details[0]?.englishName,
    arabicName: details[0]?.arabicName,
    website: details[0]?.website,
    countries: details[0]?.countries?.map((item: any) => ({ name: item })),
    emails: details[0]?.emails?.map((item: any) => ({ name: item })),
    telephones: details[0]?.telephones?.map((item: any) => ({ name: item })),
    cities: details[0]?.cities?.map((item: any) => ({ name: item })),
    ports: details[0]?.ports?.map((item: any) => ({ name: item })),
    segments: [],
    addresses: details[0]?.addresses?.length
      ? details[0]?.addresses?.map((item: any) => ({ name: item }))
      : [{ name: "" }],
    products: [],

    contacts: [],
  });

  const searchParams = useSearchParams();
  const [isEdit, setIsEdit] = useState(false);

  const [acc, setAcc] = useState<accountType>(details[0]);
  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const dispatch = useDispatch<AppDispatch>();

  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });
  const [AccessedDepartments, setAccessedDepartments] =
    useState<Department[]>(departments);
  const router = useRouter();

  // modal
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalBody, setModalBody] = useState<string>();
  const [ifTrue, setIfTrue] = useState<() => void>(() => {});
  // const []

  //#endregion

  //#region validation
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

  // console.log(emp);
  useEffect(() => {
    setIsEdit(searchParams.get("isEdit") !== "true");
  }, [searchParams]);
  const handleInput = (
    key: accountsValidationKeys,
    value: any,
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
      let data: any = { ...acc };
      data[key][index] = { name: value };
      console.log(data);

      setAcc(data);
    } else {
      setAcc((prev: any) => ({ ...prev, [key]: value }));
    }
  };

  //#region modules
  const [selectedSegments, setSelectedSegments] = useState<Segment[]>(segments);

  const handleSegments = (seg: Segment) => {
    if (isEdit) {
      seg.selected = !seg.selected;
      setSelectedSegments([...segments]);
      setValidation((prev: any) => ({ ...prev, segments: { isValid: true } }));
      let segs = selectedSegments
        .map((seg) => seg.selected && seg.title)
        .filter(Boolean) as any;

      setAcc((prev) => ({ ...prev, segments: segs }));
    }
  };
  const [selectedProducts, setSelectedProducts] = useState<Segment[]>(segments);

  const handleProducts = (prd: Segment) => {
    if (isEdit) {
      prd.selected = !prd.selected;
      setSelectedProducts([...segments]);
      setValidation((prev: any) => ({ ...prev, products: { isValid: true } }));
      let prds = selectedProducts
        .map((prd) => prd.selected && prd.title)
        .filter(Boolean) as any;

      setAcc((prev) => ({ ...prev, products: prds }));
    }
  };

  function handleAdd(arg0: string) {
    setAcc((prev: any) => {
      console.log(prev[arg0]);
      return {
        ...prev,
        [arg0]: [...prev[arg0], { name: "" }],
      };
    });
    console.log(arg0);
  }
  //#endregion

  //#region handle Saving
  const save = (e?: any) => {
    // e.preventDefault();
    //popup modal
    setModalTitle(`Are you sure?`);
    setModalBody(
      `Are you sure you want to Save all the updates ${details.firstName}`
    );
    setIfTrue(() => handleSubmit);
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    const data: any = { ...acc };
    Object.keys(acc)
      .filter(
        (key) => !["isDeleted", "notifications", "pinned", "__v"].includes(key)
      )
      .map((key: any) => {
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
            handleInput(key as accountsValidationKeys, data[key]);
          }
        }
      });

    // console.log(validation);
    // console.log(emp);

    let isFormError = Object.keys(validation).filter(
      (key) => !validation[key as accountsValidationKeys].isValid
    );
    console.log("errors", isFormError, data);

    if (isFormError.length <= 0) {
      dispatch(SHOW_LOADER());
      try {
        Object.keys(data).forEach((key: any) => {
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
          }
        });
        await updateAccount(data?._id, data);
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
  //#endregion

  // Handle remove User
  const deleteAccount = (name: string, _id: any) => {
    //popup modal
    const deleteAcc = async () => {
      dispatch(SHOW_LOADER());
      try {
        await deleteAccountById(_id);
        router.push("/accounts");
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
    setIfTrue(() => deleteAcc);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-start mt-5  h-[83vh] bg-white rounded-xl shadow-md overflow-auto px-5 gap-3">
          {/* header- wrapper */}

          <div className="flex flex-col justify-center items-center w-full border-b-[1px] py-3">
            {/* Control */}
            <h2 className=" font-light text-3xl my-4">{`${details[0]?.englishName}`}</h2>

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
                    deleteAccount(details[0].englishName, details[0]?._id)
                  }
                />
              </div>
            </div>

            {/* username */}
          </div>

          {/* personal-data-section */}
          <div className="flex flex-col items-start justify-start w-full p-5 gap-3 border rounded-xl mt-2">
            {/* title */}
            <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
              <h2>Personal Information</h2>
            </div>

            {/* data-form */}
            <form
              className="flex flex-col justify-start items-center w-full gap-10 py-5 text-darkGray"
              onSubmit={(e) => save(e)}
              autoComplete="off"
            >
              {/* disable autocomplete */}
              <input type="email" name="email" className="hidden" />
              <input type="password" className="hidden" />

              <div className="grid grid-cols-2 w-full text-darkGray gap-5">
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
                    } ${!isEdit ? "bg-white " : "bg-lightGray"} `}
                    value={acc?.englishName}
                    disabled={isEdit}
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
                    disabled={isEdit}
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      validation.arabicName.isValid
                        ? "border-lightGray outline-lightGray"
                        : "border-red-500 outline-red-500"
                    } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
                    value={acc.arabicName}
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
                    disabled={isEdit}
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      validation.website.isValid
                        ? "border-lightGray outline-lightGray"
                        : "border-red-500 outline-red-500"
                    } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
                    value={acc.website}
                    onChange={(e) => handleInput("website", e.target.value)}
                  />

                  <small
                    className={`text-red-500 absolute -bottom-6 left-2 ${
                      validation.website.isValid ? "hidden" : "block"
                    } `}
                  >
                    Arabic Name is required and should be between 3 and 20
                    letters!
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
                    disabled={isEdit}
                    className={`w-full h-12 rounded-md shadow-md  px-2 border ${
                      validation.contacts.isValid
                        ? "border-lightGray outline-lightGray"
                        : "border-red-500 outline-red-500"
                    } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
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
                {acc?.countries?.map((value: any, index: any, arr: any) => (
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
                      disabled={isEdit}
                      name={"country" + index}
                      id={"country" + index}
                      className={`w-full h-12 rounded-md shadow-md  px-2 border ${
                        validation.countries.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
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
                {acc?.cities?.map((value: any, index: any, arr: any) => (
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
                      disabled={isEdit}
                      name={"country" + index}
                      id={"country" + index}
                      className={`w-full h-12 rounded-md shadow-md  px-2 border ${
                        validation.cities.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
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
                {acc?.addresses?.map((value: any, index: any, arr: any) => (
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
                      disabled={isEdit}
                      name={"addresses" + index}
                      id={"addresses" + index}
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.addresses.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
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
                      Arabic Name is required and should be between 3 and 20
                      letters!
                    </small>
                  </div>
                ))}
                {acc?.ports?.map((value, index, arr) => (
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
                      disabled={isEdit}
                      name={"ports" + index}
                      id={"ports" + index}
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.ports.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
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
                      Arabic Name is required and should be between 3 and 20
                      letters!
                    </small>
                  </div>
                ))}
                {acc?.emails?.map((value, index, arr) => (
                  <div className="flex flex-col w-full gap-3 relative">
                    <label
                      className={`text-lg flex items-center	${
                        index !== arr.length - 1 && "pt-2.5 pb-3.5"
                      } `}
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
                      disabled={isEdit}
                      name={"emails" + index}
                      id={"emails" + index}
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.emails.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
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
                      Arabic Name is required and should be between 3 and 20
                      letters!
                    </small>
                  </div>
                ))}
                {acc?.telephones?.map((value, index, arr) => (
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
                      disabled={isEdit}
                      name={"telephones" + index}
                      id={"telephones" + index}
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.telephones.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
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
                      Arabic Name is required and should be between 3 and 20
                      letters!
                    </small>
                  </div>
                ))}
              </div>

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
                      } shadow-md flex justify-center items-center text-xl font-light capitalize ${
                        isEdit && "cursor-pointer"
                      }`}
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
                      } shadow-md flex justify-center items-center text-xl font-light capitalize ${
                        isEdit && "cursor-pointer"
                      }`}
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
            </form>
          </div>

          {/* Edit */}
          <div
            className={`flex justify-center items-center p-5 w-full ${
              !isEdit ? "hidden" : "flex"
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
            className={`flex justify-center items-center p-5 w-full ${
              !isEdit ? "flex" : "hidden"
            }`}
          >
            {/* <input type="submit" value="Create User" className="px-10 py-4 rounded-md bg-mainOrange text-white shadow-md text-center" /> */}
            <Button
              title="Save"
              handleOnClick={() => save()}
              icon={
                <span className="text-3xl">
                  <AiOutlineSave />{" "}
                </span>
              }
              classes="px-5 py-2 bg-mainOrange text-white text-xl hover:bg-mainOrange"
            />
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
