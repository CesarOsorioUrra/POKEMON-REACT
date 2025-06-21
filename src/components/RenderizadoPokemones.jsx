import { useEffect } from "react";
import { useState } from 'react'

export function RenderizadoPokemones({name, url}){
    
    const [images, setImages] = useState([]); //se define una variable que podrá ser usada dentro del return, y a la cual se le podrá 
    //asignar distintos valores con setImages(),  

    useEffect(() => {
        obtenerpostpokemon(url) //se ejecuta esta función DESPUÉS de realizar la renderización que involucra a la variable
        //que está en el estado actual (la que está dentro de setImages()) 
    })
    //useEffect, si no tiene dependencia, se produce el efecto cuando haya cualquier renderizado del componente
    //si tiene [] como dependencia, se produce el efecto solo cuando se re-renderiza la página entera
    //si tiene como dependencia a [variable], solo se porduce el efecto cuando se le usa la función setVariable para modificar el estado-valor de esa variable 

    async function obtenerpostpokemon(url){
        const respuesta2 = await fetch(`${url}`) //colocar ` ` en lugar de " ", o sino aparece error CORS
        const datospokemon = await respuesta2.json()
        setImages(datospokemon.sprites.front_default) 
        //con setImages se define el valor que se 
        //usará en el renderizado actual que involucre a la variable images
    }

    return(
        <>
        <div className="col col-md-2" id="articulo">
                <h4>{name}</h4>
                <img src= {images} />
                <p><button>CHAT</button></p>
                <p><button id={name} className="heart">LIKE</button></p>			
        </div>		
        </>
    )
}