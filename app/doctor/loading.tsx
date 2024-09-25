import { Ellipsis } from "react-css-spinners";
export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Ellipsis color="rgba(22,22,22,1)" size={200} />
    </div>
  );
}
    