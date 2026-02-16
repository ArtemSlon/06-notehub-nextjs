"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

export default function NotesClient() {
  const page = 1;
  const perPage = 12;
  const search = "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", { page, perPage, search }],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        { page: number; perPage: number; search?: string }
      ];

      return fetchNotes(params);
    },
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Something went wrong.</p>;
  if (!data) return <p>Something went wrong.</p>;

  return <NoteList notes={data.notes} />;
}