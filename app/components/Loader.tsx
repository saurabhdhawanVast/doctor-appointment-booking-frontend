import { Ellipsis } from "react-css-spinners";
export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Ellipsis color="#ffffff" size={20} />
    </div>
  );
}
