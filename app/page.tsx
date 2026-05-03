import { getAllBooks } from '@/lib/db';
import AddBookForm from '@/components/AddBookForm';
import BookList from '@/components/BookList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const books = await getAllBooks();

  return (
    <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-stone-800 tracking-tight">My Book Library</h1>
        <p className="text-stone-500 mt-1 text-sm">
          {books.length === 0
            ? 'No books yet — add your first one below'
            : `${books.length} book${books.length === 1 ? '' : 's'} tracked`}
        </p>
      </header>

      <AddBookForm />
      <BookList books={books} />
    </main>
  );
}
