import React from 'react'

function Crud() {
    const createPois = () => {
    }
    const readPois = () => {
    }
    const updatePois = () => {
    }
    const deletePois = () => {
    }

  return (
    <main>
        <h2>Gestionar Pois</h2>
        <table>
            <thead>
                <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                </tr>
            <form>
                <tr>
                <th><input type="text"/></th>
                <th><input type="text"/></th>
                <th><input type="text"/></th>
                <th><input type="text"/></th>
                </tr>
            </form>
            </thead>
            <tbody className='table-body'>
            </tbody>
        </table>
    </main>
  )
}

export default Crud