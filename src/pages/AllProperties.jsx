import React, { useContext, useEffect, useState } from 'react';
import Listing from '../components/Listing';
import ReactPaginate from 'react-paginate';
import { PropertyContext } from '../context/PropertiesContext'; // Adjust path as per your file structure

export default function AllProperties() {
  const { properties, deleteProperty } = useContext(PropertyContext) || { properties: [] };

  const [onDelete, setOnDelete] = useState(null);
  const [itemOffset, setItemOffset] = useState(0);

  // Pagination logic
  const endOffset = itemOffset + 3;
  const currentItems = properties.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(properties.length / 3);

  // Handle page click for pagination
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 3) % properties.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    // Fetch properties if needed (handled in PropertyProvider)
    // fetchProperties();
  }, []);

  if (!properties) {
    return <div>Loading...</div>; // Handle initial loading state
  }

  return (
    <>
      <div className='grid grid-cols-3 md:grid-cols-3 gap-2 pb-16'>
        {currentItems.map((property) => (
          <Listing key={property.id} listing={property} setOnDelete={setOnDelete} />
        ))}
      </div>
      <div className='flex flex-row bg-white text-blue-500 justify-center'>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          containerClassName='flex gap-4'
          activeClassName='text-gray-900 font-bold'
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
        />
      </div>
    </>
  );
}