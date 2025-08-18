"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import css from "./NotesPage.module.css";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import { Note } from "@/types/note";
import { fetchNotes } from "@/lib/api";
import Link from "next/link";

type NotesPageProps = {
  initialData: {
    notes: Note[];
    totalPages: number;
  };
  tag?: string | undefined;
};

const NotesPage = ({ initialData, tag }: NotesPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputSearchQuery, setInputSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const updateSearchQuery = useDebouncedCallback((value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputSearchQuery(value);
    updateSearchQuery(value);
  };

  const { data, isSuccess } = useQuery({
    queryKey: ["notes", searchQuery, tag, currentPage],
    queryFn: () =>
      fetchNotes({ search: searchQuery, page: currentPage, perPage: 12 }, tag),
    placeholderData: keepPreviousData,
    initialData,
  });
  // console.log("Fetched data:", data);

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <>
      <div className={css.app}>
        <div className={css.toolbar}>
          <SearchBox value={inputSearchQuery} onChange={handleSearchChange} />
          {isSuccess && totalPages > 1 && (
            <Pagination
              page={currentPage}
              total={totalPages}
              onChange={setCurrentPage}
            />
          )}
          <Link className={css.button} href={`/notes/action/create`}>
            Create note +
          </Link>
        </div>
        {notes.length > 0 && <NoteList notes={notes} />}
      </div>
    </>
  );
};

export default NotesPage;
