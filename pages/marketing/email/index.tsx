import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import Search from "@/components/Search";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MdOutlineAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import MyModal from "@/components/MyModal";
import MarketingCard from "@/components/MarketingCard";

export const getServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default function Email() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const user = useSelector((state: any) => state.authReducer);
  const { isLoading } = useSelector((state: any) => state.loaderReducer);

  // const [allEmployees, setAllEmployees] = useState<EmployeeType[]>(employees);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageemail, setPageemail] = useState([]?.slice());

  const [selectedemail, setSelectedemail] = useState(new Array());

  // modal
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalBody, setModalBody] = useState<string>();
  const [modalTrue, setModalTrue] = useState<() => void>(() => {});

  useEffect(() => {
    dispatch(HIDE_LOADER());
  }, []);

  //#region dispatch employees to the store
  // if (stations && stations?.length > 0) {
  //   dispatch(GETALLACCOUNTS({ stations }));
  // }
  //#endregion

  //#region pagination
  let startingIndex = currentPage == 1 ? 0 : (currentPage - 1) * 10;
  const handlePrevPagination = () => {
    if (currentPage > 1) setCurrentPage((prev: number) => prev - 1);
  };

  //#endregion

  //#region handle selecting employee Account

  //#region handle interna search method
  const handleSearch = (value: string) => {
    // console.log(value)
    //   if (value) {
    //     setPageemail(
    //       pageemail.filter((prod: any) => prod.name.startsWith(value))
    //     );
    //   } else {
    //     setPageemail(patchs?.slice());
    //   }
  };
  //#endregion

  //#region handleDelete
  const handleDelete = async () => {
    const deleteemail = async () => {
      dispatch(SHOW_LOADER());
      try {
        selectedemail
          .filter((id) => id != user._id)
          .forEach(async (_id) => {
            // await deleteemailById(_id);
          });
        // setPageemail((prev: emailInitalType[]) =>
        //   prev.filter((prod) => !selectedemail.includes(prod._id))
        // );
      } catch (e) {
        console.log("error in deleting station", e);
      } finally {
        dispatch(HIDE_LOADER());

        setSelectedemail([]);
      }
    };

    setModalTitle("Are you sure?");
    setModalBody(
      "Deleteing the selected product will ERASE THEM FOREVER from the database! "
    );
    setModalTrue(() => deleteemail);
    setIsOpen(true);
    //#endregion
  };
  const navigate = (id: any) => {
    router.push(`/email/${id}`);
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col justify-center items-center px-5 h-full ">
          <PageHeader
            pageTitle="pages.emails"
            newUrl={`/marketing/email/new`}
          />
          {/* Page Body */}
          <div className="flex flex-col justify-cstart enter items-center  bg-white rounded-2xl shadow-lg w-full h-full px-10 ">
            {/* top control row */}
            <div className="flex justify-center items-center w-full  py-3">
              {/* page Control */}
              <div className="flex justify-center items-center">
                {/* Search */}
                <Search
                  classes="rounded-lg w-[180px]"
                  onSearch={handleSearch}
                />

                {/* CRUD Operations */}
                <Button
                  icon={
                    <span className="text-[#00733B] transition group-hover:text-white text-2xl">
                      <MdOutlineAdd />
                    </span>
                  }
                  title="Create"
                  classes=" hover:bg-[#00733B] group hover:text-[white] transition"
                  isLink={true}
                  href={`/marketing/email/new`}
                />
              </div>
            </div>
            <div className="flex gap-x-3 gap-y-10 flex-wrap">
              <MarketingCard data={{}} type="email" />
              <MarketingCard data={{}} type="email" />
              <MarketingCard data={{}} type="email" />
            </div>
          </div>
          {/* Modal */}
          <MyModal
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            title={modalTitle}
            body={modalBody}
            ifTrue={modalTrue}
          />
        </div>
      )}
    </>
  );
}
