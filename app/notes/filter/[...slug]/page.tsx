import { fetchNotes } from "@/lib/api";
import NotesPage from "./Notes.client";
import { Metadata } from "next";

type NotesProps = {
  params: { slug: string[] };
};

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");
  const page = slug[slug.length - 1];

  return {
    title: `Note: ${page}`,
    description: `Page with selected filters: ${path}`,
    openGraph: {
      title: `Note: ${page}`,
      description: `Page with selected filters: ${path}`,
      url: `https://notehub.com/notes/${path}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `Note: ${page}`,
        },
      ],
      type: "article",
    },
  };
}

const Notes = async ({ params }: NotesProps) => {
  const { slug } = await params;
  const tag = slug[0] === "All" ? undefined : slug[0];
  const data = await fetchNotes({ page: 1, perPage: 12, search: "" }, tag);

  return (
    <NotesPage
      initialData={{
        notes: data.notes,
        totalPages: data.totalPages,
      }}
      tag={tag || "All"}
    />
  );
};

export default Notes;
