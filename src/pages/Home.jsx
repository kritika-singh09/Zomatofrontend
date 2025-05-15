import React from 'react'
import Header from '../components/HomePage/Header'
import FoodSlider from '../components/HomePage/FoodSlider'
import Recommendation from '../components/itemDetail/Recommendation'
import FoodItemGrid from '../components/HomePage/FoodItemGrid'

const Home = () => {
  return (
    <div className='max-w-xl mx-auto'>
      <Header />
      <FoodSlider />
      <FoodItemGrid/>
      <Recommendation/>
    </div>
  )
}

export default Home
