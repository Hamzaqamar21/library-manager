
import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Author from "../models/Author.js";
import Book from "../models/Book.js";

dotenv.config();

const authorsData = [
  {
    name: "William Shakespeare",
    bio: "English playwright and poet, widely regarded as one of the greatest writers.",
    nationality: "British",
    birthDate: "1564-04-26"
  },
  {
    name: "J.K. Rowling",
    bio: "British author best known for the Harry Potter fantasy series.",
    nationality: "British",
    birthDate: "1965-07-31"
  },
  {
    name: "George Orwell",
    bio: "English novelist and essayist known for political fiction.",
    nationality: "British",
    birthDate: "1903-06-25"
  },
  {
    name: "Jane Austen",
    bio: "English novelist known for romantic fiction.",
    nationality: "British",
    birthDate: "1775-12-16"
  },
  {
    name: "Mark Twain",
    bio: "American writer and humorist.",
    nationality: "American",
    birthDate: "1835-11-30"
  },
  {
    name: "Charles Dickens",
    bio: "English novelist famous for his memorable characters.",
    nationality: "British",
    birthDate: "1812-02-07"
  },
  {
    name: "Leo Tolstoy",
    bio: "Russian novelist and philosopher.",
    nationality: "Russian",
    birthDate: "1828-09-09"
  },
  {
    name: "Agatha Christie",
    bio: "English writer famous for detective novels.",
    nationality: "British",
    birthDate: "1890-09-15"
  },
  {
    name: "Ernest Hemingway",
    bio: "American novelist and short-story writer.",
    nationality: "American",
    birthDate: "1899-07-21"
  },
  {
    name: "Paulo Coelho",
    bio: "Brazilian lyricist and novelist.",
    nationality: "Brazilian",
    birthDate: "1947-08-24"
  }
];

const booksData = [
  // William Shakespeare (8)
  { title: "Hamlet", category: "Drama", description: "A tragedy about Prince Hamlet.", quantity: 10, publishedYear: 1603 },
  { title: "Macbeth", category: "Drama", description: "A tragedy about ambition and power.", quantity: 8, publishedYear: 1606 },
  { title: "Romeo and Juliet", category: "Romance", description: "A tragic love story.", quantity: 12, publishedYear: 1597 },
  { title: "Othello", category: "Drama", description: "A tragedy of jealousy.", quantity: 7, publishedYear: 1603 },
  { title: "King Lear", category: "Drama", description: "A tragedy about family and betrayal.", quantity: 9, publishedYear: 1606 },
  { title: "Julius Caesar", category: "History", description: "A historical tragedy.", quantity: 6, publishedYear: 1599 },
  { title: "The Tempest", category: "Fantasy", description: "A magical story of revenge and forgiveness.", quantity: 5, publishedYear: 1611 },
  { title: "Much Ado About Nothing", category: "Comedy", description: "A romantic comedy.", quantity: 11, publishedYear: 1598 },

  // J.K. Rowling (8)
  { title: "Harry Potter and the Philosopher's Stone", category: "Fantasy", description: "A young wizard discovers his magical destiny.", quantity: 15, publishedYear: 1997 },
  { title: "Harry Potter and the Chamber of Secrets", category: "Fantasy", description: "Harry returns to Hogwarts.", quantity: 10, publishedYear: 1998 },
  { title: "Harry Potter and the Prisoner of Azkaban", category: "Fantasy", description: "Harry learns about his family's past.", quantity: 9, publishedYear: 1999 },
  { title: "Harry Potter and the Goblet of Fire", category: "Fantasy", description: "Harry competes in a dangerous tournament.", quantity: 12, publishedYear: 2000 },
  { title: "Harry Potter and the Order of the Phoenix", category: "Fantasy", description: "Harry faces a growing threat.", quantity: 8, publishedYear: 2003 },
  { title: "Harry Potter and the Half-Blood Prince", category: "Fantasy", description: "Harry discovers secrets about Voldemort.", quantity: 7, publishedYear: 2005 },
  { title: "Harry Potter and the Deathly Hallows", category: "Fantasy", description: "The final battle against Voldemort.", quantity: 14, publishedYear: 2007 },
  { title: "The Casual Vacancy", category: "Fiction", description: "A novel about a small English town.", quantity: 5, publishedYear: 2012 },

  // George Orwell (8)
  { title: "1984", category: "Dystopian", description: "A dystopian novel about surveillance.", quantity: 10, publishedYear: 1949 },
  { title: "Animal Farm", category: "Political Fiction", description: "An allegory about political power.", quantity: 12, publishedYear: 1945 },
  { title: "Burmese Days", category: "Fiction", description: "A novel about British colonial rule.", quantity: 5, publishedYear: 1934 },
  { title: "Keep the Aspidistra Flying", category: "Fiction", description: "A story about money and social class.", quantity: 6, publishedYear: 1936 },
  { title: "Coming Up for Air", category: "Fiction", description: "A man reflects on his past.", quantity: 7, publishedYear: 1939 },
  { title: "Homage to Catalonia", category: "Memoir", description: "Orwell's account of the Spanish Civil War.", quantity: 4, publishedYear: 1938 },
  { title: "Down and Out in Paris and London", category: "Memoir", description: "An account of poverty in two cities.", quantity: 8, publishedYear: 1933 },
  { title: "The Road to Wigan Pier", category: "Nonfiction", description: "An investigation of working-class life.", quantity: 5, publishedYear: 1937 },

  // Jane Austen (8)
  { title: "Pride and Prejudice", category: "Romance", description: "A story of love and misunderstandings.", quantity: 10, publishedYear: 1813 },
  { title: "Sense and Sensibility", category: "Romance", description: "Two sisters navigate love and society.", quantity: 8, publishedYear: 1811 },
  { title: "Emma", category: "Romance", description: "A young woman enjoys matchmaking.", quantity: 9, publishedYear: 1815 },
  { title: "Mansfield Park", category: "Fiction", description: "A story about family and morality.", quantity: 6, publishedYear: 1814 },
  { title: "Northanger Abbey", category: "Gothic Fiction", description: "A young woman explores society and imagination.", quantity: 5, publishedYear: 1817 },
  { title: "Persuasion", category: "Romance", description: "A second-chance love story.", quantity: 7, publishedYear: 1817 },
  { title: "Lady Susan", category: "Fiction", description: "A witty novella about manipulation.", quantity: 4, publishedYear: 1871 },
  { title: "Sanditon", category: "Fiction", description: "An unfinished novel about a seaside town.", quantity: 5, publishedYear: 1925 },

  // Mark Twain (8)
  { title: "The Adventures of Tom Sawyer", category: "Adventure", description: "A boy's adventures along the Mississippi.", quantity: 10, publishedYear: 1876 },
  { title: "Adventures of Huckleberry Finn", category: "Adventure", description: "A journey along the Mississippi River.", quantity: 12, publishedYear: 1884 },
  { title: "The Prince and the Pauper", category: "Historical Fiction", description: "Two boys exchange identities.", quantity: 6, publishedYear: 1881 },
  { title: "A Connecticut Yankee in King Arthur's Court", category: "Fantasy", description: "A modern man travels to medieval England.", quantity: 5, publishedYear: 1889 },
  { title: "The Gilded Age", category: "Satire", description: "A satirical look at American society.", quantity: 4, publishedYear: 1873 },
  { title: "Life on the Mississippi", category: "Memoir", description: "Twain's experiences as a riverboat pilot.", quantity: 7, publishedYear: 1883 },
  { title: "The Innocents Abroad", category: "Travel", description: "A humorous travel account.", quantity: 5, publishedYear: 1869 },
  { title: "Roughing It", category: "Travel", description: "Stories of adventures in the American West.", quantity: 6, publishedYear: 1872 },

  // Charles Dickens (8)
  { title: "Oliver Twist", category: "Fiction", description: "An orphan struggles to survive in London.", quantity: 10, publishedYear: 1838 },
  { title: "A Christmas Carol", category: "Fantasy", description: "A miser discovers the meaning of Christmas.", quantity: 12, publishedYear: 1843 },
  { title: "Great Expectations", category: "Fiction", description: "A young boy dreams of becoming a gentleman.", quantity: 8, publishedYear: 1861 },
  { title: "David Copperfield", category: "Fiction", description: "A story of personal growth.", quantity: 7, publishedYear: 1850 },
  { title: "Bleak House", category: "Fiction", description: "A novel about the English legal system.", quantity: 5, publishedYear: 1853 },
  { title: "Hard Times", category: "Social Fiction", description: "A critique of industrial society.", quantity: 6, publishedYear: 1854 },
  { title: "Nicholas Nickleby", category: "Fiction", description: "A young man faces hardship and injustice.", quantity: 4, publishedYear: 1839 },
  { title: "A Tale of Two Cities", category: "Historical Fiction", description: "A story set during the French Revolution.", quantity: 9, publishedYear: 1859 },

  // Leo Tolstoy (8)
  { title: "War and Peace", category: "Historical Fiction", description: "An epic set during the Napoleonic Wars.", quantity: 10, publishedYear: 1869 },
  { title: "Anna Karenina", category: "Romance", description: "A tragic story of love and society.", quantity: 8, publishedYear: 1878 },
  { title: "Resurrection", category: "Fiction", description: "A nobleman seeks redemption.", quantity: 5, publishedYear: 1899 },
  { title: "The Death of Ivan Ilyich", category: "Philosophy", description: "A reflection on life and mortality.", quantity: 7, publishedYear: 1886 },
  { title: "Childhood", category: "Fiction", description: "A story of growing up.", quantity: 6, publishedYear: 1852 },
  { title: "The Cossacks", category: "Adventure", description: "A young Russian travels to the Caucasus.", quantity: 4, publishedYear: 1863 },
  { title: "Family Happiness", category: "Romance", description: "A novella about marriage and relationships.", quantity: 5, publishedYear: 1859 },
  { title: "Hadji Murat", category: "Historical Fiction", description: "A novella about conflict in the Caucasus.", quantity: 6, publishedYear: 1912 },

  // Agatha Christie (8)
  { title: "Murder on the Orient Express", category: "Mystery", description: "A murder mystery aboard a train.", quantity: 12, publishedYear: 1934 },
  { title: "And Then There Were None", category: "Mystery", description: "Ten strangers are trapped on an island.", quantity: 15, publishedYear: 1939 },
  { title: "The Murder of Roger Ackroyd", category: "Mystery", description: "Hercule Poirot investigates a murder.", quantity: 8, publishedYear: 1926 },
  { title: "Death on the Nile", category: "Mystery", description: "A murder occurs on a Nile cruise.", quantity: 10, publishedYear: 1937 },
  { title: "The ABC Murders", category: "Mystery", description: "Poirot investigates a series of murders.", quantity: 6, publishedYear: 1936 },
  { title: "The Mysterious Affair at Styles", category: "Mystery", description: "Poirot solves his first published case.", quantity: 7, publishedYear: 1920 },
  { title: "Five Little Pigs", category: "Mystery", description: "Poirot revisits a past murder.", quantity: 5, publishedYear: 1942 },
  { title: "Crooked House", category: "Mystery", description: "A murder investigation in a wealthy family.", quantity: 4, publishedYear: 1949 },

  // Ernest Hemingway (8)
  { title: "The Old Man and the Sea", category: "Fiction", description: "An old fisherman struggles with a giant marlin.", quantity: 10, publishedYear: 1952 },
  { title: "A Farewell to Arms", category: "War Fiction", description: "A love story during World War I.", quantity: 8, publishedYear: 1929 },
  { title: "For Whom the Bell Tolls", category: "War Fiction", description: "A novel set during the Spanish Civil War.", quantity: 7, publishedYear: 1940 },
  { title: "The Sun Also Rises", category: "Fiction", description: "A story of expatriates in Europe.", quantity: 6, publishedYear: 1926 },
  { title: "To Have and Have Not", category: "Fiction", description: "A story about a struggling fisherman.", quantity: 5, publishedYear: 1937 },
  { title: "Across the River and Into the Trees", category: "Fiction", description: "A novel about an aging military officer.", quantity: 4, publishedYear: 1950 },
  { title: "The Torrents of Spring", category: "Satire", description: "A parody of contemporary literary fiction.", quantity: 3, publishedYear: 1926 },
  { title: "Islands in the Stream", category: "Fiction", description: "A posthumously published novel.", quantity: 5, publishedYear: 1970 },

  // Paulo Coelho (8)
  { title: "The Alchemist", category: "Adventure", description: "A shepherd follows his personal legend.", quantity: 15, publishedYear: 1988 },
  { title: "Brida", category: "Fantasy", description: "A young woman explores spirituality.", quantity: 6, publishedYear: 1990 },
  { title: "The Valkyries", category: "Adventure", description: "A journey of self-discovery in the desert.", quantity: 5, publishedYear: 1992 },
  { title: "By the River Piedra I Sat Down and Wept", category: "Romance", description: "A story about love and faith.", quantity: 7, publishedYear: 1994 },
  { title: "Veronika Decides to Die", category: "Fiction", description: "A novel exploring life and purpose.", quantity: 8, publishedYear: 1998 },
  { title: "The Devil and Miss Prym", category: "Fiction", description: "A village faces a moral dilemma.", quantity: 5, publishedYear: 2000 },
  { title: "Eleven Minutes", category: "Romance", description: "A novel about love and relationships.", quantity: 6, publishedYear: 2003 },
  { title: "The Zahir", category: "Fiction", description: "A writer searches for his missing wife.", quantity: 4, publishedYear: 2005 }
];

const seedBooks = async () => {
  try {
    await connectDB();

    console.log("Starting author and book seeding...");

    // Find or create authors
    const authors = [];

    for (const authorData of authorsData) {
      let author = await Author.findOne({
        name: authorData.name
      });

      if (!author) {
        author = await Author.create(authorData);
      } else {
        await Author.findByIdAndUpdate(
          author._id,
          authorData
        );
      }

      authors.push(author);
    }

    console.log(`${authors.length} authors ready.`);

    // Create books and connect them to authors
    let createdBooks = 0;

    for (let i = 0; i < authors.length; i++) {
      const author = authors[i];

      const authorBooks = booksData.slice(i * 8, (i + 1) * 8);

      for (const bookData of authorBooks) {
        const existingBook = await Book.findOne({
          title: bookData.title,
          author: author._id
        });

        if (!existingBook) {
          await Book.create({
            ...bookData,
            author: author._id
          });

          createdBooks++;
        }
      }
    }

    const totalAuthors = await Author.countDocuments();
    const totalBooks = await Book.countDocuments();

    console.log("--------------------------------");
    console.log("Seeding completed successfully!");
    console.log(`Authors in database: ${totalAuthors}`);
    console.log(`Books in database: ${totalBooks}`);
    console.log(`New books created: ${createdBooks}`);
    console.log("--------------------------------");

    process.exit(0);

  } catch (error) {
    console.error("Error seeding authors and books:", error);
    process.exit(1);
  }
};

seedBooks();
