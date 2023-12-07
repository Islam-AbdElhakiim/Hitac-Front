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
  variantInitalType,
} from "@/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { BsCloudUpload } from "react-icons/bs";
import {
  MdDelete,
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
import { deleteVaraintById, getAllEquipments, getVariantById, updateVaraint } from "@/http/equipmentsHttp";
export const getServerSideProps = async (context: any) => {
  const id = context.params.id;

  const detailsFetch = async () => {
    return await getVariantById(id);
  };
  const supplierFetch = async () => {
    return await getAllSuppliers();
  };
  const equipmentFetch = async () => {
    return await getAllEquipments();
  };

  const [details, supplier, equipments] = await Promise.all([
    detailsFetch(),
    supplierFetch(),
    equipmentFetch(),
  ]);

  // console.log(employee, accounts)

  return {
    props: {
      details,
      supplier,
      equipments,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};

const Supplier = ({
  details,
  supplier,
  equipments,
}: {
  details: any;
  supplier: any[];
  equipments: any[];
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
    equipmentsType: Yup.string().required("Equipment Type is required"),
    supplier: Yup.string().required("Supplier is required"),
    totalCount: Yup.string().required("Total Count is required"),

    // Dynamically added email fields validation
  });


  const initialValues = {
    _id: details?._id || "",
    arrivingDate: details?.arrivingDate || "",
    equipmentsType: details?.equipmentsType || "",
    totalCount: details?.totalCount || "",
    supplier: details?.supplier || '',
    status: details?.status || "",
    fulfillDate: details?.fulfillDate || "",
    palletId: details?.palletId || "",
    variants: details?.variants || [{ title: '', value: '' }],
  };

  const formik = useFormik<variantInitalType>({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission

      setModalTitle(`Are you sure?`);
      setModalBody(
        `Are you sure you want to Save all the updates ${details._id}`
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
        await deleteVaraintById(_id);
        router.push("/inventory/equipments/in-stock/details/" + details?.equipmentsType);

      } catch (e) {
        dispatch(HIDE_LOADER());

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
      await updateVaraint(details._id, {
        ...formik.values,
      });
      router.push("/inventory/equipments/in-stock/details/" + details?.equipmentsType);

    } catch (e) {
      dispatch(HIDE_LOADER());
    } finally {
    }
  };

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
            <h2 className=" font-light text-3xl my-4">{`${details?._id}`}</h2>

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
                    deletePatch(details._id, details?._id)
                  }
                />
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
                      <label className="text-lg h-12" htmlFor="id">
                        ID<span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="id"
                        id="id"
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched._id && formik.errors._id
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                          } ${!isEdit ? "bg-white " : "bg-lightGray"
                          }`}
                        disabled={true}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?._id}
                      />
                      {formik.touched._id && formik.errors._id && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors._id}
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="arrivingDate">
                        Arriving Date<span className="text-red-500">*</span>
                      </label>

                      <input
                        type="date"
                        name="arrivingDate"
                        id="arrivingDate"
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.arrivingDate && formik.errors.arrivingDate
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                          } ${!isEdit ? "bg-white " : "bg-lightGray"
                          }`}
                        disabled={isEdit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.arrivingDate}
                      />
                      {formik.touched.arrivingDate && formik.errors.arrivingDate && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.arrivingDate}
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="equipmentsType">
                        Equipments Type<span className="text-red-500">*</span>
                      </label>
                      <SelectField
                        options={equipments?.map((res: any) => {
                          return {
                            value: res._id,
                            label: res.title,
                          };
                        })}
                        isDisabled={isEdit}
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
                          } ${!isEdit ? "bg-white " : "bg-lightGray"
                          }`}
                        disabled={isEdit}

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
                      <label className="text-lg h-12" htmlFor="status">
                        Status<span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="status"
                        id="status"
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.status && formik.errors.status
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                          } ${!isEdit ? "bg-white " : "bg-lightGray"
                          }`}
                        disabled={isEdit}

                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.status}
                      />
                      {formik.touched.status && formik.errors.status && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.status}
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="arrivingDate">
                        Fulfill Date<span className="text-red-500">*</span>
                      </label>

                      <input
                        type="date"
                        name="fulfillDate"
                        id="fulfillDate"
                        className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.fulfillDate && formik.errors.fulfillDate
                          ? "border-red-500 outline-red-500"
                          : "border-lightGray outline-lightGray"
                          } ${!isEdit ? "bg-white " : "bg-lightGray"
                          }`}
                        disabled={isEdit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fulfillDate}
                      />
                      {formik.touched.fulfillDate && formik.errors.fulfillDate && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.fulfillDate}
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="palletId">
                        Pallet Id<span className="text-red-500">*</span>
                      </label>
                      <SelectField
                        options={[]?.map((res: any) => {
                          return { value: res._id, label: res.name };
                        })}
                        isDisabled={isEdit}
                        value={formik.values.palletId}
                        onChange={(value: any) =>
                          formik.setFieldValue("palletId", value.value)
                        }
                        isValid={
                          formik.touched.palletId && formik.errors.palletId
                            ? false
                            : true
                        }
                      />

                      {formik.touched.palletId && formik.errors.palletId && (
                        <small
                          className={`text-red-500 absolute -bottom-6 left-2 `}
                        >
                          {formik.errors.palletId}
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
                          className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${!isEdit ? "bg-white " : "bg-lightGray"
                            } `}
                          disabled={isEdit}

                          onChange={formik.handleChange}
                          value={input.title}
                        />
                        <label htmlFor={`variants.${index}.value`}>Value</label>
                        <input
                          type="text"
                          id={`variants.${index}.value`}
                          name={`variants.${index}.value`}
                          className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${!isEdit ? "bg-white " : "bg-lightGray"
                            } `}
                          disabled={isEdit}
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
