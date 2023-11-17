import { FiFilter } from "react-icons/fi";
import Button from "./Button";
import { useTranslation } from "next-i18next";

const PageHeader = ({ pageTitle }: { pageTitle: string }) => {
    const { t } = useTranslation('common', { bindI18n: 'languageChanged loaded' })
    return (

        <div className="flex justify-between items-center w-full px-5 mb-2">

            {/* title */}
            <h2 className="font-light text-[22px]">{t(pageTitle)}</h2>

            {/* control */}
            <div className="flex justify-center items-center">
                <Button title="Filter" icon={<FiFilter />} />
                <Button title="Add new" classes="bg-mainOrange text-white" />
            </div>

        </div>

    );
}

export default PageHeader;