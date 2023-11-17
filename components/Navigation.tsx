import { useEffect } from "react";
import Logo from "./Logo";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NavLinks from "./NavLinks";
import Link from "next/link";
import { FiLogOut } from 'react-icons/fi'

export default function Navigation({ }: any) {
    const { t } = useTranslation('common', { bindI18n: 'languageChanged loaded' })

    return (
        <nav className="flex-[1] h-[95vh] flex flex-col items-center justify-between bg-lightGray py-5 rounded-3xl shadow-md">
            <span className="mt-10">

                <Logo />
            </span>
            <NavLinks />
            <Link href={'/logout'} className="pt-10 text-darkGray flex gap-3 justify-center items-center pr-10">
                <i className=" leading-10 text-lg"> <FiLogOut /></i>
                {t('labels.logout')}
            </Link>
        </nav>
    );
}
