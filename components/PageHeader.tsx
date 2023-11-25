import { FiFilter } from "react-icons/fi";
import Button from "./Button";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const PageHeader = ({ pageTitle, newUrl }: { pageTitle: string, newUrl: string }) => {
    const { t } = useTranslation('common', { bindI18n: 'languageChanged loaded' })
    return (

        <div className="flex justify-between items-center w-full px-5 mb-2">

            {/* title */}
            <h2 className="font-light text-[22px]">{t(pageTitle)}</h2>

            {/* control */}
            <div className="flex justify-center items-center">
                <Button title="Filter" icon={<FiFilter />} />
                <Link href={newUrl}>
                    <Button title="Add new" classes="bg-mainOrange text-white" />
                </Link>
            </div>

        </div>

    );
}

export default PageHeader;