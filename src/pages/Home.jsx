import React from 'react'
import Header from '../components/HomePage/Header'
import FoodSlider from '../components/HomePage/FoodSlider'
import Recommendation from '../components/itemDetail/Recommendation'

const Home = () => {
  return (
    <div className='max-w-xl mx-auto'>
      <Header />
      <FoodSlider />
      <Recommendation/>
    </div>
  )
}

export default Home
