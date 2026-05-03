'use server';

import { revalidatePath } from 'next/cache';
import { addBook as dbAddBook, deleteBook as dbDeleteBook } from '@/lib/db';

export async function addBook(formData: FormData) {
  const title = (formData.get('title') as string | null)?.trim() ?? '';
  const author = (formData.get('author') as string | null)?.trim() ?? '';
  const rating = parseInt((formData.get('rating') as string | null) ?? '0', 10);

  if (!title || !author) return;
  if (rating < 1 || rating > 5) return;

  dbAddBook(title, author, rating);
  revalidatePath('/');
}

export async function deleteBook(id: number) {
  dbDeleteBook(id);
  revalidatePath('/');
}
