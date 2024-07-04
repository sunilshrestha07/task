import { z } from 'zod';

const AddressSchema = z.object({
  city: z.string().min(1, "City can't be empty"),
  district: z.string().min(1, "District name can't be empty"),
  country: z.string().min(1, "Country can't be empty"),
  province: z.string().min(1, "Province can't be empty"),
});

export const UserModelSchema = z.object({
  name: z.string().min(5, "Name should be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(7, "Number should be at least 7 digits").regex(/^\d+$/, "Phone number should only contain digits"),
  dob: z.string(),
  profilePicture: z.string(),
  address: AddressSchema,
});
