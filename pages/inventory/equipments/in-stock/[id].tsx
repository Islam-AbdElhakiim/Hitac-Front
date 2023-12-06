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
  inStockProductsInitalType,
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
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
} from "@/http/supplierHttp";
import countries from "@/constants/countries";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import SelectField from "@/components/ReactSelect/SelectField";
import PalletCard from "@/components/PalletCard";
import PageHeader from "@/components/PageHeader";
export const getServerSideProps = async (context: any) => {
  const id = context.params.id;

  const detailsFetch = async () => {
    return {};
  };
  const supplierFetch = async () => {
    return await getAllSuppliers();
  };
  const segmentsFetch = async () => {
    return await getAllSegments();
  };
  const peoductsFetch = async () => {
    return await getAllProducts();
  };

  const [details, supplier, segments, products] = await Promise.all([
    detailsFetch(),
    supplierFetch(),
    segmentsFetch(),
    peoductsFetch(),
  ]);

  // console.log(employee, accounts)

  return {
    props: {
      details,
      supplier,
      segments,
      products,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};

const Supplier = ({
  details,
  supplier,
  segments,
  products,
}: {
  details: any;
  supplier: any[];
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
    salesOrder: Yup.string().required("Sales Order is required"),
    supplier: Yup.string().required("Supplier is required"),
    packingDate: Yup.string().required("Packing Date is required"),
    product: Yup.string().required("Product is required"),
    qualitySpecialist: Yup.string().required("Quality Specialist is required"),
    opertaion: Yup.string().required("Opertaion is required"),
    station: Yup.string().required("Station is required"),
    totalPallets: Yup.string().required("Total Pallets is required"),
    description: Yup.string().required("Description is required"),

    // Dynamically added email fields validation
  });


  const initialValues = {
    id: details?.id || "",
    packingDate: details?.packingDate || "",
    supplier: details?.supplier || "",
    station: details?.station || "",
    product: details?.product || '',
    totalPallets: details?.totalPallets || "",
    qualitySpecialist: details?.qualitySpecialist || "",
    opertaion: details?.opertaion || "",
    salesOrder: details?.salesOrder || "",
    description: details?.description || "",
  };

  const formik = useFormik<inStockProductsInitalType>({
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


  const deletePatch = (name: string, _id: any) => {
    //popup modal
    const deletes = async () => {
      dispatch(SHOW_LOADER());
      try {
        // await deleteSupplierById(_id);
        // router.push("/suppliers");
      } catch (e) {
      } finally {
      }
    };
    setModalTitle(`Are you sure?`);
    setModalBody(
      `Are you sure you want to delete ${name} from Hitac database?`
    );
    setIsOpen(true);
    setIfTrue(() => deletes);
  };

  const save = async (e?: any) => {


    dispatch(SHOW_LOADER());
    try {
      // await updateSupplier(details._id, {
      //   ...formik.values,
      //   emails: emailFieldValues,
      //   telephones: telephoneFieldValues,
      //   countries: countriesFieldValues,
      //   cities: citiesFieldValues,
      // });

      // router.push("/suppliers");
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
                    deletePatch(details.englishName, details?._id)
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
                Patch
              </div>
              <div
                className={`w-[150px] h-[50px] cursor-pointer transition rounded-lg ${!isProfile
                  ? "bg-mainBlue text-white"
                  : "bg-lightGray text-black"
                  } shadow-md flex justify-center items-center text-xl font-light capitalize `}
                onClick={() => setIsProfile(false)}
              >
                Pallets
              </div>
            </div>

            {/* username */}
          </div>

          {/* personal-data-section */}
          {isProfile && (
            <>
              <div className="flex flex-col items-start justify-start w-full p-5 gap-3 relative">
                {/* title */}
                <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
                  <h2>Patch Information</h2>
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
                      <label className="text-lg h-12" htmlFor="id">
                        ID<span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="id"
                        id="id"
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                          } ${!isEdit ? "bg-white " : "bg-lightGray"
                          }`}
                        disabled={true}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.id}
                      />
                      {formik.touched.id && formik.errors.id && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.id}
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="packingDate">
                        Packing date<span className="text-red-500">*</span>
                      </label>

                      <input
                        type="date"
                        name="packingDate"
                        id="packingDate"
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.packingDate && formik.errors.packingDate
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                          } ${!isEdit ? "bg-white " : "bg-lightGray"
                          }`}
                        disabled={isEdit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.packingDate}
                      />
                      {formik.touched.packingDate && formik.errors.packingDate && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.packingDate}
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
                        isDisabled={isEdit}
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
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="station">
                        Station<span className="text-red-500">*</span>
                      </label>
                      <SelectField
                        options={supplier?.map((res: any) => {
                          return {
                            value: res._id,
                            label: `${res.firstName} ${res.lastName}`,
                          };
                        })}
                        isDisabled={isEdit}
                        value={formik.values.station}
                        onChange={(value: any) =>
                          formik.setFieldValue("station", value.value)
                        }
                        isValid={
                          formik.touched.station && formik.errors.station
                            ? false
                            : true
                        }
                      />
                      {formik.touched.station && formik.errors.station && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.station}
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
                        isDisabled={isEdit}
                        value={formik.values.product}
                        onChange={(value: any) =>
                          formik.setFieldValue("products", value.value)
                        }
                        isValid={
                          formik.touched.products && formik.errors.products
                            ? false
                            : true
                        }
                      />

                      {formik.touched.products && formik.errors.products && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.products}
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="totalPallets">
                        Total Pallets<span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="totalPallets"
                        id="totalPallets"
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.totalPallets && formik.errors.totalPallets
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                          } ${!isEdit ? "bg-white " : "bg-lightGray"
                          }`}
                        disabled={isEdit}

                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.totalPallets}
                      />
                      {formik.touched.totalPallets && formik.errors.totalPallets && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.totalPallets}
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="qualitySpecialist">
                        Quality-Specialist<span className="text-red-500">*</span>
                      </label>
                      <SelectField
                        options={products?.map((res: any) => {
                          return { value: res._id, label: res.name };
                        })}
                        isDisabled={isEdit}
                        value={formik.values.qualitySpecialist}
                        onChange={(value: any) =>
                          formik.setFieldValue("qualitySpecialist", value.value)
                        }
                        isValid={
                          formik.touched.qualitySpecialist && formik.errors.qualitySpecialist
                            ? false
                            : true
                        }
                      />

                      {formik.touched.qualitySpecialist && formik.errors.qualitySpecialist && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.qualitySpecialist}
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="opertaion">
                        Operation<span className="text-red-500">*</span>
                      </label>
                      <SelectField
                        options={products?.map((res: any) => {
                          return { value: res._id, label: res.name };
                        })}
                        isDisabled={isEdit}
                        value={formik.values.opertaion}
                        onChange={(value: any) =>
                          formik.setFieldValue("opertaion", value.value)
                        }
                        isValid={
                          formik.touched.opertaion && formik.errors.opertaion
                            ? false
                            : true
                        }
                      />

                      {formik.touched.opertaion && formik.errors.opertaion && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.opertaion}
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="salesOrder">
                        Sales Order<span className="text-red-500">*</span>
                      </label>
                      <SelectField
                        options={supplier?.map((res: any) => {
                          return {
                            value: res._id,
                            label: `${res.firstName} ${res.lastName}`,
                          };
                        })}
                        isDisabled={isEdit}
                        value={formik.values.salesOrder}
                        onChange={(value: any) =>
                          formik.setFieldValue("salesOrder", value.value)
                        }
                        isValid={
                          formik.touched.salesOrder && formik.errors.salesOrder
                            ? false
                            : true
                        }
                      />
                      {formik.touched.salesOrder && formik.errors.salesOrder && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.salesOrder}
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
                        className={`w-full rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.description && formik.errors.description
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                          } ${!isEdit ? "bg-white " : "bg-lightGray"
                          }`}
                        disabled={isEdit}

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

                  {/* edit */}
                  {isEdit && (
                    <div className={`flex justify-center items-center p-5 w-full`}>
                      {/* <input type="submit" value="Create User" className="px-10 py-4 rounded-md bg-mainOrange text-white shadow-md text-center" /> */}
                      <Button
                        title="Update"
                        handleOnClick={(e) => {
                          e.stopPropagation();
                          setIsEdit(!isEdit);
                        }}
                        icon={
                          <span className="text-3xl">
                            <MdModeEdit />
                          </span>
                        }
                        classes="px-5 py-2 bg-lightGray text-mainBlue text-xl hover:bg-mainBlue hover:text-white transition"
                      />
                    </div>
                  )
                  }

                  {/* Submit */}
                  {!isEdit && (
                    <div className={`flex justify-center items-center p-5 w-full `}>
                      <Button
                        title="Save"
                        type="submit"
                        icon={
                          <span className="text-3xl">
                            <AiOutlineSave />
                          </span>
                        }
                        classes="px-5 py-2 bg-mainOrange text-white text-xl hover:bg-mainOrange"
                      />
                    </div>
                  )}
                </form>
              </div>
            </>
          )}
          {!isProfile && (
            <>
              <div className="flex flex-col items-start justify-start w-full p-5 gap-3 border rounded-xl mt-2">
                <PageHeader pageTitle="pages.pallets" newUrl={"/inventory/products/pallets/new"} />
                <div className="flex gap-x-7 gap-y-10 flex-wrap">
                  <Link href={"/inventory/products/pallets/sss"}>
                    <PalletCard />
                  </Link>
                  <Link href={"/inventory/products/pallets/sss"}>
                    <PalletCard />
                  </Link>
                  <Link href={"/inventory/products/pallets/sss"}>
                    <PalletCard />
                  </Link>

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
