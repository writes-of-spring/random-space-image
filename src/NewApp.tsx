import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./App.css";
import { useForm } from "react-hook-form";

async function fetchImage(query: string): Promise<APIRes> {
  const url = new URL("https://images-api.nasa.gov/search");
  url.searchParams.append("q", query);
  url.searchParams.append("media_type", "image");

  const result = await fetch(url.toString());
  return await result.json();
}
const getRandomImage = (data?: APIRes) => {
  if (!data?.collection?.items?.length) return;
  const randomIndex = Math.floor(Math.random() * data.collection.items.length);
  return data.collection?.items[randomIndex]?.links[0]?.href;
};

type Form = {
  searchTerm: string;
};

export function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const { register, handleSubmit } = useForm<Form>({
    defaultValues: {
      searchTerm: "",
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["image", searchQuery],
    queryFn: () => fetchImage(searchQuery),
    enabled: !!searchQuery,
    keepPreviousData: true,
  });
  console.log(data);

  const onSubmit = (data: Form) => {
    setSearchQuery(data.searchTerm);
  };
  return (
    <main
      className="h-screen bg-gray-800 flex items-center justify-center flex-wrap bg-cover"
      style={{ backgroundImage: `url(${getRandomImage(data)})` }}
    >
      <section className="container mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} onBlur={handleSubmit(onSubmit)}>
          <input
            key="searchBox"
            type="text"
            id="search-field"
            placeholder="search and hit enter"
            {...register("searchTerm")}
            className="bg-gray-200 rounded-full w-full px-4 py-1 text-gray-700 focus:outline-none focus:shadow-outline"
          />
        </form>
      </section>
    </main>
  );
}

interface APIResItem {
  data: any[];
  href: string;
  links: any[];
}
interface APIRes {
  collection: {
    href: string;
    items: APIResItem[];
  };
}
