export function PaginaInicial({numeropagina}){
    return(
        <>
        <div className="container-fluid" id="contenedor-bootstrap">
            <div className="arriba">     
                <div className = "row">
                    <div className="col col-md-1">
                        <p>Buscar:</p>
                    </div>
                    <div className="col col-md-2">
                        <input type="text" placeholder="charizard" id="textboxbuscar" size="10rem"/> 
                    </div>
                    <div className="col col-md-3" style={{textAlign : "right"}}>
                        <button id="buttonbuscar" style={{borderRadius : "0.5rem"}}>Buscar Pokemón</button>
                    </div>
                    <div className="col col-md-3" style={{textAlign : "center"}}>
                        <button id="buttondesc" style={{borderRadius : "0.5rem"}}>Ordenar desc.</button>
                    </div>
                    <div className="col col-md-3" style={{textAlign : "left"}}> 
                        <button id="buttonasc" style={{borderRadius : "0.5rem"}}>Ordenar asc.</button>
                    </div>
                </div>
            </div>

            <div className="abajo">
                <div className = "row">
                    <div className="col col-md-6" style={{textAlign : "right"}}>
                        <button id="buttonpagant" style={{borderRadius : "0.5rem"}}>Pág. anterior</button>
                    </div>
                    <div className="col col-md-6" style={{textAlign : "left"}}>
                        <button id="buttonpagsgte" style={{borderRadius : "0.5rem"}}>Pág. siguiente</button>
                    </div>
                </div>
            </div>

            <div className = "row">
                <div className="col col-md-12">
                    <div id="pagina">
                        <p>Página {numeropagina}</p>
                    </div>
                </div>
            </div>

            <div className="row" id="contenedor">
            </div>
        </div>
        </>
    )
}