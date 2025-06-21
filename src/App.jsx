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


  const [pokemones, setPokemones] = useState([]);
  const [numeropagina, setNumeroPagina] = useState(1); //el numero de pagina debe cambiarse con un setNumeroPagina 
  // que esté dentro de una función onlick de un botón para cambiar página
  //se coloca primero un numero de pagina 1
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(12);

  const [asc, setAsc] = useState(0);

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



    pokemones.map((pokemon)=>{
        //const valor = localStorage.getItem(`${pokemon.name}`)
        const like = document.getElementById(`${pokemon.name}`)
        //console.log(like)
        /*
        if(valor){
            like.style.setProperty('--c', 'blue'); 
            like.style.color = "yellow";
        }
        */
        like.onclick = function darlike(){
          console.log("Hola")
          /*
            const valor = localStorage.getItem(`${pokemon.name}`);
            if(!valor){
                localStorage.setItem(`${pokemon.name}`, like.id);
                like.style.setProperty('--c', 'blue'); //Se modifica la variable de css "--c" cada vez que se hace click en corazón
                like.style.color = "yellow";
            }
            else if(valor){
                localStorage.removeItem(`${pokemon.name}`);
                like.style.setProperty('--c', 'lightgray');
                like.style.color = "buttontext";
            }
          */
        }
    })


    obtenerpost(offset, limit) //obtenerpost se ejecuta después de que se renderizan los elementos JSX iniciales, paras eso usa useEffect

  }, [numeropagina]) //lo que se haga en cada renderizado, dependerá del estado actual de numeropagina
 
    //MOSTRAR POKEMON AL INICIO

    async function obtenerpost(offset, limit){
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`) //se puede pasar el offset como variable js
        const datos = await respuesta.json()

        //buscar como ordenar segun el parametro en el objeto
        const listapokemones = []
        datos.results.forEach((pokemon)=>{
          listapokemones.push(pokemon.name)
        })
        setPokemones(datos.results)
    }

    useEffect(()=>{
          const buttondesc = document.getElementById("buttondesc")
          const buttonasc = document.getElementById("buttonasc")
          buttonasc.onclick = function asc(){
              setAsc(asc => asc + 1)
              obtenerpost(offset, limit)
          }
    },[asc])

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
