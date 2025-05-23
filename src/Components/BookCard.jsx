import React from 'react';

const BookCard = ({ book }) => {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : 'https://via.placeholder.com/90x130?text=No+Cover';

  return (
    <div className="book-card">
      <img src={coverUrl} alt="Book Cover" />
      <div>
        <h4>{book.title}</h4>
        <p><strong>Author:</strong> {book.author_name?.join(', ') || 'Unknown'}</p>
      </div>
    </div>
  );
};

export default BookCard;
