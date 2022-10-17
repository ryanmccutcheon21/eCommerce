import React from 'react'

const Home = () => {
  return (
    <>
      HeroBanner
      <div>
        <h2>Best Selling Products</h2>
        <p>Speakers of many variations</p>
      </div>
      <div>
        {['Product1', 'Product2'].map(product => product)}
      </div>
    </>
  )
}

export default Home