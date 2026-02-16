import Link from "next/link";
import css from "./NoteList.module.css";
import type { Note } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
   const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
    return (
        <ul className={css.list}>
            {notes.map((note) => (
                <li key={note.id} className={css.item}>
                    <h3>{note.title}</h3>

                    <p>{note.content}</p>

                    <p>{note.tag}</p>

                    <Link href={`/notes/${note.id}`}>
                        View details
                    </Link>

                    <button onClick={() => mutation.mutate(note.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}