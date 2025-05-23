import React from 'react';

const Pagination = ({ page, onPrev, onNext, isNextDisabled }) => (
  <div style={{ marginTop: '20px' }}>
    <button onClick={onPrev} disabled={page === 1}>Previous</button>
    <button onClick={onNext} disabled={isNextDisabled}>Next</button>
    <p>Page {page}</p>
  </div>
);

export default Pagination;
