//import packages
import React from 'react';

//footer function
export default function App() {
  return (
    <footer className='text-center text-white' style={{ backgroundColor: 'var(--pri)' }}>
      <div className='p-3'>
        <section className=''>

          <a outline color="light" floating className='m-1 fafa' href='mailto:sarisha0004@gmail.com' role='button'>
           <i className="fa-solid fa-square-envelope m-2 icon"></i>
          </a>

          <a outline color="light" floating className='m-1 fafa' href='' role='button'>
          <i className="fa-brands fa-linkedin m-2 icon"></i>
          </a>

          <a outline color="light" floating className='m-2 fafa' href='https://github.com/Sarisha-T' role='button'>
            <i className="fa-brands fa-github m-2 icon"></i>
          </a>
        </section>

      
      </div>

      <div className='text-center p-3' style={{ backgroundColor:'var(--pri)' }}>
        © 2022 Copyright:
        <a className="text-white mx-2" href='https://github.com/Sarisha-T/GOODFOOD'>
          FoodsoGood.com
        </a>
      </div>
    </footer>
  );
}





