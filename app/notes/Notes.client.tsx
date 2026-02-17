"use client";
import css from "./NotesPage.module.css"
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";

export default function NotesClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 12;

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

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note
        </button>
      </div>
      <NoteList notes={data.notes} />
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}