"use client";

import css from "../NoteForm/NoteForm.module.css";
import { createNote, NewNote } from "../../lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useNoteDraftStore } from "@/lib/store/noteStore";

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const { mutate } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      router.push("/notes/filter/All");
    },
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...(draft as NewNote),
      [event.target.name as keyof NewNote]: event.target.value,
    });
  };

  const handleSubmit = (formData: FormData) => {
    const values = Object.fromEntries(formData) as NewNote;
    console.log(values);
    mutate(values);
  };

  const handleCancel = () => router.push("/notes/filter/All");

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label>
          Title
          <input
            type="text"
            name="title"
            className={css.input}
            defaultValue={draft?.title}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className={css.formGroup}>
        <label>
          Content
          <textarea
            name="content"
            rows={8}
            className={css.textarea}
            defaultValue={draft?.content}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className={css.formGroup}>
        <label>
          Tag
          <select
            name="tag"
            className={css.select}
            defaultValue={draft?.tag}
            onChange={handleChange}
            required
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>
        </label>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
}
