export function PaginaInicial({numeropagina}){
    return(
        <>
        <div className="container-fluid" id="contenedor-bootstrap" style={{padding: 0}}>
            <div className="arriba">     
                <div className = "row">
                    <div className="col col-md-1">
                        <p style={{fontFamily: "arial", padding: 0}}>Buscar:</p>
                    </div>
                    <div className="col col-md-2" style={{padding: 0}}>
                        <input type="text" placeholder="charizard" id="textboxbuscar" size="15"/> 
                    </div>
                    <div className="col col-md-3" style={{textAlign : "right"}}>
                        <button id="buttonbuscar" className="botonmenu">Buscar Pokemón</button>
                    </div>
                    <div className="col col-md-3" style={{textAlign : "center"}}>
                        <button id="buttondesc" className="botonmenu">Ordenar desc.</button>
                    </div>
                    <div className="col col-md-3" style={{textAlign : "left"}}> 
                        <button id="buttonasc" className="botonmenu">Ordenar asc.</button>
                    </div>
                </div>
            </div>

            <div className="abajo">
                <div className = "row">
                    <div className="col col-md-6" style={{textAlign : "right"}}>
                        <button id="buttonpagant" className="botonmenu">Pág. anterior</button>
                    </div>
                    <div className="col col-md-6" style={{textAlign : "left"}}>
                        <button id="buttonpagsgte" className="botonmenu">Pág. siguiente</button>
                    </div>
                </div>
            </div>

            <div className = "row">
                <div className="col col-md-12">
                    <div id="pagina">
                        <p><b>Página {numeropagina}</b></p>
                    </div>
                </div>
            </div>

            <div className="row" id="contenedor">
            </div>
        </div>
        </>
    )
}