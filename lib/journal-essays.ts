import type { JournalArticle } from './editorial';
import essays from './journal-essays.json';

// Author-supplied Persian essays and English translations; provenance is in docs/.
export const journalEssays: JournalArticle[] = essays as JournalArticle[];
