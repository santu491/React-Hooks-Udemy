import React, { useState, useEffect, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import IngredintsList from './IngredientList'
import Search from './Search';
import LoadingIndicator from '../UI/LoadingIndicator'
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state,action.ingredients];
    case 'DELETE':
      return state.filter((ig)=>ig.id !==action.ingredientsId);
    case 'SET':
      return action.ingredients;
      default :
      throw new Error('should not get there')

  }

}

const httpReducer=(state,action)=>{
  switch(action.type){
    case 'START':
      return{
        ...state,
        loading:true,
        error:null
      }
      case'SUCCESS':
      return{
        ...state,
        loading:false,
        error:null
      }
      case 'FAIL':
        return{
          ...state,
          loading:true,
          error:action.error
        }
  }

}

function Ingredients() {
  //------------------
 // let [ingredients, setIngredients] = useState([])
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

  //------------------

  const [ingredients, dispatchIngredients] = useReducer(ingredientReducer, [])
  const[httpState,dispatchHttp]=useReducer(httpReducer,{error:null,loading:false})

  const addIngredients = (ingredients) => {
   // setLoading(true)
   dispatchHttp({
    type:'START',
  })
    fetch('https://react-hooks-8f150.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredients),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then((response) => {
     // setLoading(false)
      dispatchHttp({
        type:'SUCCESS',
      })
      console.log(response)
      // setIngredients((prevIngredients) => [
      //   ...prevIngredients,
      //   { id: response.name, ...ingredients }
      // ])
      dispatchIngredients({
        type: 'ADD',
        ingredients: {
          id: response.name,
          ...ingredients
        }
      })
    }).catch(error => {
      // setLoading(false)
      // setError(error.message)
      dispatchHttp({
        type:'FAIL',
        error:error.message
      })

    })
  }


  const onRemoveItem = (id) => {
   // setLoading(true)
    dispatchHttp({
      type:'START',
    })
    fetch(`https://react-hooks-8f150.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE',
    }).then(res => res.json())
      .then((response) => {
       // setLoading(false)
        // console.log("del re", response)
        // let updatedIngredients = ingredients.filter(ing => ing.id !== id);
        // setIngredients(updatedIngredients)

        dispatchHttp({
          type:'SUCCESS',
        })
        dispatchIngredients({
          type: 'DELETE',
          ingredientsId:id 
        })
      }).catch(error => {
        console.log("error", error)
        // setLoading(false)
        // setError(error.message)
        dispatchHttp({
          type:'FAIL',
          error:error.message
        })
      })

  }

  const filterIngredients = useCallback((ingredients) => {

    // setIngredients(ingredients)
    dispatchIngredients({
      type: 'SET',
      ingredients: ingredients
    })
  }, [])

  const clearError = () => {
    //setError(null)
    dispatchHttp({
      type:'SUCCESS',
    })
  }
  return (
    <div className="App">
      <IngredientForm addIngredients={addIngredients} loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filterIngredients} />
        {/* Need to add list here! */}
      </section>
      <IngredintsList ingredients={ingredients} onRemoveItem={(id) => onRemoveItem(id)} />

      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
    </div>
  );
}

export default Ingredients;
