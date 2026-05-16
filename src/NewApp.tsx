import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./App.css";

async function fetchImage(query: string): Promise<APIRes> {
  const result = await fetch(`https://images-api.nasa.gov/search?q=${query}`);
  if (!result.ok) {
    throw new Error(`NASA image search failed with status ${result.status}`);
  }

  return await result.json();
}
const getRandomImage = (data: APIRes) => {
  const items = data.collection.items.filter((item) => item.links?.[0]?.href);
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex]?.links?.[0]?.href;
};

export function App() {
  const [query, setQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["image", query],
    queryFn: () => fetchImage(query),
    enabled: Boolean(query),
    select: getRandomImage,
  });

  return (
    <main
      className="flex h-screen items-center justify-center overflow-hidden bg-gray-800 bg-cover"
      style={{ backgroundImage: `url(${data})` }}
    >
      <section className="w-full px-12">
        <input
          aria-label="Search NASA images"
          className="w-full border-0 bg-transparent text-[10vw] font-sans text-white placeholder-gray-400 focus:outline-none"
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
  data: unknown[];
  href: string;
  links?: Array<{
    href: string;
  }>;
}
interface APIRes {
  collection: {
    href: string;
    items: APIResItem[];
  };
}
