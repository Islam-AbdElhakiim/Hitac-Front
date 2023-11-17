import { SearchParams } from "@/types";
import { BsSearch } from "react-icons/bs";

const Search = ({ classes, placeHolder, onSearch }: SearchParams) => {
    const handleOnChange = (event:any) => {
        let {value} = event.target;
        onSearch(value);
    }
    return (
        <div className={`relative `}>
            <input type="text" name="search" className={` text-sm w-[250px] rounded-2xl bg-transparent outline-lightGray border border-lightGray p-2 pl-10 ${classes}`} placeholder={placeHolder || "Search"} onChange={handleOnChange} />
            <i className=" absolute left-3 top-[50%] -translate-y-[50%]">
                <BsSearch />
            </i>
        </div>);
}

export default Search;