import React, { useState } from 'react';
import './App.css';
import { Ganado } from './components/Ganado';
import { Perdido } from './components/Perdido';

const posibilidades = ["piedra", "papel", "tijera"];

const PIEDRA = "piedra";
const PAPEL = "papel";
const TIJERA = "tijera";

// Componente para mostrar el resultado final
function ResultadoFinal({ nombre, partidasGanadasJugador, partidasGanadasMaquina, reiniciarJuego }) {
    const jugadorGano = partidasGanadasJugador > partidasGanadasMaquina;

    return (
        <div className='result'>
            <h2>Resultado Final</h2>
            <p>{nombre}, has ganado {partidasGanadasJugador} partida(s).</p>
            <p>La máquina ha ganado {partidasGanadasMaquina} partida(s).</p>
            <button onClick={reiniciarJuego}>Jugar de nuevo</button>
            
            {jugadorGano ? (
                <Ganado />
            ) : (
                <Perdido />
            )}
        </div>
    );
    
}

function App() {
    // Estados del juego
    const [nombre, setNombre] = useState('');
    const [numPartidas, setNumPartidas] = useState(0);
    const [partidasJugadas, setPartidasJugadas] = useState(0);
    const [opcionJugador, setOpcionJugador] = useState(null);
    const [opcionMaquina, setOpcionMaquina] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [partidasGanadasJugador, setPartidasGanadasJugador] = useState(0);
    const [partidasGanadasMaquina, setPartidasGanadasMaquina] = useState(0);
    const [juegoTerminado, setJuegoTerminado] = useState(false);

    const imagenesJugador = {
        piedra: "img/piedraJugador.png",
        papel: "img/papelJugador.png",
        tijera: "img/tijeraJugador.png"
    };

    const imagenesMaquina = {
        piedra: "img/piedraOrdenador.png",
        papel: "img/papelOrdenador.png",
        tijera: "img/tijeraOrdenador.png"
    };

    // Función para seleccionar la opción del jugador
    const seleccionarOpcion = (opcion) => {
        setOpcionJugador(opcion);
    };

    // Función para jugar una partida
    const jugarPartida = () => {
        if (!nombre) {
            alert("Por favor, ingresa un nombre.");
            return;
        }
        if (!opcionJugador) {
            alert("Selecciona una opción antes de jugar.");
            return;
        }

        // Si ya se han jugado todas las partidas, no permite continuar
        if (partidasJugadas >= numPartidas) {
            return;
        }

        // Elección aleatoria de la máquina
        const opcionMaquina = posibilidades[Math.floor(Math.random() * 3)];
        setOpcionMaquina(opcionMaquina);
        
        // Determinar el resultado de la partida
        const resultado = determinarResultado(opcionJugador, opcionMaquina);
        setHistorial([...historial, resultado]);

        // Incrementar el contador de partidas jugadas
        setPartidasJugadas(partidasJugadas + 1);

        // Actualizar el contador de victorias
        if (resultado === `Gana ${nombre}`) {
            setPartidasGanadasJugador(partidasGanadasJugador + 1);
        } else if (resultado === "Gana la máquina") {
            setPartidasGanadasMaquina(partidasGanadasMaquina + 1);
        }

        // Comprobar si se han jugado todas las partidas
        if (partidasJugadas + 1 === numPartidas) {
            setJuegoTerminado(true);
        }
    };

    // Función para determinar el resultado
    const determinarResultado = (opcionJugador, opcionMaquina) => {
        if (opcionJugador === opcionMaquina) return "Empate";
        if (
            (opcionJugador === PIEDRA && opcionMaquina === TIJERA) ||
            (opcionJugador === PAPEL && opcionMaquina === PIEDRA) ||
            (opcionJugador === TIJERA && opcionMaquina === PAPEL)
        ) {
            return `Gana ${nombre}`;
        }
        return "Gana la máquina";
    };

    // Función para reiniciar el juego
    const reiniciarJuego = () => {
        setNombre('');
        setNumPartidas(0);
        setPartidasJugadas(0);
        setOpcionJugador(null);
        setOpcionMaquina(null);
        setHistorial([]);
        setPartidasGanadasJugador(0);
        setPartidasGanadasMaquina(0);
        setJuegoTerminado(false);
    };

    return (
        <div>
            <h1>Juego de Piedra Papel Tijera</h1>

            {!juegoTerminado ? (
                <>
                    <p>
                        <label>Introduce el nombre del jugador </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            disabled={partidasJugadas > 0} // Deshabilita el nombre si ya empezó el juego
                        />
                    </p>
                    <p>
                        <label>¿Cuántas partidas quieres jugar? </label>
                        <input
                            type="number"
                            value={numPartidas}
                            onChange={(e) => setNumPartidas(parseInt(e.target.value))}
                            disabled={partidasJugadas > 0} // Deshabilita si ya empezaron las partidas
                        />
                    </p>
                    <button onClick={jugarPartida} disabled={partidasJugadas >= numPartidas}>
                        ¡JUGAR!
                    </button>

                    <h3>
                        Jugando la partida {partidasJugadas} de {numPartidas}.
                    </h3>

                    <div id="jugador">
                        {posibilidades.map((opcion) => (
                            <img
                                key={opcion}
                                className={opcionJugador === opcion ? 'seleccionado' : 'noSeleccionado'}
                                src={imagenesJugador[opcion]}
                                alt={opcion}
                                onClick={() => seleccionarOpcion(opcion)}
                            />
                        ))}
                    </div>

                    <div id="maquina">
                        {opcionMaquina && (
                            <img
                                src={imagenesMaquina[opcionMaquina]}
                                alt="maquina"
                            />
                        )}
                    </div>

                    <div>
                        <h3>Historial de partidas</h3>
                        <ul id="historial">
                            {historial.map((resultado, index) => (
                                <li key={index}>{resultado}</li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <ResultadoFinal
                    nombre={nombre}
                    partidasGanadasJugador={partidasGanadasJugador}
                    partidasGanadasMaquina={partidasGanadasMaquina}
                    reiniciarJuego={reiniciarJuego}
                />
            )}
        </div>
    );
}

export default App;
