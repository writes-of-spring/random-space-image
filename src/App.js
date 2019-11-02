import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import './App.css'
const Main = styled.main`
  min-height: 100vh;
  background-color: #333333;
  background-image: url(${props => props.bgImg});
  background-size: cover;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

function App() {
  const [query, setQuery] = useState('')
  const [image, setImage] = useState(null)
  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      console.log('First Run')
      return
    }
    if (query) {
      async function fetchData() {
        const result = await fetch(
          `https://images-api.nasa.gov/search?q=${query}`
        )
        const response = await result.json()
        const { items } = response.collection
        const randomImage = Math.floor(Math.random() * items.length + 1)
        console.log(randomImage)
        if (items.length) {
          setImage(items[randomImage].links[0].href)
        }
      }

      fetchData()
    }
  }, [query])
  return (
    <Main bgImg={image}>
      <section id="search">
        <input
          key="searchBox"
          id="search-field"
          onChange={e => setQuery(e.target.value)}
          type="text"
          placeholder="type here"
          value={query}
        />
      </section>
    </Main>
  )
}

export default App
