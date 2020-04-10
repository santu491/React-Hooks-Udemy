import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredintsList from './IngredientList'
import Search from './Search';
import LoadingIndicator from '../UI/LoadingIndicator'
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../hook/http'

const ingredientReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.ingredients];
    case 'DELETE':
      return state.filter((ig) => ig.id !== action.ingredientsId);
    case 'SET':
      return action.ingredients;
    default:
      throw new Error('should not get there')

  }

}

// const httpReducer = (state, action) => {
//   switch (action.type) {
//     case 'START':
//       return {
//         ...state,
//         loading: true,
//         error: null
//       }
//     case 'SUCCESS':
//       return {
//         ...state,
//         loading: false,
//         error: null
//       }
//     case 'FAIL':
//       return {
//         ...state,
//         loading: true,
//         error: action.error
//       }
//   }

// }

function Ingredients() {
  //------------------
  // let [ingredients, setIngredients] = useState([])
  // let [loading, setLoading] = useState(false)
  // let [error, setError] = useState(null)
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

  //------------------

  // const [ingredients, dispatchIngredients] = useReducer(ingredientReducer, [])
  // //const [httpState, dispatchHttp] = useReducer(httpReducer, { error: null, loading: false })
  // const { loading, error, data, sendRequest, identifier, reqExtra, clear } = useHttp()

  // const addIngredients = useCallback((ingredients) => {
  //   // setLoading(true)
  //   dispatchHttp({
  //     type: 'START',
  //   })
  //   fetch('https://react-hooks-8f150.firebaseio.com/ingredients.json', {
  //     method: 'POST',
  //     body: JSON.stringify(ingredients),
  //     headers: { 'Content-Type': 'application/json' }
  //   }).then(res => res.json()).then((response) => {
  //     // setLoading(false)
  //     dispatchHttp({
  //       type: 'SUCCESS',
  //     })
  //     console.log(response)
  //     // setIngredients((prevIngredients) => [
  //     //   ...prevIngredients,
  //     //   { id: response.name, ...ingredients }
  //     // ])
  //     dispatchIngredients({
  //       type: 'ADD',
  //       ingredients: {
  //         id: response.name,
  //         ...ingredients
  //       }
  //     })
  //   }).catch(error => {
  //     // setLoading(false)
  //     // setError(error.message)
  //     dispatchHttp({
  //       type: 'FAIL',
  //       error: error.message
  //     })

  //   })
  // }, [])


  // const onRemoveItem = useCallback((id) => {
  //   // setLoading(true)
  //   dispatchHttp({
  //     type: 'START',
  //   })
  //   fetch(`https://react-hooks-8f150.firebaseio.com/ingredients/${id}.json`, {
  //     method: 'DELETE',
  //   }).then(res => res.json())
  //     .then((response) => {
  //       // setLoading(false)
  //       // console.log("del re", response)
  //       // let updatedIngredients = ingredients.filter(ing => ing.id !== id);
  //       // setIngredients(updatedIngredients)

  //       dispatchHttp({
  //         type: 'SUCCESS',
  //       })
  //       dispatchIngredients({
  //         type: 'DELETE',
  //         ingredientsId: id
  //       })
  //     }).catch(error => {
  //       console.log("error", error)
  //       // setLoading(false)
  //       // setError(error.message)
  //       dispatchHttp({
  //         type: 'FAIL',
  //         error: error.message
  //       })
  //     })

  // }, [])
  //------------

  const [ingredients, dispatchIngredients] = useReducer(ingredientReducer, [])
  //const [httpState, dispatchHttp] = useReducer(httpReducer, { error: null, loading: false })
  const { loading, error, data, sendRequest, identifier, reqExtra, clear } = useHttp()

  useEffect(() => {
    if (!loading && !error && identifier === "ADD_ING") {
      dispatchIngredients({
        type: 'ADD',
        ingredients: { id: data.name, ...reqExtra }
      })
    }
    if (!loading && !error && identifier === "REMOVE_ING") {
      dispatchIngredients({
        type: 'DELETE',
        ingredientsId: reqExtra
      })
    }

  }, [data, identifier, reqExtra, loading, error])

  const addIngredients = useCallback((ingredients) => {
    sendRequest('https://react-hooks-8f150.firebaseio.com/ingredients.json', 'POST', JSON.stringify(ingredients), "ADD_ING", ingredients)

  }, [sendRequest])


  const onRemoveItem = useCallback((id) => {
    sendRequest(`https://react-hooks-8f150.firebaseio.com/ingredients/${id}.json`, 'DELETE', null, "REMOVE_ING", id)
  }, [sendRequest])



  //-----------
  const filterIngredients = useCallback((ingredients) => {

    // setIngredients(ingredients)
    dispatchIngredients({
      type: 'SET',
      ingredients: ingredients
    })
  }, [])

  //   const clearError = useCallback(() => {
  // return false
  //   }, [])
  const clearError = useCallback(() => {
    clear()
  }, [])

  const ingredientList = useMemo(() => {
    return <IngredintsList ingredients={ingredients} onRemoveItem={(id) => onRemoveItem(id)} />
  }, [ingredients, onRemoveItem])
  return (
    <div className="App">
      <IngredientForm addIngredients={addIngredients} loading={loading} />

      <section>
        <Search onLoadIngredients={filterIngredients} />
        {/* Need to add list here! */}
      </section>
      {/* <IngredintsList ingredients={ingredients} onRemoveItem={(id) => onRemoveItem(id)} /> */}
      {ingredientList}
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
    </div>
  );
}

export default Ingredients;
