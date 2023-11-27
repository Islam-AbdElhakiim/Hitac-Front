import { ButtonParams } from "@/types";
import Link from "next/link";

const Button = ({
  title,
  icon,
  classes,
  isLink,
  href,
  isIconRight,
  handleOnClick,
  isDisabled,
  as,
  type,
}: ButtonParams) => {
  return (
    <>
      {isLink && href ? (
        <Link
          href={href}
          as={as}
          className={` flex justify-center items-center p-2 bg-lightGray text-darkGray rounded-md m-2 text-sm ${classes} cursor-pointer`}
        >
          {icon && <span className="mx-1">{icon}</span>}
          {title && title}
        </Link>
      ) : (
        <button
          type={type}
          disabled={isDisabled}
          className={`flex justify-center items-center p-2 bg-lightGray text-darkGray rounded-md m-2 text-sm  gap-1 cursor-pointer transition  ${classes}`}
          onClick={handleOnClick}
        >
          {icon && (
            <span className={`mx-1 ${isIconRight && "order-1"}`}>{icon}</span>
          )}
          {title && title}
        </button>
      )}
    </>
  );
};

export default Button;
