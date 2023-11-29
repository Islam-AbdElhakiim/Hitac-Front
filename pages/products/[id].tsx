import Button from "@/components/Button";
import MyModal from "@/components/MyModal";
import { Attribute, productInitalType, productType } from "@/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { BsCloudUpload } from "react-icons/bs";
import { MdDelete, MdModeEdit, MdOutlineAdd } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllSegments } from "@/http/segmentsHttp";
import { deleteProductsById, getProductsById, updateProducts, } from "@/http/productsHttp";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";


export const getServerSideProps = async (context: any) => {
  const id = context.params.id;

  const productFetch = async () => {
    return await getProductsById(id);
  };
  const segmentsFetch = async () => {
    return await getAllSegments();
  };

  const [details, segments] = await Promise.all([
    productFetch(),
    segmentsFetch(),
  ]);

  // console.log(employee, accounts)

  return {
    props: {
      details,
      segments,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};


const Product = ({ details, segments }: { details: productType; segments: any }) => {

  console.log(details)

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
    setIsEdit(searchParams.get("isEdit") === "true");
  }, [searchParams]);

  // Handle remove User

  const validationSchema: any = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name should be between 3 and 20 letters!")
      .max(20, "Name should be between 3 and 20 letters!")
      .required("Name is required"),
    description: Yup.string().required("Description is required"),
    segment: Yup.string().required("Segment is required"),
    // Dynamically added email fields validation
  });

  const initialValues = {
    name: details?.name || "",
    description: details?.description || "",
    segment: details?.segment?._id || "",
    specifications: details?.specifications || [],
    image: details?.image || "",
  };

  const formik = useFormik<productInitalType>({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission
      console.log(values);

      setModalTitle(`Are you sure?`);
      setModalBody(
        `Are you sure you want to Save all the updates ${details.name}`
      );
      setIfTrue(() => save);
      setIsOpen(true);
    },
  });

  const deleteProduct = (name: string, _id: any) => {
    //popup modal
    const deleteProd = async () => {
      dispatch(SHOW_LOADER());
      try {
        const result = await deleteProductsById(_id);
        console.log(result);

        router.push("/products");
      } catch (e) {
      } finally {
      }
    };
    setModalTitle(`Are you sure?`);
    setModalBody(
      `Are you sure you want to delete ${name} from Hitac database?`
    );
    setIsOpen(true);
    setIfTrue(() => deleteProd);
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

  //#region handle dynamic attributes
  const [attributes, setAttributes] = useState<Attribute[]>(details.specifications);

  const addAttribute = () => {
    let temp = new Attribute();
    setAttributes((prev) => [...prev, temp]);
  }

  const addOptions = (_index: number) => {
    setAttributes((prev) => {
      let newValue = prev.map((attr, index) => {
        if (index == _index) attr.values.push("");
        return attr;
      })
      // console.log(newValue);
      return newValue;
    })

  }

  const deleteAttribute = (_index: number) => {
    setAttributes(prev => prev.filter((val, index) => index != _index));
  }

  const updateOptionValue = (_attributeIndex: number, _valueIndex: number, e: any) => {

    setAttributes((prev) => {
      let newValue = prev.map((attr, attributeIndex) => {
        // find attribute
        if (attributeIndex == _attributeIndex) {
          attr.values.map((value, valueIndex) => {
            // find option value
            if (valueIndex == _valueIndex) {
              // update it
              attr.values[valueIndex] = e.target.value
            }
          })
        }
        return attr;
      })
      // console.log(newValue);
      return newValue;
    })

  }
  //#endregion

  const save = async (e?: any) => {
    dispatch(SHOW_LOADER());

    try {

      //append the attributes
      await updateProducts(details._id, {
        ...formik.values,
        specifications: attributes
      });
      router.push("/products");
      // console.log(formik.values)
    } catch (err) {
      console.log(err)
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
            <Link
              href="/products"
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
                    deleteProduct(details.name, details?._id)
                  }
                />
              </div>
              {isEdit && (
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
              <h2>Product Information</h2>
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
                  <label className="text-lg" htmlFor="name">
                    Name<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    id="name"
                    className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2  ${formik.touched.name && formik.errors.name
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } ${isEdit ? "bg-white " : "bg-lightGray"} `}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    disabled={!isEdit}
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
                  <label className="text-lg" htmlFor="description">
                    Description<span className="text-red-500">*</span>
                  </label>

                  <textarea
                    rows={8}
                    name="description"
                    id="description"
                    className={`w-full rounded-md border border-lightGray shadow-md  px-2 ${formik.touched.description && formik.errors.description
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } ${isEdit ? "bg-white " : "bg-lightGray"}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    disabled={!isEdit}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.description}
                    </small>
                  )}
                </div>

                <div className="flex flex-col w-full gap-3 relative">
                  <label className="text-lg" htmlFor="segment">
                    Segments<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="segment"
                    id="segment"
                    className={`w-full h-12 rounded-md shadow-md  px-2 border ${formik.touched.segment && formik.errors.segment
                      ? "border-red-500 outline-red-500"
                      : "border-lightGray outline-lightGray"
                      } ${isEdit ? "bg-white " : "bg-lightGray"}`}
                    onChange={formik.handleChange}
                    value={formik.values.segment}
                    disabled={!isEdit}
                  >
                    <option selected hidden disabled value={""}>
                      Select
                    </option>
                    {segments?.map((res: any) => {
                      return <option value={res._id}>{res.name}</option>;
                    })}
                  </select>
                  {formik.touched.segment && formik.errors.segment && (
                    <small
                      className={`text-red-500 absolute -bottom-6 left-2 `}
                    >
                      {formik.errors.segment}
                    </small>
                  )}
                </div>
              </div>

              {/* start Product specifications */}
              <div className="text-2xl text-darkGray border-b-[1px] w-full py-3 flex gap-3 items-center">
                <h2>Product specifications</h2>
                {isEdit && (
                  <Button
                    type="button"
                    icon={
                      <span className="text-[#00733B] transition group-hover:text-white text-xl">
                        <MdOutlineAdd />
                      </span>
                    }
                    title="Add"
                    classes=" hover:bg-[#00733B] group hover:text-[white] transition "
                    handleOnClick={() => addAttribute()}
                  />
                )}
              </div>
              {isEdit ? (
                //write mood
                <div className="grid grid-cols-2 w-full text-darkGray gap-5">
                  {attributes?.map((attribute, attributeIndex) => (
                    <div className="flex flex-col w-full gap-3 mb-4 relative">
                      <div className="flex justify-start items-center gap-3">
                        <label className="text-lg" htmlFor="title">{t("labels.attribute") + (attributeIndex + 1)} </label>
                        {/* delete btn */}
                        <Button
                          type="button"
                          icon={
                            <span className="text-red-500 transition group-hover:text-white text-xl">
                              <MdDelete />
                            </span>
                          }
                          title={t("delete attribute")}
                          classes=" hover:bg-red-500 group hover:text-[white] transition "
                          handleOnClick={() => deleteAttribute(attributeIndex)}
                        />
                      </div>
                      <input placeholder="title" type="text" name="title" className="w-full h-12 rounded-md shadow-md  px-3 border border-lightGray outline-lightGray" value={attribute.key} onChange={(e) => setAttributes(attributes.map((attr, ind) => {
                        if (ind == attributeIndex) {
                          attr.key = e.target.value;
                        }
                        return attr;
                      }))} />
                      < div className="w-1/4" >
                        <Button
                          type="button"
                          icon={
                            <span className="text-[#00733B] transition group-hover:text-white text-xl">
                              <MdOutlineAdd />
                            </span>
                          }
                          title={t("Add Options ")}
                          classes=" hover:bg-[#00733B] group hover:text-[white] transition "
                          handleOnClick={() => addOptions(attributeIndex)}
                        />
                      </div>
                      {/* options */}
                      {attribute.values.map((value, valueIndex) => (
                        < input type="text" placeholder="add option" value={value} name="option" className="w-full h-12 rounded-md shadow-md  px-3 border border-lightGray outline-lightGray" onChange={(e) => updateOptionValue(attributeIndex, valueIndex, e)} />
                      ))}

                    </div>
                  ))}

                </div>
              ) : (
                // read-only mode
                <div className="grid grid-flow-dense w-full text-darkGray gap-5 grid-cols-2 shadow-md bg-lightGray p-2 rounded-md">
                  {attributes?.length > 0 ? attributes.map((attribute, attributeIndex) => (
                    <div className="flex flex-col w-full gap-3 mb-4 relative">
                      {/* <label className="text-lg" htmlFor="title">{t("labels.attribute") + (attributeIndex + 1)} </label> */}
                      <div className="w-full border flex flex-col items-start justify-center ">
                        <h2 className=" border-b-2 w-full p-2 font-bold text-xl  "> {attribute.key}</h2>
                        {attribute.values.map((value, valueIndex) => (
                          <span className=" p-2 w-full">{value}</span>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <span>No Attributes</span>
                  )}

                </div>
              )}
              {/* End Product specifications */}

              {/* edit */}
              {!isEdit && (
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
          </div >
          {/* Modal */}
          < MyModal
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            title={modalTitle}
            body={modalBody}
            ifTrue={ifTrue}
          />
        </div >
      )}
    </>
  );
};

export default Product;