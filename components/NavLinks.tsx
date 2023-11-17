import { useTranslation } from 'next-i18next';
import NavLink from './NavLink';
import { useState } from 'react';
import { useRouter } from 'next/router';

const NavLinks = () => {
    const { t } = useTranslation('common', { bindI18n: 'languageChanged loaded' })
    const navLinks: any = t('navLinks', { returnObjects: true });
    // console.log(navLinks)
    const [opened, setOpened] = useState('');
    const [subMenuOpened, setSubMenuOpened] = useState('');
    const [isActive, setIsActive] = useState(false);

    //extract pathName
    const pathName = (() => {
        let parts = useRouter().pathname.toLowerCase().split("/");

        if (parts.length >= 2 ) {
            // console.log("true", parts)
            return parts[1];
        } 
    })();

    // console.log(pathName);
    const openMenu = (title: string) => {
        title == opened ? setOpened('') : setOpened(title);
        // console.log(opened, title)
    }
    const openSubMenu = (title: string) => {
        title == subMenuOpened ? setSubMenuOpened('') : setSubMenuOpened(title);
        // console.log(opened, title)
    }

    return (
        <div className="flex flex-col items-center justify-start w-full h-[70%] overflow-y-auto">
            {
                Object.keys(navLinks).map((ObjKey: any) => (
                    <NavLink key={Math.random() * Math.random()} link={navLinks[ObjKey]} opened={opened} openMenu={openMenu} subMenuOpened={subMenuOpened} openSubMenu={openSubMenu} selected='Suppliers' isActive={pathName == navLinks[ObjKey].title?.toLowerCase()} />
                ))
            }
        </div>
    );
}

export default NavLinks;