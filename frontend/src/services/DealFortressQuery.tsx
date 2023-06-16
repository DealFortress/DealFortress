import { useQuery} from "@tanstack/react-query"
// import { Notice } from "../types";


const baseUrl = import.meta.env.VITE_API_SERVER_URL;

const noticesUrl = `${baseUrl}/notices`;
// const productsUrl = `${baseUrl}/products`;
// const categoriesUrl = `${baseUrl}/categories`;



export const Todos = () => {
    // const queryClient = useQueryClient();

    const query  = useQuery({
        queryKey:["notices"],
        queryFn: async () => {
            const response = await fetch(noticesUrl);
            return response;
        }
    })
    console.log(query);
};
