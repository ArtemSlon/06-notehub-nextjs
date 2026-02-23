"use client";
import css from "./NotesPage.module.css"
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { useDebounce } from "use-debounce";

export default function NotesClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const perPage = 12;
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", { page, perPage, search, debouncedSearch }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search: debouncedSearch,
      }),
    placeholderData: (previousData) => previousData,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Something went wrong.</p>;
  if (!data) return <p>Something went wrong.</p>;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(value: string) => {
            setSearch(value);
            setPage(1);
          }}
        />
        {data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          pageCount={data.totalPages}
          onPageChange={(selectedPage: number) =>
            setPage(selectedPage)
          }
        />
      )}
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