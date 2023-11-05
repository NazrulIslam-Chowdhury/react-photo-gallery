import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { BsFillCheckCircleFill, BsCardImage } from "react-icons/bs";
import toast from "react-hot-toast";
import Header from "./Header";

const Gallery = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState();
  const [asc, setAsc] = useState(false);

  // reference for drag and drop
  const dragRef = useRef();
  const dragOverRef = useRef();

  // get data from local storage
  const gallery = useCallback(() => {
    const photos = JSON.parse(localStorage.getItem("photos"));
    setFilteredPhotos(photos);
  }, []);

  useEffect(() => {
    gallery();
  }, [gallery]);

  // delete files
  const handleDeleteFiles = () => {
    const photos = JSON.parse(localStorage.getItem("photos"));
    const updatedPhotos = photos.filter(
      (photo) => !selectedItems.includes(photo.id)
    );
    localStorage.setItem("photos", JSON.stringify(updatedPhotos));
    setSelectedItems([]);
    gallery();
    toast.success("Files Deleted");
  };

  // taking value from selected items and store them in an array
  const handleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedItems((prev) => [...prev, value]);
    } else {
      setSelectedItems((prev) => {
        return [...prev.filter((selected) => selected !== value)];
      });
    }
  };

  // sort by asc,dsc
  const sort = () => {
    setAsc(!asc);
    setFilteredPhotos([...filteredPhotos.reverse()]);
  };

  // drag and drop sorting
  const handleDragSorting = () => {
    let sortedPhotos = [...filteredPhotos];

    // remove and save the dragged item content
    const draggedItemContent = sortedPhotos.splice(dragRef.current, 1)[0];

    // switch the position
    sortedPhotos.splice(dragOverRef.current, 0, draggedItemContent);

    // reset the position
    (dragRef.current = null), (dragOverRef.current = null);

    // update the array
    localStorage.setItem("photos", JSON.stringify(sortedPhotos));
    gallery();
  };

  return (
    <div
      className={`relative space-y-10 lg:p-10 p-5 z-auto ${
        openModal &&
        "bg-slate-800 dark:bg-opacity-70 bg-opacity-80 h-screen w-screen transition-all duration-500"
      }`}
    >
      <div className="flex">
        {/* header component */}
        <div
          className={`absolute right-8 mt-4 ${
            selectedItems.length > 0 && "right-[11.7rem]"
          } ${openModal && "-z-10"}`}
        >
          <Header />
        </div>

        {/* sort by asc,dsc */}
        <button
          onClick={sort}
          className={`mt-4 px-10 py-2 text-xs bg-slate-200 hover:bg-teal-400 hover:scale-110 rounded uppercase transition-all duration-500 ${
            openModal && "relative -z-10"
          }`}
        >
          {!asc ? "descending" : "ascending"}
        </button>

        {/* show delete button */}
        {selectedItems?.length > 0 && (
          <p
            onClick={handleDeleteFiles}
            className={`bg-red-300 hover:bg-red-500 hover:text-white hover:scale-110 px-11 py-2 mt-4 text-xs uppercase rounded cursor-pointer transition-all duration-500 fixed right-6 z-10 ${
              openModal && "-z-30"
            }`}
          >
            Delete Files
          </p>
        )}
      </div>

      {/* add image modal */}
      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        gallery={gallery}
      />

      {/* show images with draggable feature*/}
      {selectedItems.length > 0 && (
        <p
          className={`flex items-center justify-center fixed text-gray-400 top-20 sm:left-[45rem] -left-1 gap-2 z-10 bg-gray-100 px-5 py-2 rounded ${
            openModal && "-z-30"
          }`}
        >
          <BsFillCheckCircleFill className="w-6 h-6 text-teal-400" />
          {selectedItems.length}
          {selectedItems.length > 1 ? <span>files</span> : <span>file</span>}
          selected
        </p>
      )}

      <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-3">
        {filteredPhotos?.map((photo, idx) => {
          return (
            <div
              key={photo.id}
              className={`group relative cursor-move overflow-hidden ${
                openModal && "-z-10"
              } ${idx === 0 && "col-span-2 row-span-2"}`}
              draggable
              onDragStart={() => (dragRef.current = idx)}
              onDragEnter={() => (dragOverRef.current = idx)}
              onDragEnd={handleDragSorting}
              onDragOver={(e) => e.preventDefault()}
            >
              <img
                src={photo.url}
                alt={photo.url}
                loading="lazy"
                className="w-full h-full object-cover rounded-lg group-hover:scale-110 duration-700 transition-all"
              />

              <div className="absolute h-full w-full opacity-0 top-0 group-hover:opacity-100 transition-all duration-300 bg-slate-800 bg-opacity-70"></div>

              <input
                type="checkbox"
                value={photo.id}
                className="opacity-0 group-hover:opacity-100 checked:opacity-100 absolute top-0 left-0 w-12 h-12 cursor-pointer"
                onChange={handleChange}
              />
            </div>
          );
        })}
        <div
          onClick={() => setOpenModal(true)}
          className={`flex flex-col justify-center items-center gap-5 border-2 border-gray-500 border-dashed  py-20 cursor-pointer hover:bg-teal-400 hover:bg-opacity-60 transition-colors duration-500 group rounded-lg ${
            openModal && "relative -z-10"
          }`}
        >
          <BsCardImage className="w-7 h-7 dark:text-white group-hover:text-white" />
          <p className="uppercase dark:text-white group-hover:text-white">
            Add Images
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
