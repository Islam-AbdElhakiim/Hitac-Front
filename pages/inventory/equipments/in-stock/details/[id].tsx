import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import Search from "@/components/Search";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MdModeEdit, MdOutlineAdd } from "react-icons/md";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbArrowsSort, TbTextDirectionLtr } from "react-icons/tb";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
    productType,
} from "@/types";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import MyModal from "@/components/MyModal";
import Link from "next/link";
import DataCard from "@/components/DataCard";
import EquipmentCard from "@/components/EquipmentCard";
import { getEquipmentById, getVariantById } from "@/http/equipmentsHttp";

export const getServerSideProps = async ({ params, locale }: any) => {
    const id = params.id;

    const data = await getEquipmentById(id);
    return {
        props: {
            equip: data,
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
};

export default function Products({ equip }: { equip: any }) {
    console.log(equip);

    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation("common", {
        bindI18n: "languageChanged loaded",
    });

    const user = useSelector((state: any) => state.authReducer);
    const { isLoading } = useSelector((state: any) => state.loaderReducer);

    // const [allEmployees, setAllEmployees] = useState<EmployeeType[]>(employees);


    // modal
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>();
    const [modalBody, setModalBody] = useState<string>();
    const [modalTrue, setModalTrue] = useState<() => void>(() => { });

    useEffect(() => {
        dispatch(HIDE_LOADER());
    }, []);


    //#region handleDelete
    const handleDelete = async () => {
        const deleteProducts = async () => {
            dispatch(SHOW_LOADER());
            try {

            } catch (e) {
                console.log("error in deleting station", e);
            } finally {
                dispatch(HIDE_LOADER());

            }
        };

        setModalTitle("Are you sure?");
        setModalBody(
            "Deleteing the selected product will ERASE THEM FOREVER from the database! "
        );
        setModalTrue(() => deleteProducts);
        setIsOpen(true);
        //#endregion
    };
    const navigate = (id: any) => {
        router.push(`/products/${id}`);
    };
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <PageHeader pageTitle="pages.equipments" newUrl={""} />

                    <div className="flex flex-col p-10 gap-6">
                        <div className="flex gap-x-20 gap-y-10 flex-wrap">
                            <DataCard data={equip} fullWidth={true} />
                        </div>

                        <h2 className="text-[22px] font-semibold mb-10">Item Variants</h2>
                        <div className="flex gap-x-16 gap-y-10 flex-wrap">
                            <Link href="/inventory/equipments/variant/sss">
                                <EquipmentCard id='d' />
                            </Link>
                            <Link href="/inventory/equipments/in-stock/sss">
                                <EquipmentCard id='d' />
                            </Link>
                            <Link href="/inventory/equipments/in-stock/sss">
                                <EquipmentCard id='d' />
                            </Link>
                        </div>
                        <div className="flex justify-center">
                            <Link href={"/inventory/equipments/variant/new?id=" + equip._id}>
                                <Button title="Add New" classes="bg-mainOrange text-white px-[13px] py-[13px]" />
                            </Link>
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
                </>
            )}
        </>
    );
}
