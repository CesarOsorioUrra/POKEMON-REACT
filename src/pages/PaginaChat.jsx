import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { RenderizadoChat } from "../components/RenderizadoChat";

export default function PaginaChat() {

    const [lecturadeapi, setLecturadeapi] = useState(0)
    const [pokemonjson, setPokemonjson] = useState({})

    const params = useParams(); //permite ocupar el parametro que se está adjuntando desde la URL
    //en este caso solo se está pasando el nombre del pokemon, lo que sería params.pokemon_nombre

    const pokemon_id = params.pokemon_id


    async function todoslospokemon(){
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_id}`) //se puede pasar el offset como variable js
        const datospokemon = await respuesta.json()

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
            "name" : datospokemon.name,
            "abilities" : habilidades.join(", "), //transforma lista a strings separados por coma
            "moves" : movimientos.join(", "), 
            "stats" : estadisticas.join(", "),
            "image" : datospokemon.sprites.front_default
        })
        
        setLecturadeapi(lecturadeapi => lecturadeapi + 1)
                
    }

    if (!pokemon_id) {
        return <div className="container py-5"><h1 className="text-center">Pokemon no encontrado</h1></div>;
    }

    const [messageHistory, setMessageHistory] = useState([]);

    useEffect(() => {
        todoslospokemon()
    },[]);

    useEffect(()=>{
        console.log(pokemonjson)
        
        const ingresodetexto = document.getElementById("ingresodetexto")
        const prompt = "Tu nombre es: " + pokemonjson.name +
        ", tus habilidades son: " + pokemonjson.abilities +
        ", tus movimientos son: " + pokemonjson.moves +
        ", tus estadisticas son:" + pokemonjson.stats
        + ingresodetexto.value

        sendMessage(prompt)
        
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
                        <img src={pokemonjson.image} alt={pokemonjson.name} className="rounded-circle" style={{ width: "60px", height: "60px" }} />
                        <div>
                            <h5 className="mb-0">{pokemonjson.name}</h5>
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
                        <RenderizadoChat key={index} sender={msg.sender} text={msg.text} name={pokemonjson.name} />
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