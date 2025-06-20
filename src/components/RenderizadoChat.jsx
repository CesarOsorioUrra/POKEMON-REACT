export function RenderizadoChat({sender, text, name}){
    return(
        <>
            <div className={`d-flex mb-3 ${sender === "user" ? "justify-content-end" : "justify-content-start"}`}>
                <div className={`p-3 border rounded ${sender === "user" ? "bg-success bg-opacity-10 text-end" : "bg-white"}`}
                    style={{ maxWidth: "75%" }}>
                    <strong className="d-block mb-1">
                        {sender === "user" ? "Tú" : name}
                    </strong>
                    <span>{text}</span>
                </div>
            </div>
        </>
    )
}
