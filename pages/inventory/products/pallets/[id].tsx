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
  palletsInitalType,
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
import { getAllEmployees, getUserById, updateEmp } from "@/http/employeeHttp";
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
import { deletePalletsById, fulfillPallets, getPalletsById, updatePallets } from "@/http/palletsHttp";
import { getAllStations } from "@/http/stationsHttp";
export const getServerSideProps = async (context: any) => {
  const id = context.params.id;

  const detailsFetch = async () => {
    return await getPalletsById(id);
  };
  const supplierFetch = async () => {
    return await getAllSuppliers();
  };
  const productFetch = async () => {
    return await getAllProducts();
  };
  const employeeFetch = async () => {
    return await getAllEmployees();
  };
  const stationFetch = async () => {
    return await getAllStations();
  };

  const [details, supplier, products, employees, stations] = await Promise.all([
    detailsFetch(),
    supplierFetch(),
    productFetch(),
    employeeFetch(),
    stationFetch(),
  ]);

  // console.log(employee, accounts)

  return {
    props: {
      details,
      supplier, products, employees, stations,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};

const Supplier = ({
  details,
  supplier, products, employees, stations
}: {
  details: any;
  supplier: any[];
  products: any[];
  employees: any[];
  stations: any[]
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
    packingDate: Yup.string().required("Packing Date is required"),
    supplier: Yup.string().required("Supplier is required"),
    station: Yup.string().required("Station is required"),
    product: Yup.string().required("Product is required"),
    boxWeight: Yup.string().required("Box Weight is required"),
    boxesPerBase: Yup.string().required("Boxes Per Base is required"),
    boxesPerColumn: Yup.string().required("Boxes Per Column is required"),
    totalBoxes: Yup.string().required("Total Boxes is required"),
    palletGrossWeight: Yup.string().required("Pallet Gross Weight is required"),
    palletNetWeight: Yup.string().required("Pallet Net Weight is required"),
    containerSpot: Yup.string().required("Container Spot is required"),
    qualitySpecialist: Yup.string().required("Quality Specialist is required"),
    operation: Yup.string().required("Opertaion is required"),

    // Dynamically added email fields validation
  });


  const initialValues = {
    id: details?._id || "",
    salesCases: details.salesCases || '',
    supplier: details.supplier._id || '',
    station: details.station?._id || '',
    packingDate: details.packingDate.split("T")[0] || '',
    product: details.product._id || '',
    brand: details.brand || '',
    boxWeight: details.boxWeight || '',
    boxesPerBase: details.boxesPerBase || '',
    boxesPerColumn: details.boxesPerColumn || '',
    totalBoxes: details.totalBoxes || '',
    palletGrossWeight: details.palletGrossWeight || '',
    palletNetWeight: details.palletNetWeight || '',
    status: details.status == 1 ? 'Fullfilled' : 'In-Stock',
    containerSpot: details.containerSpot || '',
    qrCode: details.qrCode || '',
    qualitySpecialist: details.qualitySpecialist._id || '',
    operation: details.operation._id || '',
    specifications: details.specifications || '',
  };

  const formik = useFormik<palletsInitalType>({
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

  console.log(formik.errors);

  const deletePatch = (name: string, _id: any) => {
    //popup modal
    const deletes = async () => {
      dispatch(SHOW_LOADER());
      try {
        await deletePalletsById(_id);
        router.push(`/inventory/products/in-stock/${details?.patch?._id}?isEdit=true`);

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
      delete formik.values.status
      await updatePallets(details._id, {
        ...formik.values,

      });

      router.push(`/inventory/products/in-stock/${details?.patch?._id}?isEdit=true`);

    } catch (e) {
    } finally {
    }
  };

  const handlePrint = (e: any) => {
    e.preventDefault();
    const base64QRCode = details?.QRCode; // replace with your actual base64 image

    // Create a new window
    const printWindow: any = window.open('', '_blank');

    // Set the content of the new window
    printWindow.document.write(`
      <html>
      <head>
        <title>Print QR Code</title>
      </head>
      <body>
      <div style="display: flex; justify-content: center; text-align: center;">
      <img src="${base64QRCode}" alt="QR Code" width="400" >
      </div>
        <script>
          // Automatically trigger the print dialog after the image loads
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          };
        </script>
      </body>
      </html>
    `);

    // Close the document after printing
    printWindow.document.close();
  }

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
              href="/inventory/products/fullfilled"
              className="absolute top-5 left-5 text-3xl text-mainBlue"
            >
              <IoMdArrowRoundBack />
            </Link>
            <h2 className=" font-light text-3xl my-4">{`${details?._id}`}</h2>

            {details.status != 1 && <div className="flex flex-col justify-center items-center">
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
            </div>}


            {/* username */}
          </div>

          {/* personal-data-section */}
          <div className="flex flex-col items-start justify-start w-full p-5 gap-3 relative">
            {/* title */}
            <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
              <h2>Pallet Information</h2>
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
                    options={stations?.map((res: any) => {
                      return {
                        value: res._id,
                        label: `${res.englishName}`,
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

                {
                  //specifications
                  products.find((res: any) => res._id == formik.values.product)?.specifications.map((res: any) => (
                    <div className="flex flex-col w-full gap-3 relative mb-2">
                      <label className="text-lg h-12" htmlFor="product">
                        {res.key}
                      </label>
                      <SelectField
                        options={res.values?.map((res: any) => {
                          return { value: res, label: res };
                        })}
                        value={formik.values.specifications[res.key]}
                        onChange={(value: any) =>
                          formik.setFieldValue(`specifications.${res.key}`, value.value)
                        }
                        isDisabled={isEdit}

                        isValid={
                          formik.touched[res.key] && formik.errors[res.key]
                            ? false
                            : true
                        }
                      />
                    </div>
                  ))
                }

                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="brand">
                    Brand
                  </label>

                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"
                      }`}
                    disabled={isEdit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.brand}
                  />
                  {formik.touched.brand && formik.errors.brand && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.brand}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="boxWeight">
                    Box Weight
                  </label>

                  <input
                    type="text"
                    name="boxWeight"
                    id="boxWeight"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"
                      }`}
                    disabled={isEdit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.boxWeight}
                  />
                  {formik.touched.boxWeight && formik.errors.boxWeight && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.boxWeight}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="boxesPerBase">
                    Boxes Per Base
                  </label>

                  <input
                    type="text"
                    name="boxesPerBase"
                    id="boxesPerBase"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"
                      }`}
                    disabled={isEdit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.boxesPerBase}
                  />
                  {formik.touched.boxesPerBase && formik.errors.boxesPerBase && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.boxesPerBase}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="boxesPerColumn">
                    Boxes Per Column
                  </label>

                  <input
                    type="text"
                    name="boxesPerColumn"
                    id="boxesPerColumn"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"
                      }`}
                    disabled={isEdit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.boxesPerColumn}
                  />
                  {formik.touched.boxesPerColumn && formik.errors.boxesPerColumn && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.boxesPerColumn}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="totalBoxes">
                    Totol Boxes
                  </label>

                  <input
                    type="text"
                    name="totalBoxes"
                    id="totalBoxes"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"
                      }`}
                    disabled={isEdit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.totalBoxes}
                  />
                  {formik.touched.totalBoxes && formik.errors.totalBoxes && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.totalBoxes}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="palletGrossWeight">
                    Pallet Gross Weight
                  </label>

                  <input
                    type="text"
                    name="palletGrossWeight"
                    id="palletGrossWeight"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"
                      }`}
                    disabled={isEdit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.palletGrossWeight}
                  />
                  {formik.touched.palletGrossWeight && formik.errors.palletGrossWeight && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.palletGrossWeight}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="palletNetWeight">
                    Pallet Net Weight
                  </label>

                  <input
                    type="text"
                    name="palletNetWeight"
                    id="palletNetWeight"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"
                      }`}
                    disabled={isEdit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.palletNetWeight}
                  />
                  {formik.touched.palletNetWeight && formik.errors.palletNetWeight && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.palletNetWeight}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="salesCases">
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
                    value={formik.values.salesCases}
                    onChange={(value: any) =>
                      formik.setFieldValue("salesCases", value.value)
                    }
                    isValid={
                      formik.touched.salesCases && formik.errors.salesCases
                        ? false
                        : true
                    }
                  />
                  {formik.touched.salesCases && formik.errors.salesCases && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.salesCases}
                    </small>
                  )}
                </div>

                <span>QR-Code</span>
                <div className="col-span-2 border-2 rounded-xl flex justify-center">
                  {details?.QRCode ? <Image
                    src={details?.QRCode ? details?.QRCode : ""}
                    width={300}
                    height={300}
                    alt="employee-image"
                  /> :
                    <div>No QR Code</div>
                  }

                </div>



                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="status">
                    Status
                  </label>

                  <input
                    type="text"
                    name="status"
                    id="status"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.id && formik.errors.id
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
                  <label className="text-lg h-12" htmlFor="containerSpot">
                    Container Spot<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="containerSpot"
                    id="containerSpot"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.containerSpot && formik.errors.containerSpot
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"
                      }`}
                    disabled={isEdit}

                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.containerSpot}
                  />
                  {formik.touched.containerSpot && formik.errors.containerSpot && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.containerSpot}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="operation">
                    Operation<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={employees?.map((res: any) => {
                      return { value: res._id, label: `${res.firstName} ${res.lastName}` };
                    })}
                    isDisabled={isEdit}
                    value={formik.values.operation}
                    onChange={(value: any) =>
                      formik.setFieldValue("operation", value.value)
                    }
                    isValid={
                      formik.touched.operation && formik.errors.operation
                        ? false
                        : true
                    }
                  />

                  {formik.touched.operation && formik.errors.operation && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.operation}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="qualitySpecialist">
                    Quality-Specialist<span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    options={employees?.map((res: any) => {
                      return { value: res._id, label: `${res.firstName} ${res.lastName}` };
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


              </div>

              {/* edit */}
              {isEdit && (
                <div className={`flex justify-center items-center p-5 w-full`}>
                  {/* <input type="submit" value="Create User" className="px-10 py-4 rounded-md bg-mainOrange text-white shadow-md text-center" /> */}
                  {details?.QRCode && < Button
                    title="Print QR-Code"
                    classes="px-5 py-2 bg-mainOrange text-white text-xl hover:bg-mainOrange"
                    handleOnClick={handlePrint}
                  />}
                  {details.status != 1 && <Button
                    title="Proceed to FulFill"
                    classes="px-5 py-2 bg-mainBlue text-white text-xl hover:bg-mainBlue hover:text-white transition"
                    handleOnClick={async (e: any) => {
                      e.preventDefault();
                      dispatch(SHOW_LOADER());

                      try {
                        await fulfillPallets(details._id);
                        router.push(`/inventory/products/pallets/${details?._id}`);

                        // await getPalletsById(details._id);

                      } catch (e) {
                      } finally {
                        dispatch(HIDE_LOADER());

                      }
                    }}
                  />}
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
