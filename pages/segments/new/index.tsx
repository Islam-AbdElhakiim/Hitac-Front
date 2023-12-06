import Button from "@/components/Button";
import { segmentType, stationType } from "@/types";
import { useTranslation } from "next-i18next";
import { MdOutlineAdd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import countries from "@/constants/countries";
import { createSegments } from "@/http/segmentsHttp";
import { BsCloudUpload } from "react-icons/bs";
import { useState } from "react";
import Image from "next/image";
import { SHOW_LOADER } from "@/redux/modules/loader-slice";
import { AppDispatch } from "@/redux/store";

const NewStation = () => {
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const router = useRouter();

  const { isLoading } = useSelector((state: any) => state.loaderReducer);
  const [filePath, setFilePath] = useState("/avatar.png");
  const dispatch = useDispatch<AppDispatch>();

  //#region initialization

  const validationSchema: any = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name should be between 3 and 20 letters!")
      .max(20, "Name should be between 3 and 20 letters!")
      .required("Name is required"),
    description: Yup.string().required("Description is required"),
    // Dynamically added email fields validation
  });

  const formik = useFormik<segmentType>({
    initialValues: {
      name: "",
      description: "",
      image: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission


      dispatch(SHOW_LOADER());
      try {
        await createSegments({
          ...values,
        });
        router.push("/segments");
      } catch (e) {
      } finally {
        // dispatch(HIDE_LOADER());
      }
    },
  });

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
        <div className="flex flex-col items-start justify-start my-5 pb-10 bg-white rounded-xl shadow-md">
          {/* header- wrapper */}
          <div className="flex flex-col justify-center items-center w-full border-b-[1px] py-3">
            {/* Image */}
            <div className="image-wrapper flex justify-center items-center w-40 h-40 rounded-full p-5 relative bg-bgGray border overflow-hidden">
              <Image src={filePath} alt="segment-image" fill />

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
                      }} `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
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
                      } `}
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

              {/* Submit */}
              <div className="flex justify-center items-center p-5 w-full">
                <Button
                  type="submit"
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

export default NewStation;
