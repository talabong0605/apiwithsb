import React, { useState, useEffect } from 'react';
import '../App.css';

const BOOKS_PER_PAGE = 25;
const defaultQuery = "nature";

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [uploadedBooks, setUploadedBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [numFound, setNumFound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBooks = async (searchQuery = defaultQuery) => {
    setLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&page=1`);
      const data = await res.json();

      setBooks(data.docs || []);
      setNumFound(data.numFound || 0);
      setError('');
      setUploadedBooks([]);
      setPage(1);
    } catch {
      setError('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchBooks(query);
  };

  const totalPages = Math.ceil(
    (uploadedBooks.length > 0 ? uploadedBooks.length : numFound) / BOOKS_PER_PAGE
  );

  const startIdx = (page - 1) * BOOKS_PER_PAGE;
  const displayedBooks = uploadedBooks.length > 0
    ? uploadedBooks.slice(startIdx, startIdx + BOOKS_PER_PAGE)
    : books.slice(startIdx, startIdx + BOOKS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data)) {
          setUploadedBooks(data);
          setError('');
          setPage(1);
        } else {
          setError('Uploaded file must be a JSON array.');
        }
      } catch {
        setError('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const clearUpload = () => {
    setUploadedBooks([]);
    setError('');
    fetchBooks(query || defaultQuery);
  };

  const BookCard = ({ book }) => {
    const coverUrl = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : 'https://via.placeholder.com/90x130?text=No+Cover';

    return (
      <div className="book-card">
        <img src={coverUrl} alt="Book Cover" />
        <h4>{book.title}</h4>
        <p><strong>Author:</strong> {book.author_name?.join(', ') || 'Unknown'}</p>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="header-bar">
        <h2>BOOK HUB</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={uploadedBooks.length > 0}
          />
          <button type="submit" disabled={uploadedBooks.length > 0}>Search</button>
        </form>
      </div>
      <blockquote className="book-quote">
        “A reader lives a thousand lives before he dies. The man who never reads lives only one.”  
        <span>– George R.R. Martin</span>
      </blockquote>
      <hr/>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <div className="spinner"></div>}

      {!loading && displayedBooks.length > 0 && (
        <>
          {!uploadedBooks.length && <p>Found {numFound} results</p>}
          <div className="book-grid">
            {displayedBooks.map((book, i) => (
              <BookCard key={i} book={book} />
            ))}
          </div>

          {!uploadedBooks.length && (
            <div className="pagination">
              <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                Next
              </button>
            </div>
          )}
        </>
      )}

      {!loading && displayedBooks.length === 0 && <p>No books found.</p>}

      <div style={{ marginTop: '30px' }}>
        <label>
          📂 Upload JSON file of books: 
          <input type="file" accept=".json" onChange={handleUpload} />
        </label>
        {uploadedBooks.length > 0 && (
          <button onClick={clearUpload} style={{ marginLeft: '10px' }}>
            Clear Upload & Return to Search
          </button>
        )}
      </div>
    </div>
  );
};

export default BookSearch;
