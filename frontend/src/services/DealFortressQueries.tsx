import { useQuery } from "@tanstack/react-query";
import { getCategoriesAPI, getNoticesAPI } from "./DealFortressAPI";

export const noticesQuery = () =>  useQuery({
    queryKey: ["notices"],
    queryFn: getNoticesAPI
});

export const categoriesQuery = () =>  useQuery({
    queryKey: ["notices"],
    queryFn: getCategoriesAPI
});
  