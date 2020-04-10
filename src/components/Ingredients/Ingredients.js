import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredintsList from './IngredientList'
import Search from './Search';
import LoadingIndicator from '../UI/LoadingIndicator'
import ErrorModal from '../UI/ErrorModal';

function Ingredients() {

  let [ingredients, setIngredients] = useState([])
  let [loading, setLoading] = useState(false)
  let [error, setError] = useState(null)
  // useEffect(() => {
  //   fetch('https://react-hooks-8f150.firebaseio.com/ingredients.json')
  //     .then((response) => response.json())
  //     .then(response => {
  //       let updatedIngredients=[]

  //       for(let key in response){
  //         updatedIngredients.push({
  //           id:key,
  //           title:response[key].title,
  //           amount:response[key].amount
  //         })
  //       }
  //       setIngredients(updatedIngredients)
  //       // console.log("response", response)
  //     })
  // }, [])

  const addIngredients = (ingredients) => {
    setLoading(true)
    fetch('https://react-hooks-8f150.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredients),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then((response) => {
      setLoading(false)
      console.log(response)
      setIngredients((prevIngredients) => [
        ...prevIngredients,
        { id: response.name, ...ingredients }
      ])
    }).catch(error => {
      setLoading(false)
      setError(error.message)

    })
  }


  const onRemoveItem = (id) => {
    setLoading(true)
    fetch(`https://react-hooks-8f150.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE',
    }).then(res => res.json())
      .then((response) => {
        setLoading(false)
        console.log("del re", response)
        let updatedIngredients = ingredients.filter(ing => ing.id !== id);
        setIngredients(updatedIngredients)
      }).catch(error => {
        console.log("error", error)
        setLoading(false)
        setError(error.message)
      })

  }

  const filterIngredients = useCallback((ingredients) => {

    setIngredients(ingredients)

  }, [])

  const clearError = () => {
    setError(null)
  }
  return (
    <div className="App">
      <IngredientForm addIngredients={addIngredients} loading={loading} />

      <section>
        <Search onLoadIngredients={filterIngredients}  />
        {/* Need to add list here! */}
      </section>
      <IngredintsList ingredients={ingredients} onRemoveItem={(id) => onRemoveItem(id)} />

      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
    </div>
  );
}

export default Ingredients;
