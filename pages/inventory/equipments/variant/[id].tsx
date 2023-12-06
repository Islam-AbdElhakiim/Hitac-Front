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
    Account,
    EmployeeType,
    productType,
    segmentType,
    supplierType,
} from "@/types";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/modules/loader-slice";
import Loader from "@/components/Loader";
import MyModal from "@/components/MyModal";
import Link from "next/link";
import { deleteSegmentsById, getAllSegments } from "@/http/segmentsHttp";
import { deleteProductsById, getAllProducts } from "@/http/productsHttp";
import { IoArrowForward } from "react-icons/io5";
import DataCard from "@/components/DataCard";
import { FiFilter } from "react-icons/fi";
import PatchCard from "@/components/PatchCard";
import EquipmentCard from "@/components/EquipmentCard";

export const getServerSideProps = async ({ locale }: any) => {
    const data = await getAllProducts();
    return {
        props: {
            products: data,
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
};

export default function Products({ products }: { products: productType[] }) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation("common", {
        bindI18n: "languageChanged loaded",
    });

    const user = useSelector((state: any) => state.authReducer);
    const { isLoading } = useSelector((state: any) => state.loaderReducer);

    // const [allEmployees, setAllEmployees] = useState<EmployeeType[]>(employees);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageProducts, setPageProducts] = useState(products?.slice());

    const [selectedProducts, setSelectedProducts] = useState(new Array());

    // modal
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>();
    const [modalBody, setModalBody] = useState<string>();
    const [modalTrue, setModalTrue] = useState<() => void>(() => { });

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
    const handleNextPagination = () => {
        if (10 * currentPage < products?.length)
            setCurrentPage((prev: number) => prev + 1);
    };
    //#endregion

    //#region handle selecting employee Account
    const handleClick = (prod: any) => {
        if (!selectedProducts.includes(prod._id)) {
            setSelectedProducts([...selectedProducts, prod._id]);
        } else {
            setSelectedProducts(
                selectedProducts.filter((product) => product != prod._id)
            );
        }
    };
    //selecting all emplyee
    const selectAll = () => {
        setSelectedProducts(products.map((prod: any) => prod._id));
        if (selectedProducts?.length == products?.length) {
            setSelectedProducts([]);
        }
    };
    //#endregion

    //#region handle interna search method
    const handleSearch = (value: string) => {
        // console.log(value)
        if (value) {
            setPageProducts(
                pageProducts.filter((prod: any) => prod.name.startsWith(value))
            );
        } else {
            setPageProducts(products?.slice());
        }
    };
    //#endregion

    //#region handleDelete
    const handleDelete = async () => {
        const deleteProducts = async () => {
            dispatch(SHOW_LOADER());
            try {
                selectedProducts
                    .filter((id) => id != user._id)
                    .forEach(async (_id) => {
                        await deleteProductsById(_id);
                    });
                setPageProducts((prev: productType[]) =>
                    prev.filter((prod) => !selectedProducts.includes(prod._id))
                );
            } catch (e) {
                console.log("error in deleting station", e);
            } finally {
                dispatch(HIDE_LOADER());

                setSelectedProducts([]);
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
                    <PageHeader pageTitle="pages.equipments" newUrl={"/inventory/equipments/in-stock/new"} />

                    <div className="flex flex-col p-10 gap-6">
                        <div className="flex gap-x-20 gap-y-10 flex-wrap">
                            <DataCard fullWidth={true} />
                        </div>

                        <h2 className="text-[22px] font-semibold mb-10">Item Variants</h2>
                        <div className="flex gap-x-16 gap-y-10 flex-wrap">
                            <Link href="/inventory/equipments/in-stock/sss">
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
                            <Link href="/inventory/equipments/in-stock/new">
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
