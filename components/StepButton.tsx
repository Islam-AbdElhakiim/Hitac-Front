import { useRouter } from "next/navigation";

const StepButton = ({
  arr,
  setArr,
  setSelectedTab,
}: {
  arr: any;
  setArr?: any;
  setSelectedTab?: any;
}) => {
  const router = useRouter();

  const nextStep = () => {
    const index = arr.findIndex((item: any) => item.active);
    setArr((prev: any) =>
      prev.map((item: any, i: any) => {
        if (index == i && i < arr.length - 1) {
          item.active = false;
          prev[index + 1].active = true;
          setSelectedTab(prev[index + 1].name);
        }
        return item;
      })
    );
  };

  const prevStep = () => {
    setArr((prev: any) =>
      prev.map((item: any, index: any) => {
        if (index > 0 && item.active) {
          item.active = false;
          prev[index - 1].active = true;
          setSelectedTab(prev[index - 1].name);
        }
        return item;
      })
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <nav className="flex justify-between">
        {/* Link to Tab 1 */}
        <div
          className={`arrow arrow-right ${arr[0].active ? "active" : ""}`}
          onClick={() => {
            router.push(arr[0]?.url);
          }}
        >
          {arr[0].name}
        </div>

        {arr.map((item: any, index: number) => {
          return (
            index > 0 &&
            index < arr.length - 1 && (
              <>
                <div
                  key={index}
                  className={`arrow arrow-right arrow-left ${
                    item.active ? "active" : ""
                  }`}
                  onClick={() => {
                    router.push(item?.url);
                  }}
                >
                  {item.name}
                </div>
              </>
            )
          );
        })}
        <div
          className={`arrow arrow-left ${
            arr[arr.length - 1].active ? "active" : ""
          }`}
          onClick={() => {
            router.push(arr[arr.length - 1]?.url);
          }}
        >
          {arr[arr.length - 1].name}
        </div>
        {/* <div className="arrow arrow-right arrow-left">s</div> */}
      </nav>
    </div>
  );
};

export default StepButton;
