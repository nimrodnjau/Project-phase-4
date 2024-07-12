import React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Listing({listing}) {

  
  return (
    <Link key={listing.id}>
  <div className='bg-white my-[2rem] flex justify-center items-center relative hover:scale-105 transition duration-500 cursor-pointer '>
    <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd0P-8jGLtQjo5Xcy0YxABxzwUQ5Fwgs0ATQ&s"} alt="" className='w-[24rem] h-[26rem] rounded-[1.25rem]'/>
    <div className='bg-white flex items-center justify-between w-[22rem] h-[8rem] px-[1.38rem] rounded-[1.25rem] shadow-md absolute bottom-[-4rem] max-xs:w-[18rem]'>
      <div className='flex flex-col justify-between gap-1'>
        <p className='text-[1.5rem] font-semibold max-xs:text-[1.4rem]'>{listing.title}</p>
        <p className='text-[1.3rem] font-semibold text-blue-600 max-xs:text-[1.2rem]'> Ksh {listing.price}</p>
      </div>
      <Link to={`/individualproperty/${listing.id}`} className='bg-blue-600 text-white font-semibold rounded-[1.5rem] py-3 px-7 hover:text-[var(--mainBlue)] hover:bg-white hover:shadow-md hover:shadow-[var(--mainBlue)] transition duration-400'>
        Details
      </Link>
    </div>
  </div>
</Link>

  )
}

