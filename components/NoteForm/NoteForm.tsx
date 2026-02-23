"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import css from "./NoteForm.module.css";
import * as Yup from "yup";

interface NoteFormProps {
  onCancel: () => void;
}
type NoteTag =
  | "Personal"
  | "Meeting"
  | "Shopping"
  | "Todo"
  | "Work";

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}


export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });
  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    mutation.mutate(values, {
      onSuccess: () => {
        actions.resetForm();
      },
    });
  };
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .required("Title is required"),

  content: Yup.string()
    .max(500, "Maximum 500 characters"),

  tag: Yup.string()
    .oneOf(["Personal", "Meeting", "Shopping", "Todo", "Work"])
    .required("Tag is required"),
});

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Personal" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <Field name="title" placeholder="Title" />
        <ErrorMessage name="title" component="div" />
        <Field name="content" placeholder="Content" />
        <Field as="select" name="tag">
          <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
        </Field>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </Form>
    </Formik>
  );
}