import type { Book } from '@/lib/db';
import { deleteBook } from '@/app/actions';

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? 'text-amber-400' : 'text-stone-200'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function BookList({ books }: { books: Book[] }) {
  if (books.length === 0) {
    return (
      <section className="text-center py-12 text-stone-400">
        <div className="text-5xl mb-3">📚</div>
        <p className="text-base font-medium">No books yet</p>
        <p className="text-sm mt-1">Add your first book above!</p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-stone-700">Your Books</h2>
      <ul className="space-y-2">
        {books.map((book) => (
          <li
            key={book.id}
            className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-start justify-between gap-3"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-stone-800 truncate">{book.title}</p>
              <p className="text-sm text-stone-500 truncate">{book.author}</p>
              <div className="mt-1 text-lg leading-none">
                <Stars rating={book.rating} />
              </div>
            </div>

            <form
              action={async () => {
                'use server';
                await deleteBook(book.id);
              }}
              className="shrink-0 self-center"
            >
              <button
                type="submit"
                aria-label={`Delete ${book.title}`}
                className="text-stone-300 hover:text-red-400 active:text-red-600 transition-colors p-1 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
