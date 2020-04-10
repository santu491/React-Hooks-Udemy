import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredintsList from './IngredientList'
import Search from './Search';

function Ingredients() {

  let [ingredients, setIngredients] = useState([])

  const addIngredients = (ingredients) => {

    setIngredients((prevIngredients) => [
      ...prevIngredients,
      { id: Math.random(), ...ingredients }
    ])

  }

  const onRemoveItem = (id) => {
    let updatedIngredients = ingredients.filter(ing => ing.id !== id);
    setIngredients(updatedIngredients)

  }
  return (
    <div className="App">
      <IngredientForm addIngredients={addIngredients} />

      <section>
        <Search />
        {/* Need to add list here! */}
      </section>
      <IngredintsList ingredients={ingredients} onRemoveItem={(id) => onRemoveItem(id)} />
    </div>
  );
}

export default Ingredients;
