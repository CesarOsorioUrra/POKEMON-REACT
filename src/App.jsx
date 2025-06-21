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

  const [storage, setStorage] = useState(0);

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
    
    //console.log(pokemones) al inicio se muestra solo el arreglo vacio porque se imprime el estado inicial de la lista pokemones
    //antes de que se ejecute la función asincrónica obtenerpost(), la cual es la que agrega los pokemones obtenidos en el fetch, a la lista 

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
 
  useEffect(()=>{
    //si se coloca este efecto en el useEffect que tiene como dependencia a [numeropagina]
    //entonces solo se podrá activar este código cuando se haga un cambio de página
    //por lo tanto de coloca en otro useEffect el cual se activará cada vez que haya un renderizado (dependencia [storage])
    pokemones.forEach((pokemon)=>{
          //localStorage.clear()
          const key = localStorage.getItem(`${pokemon.name} item`);
          const value = document.getElementById(`${pokemon.name}`)

          //se checkea al renderizado de cada pagina si es que existe o no la key almacenada en localstorage
          //si existe, entonces el corazón se torna rojo, si no existe, el corazón se torna gris
          if(key){
              value.style.setProperty('--c', 'red'); 
              value.style.color = "yellow";
          }
          else if(!key){
              value.style.setProperty('--c', 'lightgray'); 
              value.style.color = "buttontext";
          }

          //estando presentemente en el renderizado de una página, cuando se hace click en un corazón, este se torna rojo
          //...y se agrega al localstorage el item con key '${pokemon.name} item' y value '${pokemon.name}'
          //...y si se hace click nuevamente en el corazón, entonces este se torna gris y se elimina del localstorage
          //...el item con key '${pokemon.name} item' y value '${pokemon.name}' creado anteriormente
          value.onclick = function darlike(){
              const key = localStorage.getItem(`${pokemon.name} item`);
              if(!key){
                  localStorage.setItem(`${pokemon.name} item`, value.id);
                  value.style.setProperty('--c', 'red'); //Se modifica la variable de css "--c" cada vez que se hace click en corazón
                  value.style.color = "yellow";
              }
              else if(key){
                  localStorage.removeItem(`${pokemon.name} item`);
                  value.style.setProperty('--c', 'lightgray');
                  value.style.color = "buttontext";
              }
          }
    })
  },[storage])



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
        setStorage(storage => storage + 1)
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
        setStorage(storage => storage + 1)
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
