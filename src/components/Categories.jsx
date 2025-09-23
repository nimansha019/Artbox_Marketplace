import React from 'react'
import { assets, categories } from '../assets/assets';  
import { useAppContext } from '../context/AppContext';

const Categories = () => {
    const {navigate} = useAppContext();
  return (
    <div className='mt-16'>

      <p className='text-2xl md:text-3xl font-medium'> Categories </p>
      <div className='grid grid-flow-col auto-cols-max gap-10.5 mt-10.5 overflow-x-auto'>

      {categories.map((category, index) => (
        <div 
          key={index} 
          className='group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center'
          style={{backgroundColor: category.bgColor}}
          onClick={() => {
            navigate(`/products/${category.path.toLowerCase()}`);
            scrollTo(0,0);
          }}
        >
          <img src={category.image} alt={category.text} className='group-hover:scale-108 transition max-w-28'/>
          <p className='text-sm font-medium'>{category.text}</p>
        </div>
      ))}
      </div>
    </div>
  )
}

export default Categories;
