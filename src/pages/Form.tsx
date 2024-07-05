import React, { useEffect, useRef, useState } from "react";
import { userInterface } from "../declareInterface/declareInterface";
import { ZodError } from "zod";
import { storage } from "../firebase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Data from "../components/Data";
import { UserModelSchema } from "../zodModels/User.model";

interface Country {
  name: {
    common: string;
  };
}

const Form: React.FC = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [formData, setFormData] = useState<userInterface>({
    id: 0,
    name: "",
    phoneNumber: 0,
    email: "",
    dob: "",
    city: "",
    district: "",
    country: "Nepal",
    province: "",
    profilePicture: "",
  });
  const [submittedData, setSubmittedData] = useState<userInterface[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const profileRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Fetch countries from API
  const fetchCountries = async () => {
    try {
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data: Country[] = await res.json();
      const countryNames = data.map((country: Country) => country.name.common);
      countryNames.sort((a, b) => a.localeCompare(b)); // Sorting in ascending order
      setCountries(countryNames);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) {
        // 5MB
        alert("File size should be less than 5MB.");
        return;
      }
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // Handle picture upload
  const handlePictureUpload = async () => {
    if (image) {
      const imageRef = ref(storage, `profile/${image.name + v4()}`);
      await uploadBytes(imageRef, image);
      const firebaseUrl = await getDownloadURL(imageRef);
      return firebaseUrl;
    }
    return null;
  };

  // Handle form submit
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const uploadedImageUrl = await handlePictureUpload();
      const updatedFormData = {
        ...formData,
        id: submittedData.length + 1, // Assign unique ID
        profilePicture: uploadedImageUrl,
      };

      const result = UserModelSchema.safeParse(updatedFormData);

      if (result.success) {
        // getting the current array from localStorage
        const storedData = localStorage.getItem("formData");
        let formDataArray = storedData ? JSON.parse(storedData) : [];

        // Add the new form data 
        formDataArray.push(updatedFormData);

        // Save the updated array back to localStorage
        localStorage.setItem("formData", JSON.stringify(formDataArray));
        console.log("Form data saved to local storage:", formDataArray);

        setSubmittedData(formDataArray);
        setFormErrors({}); // Clear errors on successful submission
        window.location.reload()
      } else {
        // Handle validation errors
        const validationErrors: { [key: string]: string } = {};
        result.error.errors.forEach((err) => {
          if (err.path) {
            validationErrors[err.path[0]] = err.message;
          }
        });
        setFormErrors(validationErrors);
      }

      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      if (error instanceof ZodError) {
        const validationErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            validationErrors[err.path[0]] = err.message;
          }
        });
        setFormErrors(validationErrors);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="bg-blue-100 w-full h-full py-16 lg:px-24">
      <div className="grid sm:grid-cols-4 xl:grid-cols-5 bg-orange-100 rounded-xl overflow-hidden">
        <div className="sm:col-span-2 xl:col-span-3 flex justify-center">
          <div className="w-full h-full relative">
            <img
              className="w-full h-full object-cover object-top"
              src="https://img.freepik.com/premium-vector/evaluation-employee-assessment-rating-performance-review-improvement-satisfaction_566886-6087.jpg?w=1060"
              alt=""
            />
            <div className=" absolute top-10 left-16">
              <p className=" text-4xl font-quicksand font-semibold">
                Fill up the form
              </p>
              <p className=" font-quicksand text-balance font-medium">
                To get started
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-start items-center col-span-2 py-10 px-16">
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-4 w-full font-quicksand font-medium"
          >
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="name">
                Name
              </label>
              <input
                className="px-4 py-2 rounded-lg w-full"
                type="text"
                id="name"
                required
                onChange={handleFormChange}
              />
              {formErrors.name && (
                <span className="text-red-500">{formErrors.name}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="email">
                Email
              </label>
              <input
                className="px-4 py-2 rounded-lg w-full"
                type="email"
                id="email"
                required
                onChange={handleFormChange}
              />
              {formErrors.email && (
                <span className="text-red-500">{formErrors.email}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="phoneNumber">
                Phone no
              </label>
              <input
                className="px-4 py-2 rounded-lg w-full"
                type="tel"
                id="phoneNumber"
                required
                onChange={handleFormChange}
              />
              {formErrors.phoneNumber && (
                <span className="text-red-500">{formErrors.phoneNumber}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="dob">
                Date of birth
              </label>
              <input
                className="px-4 py-2 rounded-lg w-full"
                type="date"
                id="dob"
                required
                onChange={handleFormChange}
              />
              {formErrors.dob && (
                <span className="text-red-500">{formErrors.dob}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="city">
                City
              </label>
              <input
                className="px-4 py-2 rounded-lg w-full"
                type="text"
                id="city"
                required
                onChange={handleFormChange}
              />
              {formErrors.city && (
                <span className="text-red-500">{formErrors.city}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="district">
                District
              </label>
              <input
                className="px-4 py-2 rounded-lg w-full"
                type="text"
                id="district"
                required
                onChange={handleFormChange}
              />
              {formErrors.district && (
                <span className="text-red-500">{formErrors.district}</span>
              )}
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col w-[48%]">
                <label className="font-semibold" htmlFor="province">
                  Province
                </label>
                <select
                  id="province"
                  className="py-2 rounded-md"
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Province</option>
                  <option value="Koshi Province">
                    Koshi Province
                  </option>
                  <option value="Madhesh Province">
                    Madhesh Province
                  </option>
                  <option value="Bagmati Province">
                    Bagmati Province
                  </option>
                  <option value="Gandaki Province">
                    Gandaki Province
                  </option>
                  <option value="Lumbini Province">
                    Lumbini Province
                  </option>
                  <option value="Karnali Province">
                    Karnali Province
                  </option>
                  <option value="Sudurpashchim Province">
                    Sudurpashchim Province
                  </option>
                </select>
                {formErrors.province && (
                  <span className="text-red-500">
                    {formErrors.province}
                  </span>
                )}
              </div>
              <div className="flex flex-col w-[48%]">
                <label className="font-semibold" htmlFor="country">
                  Country
                </label>
                <select
                  id="country"
                  className="py-2 rounded-md"
                  onChange={handleFormChange}
                  required
                >
                  <option value="Nepal">Nepal</option>
                  {countries.map((country, index) => (
                    <option value={country} key={index}>
                      {country}
                    </option>
                  ))}
                </select>
                {formErrors.country && (
                  <span className="text-red-500">
                    {formErrors.country}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="profilePicture">Profile Picture</label>
              <input
                type="file"
                id="profilePicture"
                required
                accept=".png"
                ref={profileRef}
                hidden
                onChange={handleImageChange}
              />
              <div
                className="w-full aspect-[16/4] overflow-hidden outline-dashed outline-2 flex justify-center items-center cursor-pointer rounded-lg"
                onClick={() => profileRef.current?.click()}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="profile"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <img
                    className="w-10 aspect-square"
                    src="/icon/plus.png"
                    alt=""
                  />
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className={`bg-black text-white font-quicksand font-semibold outline outline-1 outline-black px-8 py-3 rounded-xl w-full ${isUploading ? "cursor-not-allowed" : ""}`}
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="loader"></span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-28">
        <Data formData={submittedData} />
      </div>
    </div>
  );
};

export default Form;
