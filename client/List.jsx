import React from 'react'

function List({ list }) {
  return (
    <div>
      {list.map((item) => {
        return <h1 key={item.id}>{item.name}</h1>
      })}
    </div>
  )
}

export default List