import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { userInterface } from "../declareInterface/declareInterface";

const Profile: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const [specificData, setSpecificData] = useState<userInterface | null>(null);

   useEffect(() => {
      // Fetch data from localStorage
      const storedData = localStorage.getItem("formData");
      if (storedData) {
         const parsedData = JSON.parse(storedData);

         // Find the specific data using the id from URL params
         const data = parsedData.find(
            (item: userInterface) => item.id === Number(id)
         );
         setSpecificData(data);
      }
   }, [id]);

   if (!specificData) {
      return <div>Loading...</div>;
   }

   return (
      <>
         <div className=" bg-orange-50 h-screen">
            <div className=" text-center">
               <h1 className="text-4xl font-bold font-quicksand py-10">
                  Profile
               </h1>
            </div>
            <div className=" flex justify-center items-center">
               <div className=" flex flex-col gap-7">
                  <div className="flex justify-center items-center">
                     <img
                        className="rounded-full h-40 w-40"
                        src={specificData.profilePicture}
                        alt=""
                     />
                  </div>
                  <div className=" text-xl font-quicksand font-semibold flex flex-col gap-2">
                     <p className=" py-2 rounded-lg px-10 bg-white outline outline-1 text-center">
                        {specificData.name}
                     </p>
                     <p className=" py-2 rounded-lg px-10 bg-white outline outline-1 text-center">
                        {specificData.email}
                     </p>
                     <p className=" py-2 rounded-lg px-10 bg-white outline outline-1 text-center">
                        {specificData.phoneNumber}
                     </p>
                     <p className=" py-2 rounded-lg px-10 bg-white outline outline-1 text-center">
                        {specificData.dob}
                     </p>
                     <p className=" py-2 rounded-lg px-10 bg-white outline outline-1 text-center">
                        {specificData.city}
                     </p>
                     <p className=" py-2 rounded-lg px-10 bg-white outline outline-1 text-center">
                        {specificData.province}
                     </p>
                     <p className=" py-2 rounded-lg px-10 bg-white outline outline-1 text-center">
                        {specificData.country}
                     </p>
                  </div>
                  <div className="">
                     <Link to="/">
                        <p className=" px-6 py-2 bg-black text-white hover:text-black hover:bg-white outline outline-1 text-center rounded-md w-1/2">
                           Home
                        </p>
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Profile;
