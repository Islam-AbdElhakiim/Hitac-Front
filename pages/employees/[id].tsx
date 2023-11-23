import Button from "@/components/Button";
import MyModal from "@/components/MyModal";
import Search from "@/components/Search";
import { departments, employeeBase, excludeProperty } from "@/constants";
import {
  Account,
  CreateEmployeeDTO,
  Department,
  DepartmentTitles,
  EmployeeType,
  ValidationObject,
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
import { deleteUserById, getUserById, updateEmp } from "@/http/employeeHttp";

export const getServerSideProps = async (context: any) => {
  const id = context.params.id;

  const employeefetch = async () => {
    return await getUserById(id);
  };
  const accountsFetch = async () => {
    return await (await fetch(`http://localhost:3002/accounts`)).json();
  };

  const [employee, accounts] = await Promise.all([
    employeefetch(),
    accountsFetch(),
  ]);
  // console.log(employee, accounts)

  return {
    props: {
      employee,
      accounts,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};

const Employee = ({
  employee,
  accounts,
}: {
  employee: EmployeeType;
  accounts: Account[];
}) => {
  const searchParams = useSearchParams();
  const [isEdit, setIsEdit] = useState(false);

  const [searchedAccounts, setSearchedAccounts] = useState<Account[]>(accounts);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(
    new Array<string>()
  );
  const [accessedAccounts, setAccessedAccounts] = useState<Account[]>(
    accounts.filter((acc) => employee.accessedAccounts?.includes(acc._id))
  );
  const [emp, setEmp] = useState<EmployeeType>(employee);
  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const dispatch = useDispatch<AppDispatch>();
  const [temoPasswrod, setTempPassword] = useState<string>("");

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

  //#region image
  // image
  const [filePath, setFilePath] = useState(emp.image);
  const handleImageUpload = async (e: any) => {
    const files = e.target.files;
    console.log(files[0]);
    const formData = new FormData();
    formData.append("image", files[0]);
    const res = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data) {
      console.log(data.filePath.slice(8));
      console.log(typeof data.filePath.slice(8));
      setFilePath(data.filePath.slice(8));
      setEmp((prev) => ({ ...prev, image: data.filePath.slice(8) }));
    }
  };

  //#endregion

  //#region validation
  const [validation, setValidation] = useState<ValidationObject>(() => ({
    firstName: {
      regex: /^.{3,20}$/,
      isValid: true,
    },
    lastName: {
      regex: /^.{3,20}$/,
      isValid: true,
    },
    email: {
      regex: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/,
      isValid: true,
    },
    telephone: {
      regex: /^(\+\d{1,2}\s?)?(\(\d{1,}\)|\d{1,})([-\s]?\d{1,})+$/,
      isValid: true,
    },
    age: {
      regex: /^(1[0-9]|[2-7][0-9]|80)$/,
      isValid: true,
    },
    salary: {
      regex: /^(500|[1-9]\d{2,4}|200000)$/,
      isValid: true,
    },
    password: {
      regex: /^.{0}$|^.{8,}$/,
      isValid: true,
    },
    confirmPassword: {
      isValid: true,
    },
    role: {
      isValid: true,
    },
    hiringDate: {
      isValid: true,
    },
    modules: {
      isValid: true,
    },
  }));

  console.log(emp);
  useEffect(() => {
    setIsEdit(searchParams.get("isEdit") === "true");
  }, [searchParams]);
  const handleInput = (key: validationKeys, value: any) => {
    if (Object.hasOwn(validation, key)) {
      // console.log("yes", key)

      if (["role", "hiringDate", "modules"].includes(key)) {
        setValidation((prev: ValidationObject) => ({
          ...prev,
          [key]: { isValid: true },
        }));
      } else {
        //validate
        setValidation((prev: ValidationObject) => ({
          ...prev,
          [key]: { ...prev[key], isValid: prev[key].regex?.test(value) },
        }));
        // console.log(validation)
      }
    }

    //update
    if (key == "password" && value != emp.password) {
      setTempPassword(value);
    }
    setEmp((prev) => ({ ...prev, [key]: value }));
  };

  //#endregion

  const initDepartments = (() => {
    if (employee && !isEdit)
      departments.forEach((dept) => {
        if (employee.modules.includes(dept.title)) {
          dept.selected = true;
        }
      });
  })();

  const setDepartments = (depart: Department) => {
    if (isEdit) {
      depart.selected = !depart.selected;
      setAccessedDepartments([...departments]);
      setValidation((prev) => ({ ...prev, modules: { isValid: true } }));
      let modules = AccessedDepartments.map(
        (dept) => dept.selected && (dept.title as DepartmentTitles)
      ).filter(Boolean) as DepartmentTitles[];
      console.log(modules);
      setEmp((prev) => ({ ...prev, modules: modules }));
    }
  };

  //internal search handling
  const handleSearch = (value: string) => {
    console.log(value);
    let ac = accessedAccounts;
    if (isEdit) {
      if (value) {
        setSearchedAccounts(
          accounts.filter((account: Account) =>
            account.englishName.toLowerCase().startsWith(value.toLowerCase())
          )
        );
      } else {
        setSearchedAccounts(accounts.slice());
      }
    } else {
      if (value) {
        setAccessedAccounts(
          accounts
            .filter((acc) => employee.accessedAccounts?.includes(acc._id))
            .filter((acc) =>
              acc.englishName.toLowerCase().startsWith(value.toLowerCase())
            )
        );
      } else {
        setAccessedAccounts(
          accounts.filter((acc) => employee.accessedAccounts?.includes(acc._id))
        );
      }
    }
  };

  // #region selecting Accounts
  const handleClick = (id: string) => {
    if (!selectedAccounts.includes(id)) {
      setSelectedAccounts([...selectedAccounts, id]);
    } else {
      setSelectedAccounts(selectedAccounts.filter((acc) => acc != id));
    }
  };
  //selecting all emplyee
  const selectAll = () => {
    setSelectedAccounts(searchedAccounts.map((acc: any) => acc._id));

    if (selectedAccounts.length == searchedAccounts.length) {
      setSelectedAccounts([]);
    }
  };
  //#endregion

  //#region Handle Assign Access
  const assignAccess = (name: string) => {
    //popup modal
    setModalTitle(`Are you sure?`);
    setModalBody(
      `Are you sure you want to Assign those accounts accsses for ${employee.firstName}`
    );
    setIfTrue(() => handleAssignAccess);
    setIsOpen(true);
  };

  const handleAssignAccess = () => {
    setAccessedAccounts((prev) => {
      const newList = [
        ...prev,
        ...accounts.filter((acc) => {
          if (
            selectedAccounts.includes(acc._id) &&
            accessedAccounts.filter((a) => a._id == acc._id).length == 0
          ) {
            return true;
          }
        }),
      ];
      //assign them to emp
      setEmp((prev) => {
        let newState = {
          ...prev,
          accessedAccounts: newList.map((account: Account) => account._id),
        };

        console.log(newState);

        return newState;
      });

      console.log(newList);
      return newList;
    });
    // setEmp({ ...emp, accessedAccounts: accessedAccounts.map((account: Account) => account._id) });
  };

  //#endregion

  //#region Handle remove Access
  const removeAccess = () => {
    //popup modal
    setModalTitle("Are you sure?");
    setModalBody(
      `Are you sure you want to remove those accounts accsses for ${employee.firstName}`
    );
    setIfTrue(() => handleRemoveAccess);
    setIsOpen(true);
  };

  const handleRemoveAccess = () => {
    setAccessedAccounts((prev) => {
      let newState = prev.filter((acc) => !selectedAccounts.includes(acc._id));
      console.log(newState);
      setEmp((prev) => ({
        ...prev,
        accessedAccounts: newState.map((acc) => acc._id),
      }));
      return newState;
    });
    // console.log(accessedAccounts)
  };

  //#endregion

  //#region handle Saving
  const save = (e?: any) => {
    // e.preventDefault();
    //popup modal
    setModalTitle(`Are you sure?`);
    setModalBody(
      `Are you sure you want to Save all the updates ${employee.firstName}`
    );
    setIfTrue(() => handleSaving);
    setIsOpen(true);
  };

  const handleSaving = async () => {
    Object.keys(emp)
      .filter(
        (key) => !["isDeleted", "notifications", "pinned", "__v"].includes(key)
      )
      .map((key) => {
        if (
          ["role", "modules"].includes(key) &&
          (!emp[key] || emp[key] == "")
        ) {
          setValidation((prev) => ({ ...prev, [key]: { isValid: false } }));
        } else {
          handleInput(key as validationKeys, emp[key]);
        }
      });

    // console.log(validation);
    // console.log(emp);

    let isFormError = Object.keys(validation).filter(
      (key) => !validation[key as validationKeys].isValid
    );
    console.log("errors", isFormError);

    if (isFormError.length <= 0) {
      dispatch(SHOW_LOADER());
      try {
        let toBeCreatedEmp;
        if (temoPasswrod != "") {
          toBeCreatedEmp = new CreateEmployeeDTO(emp);
        } else {
          const empWithoutPassword = excludeProperty(emp, "password");
          toBeCreatedEmp = new CreateEmployeeDTO(empWithoutPassword);
        }
        console.log("final", toBeCreatedEmp, emp);
        const respnse = await updateEmp(emp._id ? emp._id : "", toBeCreatedEmp);
        console.log(respnse);
        //reseting depts
        departments.forEach((dept) => (dept.selected = false));
        router.push("/employees");
      } catch (e) {
        console.log(e);
      } finally {
        // dispatch(HIDE_LOADER())
      }
    } else {
      return;
    }
  };
  //#endregion

  // Handle remove User
  const deleteUser = (name: string, _id: any) => {
    const handleDelete = async () => {
      dispatch(SHOW_LOADER());
      try {
        await deleteUserById(_id);
      } catch (e) {
        console.log("error in deleting user", e);
      } finally {
        dispatch(HIDE_LOADER());
      }
    };
    //popup modal

    setModalTitle(`Are you sure?`);
    setModalBody(
      `Are you sure you want to delete ${name} from Hitac database?`
    );
    setIsOpen(true);
    setIfTrue(() => handleDelete);
    if (true) {
      setAccessedAccounts(
        accessedAccounts.filter((acc) => !selectedAccounts.includes(acc._id))
      );
      setEmp({
        ...emp,
        accessedAccounts: accessedAccounts.map(
          (account: Account) => account._id
        ),
      });
    }

    console.log(emp);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-start mt-5  h-[83vh] bg-white rounded-xl shadow-md overflow-auto px-5 gap-3">
          {/* header- wrapper */}
          {isEdit ? (
            <div className="flex flex-col justify-center items-center w-full border-b-[1px] py-3">
              {/* Image */}
              <div className="image-wrapper flex justify-center items-center w-40 h-40 rounded-full p-5 relative bg-bgGray border overflow-hidden">
                <Image
                  src={filePath ? filePath : "/uploads/avatar.png"}
                  alt="employee-image"
                  fill
                />

                {/* <input type="file" name="file" accept="image/*" /> */}
              </div>
              {/* Control */}
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
                      deleteUser(employee.firstName, employee._id)
                    }
                  />
                </div>

                <form method="post" encType="multipart/form-data">
                  <label
                    htmlFor="file-upload"
                    className="flex justify-center items-center gap-2 custom-file-upload cursor-pointer p-3 bg-lightGray rounded-md shadow-md text-darkGray text-sm hover:bg-[#00733B] hover:text-white group"
                  >
                    Upload Picture{" "}
                    <span className="text-2xl text-[#00733B] group-hover:text-white ">
                      <BsCloudUpload />
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </form>
              </div>

              {/* username */}
              <h2 className=" font-light text-3xl my-4">{`${employee.firstName} ${employee.lastName}`}</h2>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center w-full border-b-[1px] py-3">
              {/* Image */}
              <div className="image-wrapper flex justify-center items-center w-40 h-40 rounded-full p-5 relative bg-bgGray border overflow-hidden">
                <Image
                  src={`${
                    employee.image ? employee.image : "/uploads/avatar.png"
                  }`}
                  alt="employee-image"
                  fill
                />
              </div>
              {/* Control */}
              <div className="flex justify-center items-center">
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
                    deleteUser(employee.firstName, employee._id)
                  }
                />
              </div>

              {/* username */}
              <h2 className=" font-light text-3xl">{`${employee.firstName} ${employee.lastName}`}</h2>
            </div>
          )}

          {/* personal-data-section */}
          <div className="flex flex-col items-start justify-start w-full p-5 gap-3 border rounded-xl mt-2">
            {/* title */}
            <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
              <h2>Personal Information</h2>
            </div>

            {/* data-form */}
            {isEdit ? (
              <form
                className="flex flex-col justify-start items-center w-full gap-10 py-5 text-darkGray"
                autoComplete="off"
              >
                {/* disable autocomplete */}
                {/* <input type="email" name="email" className="hidden" /> */}
                {/* <input type="password" className="hidden" /> */}
                {/* first row */}
                <div className="flex justify-center items-center w-full text-darkGray gap-5">
                  {/* left col */}
                  <div className="flex flex-col w-full gap-3 relative">
                    <label className="text-lg" htmlFor="firstname">
                      First Name<span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="firstname"
                      id="firstname"
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.firstName.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } `}
                      value={emp.firstName}
                      onChange={(e) => handleInput("firstName", e.target.value)}
                    />

                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 ${
                        validation.firstName.isValid ? "hidden" : "block"
                      } `}
                    >
                      Firstname is required and should be between 3 and 20
                      letters!
                    </small>
                  </div>

                  {/* right col */}
                  <div className="flex flex-col w-full gap-3 relative">
                    <label className="text-lg" htmlFor="lastname">
                      Last Name<span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="lastname"
                      id="lastname"
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.lastName.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } `}
                      value={emp.lastName}
                      onChange={(e) => handleInput("lastName", e.target.value)}
                    />

                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 ${
                        validation.lastName.isValid ? "hidden" : "block"
                      } `}
                    >
                      Lastname is required and should be between 3 and 20
                      letters!
                    </small>
                  </div>
                </div>

                {/* second row */}
                <div className="flex justify-center items-center w-full text-darkGray gap-5">
                  {/* left col */}
                  <div className="flex flex-col w-full gap-3 relative">
                    <label className="text-lg" htmlFor="email123">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      autoComplete="off"
                      type="email"
                      name="email123"
                      id="email123"
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.email.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } `}
                      value={emp.email}
                      onChange={(e) => handleInput("email", e.target.value)}
                    />

                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 ${
                        validation.email.isValid ? "hidden" : "block"
                      } `}
                    >
                      Please enter a valid email address!
                    </small>
                  </div>

                  {/* right col */}
                  <div className="flex flex-col w-full gap-3 relative">
                    <label className="text-lg" htmlFor="telephone">
                      Telephone<span className="text-red-500">*</span>
                    </label>

                    <input
                      type="telephone"
                      name="telephone"
                      id="telephone"
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.telephone.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } `}
                      value={emp.telephone}
                      onChange={(e) => handleInput("telephone", e.target.value)}
                    />

                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 ${
                        validation.telephone.isValid ? "hidden" : "block"
                      } `}
                    >
                      Please enter a valid Telephone Number!
                    </small>
                  </div>
                </div>

                {/* Third row */}
                <div className="flex justify-center items-center w-full text-darkGray gap-5">
                  {/* left col */}
                  <div className="flex flex-col w-full gap-3 relative">
                    <label className="text-lg" htmlFor="age">
                      Age<span className="text-red-500">*</span>
                    </label>

                    <input
                      type="age"
                      name="age"
                      id="age"
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.age.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } `}
                      value={emp.age}
                      onChange={(e) => handleInput("age", e.target.value)}
                    />

                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 ${
                        validation.age.isValid ? "hidden" : "block"
                      } `}
                    >
                      Age should be between 10 and 80 years!
                    </small>
                  </div>

                  {/* right col */}
                  <div className="flex flex-col w-full gap-3 relative">
                    <label className="text-lg" htmlFor="salary">
                      Salary<span className="text-red-500">*</span>
                    </label>

                    <input
                      type="salary"
                      name="salary"
                      id="salary"
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.salary.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } `}
                      value={emp.salary}
                      onChange={(e) => handleInput("salary", e.target.value)}
                    />

                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 ${
                        validation.salary.isValid ? "hidden" : "block"
                      } `}
                    >
                      Please enter a valid salary!
                    </small>
                  </div>
                </div>

                {/* Third row */}
                <div className="flex justify-center items-center w-full text-darkGray gap-5">
                  {/* left col */}
                  <div className="flex flex-col w-full gap-3 relative">
                    <label className="text-lg" htmlFor="role">
                      role<span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      name="role"
                      id="role"
                      className={`w-full h-12 rounded-md shadow-md  px-2 border ${
                        validation.role.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      }`}
                      onChange={(e) => {
                        handleInput("role", e.target.value);
                      }}
                      defaultValue={!emp.role ? "select" : emp.role}
                    >
                      <option disabled value={"select"}>
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
                        validation.role.isValid ? "hidden" : "block"
                      } `}
                    >
                      Please select a role!
                    </small>
                  </div>

                  {/* right col */}
                  <div className="flex flex-col w-full gap-3 relative">
                    <label className="text-lg" htmlFor="hiring-date">
                      Hiring Date
                    </label>
                    <input
                      type="date"
                      name="hiring-date"
                      id="hiring-date"
                      className="w-full h-12 rounded-md outline-lightGray border border-lightGray shadow-md  px-2"
                      value={emp.hiringDate?.toString()}
                      onChange={(e) =>
                        setEmp({
                          ...emp,
                          hiringDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Third row */}
                <div className="flex justify-center items-center w-full text-darkGray gap-5">
                  {/* left col */}
                  <div className="flex flex-col w-full gap-3 relative">
                    <label className="text-lg" htmlFor="userpassword">
                      Password<span className="text-red-500">*</span>
                    </label>
                    <small className="text-gray-500 italic">
                      Leave it empty if you don't want to to change the password{" "}
                    </small>
                    <input
                      autoComplete="off"
                      type="password"
                      name="userpassword"
                      id="userpassword"
                      className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                        validation.password.isValid
                          ? "border-lightGray outline-lightGray"
                          : "border-red-500 outline-red-500"
                      } `}
                      onChange={(e) => handleInput("password", e.target.value)}
                    />

                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 ${
                        validation.password.isValid ? "hidden" : "block"
                      } `}
                    >
                      Password should be more than 8 letters!
                    </small>
                  </div>
                </div>

                {/* Forth row */}
                <div className="flex justify-start items-center w-full text-darkGray gap-5">
                  {/* left col */}
                  {/* right col */}
                  <div className="flex flex-col w-full gap-3">
                    <label className="text-lg" htmlFor="notes">
                      Notes
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      className="w-full h-24 rounded-md outline-lightGray border border-lightGray shadow-md px-2"
                      onChange={(e) =>
                        setEmp((prev) => ({ ...prev, notes: e.target.value }))
                      }
                      value={emp.notes}
                    ></textarea>
                  </div>
                </div>
              </form>
            ) : (
              <form className="flex flex-col justify-start items-center w-full gap-10 py-5 text-darkGray">
                {/* first row */}
                <div className="flex justify-center items-center w-full text-darkGray gap-5">
                  {/* left col */}
                  <div className="flex flex-col w-full gap-3">
                    <label className="text-lg" htmlFor="firstname">
                      First Name
                    </label>

                    {/* <input  disabled={!isEdit} type="text" name="firstname" id="firstname" className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${ validation.firstName.isValid ? 'border-lightGray outline-lightGray' : 'border-red-500 outline-red-500'} `} value={emp.firstName} onChange={(e) => handleInput("firstName", e.target.value)} />

                            <small className={`text-red-500 absolute -bottom-6 left-2 ${validation.firstName.isValid ? 'hidden' : 'block'} `}>Firstname is required and should be between 3 and 20 letters!</small> */}

                    <input
                      type="text"
                      name="firstname"
                      id="firstname"
                      disabled={!isEdit}
                      className={`w-full h-12 rounded-md outline-lightGray border border-lightGray shadow-md ${
                        isEdit ? "bg-white " : "bg-lightGray"
                      }  px-2`}
                      value={emp.firstName}
                      onChange={(e) =>
                        setEmp({ ...emp, firstName: e.target.value })
                      }
                    />
                  </div>

                  {/* right col */}
                  <div className="flex flex-col w-full gap-3">
                    <label className="text-lg" htmlFor="lastname">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      id="lastname"
                      disabled={!isEdit}
                      className={`w-full h-12 rounded-md outline-lightGray border border-lightGray shadow-md ${
                        isEdit ? "bg-white " : "bg-lightGray"
                      }  px-2`}
                      value={employee.lastName}
                    />
                  </div>
                </div>

                {/* second row */}
                <div className="flex justify-center items-center w-full text-darkGray gap-5">
                  {/* left col */}
                  <div className="flex flex-col w-full gap-3">
                    <label className="text-lg" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      disabled={!isEdit}
                      className={`w-full h-12 rounded-md outline-lightGray border border-lightGray shadow-md ${
                        isEdit ? "bg-white " : "bg-lightGray"
                      }  px-2`}
                      value={employee.email}
                    />
                  </div>

                  {/* right col */}
                  <div className="flex flex-col w-full gap-3">
                    <label className="text-lg" htmlFor="telephone">
                      Telephone
                    </label>
                    <input
                      type="text"
                      name="telephone"
                      id="telephone"
                      disabled={!isEdit}
                      className={`w-full h-12 rounded-md outline-lightGray border border-lightGray shadow-md ${
                        isEdit ? "bg-white " : "bg-lightGray"
                      }  px-2`}
                      value={employee.telephone}
                    />
                  </div>
                </div>

                {/* Third row */}
                <div className="flex justify-center items-center w-full text-darkGray gap-5">
                  {/* left col */}
                  <div className="flex flex-col w-full gap-3">
                    <label className="text-lg" htmlFor="age">
                      Age
                    </label>
                    <input
                      type="text"
                      name="age"
                      id="age"
                      disabled={!isEdit}
                      className={`w-full h-12 rounded-md outline-lightGray border border-lightGray shadow-md ${
                        isEdit ? "bg-white " : "bg-lightGray"
                      }  px-2`}
                      value={employee.age}
                    />
                  </div>

                  {/* right col */}
                  <div className="flex flex-col w-full gap-3">
                    <label className="text-lg" htmlFor="salary">
                      Salary
                    </label>
                    <input
                      type="text"
                      name="salary"
                      id="salary"
                      disabled={!isEdit}
                      className={`w-full h-12 rounded-md outline-lightGray border border-lightGray shadow-md ${
                        isEdit ? "bg-white " : "bg-lightGray"
                      }  px-2`}
                      value={employee.salary}
                    />
                  </div>
                </div>

                {/* Forth row */}
                <div className="flex justify-center items-center w-full text-darkGray gap-5">
                  {/* left col */}
                  <div className="flex flex-col w-full gap-3">
                    <label className="text-lg" htmlFor="hiring-date">
                      Hiring Date
                    </label>
                    <input
                      type="date"
                      name="hiring-date"
                      id="hiring-date"
                      disabled={!isEdit}
                      className={`w-full h-12 rounded-md outline-lightGray border border-lightGray shadow-md ${
                        isEdit ? "bg-white " : "bg-lightGray"
                      }  px-2`}
                      value={employee.hiringDate}
                    />
                  </div>

                  {/* right col */}
                  <div className="flex flex-col w-full gap-3">
                    <label className="text-lg" htmlFor="notes">
                      Notes
                    </label>
                    <input
                      type="text"
                      name="notes"
                      id="notes"
                      disabled={!isEdit}
                      className={`w-full h-12 rounded-md outline-lightGray border border-lightGray shadow-md ${
                        isEdit ? "bg-white " : "bg-lightGray"
                      }  px-2`}
                      value={employee.notes}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Accessed Departments */}
          <div className="flex flex-col justify-center items-start w-full p-5 border">
            {/* title */}
            <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
              <h2>Accessed Departments</h2>
            </div>

            {/* departments selection */}
            <div className="flex justify-center items-center w-full border gap-10 p-10">
              {AccessedDepartments.map((department: Department) => (
                <div
                  key={department.title}
                  className={`w-[250px] h-[100px] rounded-lg ${
                    department.selected == true
                      ? "bg-mainBlue text-white"
                      : "bg-lightGray text-black"
                  } shadow-md flex justify-center items-center text-xl font-light capitalize ${
                    isEdit && "cursor-pointer"
                  } `}
                  onClick={() => setDepartments(department)}
                >
                  {department.title}{" "}
                </div>
              ))}
            </div>
          </div>

          {/* Accessed Accounts */}
          <div className="w-full flex flex-col justify-start items-center p-5 min-h-[600px] overflow-auto border">
            {/* title */}
            <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
              <h2>Accessed Accounts</h2>
            </div>

            {/* page Control */}
            <div className={`flex justify-center items-center py-5`}>
              {/* Search */}
              <Search onSearch={handleSearch} classes="rounded-lg w-[180px]" />

              {/* CRUD Operations */}
              <div
                className={`flex justify-center items-cente ${
                  isEdit ? "flex" : "hidden"
                }`}
              >
                <Button
                  icon={
                    <span className="text-[#00733B] text-[32px]">
                      <MdOutlineAdd />
                    </span>
                  }
                  title="Assign Access"
                  classes=" font-bold"
                  handleOnClick={assignAccess}
                />
                <Button
                  icon={
                    <span className="text-[#E70C0C] text-[32px]">
                      <RiDeleteBin6Line />
                    </span>
                  }
                  title="Remove Access"
                  classes=" font-bold"
                  handleOnClick={() => removeAccess()}
                />
              </div>
            </div>

            {/* Table */}
            <table className={` w-full`}>
              <thead className=" bg-bgGray  h-full">
                <tr className="  text-left ">
                  <th className={`${isEdit ? "block" : "hidden"}`}>
                    <input
                      type="checkbox"
                      onClick={() => selectAll()}
                      checked={
                        selectedAccounts.length == searchedAccounts.length
                      }
                      readOnly
                    />
                  </th>

                  <th className="">
                    <span className=" inline-block relative top-1 mr-1 ">
                      {" "}
                      <TbArrowsSort />{" "}
                    </span>
                    <span>Name</span>
                  </th>
                  <th className="">
                    <span className=" inline-block relative top-1 mr-1 ">
                      {" "}
                      <TbArrowsSort />{" "}
                    </span>
                    <span>Country</span>
                  </th>
                  <th className="">
                    <span className=" inline-block relative top-1 mr-1 ">
                      {" "}
                      <TbArrowsSort />{" "}
                    </span>
                    <span>Segments</span>
                  </th>
                  <th className={`${isEdit ? "block" : "hidden"}`}>
                    <span className=" inline-block relative top-1 mr-1 ">
                      {" "}
                      <TbArrowsSort />{" "}
                    </span>
                    <span>Access</span>
                  </th>
                </tr>
              </thead>
              <tbody className=" border border-green-500 h-full">
                {!isEdit
                  ? accessedAccounts.map((account: Account) => (
                      <tr
                        key={account.englishName + Math.random()}
                        className=" text-left bg-lightGray"
                      >
                        <td className={`check ${isEdit ? "block" : "hidden"}`}>
                          <input
                            type="checkbox"
                            onClick={() => handleClick(account._id)}
                            checked={selectedAccounts.includes(account._id)}
                            readOnly
                          />
                        </td>
                        <td>{account.englishName}</td>

                        <td>{account.countries?.join(",")}</td>
                        <td>{account.segments?.join(",")}</td>
                      </tr>
                    ))
                  : searchedAccounts.map((account: Account) => (
                      <tr
                        key={account.englishName + Math.random()}
                        className=" text-left"
                      >
                        <td className={``}>
                          <input
                            type="checkbox"
                            onClick={() => handleClick(account._id)}
                            checked={selectedAccounts.includes(account._id)}
                            readOnly
                          />
                        </td>
                        <td>{account.englishName}</td>

                        <td>{account.countries?.join(",")}</td>
                        <td>{account.segments?.join(",")}</td>
                        <td>
                          <span
                            className={`${
                              emp.accessedAccounts?.includes(account._id)
                                ? "block"
                                : "hidden"
                            }`}
                          >
                            <IoCheckmarkCircleOutline />
                          </span>

                          <span
                            className={`${
                              !emp.accessedAccounts?.includes(account._id)
                                ? "block"
                                : "hidden"
                            }`}
                          >
                            <MdOutlineRadioButtonUnchecked />
                          </span>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Edit */}
          <div
            className={`flex justify-center items-center p-5 w-full ${
              isEdit ? "hidden" : "flex"
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
              isEdit ? "flex" : "hidden"
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

export default Employee;
