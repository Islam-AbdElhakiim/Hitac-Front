import { useTranslation } from "next-i18next";
import NavLink from "./NavLink";
import { useState } from "react";
import { useRouter } from "next/router";

const NavLinks = () => {
  const { t } = useTranslation("common", {
    bindI18n: "languageChanged loaded",
  });

  const navLinks: any = t("navLinks", { returnObjects: true });

  const [secondLevelMenuOpened, setSecondLevelMenuOpened] = useState<string>("");
  const [thirdLevelMenuOpened, setThirdLevelMenuOpened] = useState<string>("");
  const [isActive, setIsActive] = useState(false);

  //extract pathName
  let pathName = useRouter().pathname.toLowerCase().split("/")[1];

  // console.log(pathName);

  const openSecondLevelMenu = (title: string) => {
    secondLevelMenuOpened == `second-${title}` ? setSecondLevelMenuOpened("") : setSecondLevelMenuOpened(`second-${title}`);
    // console.log(opened, title)
  };

  const openThirdLevelMenu = (title: string) => {
    thirdLevelMenuOpened == `third-${title}` ? setThirdLevelMenuOpened("") : setThirdLevelMenuOpened(`third-${title}`);
    // console.log(opened, title)
  };

  // console.log(secondLevelMenuOpened, thirdLevelMenuOpened)

  return (
    <div className="flex flex-col items-center justify-start w-full h-[70%] overflow-y-auto">
      {Object.keys(navLinks).map((linksItem: any) => (
        <NavLink
          key={Math.random() * Math.random() + 'df'}
          link={navLinks[linksItem]}
          openSecondLevelMenu={openSecondLevelMenu}
          secondLevelMenuOpened={secondLevelMenuOpened}
          openThirdLevelMenu={openThirdLevelMenu}
          thirdLevelMenuOpened={thirdLevelMenuOpened}
          pathName={pathName}
          isActive={(() => {
            if (secondLevelMenuOpened != "") {
              if (thirdLevelMenuOpened != "") {
                // console.log("third is open on ", pathName, "and the thirdlevel opened is ", thirdLevelMenuOpened.toLocaleLowerCase())
                return pathName == thirdLevelMenuOpened.toLowerCase()
              } else {
                // console.log("second level is open on ", pathName, "and the secondlevel opened is ", secondLevelMenuOpened.toLocaleLowerCase())
                return pathName == secondLevelMenuOpened.toLowerCase()
              }
            } else {
              // console.log("first level is open on ", pathName, "and the opened is ", navLinks[linksItem].urlTitle?.toLowerCase())
              return pathName == navLinks[linksItem].urlTitle?.toLowerCase()

            }
          })()
          }
        />
      ))}
    </div>
  );
};

export default NavLinks;
