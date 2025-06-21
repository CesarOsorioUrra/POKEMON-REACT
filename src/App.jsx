import { useState } from 'react'
import './App.css'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import { useEffect } from "react";
import { PaginaInicial } from './components/PaginaInicial';
import { RenderizadoPokemones } from './components/RenderizadoPokemones';

function App() {

//ERROR SE DEBE A QUE SE DESORDENA EL ORDEN DE RENDERIZADO DESPUES DE CONVERTIR A JSON
//COLOCAR COMPONENTES


  const [pokemones, setPokemones] = useState([]); //pokemones es un arreglo que tiene varios objetos
  const [numeropagina, setNumeroPagina] = useState(1); //el numero de pagina debe cambiarse con un setNumeroPagina 
  // que esté dentro de una función onlick de un botón para cambiar página
  //se coloca primero un numero de pagina 1
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(12);

  useEffect(() => {
    const buttonpagant = document.getElementById("buttonpagant")
    const buttonpagsgte = document.getElementById("buttonpagsgte")

    buttonpagant.onclick = function pagant(){
        setNumeroPagina(numeropagina => numeropagina - 1)
        setOffset(offset => offset - limit)
        obtenerpost(offset, limit)
    }

    buttonpagsgte.onclick = function pagsgte(){
        setNumeroPagina(numeropagina => numeropagina + 1)
        setOffset(offset => offset + limit)
        obtenerpost(offset, limit)
    }

    obtenerpost(offset, limit) //obtenerpost se ejecuta después de que se renderizan los elementos JSX iniciales, paras eso usa useEffect
    

    document.getElementById("buttonbuscar").onclick = function buscarpokemon(){
      todoslospokemon()
    }
  }, [numeropagina]) //lo que se haga en cada renderizado, dependerá del estado actual de numeropagina
  //cuando se realiza una busqueda, aunque se muestren todos los pokemon, se mantiene el estado actual
  //...que esta definido por el valor-estado numeropagina, el cual solo puede cambiar
  //...cuando se hace click en los botones para cambiar de pagina
  //entones, si se realiza una busqueda, se hace fetch de todos los pokemon, pero si se cambia de pagina
  //...se cambia de estado, haciendo que se rendericen solo los pokemones de la pagina siguiente
  //... y no se siga mostrando el pokemon que se buscó
 
    //MOSTRAR POKEMON AL INICIO

    async function obtenerpost(offset, limit){
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`) //se puede pasar el offset como variable js
        const datos = await respuesta.json()
        const datosASC = datos.results.slice().sort((a,b) => a.name.localeCompare(b.name)) //slice() es para copiar el arreglo y no modificar el arreglo original
        const datosDESC = datos.results.slice().sort((a,b) => b.name.localeCompare(a.name))
        setPokemones(datos.results)   

        //no se pueden leer pokemonesASC ni pokemone DESC en esta función
        //console.log(pokemonesASC) 
        //console.log(pokemonesDESC)
        //, pero si se puede leer datosASC y datosDESC
        
        const buttonasc = document.getElementById("buttonasc") 
          buttonasc.onclick = function asc(){
              setPokemones(datosASC) //cada vez que varie el estado del valor de la lista "pokemones", se va a realizar un renderizado que va a reemplazar los articulos del renderizado anterior
        }
        const buttondesc = document.getElementById("buttondesc")
          buttondesc.onclick = function desc(){
              setPokemones(datosDESC)
        }   
    }

    async function todoslospokemon(){
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10277`) //se puede pasar el offset como variable js
        const datos = await respuesta.json()
        let textbox = document.getElementById("textboxbuscar")
        const pokemonbuscado = []
        datos.results.forEach((pokemon)=>{
            if(pokemon.name === textbox.value){
                pokemonbuscado.push(pokemon)
                console.log(pokemonbuscado)
                setPokemones(pokemonbuscado)
            }
        })
    }

  return (
    <>
        <PaginaInicial numeropagina={numeropagina}/>
        <div className="container-fluid">
            <div className="row">
            {
                pokemones.length > 0 && pokemones.map((pokemon, index) => {
                    return <RenderizadoPokemones key={index} name={pokemon.name} url={pokemon.url}/>
                })
            }
            </div>
        </div>
    </>
  )
}
export default App
