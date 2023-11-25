import Button from "@/components/Button";
import {
  CreateEmployeeDTO,
  Department,
  DepartmentTitles,
  EmployeeType,
  ValidationObject,
  validationKeys,
} from "@/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MdOutlineAdd } from "react-icons/md";
import { departments, employeeBase } from "@/constants";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { BsCloudUpload } from "react-icons/bs";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useRouter as useNextRouter } from "next/router";

export const getServerSideProps = async ({ locale }: any) => {
  return {
    props: { ...(await serverSideTranslations(locale, ["common"])) },
  };
};

const NewEmployee = (props: any) => {
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
  const initEmployee = () => ({
    firstName: "",
    lastName: "",
    role: "",
    // accessedAccounts: [],
    image: "/uploads/avatar.png",
    email: "",
    telephone: [""],
    age: 0,
    salary: 0,
    password: "",
    modules: [],
    hiringDate: new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    confirmPassword: "",
    notes: "",
  });

  const [newEmployee, setNewEmployee] = useState<EmployeeType>(initEmployee());

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
      regex: /^.{8,}$/,
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
  //#endregion

  const [filePath, setFilePath] = useState("/avatar.png");

  // image
  const handleImageUpload = async (e: any) => {
    const files = e.target.files;
    // console.log(files[0]);
    const formData = new FormData();
    formData.append("image", files[0]);
    const res = await fetch("https://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data) {
      // console.log(data.filePath.slice(8));
      // console.log(typeof data.filePath.slice(8));
      setFilePath(data.filePath.slice(8));
      setNewEmployee((prev) => ({ ...prev, image: data.filePath.slice(8) }));
    }
  };

  const handleInput = (key: validationKeys, value: string) => {
    if (Object.hasOwn(validation, key)) {
      console.log("yes", key);

      if (key == "confirmPassword") {
        setValidation((prev: ValidationObject) => ({
          ...prev,
          confirmPassword: {
            ...prev.confirmPassword,
            isValid:
              newEmployee.password === value && newEmployee.password != "",
          },
        }));
      } else if (["role", "hiringDate", "modules"].includes(key)) {
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
        console.log(validation);
      }
    }

    //update
    setNewEmployee((prev) => ({ ...prev, [key]: value }));
  };

  //#region modules
  const [AccessedDepartments, setAccessedDepartments] =
    useState<Department[]>(departments);

  const handleDepartments = (depart: Department) => {
    depart.selected = !depart.selected;
    setAccessedDepartments([...departments]);
    setValidation((prev) => ({ ...prev, modules: { isValid: true } }));
    let modules = AccessedDepartments.map(
      (dept) => dept.selected && (dept.title as DepartmentTitles)
    ).filter(Boolean) as DepartmentTitles[];

    setNewEmployee((prev) => ({ ...prev, modules: modules }));
  };

  //#endregion

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // // e.target.preventDefault();
    let isFormError = Object.keys(newEmployee).filter((key) => {
      // let isFormError =["firstName", "lastName"].map((key) => {

      if (!newEmployee[key] || newEmployee[key] == "") {
        if (["role", "modules"].includes(key)) {
          setValidation((prev) => ({ ...prev, [key]: { isValid: false } }));
        } else {
          handleInput(key as validationKeys, "");
        }

        return key;
      }
    });
    console.log(isFormError);
    if (isFormError.length <= 0) {
      dispatch(SHOW_LOADER());
      try {
        const toBeCreatedEmp = new CreateEmployeeDTO(newEmployee);
        console.log("first", toBeCreatedEmp);
        const respnse = await fetch(employeeBase, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toBeCreatedEmp),
        });
        const data = await respnse.json();
        console.log("set", data);
        //reseting depts
        departments.forEach((dept) => (dept.selected = false));
        router.push("/employees");
      } catch (e) {
        console.log(e);
      } finally {
        dispatch(HIDE_LOADER());
      }
    } else {
      return;
    }
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-start my-5 pb-10  h-[83vh] bg-white rounded-xl shadow-md overflow-auto">
          {/* header- wrapper */}
          <div className="flex flex-col justify-center items-center w-full border-b-[1px] py-3">
            {/* Image */}
            <div className="image-wrapper flex justify-center items-center w-40 h-40 rounded-full p-5 relative bg-bgGray border overflow-hidden">
              <Image src={filePath} alt="employee-image" fill />

              {/* <input type="file" name="file" accept="image/*" /> */}
            </div>
            {/* Control */}
            <div className="flex justify-center items-center mt-2">
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
            {/* <h2 className=" font-light text-3xl">{`${newEmployee.firstName} ${newEmployee.lastName}`}</h2> */}
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
              onSubmit={(e) => handleSubmit(e)}
              autoComplete="off"
            >
              {/* disable autocomplete */}
              <input type="email" name="email" className="hidden" />
              <input type="password" className="hidden" />
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
                    value={newEmployee.firstName}
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
                    value={newEmployee.lastName}
                    onChange={(e) => handleInput("lastName", e.target.value)}
                  />

                  <small
                    className={`text-red-500 absolute -bottom-6 left-2 ${
                      validation.lastName.isValid ? "hidden" : "block"
                    } `}
                  >
                    Lastname is required and should be between 3 and 20 letters!
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
                    value={newEmployee.email}
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
                    value={newEmployee.telephone}
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
                    value={newEmployee.age}
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
                    value={newEmployee.salary}
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
                    value={newEmployee.hiringDate?.toString()}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
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
                    value={newEmployee.password}
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

                {/* right col */}

                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg" htmlFor="confirmPassword">
                    confirmPassword<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                      validation.confirmPassword.isValid
                        ? "border-lightGray outline-lightGray"
                        : "border-red-500 outline-red-500"
                    } `}
                    onChange={(e) =>
                      handleInput("confirmPassword", e.target.value)
                    }
                  />

                  <small
                    className={`text-red-500 absolute -bottom-6 left-2 ${
                      validation.confirmPassword.isValid ? "hidden" : "block"
                    } `}
                  >
                    Passwords do not match!
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
                      setNewEmployee((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    value={newEmployee.notes}
                  ></textarea>
                </div>
              </div>

              {/* Accessed Departments */}
              <div className="flex flex-col justify-center items-start w-full p-5 relative">
                {/* title */}
                <div className="text-darkGray border-b-[1px] w-full py-3">
                  <h2 className="text-2xl">
                    Accessed Departments
                    <span className="text-red-500 text-lg">*</span>
                  </h2>
                </div>

                {/* departments selection */}
                <div
                  className={`flex justify-center items-center w-full gap-10 p-10 border ${
                    validation.modules.isValid
                      ? " border-lightGray "
                      : " border-red-500"
                  }`}
                >
                  {AccessedDepartments.map((department) => (
                    <div
                      key={department.title}
                      className={`w-[250px] h-[100px] cursor-pointer transition rounded-lg ${
                        department.selected == true
                          ? "bg-mainBlue text-white"
                          : "bg-bgGray text-black"
                      } shadow-md flex justify-center items-center text-xl font-light capitalize `}
                      onClick={() => handleDepartments(department)}
                    >
                      {department.title}{" "}
                    </div>
                  ))}
                </div>
                <small
                  className={`text-red-500 absolute -bottom-2 left-10 ${
                    validation.modules.isValid ? "hidden" : "block"
                  } `}
                >
                  Please Choose the designated departments!
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

export default NewEmployee;
