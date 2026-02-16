"use client";

import { Formik, Form, Field } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import css from "./NoteForm.module.css";

interface Props {
  onCancel: () => void;
}

export default function NoteForm({ onCancel }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" }}
      onSubmit={(values, actions) => {
        mutation.mutate(values);
        actions.resetForm();
      }}
    >
      <Form className={css.form}>
        <Field name="title" placeholder="Title" />
        <Field name="content" placeholder="Content" />
        <Field as="select" name="tag">
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
        </Field>

        <button type="submit" disabled={mutation.isPending}>
          Create note
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </Form>
    </Formik>
  );
}