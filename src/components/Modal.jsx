import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import moment from "moment";
import { useState } from "react";

const imageHostingToken = import.meta.env.VITE_IMAGE_BB_TOKEN;

const Modal = ({ openModal, setOpenModal, gallery }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const image_hosting_url = `https://api.imgbb.com/1/upload?key=${imageHostingToken}`;

  const onSubmit = async (data) => {
    // hosting image to imageBB
    setLoading(true);
    const date = moment().format("MMMM Do YYYY, h:mm:ss a"); //get upload time

    const formData = new FormData();
    formData.append("image", data?.image[0]);
    const fetchImage = await fetch(image_hosting_url, {
      method: "POST",
      body: formData,
    });
    const res = await fetchImage.json();
    const url = res.data?.display_url;

    const uuid = Math.random().toString(16).replace(/\./g, ""); // generate random id

    // save image to local storage
    const photo = {
      id: uuid,
      url,
      date,
    };
    const prevData = JSON.parse(localStorage.getItem("photos"));

    // save data to local storage
    localStorage.setItem(
      "photos",
      JSON.stringify(prevData ? [...prevData, photo] : [photo])
    );

    setLoading(false);
    reset();
    toast.success("Image added");
    setOpenModal(false);
    gallery();
  };

  return (
    <div
      className={`bg-slate-300 p-6 absolute sm:translate-x-[38rem] sm:translate-y-[8rem] -translate-x-[0.6rem] translate-y-[10rem] scale-0 opacity-0 transition-all duration-700 ease-in-out rounded z-10 ${
        openModal && "scale-100 opacity-100"
      }`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 relative"
      >
        <p
          onClick={() => setOpenModal(false)}
          className="absolute right-0 top-0 bg-slate-200 hover:bg-teal-400 p-2 rounded-full cursor-pointer"
        >
          X
        </p>
        <label htmlFor="image" className=" text-xs font-medium">
          Select Image
        </label>
        <input
          {...register("image")}
          type="file"
          accept=".jpg,.jpeg,.png"
          className="rounded-md text-xl file:px-8 file:py-3 file:rounded-md file:bg-slate-200 file:cursor-pointer file:border-none w-[100%] sm:w-auto"
        />
        <button className="px-10 py-2 font-medium bg-slate-200 hover:bg-teal-400 rounded uppercase transition-colors duration-300">
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default Modal;
