import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import LoadingIndicator from '../UI/LoadingIndicator'

const Search = React.memo(props => {
  const [searchString, setSearchString] = useState('')
  const [loading,setLoading]=useState(false)
  const inputRef = useRef()
  const { onLoadIngredients } = props
  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(true)
      if (searchString === inputRef.current.value) {
        let query = searchString.length === 0 ? '' : `?orderBy="title"&equalTo="${searchString}"`
        fetch('https://react-hooks-8f150.firebaseio.com/ingredients.json' + query).then(res => res.json())
          .then(response => {
            console.log(response)
            let UpdatedIngredients = []
            for (let key in response) {
              UpdatedIngredients.push({
                id: key,
                amount: response[key].amount,
                title: response[key].title

              })
            }
            setLoading(false)
            onLoadIngredients(UpdatedIngredients)
          }).catch(error => {
            setLoading(false)
            console.log("search error", error)
          })
      }
    }, 500)

    return()=>{
      clearTimeout(timer)
    }

  }, [searchString, onLoadIngredients])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading && <LoadingIndicator />}
          <input
            ref={inputRef}
            type="text" value={searchString} onChange={(e) => setSearchString(e.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
