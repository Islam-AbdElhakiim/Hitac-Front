import Image from "next/image";
import Link from "next/link";

const Logo = ({ classes, textClasses }: { classes?: string, textClasses?: string }) => {
    return (
        <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center justify-center ">
            <div className={`image-wrapper w-[80px] h-[80px] relative ${classes}`}>
                <Image
                    src={'/hitac.png'}
                    alt="hitac-logo" 
                    priority
                    fill
                    draggable={false}
                />
            </div>
            <h2 className={`text-mainBlue uppercase relative -top-2 ${textClasses}`}><span className=" text-mainOrange">Hi</span>tac</h2>
            </Link>
        </div>
    );
}


export default Logo;