import { ModelParams, intialSalesType, performaType } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import { useFormik } from "formik";
import { Fragment, useState } from "react";
import SelectField from "./ReactSelect/SelectField";

export default function PerformaModal({ show, onHide }: any) {
  // let [isOpen, setIsOpen] = useState(true)
  const formik = useFormik<performaType>({
    initialValues: {
      date: "",
      expiryDate: "",
      terms: "",
      note: "",
    },
    onSubmit: async (values) => {
      // Handle form submission
      // dispatch(SHOW_LOADER());
      // try {
      //     await createSupplier({
      //         ...values,
      //     });
      //     router.push("/suppliers");
      // } catch (e) {
      // } finally {
      //     // dispatch(HIDE_LOADER());
      // }
    },
  });
  function closeModal() {}

  function openModal() {}

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[70%]  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Performa
                  </Dialog.Title>
                  <div className="mt-2">
                    <form
                      className="flex flex-col justify-start items-center w-full gap-10 py-5 text-darkGray"
                      onSubmit={formik.handleSubmit}
                      autoComplete="off"
                    >
                      {/* first row */}
                      <div className="grid grid-cols-2 w-full text-darkGray gap-5">
                        {/* left col */}

                        <div className="flex flex-col w-full gap-3 relative mb-2">
                          <label className="text-lg h-12" htmlFor="date">
                            Date<span className="text-red-500">*</span>
                          </label>

                          <input
                            type="date"
                            name="date"
                            id="date"
                            className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                              formik.touched.date && formik.errors.date
                                ? "border-red-500 outline-red-500"
                                : "border-lightGray outline-lightGray"
                            } `}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.date}
                          />
                          {formik.touched.date && formik.errors.date && (
                            <small
                              className={`text-red-500 absolute -bottom-6 left-2 `}
                            >
                              {formik.errors.date}
                            </small>
                          )}
                        </div>
                        <div className="flex flex-col w-full gap-3 relative mb-2">
                          <label className="text-lg h-12" htmlFor="expiryDate">
                            Expiry Date<span className="text-red-500">*</span>
                          </label>

                          <input
                            type="date"
                            name="expiryDate"
                            id="expiryDate"
                            className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                              formik.touched.expiryDate &&
                              formik.errors.expiryDate
                                ? "border-red-500 outline-red-500"
                                : "border-lightGray outline-lightGray"
                            } `}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.expiryDate}
                          />
                          {formik.touched.expiryDate &&
                            formik.errors.expiryDate && (
                              <small
                                className={`text-red-500 absolute -bottom-6 left-2 `}
                              >
                                {formik.errors.expiryDate}
                              </small>
                            )}
                        </div>
                        <div className="flex flex-col w-full gap-3 relative mb-2">
                          <label className="text-lg h-12" htmlFor="terms">
                            Terms of payment
                          </label>
                          <SelectField
                            options={[]}
                            value={formik.values.terms}
                            onChange={(value: any) =>
                              formik.setFieldValue(`terms`, value.value)
                            }
                            isValid={
                              formik.touched.terms && formik.errors.terms
                                ? false
                                : true
                            }
                          />
                        </div>
                        <div className="flex flex-col w-full gap-3 relative mb-2">
                          <label className="text-lg h-12" htmlFor="note">
                            Note<span className="text-red-500">*</span>
                          </label>

                          <input
                            type="text"
                            name="note"
                            id="note"
                            className={`w-full h-12 rounded-md border border-lightGray shadow-md  px-2 ${
                              formik.touched.note && formik.errors.note
                                ? "border-red-500 outline-red-500"
                                : "border-lightGray outline-lightGray"
                            } `}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.note}
                          />
                          {formik.touched.note && formik.errors.note && (
                            <small
                              className={`text-red-500 absolute -bottom-6 left-2 `}
                            >
                              {formik.errors.note}
                            </small>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="mt-4 flex justify-center items-center gap-5">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-lightGray text-mainBlue px-8 py-2 text-sm font-medium  hover:bg-mainBlue hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        onHide();
                      }}
                    >
                      Yes
                    </button>

                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-lightGray text-red-500 px-8 py-2 text-sm font-medium  hover:bg-red-500 hover:text-white trasnition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        onHide();
                      }}
                    >
                      No
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
