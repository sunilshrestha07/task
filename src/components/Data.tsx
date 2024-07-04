import React, { useEffect, useState } from "react";
import { userInterface } from "../declareInterface/declareInterface";
import {  useNavigate } from "react-router-dom";

const Data: React.FC<{ formData: userInterface[] }> = ({ formData }) => {
   const navigate = useNavigate()
   const [allData, setAllData] = useState<userInterface[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [editingId, setEditingId] = useState<number | null>(null); // Track the currently editing item by ID
   const [editFormData, setEditFormData] = useState<Partial<userInterface>>({}); // Track the edited form data
   const itemsPerPage = 5;

   useEffect(() => {
      const storedData = localStorage.getItem("formData");
      setAllData(storedData ? JSON.parse(storedData) : []);
   }, [formData]);

   if (!allData) return null;

   const totalPages = Math.ceil(allData.length / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const currentData = allData.slice(startIndex, startIndex + itemsPerPage);

   // Handle page navigation
   const handlePreviousPage = () => {
      if (currentPage > 1) {
         setCurrentPage(currentPage - 1);
      }
   };

   // Handle page navigation
   const handleNextPage = () => {
      if (currentPage < totalPages) {
         setCurrentPage(currentPage + 1);
      }
   };

   // Handle edit
   const handleEdit = (item: userInterface) => {
      setEditingId(item.id);
      setEditFormData(item);
   };

   // Handle edit save
   const handleSave = () => {
      if (editingId === null) return;

      const updatedData = allData.map((item) =>
         item.id === editingId
            ? {
                 ...item,
                 ...editFormData,
                 phoneNumber: Number(editFormData.phoneNumber),
              } // Convert phoneNumber to number
            : item
      );
      setAllData(updatedData);
      localStorage.setItem("formData", JSON.stringify(updatedData));
      setEditingId(null); // Exit edit mode after saving
   };

   // Handle delete
   const handleDelete = (id: number) => {
      const updatedData = allData.filter((item) => item.id !== id);
      setAllData(updatedData);
      localStorage.setItem("formData", JSON.stringify(updatedData));
   };

   // Handle change of the input fields
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditFormData({
         ...editFormData,
         [name]: name === "phoneNumber" ? Number(value) : value,
      });
   };

   const handelRowClick =(id:any)=>{
      navigate(`/profile/${id}`)
   }

   return (
      <div className="">
         <div className="">
            {allData.length > 0 ? (
               <div className="">
                  <div className="">
                     <p className="text-2xl font-semibold my-3 sm:my-5">
                        My Orders
                     </p>
                  </div>
                  <div className="orders-table w-full font-quicksand">
                     <table className="min-w-full border-collapse border border-gray-200">
                        <thead className="text-sm ">
                           <tr className="bg-gray-100">
                              <th className="px-3 sm:px-4 py-3 border border-gray-200 text-left">
                                 Name
                              </th>
                              <th className="px-3 sm:px-4 py-3 border border-gray-200 text-left">
                                 Email
                              </th>
                              <th className="px-3 sm:px-4 py-3 border border-gray-200 text-left">
                                 Phone
                              </th>
                              <th className="px-3 sm:px-4 py-3 border border-gray-200 text-left">
                                 DOB
                              </th>
                              <th className="px-3 sm:px-4 py-3 border border-gray-200 text-left">
                                 City
                              </th>
                              <th className="px-3 sm:px-4 py-3 border border-gray-200 text-left">
                                 Province
                              </th>
                              <th className="px-3 sm:px-4 py-3 border border-gray-200 text-left">
                                 Country
                              </th>
                              <th className="px-3 sm:px-4 py-3 border border-gray-200 text-left">
                                 Actions
                              </th>
                           </tr>
                        </thead>
                        <tbody className="">
                           {currentData.map((item) => (
                              <tr
                                 key={item.id}
                                 className="bg-white even:bg-gray-50 hover:bg-gray-100 text-sm "
                               onClick={()=>handelRowClick(item.id)}>
                                 <td className="px-3 sm:px-4 py-3 border border-gray-200">
                                    {editingId === item.id ? (
                                       <input
                                          className="px-1 py-1"
                                          type="text"
                                          name="name"
                                          defaultValue={item.name}
                                          onChange={handleChange}
                                       />
                                    ) : (
                                       <p>{item.name}</p>
                                    )}
                                 </td>
                                 <td className="px-3 sm:px-4 py-3 border border-gray-200">
                                    {editingId === item.id ? (
                                       <input
                                          className="px-1 py-1"
                                          type="email"
                                          name="email"
                                          defaultValue={item.email}
                                          onChange={handleChange}
                                       />
                                    ) : (
                                       <p>{item.email}</p>
                                    )}
                                 </td>
                                 <td className="px-3 sm:px-4 py-3 border border-gray-200">
                                    {editingId === item.id ? (
                                       <input
                                          className="px-1 py-1"
                                          type="text"
                                          name="phoneNumber"
                                          defaultValue={item.phoneNumber.toString()}
                                          onChange={handleChange}
                                       />
                                    ) : (
                                       <p>{item.phoneNumber}</p>
                                    )}
                                 </td>
                                 <td className="px-3 sm:px-4 py-3 border border-gray-200">
                                    {editingId === item.id ? (
                                       <input
                                          className="px-1 py-1"
                                          type="text"
                                          name="dob"
                                          defaultValue={item.dob}
                                          onChange={handleChange}
                                       />
                                    ) : (
                                       <p>
                                          {new Date(
                                             item.dob
                                          ).toLocaleDateString()}
                                       </p>
                                    )}
                                 </td>
                                 <td className="px-3 sm:px-4 py-3 border border-gray-200">
                                    {editingId === item.id ? (
                                       <input
                                          className="px-1 py-1"
                                          type="text"
                                          name="city"
                                          defaultValue={item.city}
                                          onChange={handleChange}
                                       />
                                    ) : (
                                       <p>{item.city}</p>
                                    )}
                                 </td>
                                 <td className="px-3 sm:px-4 py-3 border border-gray-200">
                                    {editingId === item.id ? (
                                       <input
                                          className="px-1 py-1"
                                          type="text"
                                          name="province"
                                          defaultValue={item.province}
                                          onChange={handleChange}
                                       />
                                    ) : (
                                       <p>{item.province}</p>
                                    )}
                                 </td>
                                 <td className="px-3 sm:px-4 py-3 border border-gray-200">
                                    {editingId === item.id ? (
                                       <input
                                          className="px-1 py-1"
                                          type="text"
                                          name="country"
                                          defaultValue={item.country}
                                          onChange={handleChange}
                                       />
                                    ) : (
                                       <p>{item.country}</p>
                                    )}
                                 </td>
                                 <td className="flex gap-2 justify-center items-center h-full">
                                    {editingId === item.id ? (
                                       <div className="flex justify-center items-center w-full aspect-video ">
                                          <div
                                             className=""
                                             onClick={handleSave}
                                          >
                                             <img
                                                className="w-7 aspect-square"
                                                src="/icon/tick.png"
                                                alt=""
                                             />
                                          </div>
                                       </div>
                                    ) : (
                                       <div className="flex gap-3 justify-center items-center w-full aspect-video">
                                          <div
                                             className=""
                                             onClick={() =>
                                                handleDelete(item.id)
                                             }
                                          >
                                             <img
                                                className="w-7 aspect-square"
                                                src="/icon/delete.png"
                                                alt=""
                                             />
                                          </div>
                                          <div
                                             className=""
                                             onClick={() => handleEdit(item)}
                                          >
                                             <img
                                                className="w-7 aspect-square"
                                                src="/icon/edit.png"
                                                alt=""
                                             />
                                          </div>
                                       </div>
                                    )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                     <button
                        className={`px-4 py-2 rounded-lg ${
                           currentPage === 1
                              ? "opacity-50 cursor-not-allowed"
                              : "bg-blue-500 text-white"
                        }`}
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                     >
                        Previous
                     </button>
                     <span>
                        Page {currentPage} of {totalPages}
                     </span>
                     <button
                        className={`px-4 py-2 rounded-lg ${
                           currentPage === totalPages
                              ? "opacity-50 cursor-not-allowed"
                              : "bg-blue-500 text-white"
                        }`}
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                     >
                        Next
                     </button>
                  </div>
               </div>
            ) : (
               <div className=""></div>
            )}
         </div>
      </div>
   );
};

export default Data;
