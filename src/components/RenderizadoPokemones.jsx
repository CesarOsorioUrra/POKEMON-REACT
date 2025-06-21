import { useEffect } from "react";
import { useState } from 'react'

export function RenderizadoPokemones({name, url}){
    
    const [images, setImages] = useState([]); //se define una variable que podrá ser usada dentro del return, y a la cual se le podrá 
    //asignar distintos valores con setImages(),  

    useEffect(() => {
        obtenerpostpokemon(url) //se ejecuta esta función DESPUÉS de realizar la renderización que involucra a la variable
        //que está en el estado actual (la que está dentro de setImages()) 
    }, [])

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