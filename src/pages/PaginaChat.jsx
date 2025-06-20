const [messageHistory, setMessageHistory] = useState([]);
let [count, setCount] = useState(0);
const [pokemonJSON, setPokemonJSON] = useState(null);

useEffect(() => {
  //para preveninr que se ejecute const txb = document.getElementById("txb") en el renderizado inicial
  //esto pq o sino va a dar null, y dará error
  //solo se ejecutará si txb ya se renderizó
  if(document.getElementById("txb") != null) {
    const txb = document.getElementById("txb")
    const txa = document.getElementById("txa")


    //sendMessage("Mi nombre es Juan" + txb.value) //si en textbox escribo "¿cual es mi nombre?"
    //la ia rseponde "Tu nombre es Juan". Debe concatenarse texto y variables con "+" para influir la respuesta de la IA
    console.log(pokemonJSON)
    sendMessage("Tu nombre es: " + pokemonJSON[0].name +
        ", tus habilidades son: " + pokemonJSON[0].abilities +
        ", tus movimientos son: " + pokemonJSON[0].moves +
        ", tus estadisticas son:" + pokemonJSON[0].stats
        + txb.value) //se envía a la IA lo que se escribe en el texbox
  }
}, [count]); //se ejecuta cuando count aumenta

async function sendForm(formData) {
    const message = formData.get('message').trim();
    if (!message) return;
    sendMessage(message);
}

async function sendMessage(message) {
    const updatedHistory = [...messageHistory, { sender: "user", text: message }]; //... es deconstrucción
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
    const texto_respuesta_de_gemini = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No se obtuvo respuesta del modelo."
    txa.value = texto_respuesta_de_gemini
}