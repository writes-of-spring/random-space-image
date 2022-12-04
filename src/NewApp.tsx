import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./App.css";

async function fetchImage(query: string): Promise<APIRes> {
  const result = await fetch(`https://images-api.nasa.gov/search?q=${query}`);
  return await result.json();
}
const getRandomImage = (data: APIRes) => {
  const randomIndex = Math.floor(Math.random() * data.collection.items.length);
  return data.collection?.items[randomIndex]?.links[0]?.href;
};

export function App() {
  const [query, setQuery] = useState("");

  const { data } = useQuery(["image", query], () => fetchImage(query), {
    enabled: !!query,
    select: getRandomImage,
  });
  console.log(data);
  return (
    <main
      className="h-screen bg-gray-800 flex items-center justify-center flex-wrap bg-cover"
      // style={{ backgroundImage: `url(${data})` }}
    >
      <section className="container mx-auto">
        <input
          key="searchBox"
          id="search-field"
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="search..."
          value={query}
        />
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
