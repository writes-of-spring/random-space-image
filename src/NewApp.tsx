import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./App.css";
import { useForm } from "react-hook-form";

async function fetchImage(query: string): Promise<APIRes> {
  const url = new URL("https://images-api.nasa.gov/search");
  url.searchParams.append("q", query);
  url.searchParams.append("media_type", "image");

  const result = await fetch(url.toString());

  if (!result.ok) throw new Error("Failed to fetch image");
  return await result.json();
}
const getRandomImage = (data?: APIRes) => {
  if (!data?.collection?.items?.length) return;
  //return a random image from the array of images in the API response
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

  const { data } = useQuery({
    queryKey: ["image", searchQuery],
    queryFn: () => fetchImage(searchQuery),
    enabled: !!searchQuery,
    keepPreviousData: true,
  });

  const onSubmit = (data: Form) => {
    setSearchQuery(data.searchTerm);
  };
  return (
    <main
      className="flex h-screen flex-wrap items-center justify-center bg-gray-800 bg-cover"
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
            className="focus:shadow-outline w-full rounded-full bg-gray-200 py-1 text-gray-700 focus:outline-none"
          />
        </form>
      </section>
    </main>
  );
}

interface LinkWithHref {
  href: string;
  [key: string]: unknown;
}
interface APIResItem {
  data: unknown[];
  href: string;
  links: LinkWithHref[];
}
interface APIRes {
  collection: {
    href: string;
    items: APIResItem[];
  };
}
