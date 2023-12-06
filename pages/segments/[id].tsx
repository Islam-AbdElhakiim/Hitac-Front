import Button from "@/components/Button";
import MyModal from "@/components/MyModal";

import { segmentType, stationType } from "@/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { BsCloudUpload } from "react-icons/bs";
import { MdModeEdit, MdOutlineAdd } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbArrowsSort } from "react-icons/tb";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import countries from "@/constants/countries";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import {
  deleteStationById,
  getStationById,
  updateStation,
} from "@/http/stationsHttp";
import {
  deleteSegmentsById,
  getSegmentsById,
  updateSegments,
} from "@/http/segmentsHttp";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
export const getServerSideProps = async (context: any) => {
  const id = context.params.id;

  const segmentFetch = async () => {
    return await getSegmentsById(id);
  };

  const [details] = await Promise.all([segmentFetch()]);

  // console.log(employee, accounts)

  return {
    props: {
      details,

      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};

const Segment = ({ details }: { details: any }) => {
  console.log(details);

  const searchParams = useSearchParams();
  const [isEdit, setIsEdit] = useState(false);
  const [filePath, setFilePath] = useState(details?.image);

  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const dispatch = useDispatch<AppDispatch>();

  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const router = useRouter();

  // modal
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalBody, setModalBody] = useState<string>();
  const [ifTrue, setIfTrue] = useState<() => void>(() => { });

  useEffect(() => {
    setIsEdit(searchParams.get("isEdit") !== "true");
  }, [searchParams]);

  // Handle remove User

  const validationSchema: any = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name should be between 3 and 20 letters!")
      .max(20, "Name should be between 3 and 20 letters!")
      .required("Name is required"),
    description: Yup.string().required("Description is required"),
    // Dynamically added email fields validation
  });

  const initialValues = {
    name: details?.name || "",
    description: details?.description || "",
    image: details?.image || "",
  };

  const formik = useFormik<segmentType>({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission

      setModalTitle(`Are you sure?`);
      setModalBody(
        `Are you sure you want to Save all the updates ${details.name}`
      );
      setIfTrue(() => save);
      setIsOpen(true);
    },
  });

  const deleteSegment = (name: string, _id: any) => {
    //popup modal
    const deleteSeg = async () => {
      dispatch(SHOW_LOADER());
      try {
        await deleteSegmentsById(_id);
        router.push("/segments");
      } catch (e) {
      } finally {
      }
    };
    setModalTitle(`Are you sure?`);
    setModalBody(
      `Are you sure you want to delete ${name} from Hitac database?`
    );
    setIsOpen(true);
    setIfTrue(() => deleteSeg);
  };

  const save = async (e?: any) => {


    dispatch(SHOW_LOADER());
    try {
      await updateSegments(details._id, {
        ...formik.values,
      });
      router.push("/segments");
    } catch (e) {
    } finally {
      // dispatch(HIDE_LOADER());
    }
  };
  const handleImageUpload = async (e: any) => {
    const files = e.target.files;
    console.log(files[0]);
    const formData = new FormData();
    formData.append("image", files[0]);
    const res = await fetch("https://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data) {
      console.log(data.filePath.slice(8));
      console.log(typeof data.filePath.slice(8));
      setFilePath(data.filePath.slice(8));
      formik.setFieldValue("image", data.filePath.slice(8));
    }
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-start mt-5 bg-white rounded-xl shadow-md  px-5 gap-3">
          {/* header- wrapper */}

          <div className="flex flex-col justify-center items-center w-full border-b-[1px] py-3 relative">
            <Link
              href="/segments"
              className="absolute top-5 left-5 text-3xl text-mainBlue"
            >
              <IoMdArrowRoundBack />
            </Link>
            <div className="image-wrapper flex justify-center items-center w-40 h-40 rounded-full p-5 relative bg-bgGray border overflow-hidden">
              <Image
                src={filePath ? filePath : "/uploads/avatar.png"}
                alt="employee-image"
                fill
              />

              {/* <input type="file" name="file" accept="image/*" /> */}
            </div>
            {/* Control */}
            <h2 className=" font-light text-3xl my-4">{`${details?.name}`}</h2>

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
                    deleteSegment(details.name, details?._id)
                  }
                />
              </div>
              {!isEdit && (
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
              )}
            </div>

            {/* username */}
          </div>

          {/* personal-data-section */}
          <div className="flex flex-col items-start justify-start w-full p-5 gap-3 border rounded-xl mt-2">
            {/* title */}
            <div className="text-2xl text-darkGray border-b-[1px] w-full py-3">
              <h2>Segment Information</h2>
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
              <div className="grid grid-cols-1 w-full text-darkGray gap-5">
                {/* left col */}
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="name">
                    Name<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    id="name"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2  ${formik.touched.name && formik.errors.name
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"} `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    disabled={isEdit}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.name}
                    </small>
                  )}
                </div>
                <div className="flex flex-col w-full gap-3 relative mb-2">
                  <label className="text-lg h-12" htmlFor="description">
                    Description<span className="text-red-500">*</span>
                  </label>

                  <textarea
                    rows={8}
                    name="description"
                    id="description"
                    className={`w-full rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.description && formik.errors.description
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } ${!isEdit ? "bg-white " : "bg-lightGray"}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    disabled={isEdit}
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

              {/* Submit */}
              {/* Edit */}
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

export default Segment;
