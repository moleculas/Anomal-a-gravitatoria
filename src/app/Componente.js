import { useEffect, useState, useRef } from 'react';
import {
    IconButton,
    Typography,
    Box,
    CircularProgress,
    Divider
} from '@mui/material';
import {
    VolumeUp,
    VolumeOff
} from '@mui/icons-material/';
import Typed from 'typed.js';
import { useLocation } from 'react-router-dom';
import MobileDetect from 'mobile-detect';
import Marquee from "react-fast-marquee";

//carga componentes
import LineaTiempo from './LineaTiempo';

//importaciones acciones
import { useDynamicResources } from './useDynamicResources';

//constantes
import { TRADUCCIONS } from './constantes';

const mixBlend = {
    1: "screen",
    2: "overlay",
    3: "lighten",
    4: "hard-light",
    5: "difference",
    6: "exclusion",
    7: "color",
    8: "luminosity"
};
const baseTime = 10;

function Componente(props) {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const itemValue = params.get('item');
    const {
        loadingPercentage,
        titulo,
        subtitulo,
        textOriginal,
        poster,
        lang,
        miAudio
    } = useDynamicResources(itemValue);
    const md = new MobileDetect(window.navigator.userAgent);
    const isMobile = md.mobile();
    const audioRef = useRef(null);
    const textRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [cambios, setCambios] = useState({ producto: 0, dinamico: 0 });
    const [reset, setReset] = useState(false);
    const [poema, setPoema] = useState({ titulo: "", versos: null, partes: null, activo: null });
    const [cambioParte, setCambioParte] = useState(null);
    const [contadorInactividad, setContadorInactividad] = useState({ temporizador: 0, tiempoBase: 0 });
    const [loadingPercentageSecundario, setLoadingPercentageSecundario] = useState(0);
    const [typedInstance, setTypedInstance] = useState(null);
    const [archillectImage, setArchillectImage] = useState(null);
    const [marquesina, setMarquesina] = useState("");

    //useEffect

    useEffect(() => {
        if (textOriginal) {
            setArchillectImage(Math.floor(Math.random() * 406400) + 1);
            setLoadingPercentageSecundario(10);
            setPoema({ titulo: textOriginal[0].titulo, versos: textOriginal[0].versos, partes: textOriginal.length, activo: 1 });
            setContadorInactividad(prevContador => ({
                ...prevContador,
                tiempoBase: baseTime + randomAdditionalTime()
            }));
            setMarquesina(textOriginal[0].versos[Math.floor(Math.random() * textOriginal[0].versos.length)].split('\n')[0]);
        };
    }, [textOriginal]);

    useEffect(() => {
        if (loadingPercentage + loadingPercentageSecundario === 100) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 200);
            return () => clearTimeout(timer);
        };
    }, [loadingPercentage, loadingPercentageSecundario]);

    useEffect(() => {
        if (isLoading) return;
        let intervalId = null;
        const modificarTexto = (registro) => {
            registro = registro.charAt(0).toUpperCase() + registro.slice(1);
            const palabras = registro.split(' ');
            const palabrasFiltradas = palabras.filter(palabra => palabra.length > 3);
            if (palabrasFiltradas.length > 0) {
                const palabraAleatoria = palabrasFiltradas[Math.floor(Math.random() * palabrasFiltradas.length)];
                registro = registro.replace(palabraAleatoria, `<i>${palabraAleatoria}</i>`);
            };
            return registro;
        };
        const intervalFunction = () => {
            if (poema?.versos.length >= 2) {
                let index1 = Math.floor(Math.random() * poema.versos.length);
                let index2 = Math.floor(Math.random() * poema.versos.length);
                while (index2 === index1) {
                    index2 = Math.floor(Math.random() * poema.versos.length);
                };
                const estrofa1 = poema.versos[index1].split('\n');
                const estrofa2 = poema.versos[index2].split('\n');
                const registro1 = estrofa1[Math.floor(Math.random() * estrofa1.length)];
                const registro2 = estrofa2[Math.floor(Math.random() * estrofa2.length)];
                const nuevoArray = [modificarTexto(registro1), modificarTexto(registro2)];
                if (typedInstance) {
                    typedInstance.destroy();
                };
                const newTyped = new Typed(textRef.current, {
                    strings: nuevoArray,
                    typeSpeed: 50,
                    cursorChar: registro1,
                });
                setTypedInstance(newTyped);
                setCambios(prevCambios => ({
                    ...prevCambios,
                    dinamico: prevCambios.dinamico + 1
                }));
                return () => {
                    newTyped.destroy();
                };
            };
        };
        const handleVisibilityChange = () => {
            if (document.hidden) {
                clearInterval(intervalId);
            } else {
                intervalId = setInterval(intervalFunction, (baseTime + randomAdditionalTime()) * 1000);
            };
        };
        if (cambioParte) {
            if (typedInstance) {
                typedInstance.destroy();
                setTypedInstance(null);
            };
            clearInterval(intervalId);
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        !intervalId && intervalFunction();
        intervalId = setInterval(intervalFunction, (baseTime + randomAdditionalTime()) * 1000);
        return () => {
            clearInterval(intervalId);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (typedInstance) {
                typedInstance.destroy();
            }
        };
    }, [isLoading, poema, cambioParte]);

    useEffect(() => {
        if (reset) {
            setTimeout(() => {
                setIsLoading(false);
                setReset(false);
            }, 500);
        };
    }, [isLoading]);

    useEffect(() => {
        if (reset) {
            setTimeout(() => {
                setIsLoading(false);
                setReset(false);
            }, 500);
        };
    }, [isLoading]);

    useEffect(() => {
        if (cambioParte) {
            setPoema({ titulo: textOriginal[cambioParte - 1].titulo, versos: textOriginal[cambioParte - 1].versos, partes: textOriginal.length, activo: cambioParte });
            setMarquesina(textOriginal[cambioParte - 1].versos[Math.floor(Math.random() * textOriginal[cambioParte - 1].versos.length)].split('\n')[0]);
            setCambioParte(null);
        };
    }, [cambioParte]);

    useEffect(() => {
        const manejarInactividad = () => {
            setContadorInactividad(prevContador => ({
                ...prevContador,
                temporizador: prevContador.temporizador + 1
            }));
            if (contadorInactividad.temporizador === contadorInactividad.tiempoBase) {
                duendeVideo();
            };
        };
        const intervalo = setInterval(manejarInactividad, 1000);
        return () => {
            clearInterval(intervalo);
        };
    }, [contadorInactividad]);

    //funciones     

    const randomAdditionalTime = () => {
        const additionalTimeOptions = [2, 10, 15, 20, 25, 30];
        return additionalTimeOptions[Math.floor(Math.random() * additionalTimeOptions.length)];
    };

    const duendeVideo = () => {
        setArchillectImage(Math.floor(Math.random() * 406400) + 1);
        setContadorInactividad({ temporizador: 0, tiempoBase: baseTime + randomAdditionalTime() });
    };

    const togglePlayAudio = () => {
        if (!isPlaying) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        };
    };

    if (isLoading) {
        return (
            <>
                <img className="w-full h-full object-cover absolute top-0 left-0 z-0" src={poster} />
                <div className="flex flex-1 flex-col items-center justify-center p-24">
                    <Box className="relative inline-flex z-50">
                        <CircularProgress variant="indeterminate" {...props} sx={{ color: "#F5F5F5" }} value={loadingPercentage + loadingPercentageSecundario} size="60px" />
                        <Box className="absolute inset-0 flex items-center justify-center">
                            <Typography variant="caption" component="div" className="text-sm text-[#F5F5F5]">
                                {`${Math.round(loadingPercentage + loadingPercentageSecundario)}%`}
                            </Typography>
                        </Box>
                    </Box>
                </div>
            </>
        )
    };

    return (
        <div className="w-full"
            style={{
                overflow: isMobile ? "auto" : "hidden",
                height: isMobile ? "auto" : "100vh",
            }}
        >
            <img className="w-full h-full object-cover fixed top-0 left-0 z-0 animate-ken-burns" src={`https://archillect.mhsattarian.workers.dev/${archillectImage}/img`} />
            <Marquee className="text-[100vh] text-white fixed top-[-30px] left-0 z-2" style={{ mixBlendMode: mixBlend[2] }}>
                {marquesina}
            </Marquee>
            <div className="w-full h-full absolute top-0 left-0 z-1 bg-black" style={{ mixBlendMode: mixBlend[0], opacity: 0.5 }} />
            <div className="fixed top-0 left-0 grid grid-cols-1 md:grid-cols-2 md:gap-4 md:px-56 md:py-28 h-full overflow-auto md:overflow-hidden z-15">
                <div className="flex flex-1 flex-col p-24 w-full"
                    style={{ justifyContent: "flex-start" }}
                >
                    {!isMobile && <Divider className="w-[1000px] opacity-0" />}
                    <Typography
                        sx={{
                            fontSize: {
                                xs: '70px',
                                md: '94px'
                            },
                            color: "#F5F5F5",
                            borderLeft: "5px solid grey",
                            paddingLeft: {
                                sm: "10px",
                                md: "50px"
                            },
                            lineHeight: "62px",
                            marginTop: "10px"
                        }}
                        variant='h1'
                        ref={textRef}
                    />
                </div>
                <div className="w-full relative h-auto">
                    <LineaTiempo
                        poema={poema}
                        setPoema={setPoema}
                        titulo={titulo}
                        cambios={cambios}
                        isMobile={isMobile}
                        setCambioParte={setCambioParte}
                        traduccions={[TRADUCCIONS[7][lang], TRADUCCIONS[8][lang], TRADUCCIONS[9][lang]]}
                    />
                </div>
            </div>
            <div className="fixed bottom-0 right-0 pb-16 pr-16">
                <IconButton
                    onClick={togglePlayAudio}
                    color="primary"
                    sx={{
                        backgroundColor: '#161616',
                        '&:hover': {
                            backgroundColor: '#212121'
                        },
                        transition: 'background 0.2s ease-in-out'
                    }}
                >
                    {isPlaying ? <VolumeOff fontSize="large" sx={{ color: "white" }} /> : <VolumeUp fontSize="large" sx={{ color: "white" }} />}
                </IconButton>
            </div>
            <audio ref={audioRef} src={miAudio} loop />
        </div>
    )
}

export default Componente;