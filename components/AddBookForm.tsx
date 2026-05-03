'use client';

import { useRef, useState, useTransition } from 'react';
import { addBook } from '@/app/actions';

export default function AddBookForm() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    if (!rating) return;
    formData.set('rating', String(rating));
    startTransition(async () => {
      await addBook(formData);
      formRef.current?.reset();
      setRating(0);
      setHovered(0);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    });
  }

  const displayRating = hovered || rating;

  return (
    <section className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <h2 className="text-lg font-semibold text-stone-700">Add a Book</h2>

      <form ref={formRef} action={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-stone-600 mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. The Pragmatic Programmer"
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-base text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-stone-600 mb-1">
            Author
          </label>
          <input
            id="author"
            name="author"
            type="text"
            required
            placeholder="e.g. Andrew Hunt"
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-base text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-stone-600 mb-2">Rating</p>
          <div className="flex gap-1" role="group" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star} star${star === 1 ? '' : 's'}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="text-3xl leading-none p-1 transition-transform active:scale-90"
              >
                <span className={star <= displayRating ? 'text-amber-400' : 'text-stone-300'}>
                  ★
                </span>
              </button>
            ))}
            {displayRating > 0 && (
              <span className="ml-2 self-center text-sm text-stone-500">
                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][displayRating]}
              </span>
            )}
          </div>
          {rating === 0 && (
            <p className="text-xs text-stone-400 mt-1">Tap a star to set your rating</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || rating === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-3 text-base transition-colors"
        >
          {isPending ? 'Adding…' : 'Add Book'}
        </button>

        {success && (
          <p className="text-center text-sm text-emerald-600 font-medium animate-pulse">
            Book added!
          </p>
        )}
      </form>
    </section>
  );
}
