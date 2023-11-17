import { useSelector } from "react-redux";

const loader = () => {
    // const {isLoading} = useSelector((state:any) => state.loaderReducer);
    // console.log(isLoading)

    return (
        // isLoading ? (

        <div className=" h-screen w-screen fixed bg-bgGray flex justify-center items-center z-10 top-0 left-0">
            <span className="loader"></span>
        </div>
        // ): null

    )

}

export default loader;