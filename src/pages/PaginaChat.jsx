import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function PaginaChat() {

    const [lecturadeapi, setLecturadeapi] = useState(0)
    const [pokemonjson, setPokemonjson] = useState({})

    const params = useParams(); //permite ocupar el parametro que se está adjuntando desde la URL
    //en este caso solo se está pasando el nombre del pokemon, lo que sería params.pokemon_nombre

    const pokemon_nombre = params.pokemon_nombre


    async function todoslospokemon(){
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10277`) //se puede pasar el offset como variable js
        const datos = await respuesta.json()
        datos.results.forEach((pokemon)=>{

            if(pokemon.name === pokemon_nombre){

                async function obtenerpostpokemon(){
                    const respuesta2 = await fetch(`${pokemon.url}`) //colocar ` ` en lugar de " ", o sino aparece error CORS
                    const datospokemon = await respuesta2.json()

                    let habilidades = []
                    let movimientos = []
                    let estadisticas = []

                    datospokemon.abilities.forEach((abilities)=>{
                        habilidades.push(abilities.ability.name)
                    })        
                    datospokemon.moves.forEach((moves)=>{
                        movimientos.push(moves.move.name)
                    })                      
                    datospokemon.stats.forEach((stats)=>{
                        estadisticas.push(stats.stat.name + ": " + stats.base_stat)
                    })       
                    
                    
                    setPokemonjson({
                        "name" : pokemon.name,
                        "abilities" : habilidades.join(", "), //transforma lista a strings separados por coma
                        "moves" : movimientos.join(", "), 
                        "stats" : estadisticas.join(", ")
                    })
                    
                    setLecturadeapi(lecturadeapi => lecturadeapi + 1)
                }
            }
        })
    }

    if (!pokemon_nombre) {
        return <div className="container py-5"><h1 className="text-center">Pokemon no encontrado</h1></div>;
    }

    const [messageHistory, setMessageHistory] = useState([]);



    useEffect(() => {
        todoslospokemon()
    }, []);

    useEffect(()=>{
        console.log(pokemonjson)
        /*
        const ingresodetexto = document.getElementById("ingresodetexto")
        const prompt = "Tu nombre es: " + pokemonjson[0].name +
        ", tus habilidades son: " + pokemonjson[0].abilities +
        ", tus movimientos son: " + pokemonjson[0].moves +
        ", tus estadisticas son:" + pokemonjson[0].stats
        + ingresodetexto.value
        sendMessage(prompt)
        */
    },[lecturadeapi])



    async function sendForm(formData) {
        const message = formData.get('message').trim();
        if (!message) return;
        sendMessage(message);
    }

    async function sendMessage(message) {
        const updatedHistory = [...messageHistory, { sender: "user", text: message }];
        try {
            const reply = await askGemini(updatedHistory);
            setMessageHistory([...updatedHistory, { sender: "model", text: reply }]);
        } catch (error) {
            console.log("Error al enviar el mensaje:", error);
            setMessageHistory([...updatedHistory, { sender: "model", text: "Lo siento, ocurrió un error al procesar tu mensaje." }]);
        }
    }

    async function askGemini(messageHistory) {
        const apiKey = import.meta.env.VITE_API_KEY;
        const content = messageHistory.map(msg => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
        }));
        const body = {
            contents: content
        };
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const error = await response.text();
            console.error("Gemini error:", error);
            throw new Error("Error en la API de Gemini");
        }
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No se obtuvo respuesta del modelo.";
    }

    return (
        <div className="vh-100 d-flex flex-column">

            <div className="border-bottom p-3 bg-white shadow-sm">
                <div className="container d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <div>
                            <h5 className="mb-0">{pokemon_nombre}</h5>
                        </div>
                    </div>
                    <NavLink to={`/pokemones`}>
                        <button className="btn btn-outline-dark btn-md">Volver a página de pokemones</button>
                    </NavLink>
                </div>
            </div>

            <div className="flex-grow-1 overflow-auto bg-light py-3">
                <div className="container">
                    {messageHistory.map((msg, index) => (
                        <div key={index} className={`d-flex mb-3 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}>
                            <div className={`p-3 border rounded ${msg.sender === "user" ? "bg-success bg-opacity-10 text-end" : "bg-white"}`}
                                style={{ maxWidth: "75%" }}>
                                <strong className="d-block mb-1">
                                    {msg.sender === "user" ? "Tú" : pokemon_nombre}
                                </strong>
                                <span>{msg.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-top p-3 bg-white">
                <form className="container d-flex align-items-center gap-2" action={sendForm}>
                    <input id="ingresodetexto" type="text" name="message" className="form-control form-control-md" placeholder="Escribe tu mensaje..." />
                    <button type="submit" className="btn btn-dark btn-md d-flex align-items-center gap-2">
                        <span>Enviar</span>
                        <i className="bi bi-send"></i>
                    </button>
                </form>
            </div>

        </div>
    );
}