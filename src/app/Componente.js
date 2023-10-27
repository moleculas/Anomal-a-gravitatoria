import { useEffect, useState, useRef } from 'react';
import {
    IconButton,
    Typography,
    Box
} from '@mui/material';
import {
    VolumeUp,
    VolumeOff,
    QuestionMark
} from '@mui/icons-material/';
import Typed from 'typed.js';
import { useLocation } from 'react-router-dom';
import MobileDetect from 'mobile-detect';

//carga componentes
import LineaTiempo from './LineaTiempo';
import DialogCustom from './DialogCustom';

//importaciones acciones
import { useDynamicResources } from './useDynamicResources';

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
        titulo,
        subtitulo,
        textOriginal,
        videosBg,
        videosOv,
        miAudio,
        duracion,
        poster
    } = useDynamicResources(itemValue);
    const md = new MobileDetect(window.navigator.userAgent);
    const isMobile = md.mobile();
    const audioRef = useRef(null);
    const textRef = useRef(null);
    const [mezcla, setMezcla] = useState(null);
    const [videoBg, setVideoBg] = useState("");
    const [videoOv, setVideoOv] = useState("");
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [teclaPresionada, setTeclaPresionada] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [text, setText] = useState(null);
    const [transferTeclaPresionada, setTransferTeclaPresionada] = useState(null);
    const [cambios, setCambios] = useState({ producto: 0, dinamico: 0 });
    const [reset, setReset] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    //useEffect

    useEffect(() => {
        if (videosBg && videosOv && miAudio && textOriginal) {
            const videosToLoad = [...videosBg, ...videosOv].map(videoUrl => {
                const video = document.createElement('video');
                video.src = videoUrl;
                return video;
            });
            const loadHandlers = videosToLoad.map(video => {
                return new Promise((resolve, reject) => {
                    video.addEventListener('loadeddata', () => {
                        resolve();
                    });
                    video.addEventListener('error', () => {
                        reject();
                    });
                });
            });
            const audio = new Audio(miAudio);
            const audioLoadPromise = new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', () => {
                    resolve();
                });
                audio.addEventListener('error', () => {
                    reject();
                });
            });
            Promise.all([...loadHandlers, audioLoadPromise])
                .then(() => {
                    setIsLoading(false);
                })
                .catch(() => {
                    console.error('Error cargando videos o audio');
                });
            setText(textOriginal);
        };
    }, [videosBg, videosOv, miAudio, textOriginal]);

    useEffect(() => {
        if (isLoading) return;
        setVideoBg(videosBg[Math.floor(Math.random() * videosBg.length)]);
        setVideoOv(videosOv[Math.floor(Math.random() * videosOv.length)]);
    }, [isLoading]);

    useEffect(() => {
        if (isLoading) return;
        let intervalId = null;
        const randomAdditionalTime = () => {
            const additionalTimeOptions = [2, 10, 15, 20, 25, 30];
            return additionalTimeOptions[Math.floor(Math.random() * additionalTimeOptions.length)];
        };
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
            if (textOriginal.length >= 2) {
                let index1 = Math.floor(Math.random() * textOriginal.length);
                let index2 = Math.floor(Math.random() * textOriginal.length);
                while (index2 === index1) {
                    index2 = Math.floor(Math.random() * textOriginal.length);
                };
                const estrofa1 = textOriginal[index1].split('\n');
                const estrofa2 = textOriginal[index2].split('\n');
                const registro1 = estrofa1[Math.floor(Math.random() * estrofa1.length)];
                const registro2 = estrofa2[Math.floor(Math.random() * estrofa2.length)];
                const nuevoArray = [modificarTexto(registro1), modificarTexto(registro2)];
                const typed = new Typed(textRef.current, {
                    strings: nuevoArray,
                    typeSpeed: 50,
                    cursorChar: registro1,
                });
                setCambios(prevCambios => ({
                    ...prevCambios,
                    dinamico: prevCambios.dinamico + 1
                }));
                return () => {
                    typed.destroy();
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
        document.addEventListener("visibilitychange", handleVisibilityChange);
        !intervalId && intervalFunction();
        intervalId = setInterval(intervalFunction, (baseTime + randomAdditionalTime()) * 1000);
        return () => {
            clearInterval(intervalId);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
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
        if (isLoading) return;
        const handleKeyPress = (event) => {
            if (event.key === "1" && !teclaPresionada) {
                setTeclaPresionada(true);
                teclaPresionada1();
            };
            if (event.key === "3" && !teclaPresionada) {
                setTeclaPresionada(true);
                teclaPresionada3();
            };
            if (event.key === "4" && !teclaPresionada) {
                setTeclaPresionada(true);
                teclaPresionada4();
                setTransferTeclaPresionada("4");
            };
            if (event.key === "0" && !teclaPresionada) {
                setIsLoading(true);
                setTeclaPresionada(true);
                teclaPresionada0();
                setTransferTeclaPresionada("0");
            };
        };
        const handleKeyUp = (event) => {
            if (event.key === "1") {
                setTeclaPresionada(false);
                teclaLiberada1();
            };
            if (event.key === "3") {
                setTeclaPresionada(false);
            };
            if (event.key === "4") {
                setTeclaPresionada(false);
            };
        };
        window.addEventListener("keydown", handleKeyPress);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [teclaPresionada, isLoading]);

    useEffect(() => {
        if (reset) {
            setTimeout(() => {
                setIsLoading(false);
                setReset(false);
            }, 500);
        };
    }, [isLoading]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
                console.log('FullScreen Content');
            } else {
                setTimeout(() => {
                    setIsLoading(true);
                    setIsFullscreen(false);
                }, 50);
            };
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        };
    }, []);

    //funciones   

    const teclaPresionada1 = () => {
        let numeroAleatorio;
        do {
            numeroAleatorio = Math.floor(Math.random() * 8) + 1;
        } while (mezcla === numeroAleatorio);
        setMezcla(numeroAleatorio);
        let randomVideoIndex;
        do {
            randomVideoIndex = Math.floor(Math.random() * videosOv.length);
        } while (videosOv[randomVideoIndex] === videoOv);
        setVideoOv(videosOv[randomVideoIndex]);
        setOverlayVisible(true);
        setCambios(prevCambios => ({
            ...prevCambios,
            producto: prevCambios.producto + 1
        }));
    };

    const teclaLiberada1 = () => {
        setOverlayVisible(false);
    };

    const teclaPresionada3 = () => {
        let randomVideoIndex;
        do {
            randomVideoIndex = Math.floor(Math.random() * videosBg.length);
        } while (videosBg[randomVideoIndex] === videoBg);
        setVideoBg(videosBg[randomVideoIndex]);
        setCambios(prevCambios => ({
            ...prevCambios,
            producto: prevCambios.producto + 1
        }));
    };

    const teclaPresionada4 = () => {
        const shuffle = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            };
            return array;
        };
        const arr = shuffle([...text]);
        setText(arr);
        setCambios(prevCambios => ({
            ...prevCambios,
            producto: prevCambios.producto + 1
        }));
    };

    const teclaPresionada0 = () => {
        setReset(true);
        setTimeout(() => {
            setTeclaPresionada(false);
        }, 3000);
        setText(textOriginal);
        setCambios({ producto: 0, dinamico: 0 });
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

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    if (isLoading) {
        return (
            <>
                <img className="w-full h-full object-cover absolute top-0 left-0 z-0" src={poster} />
                <div className="flex flex-1 flex-col items-center justify-center p-24">
                    <Box
                        id="spinner"
                        sx={{
                            '& > div': {
                                backgroundColor: 'palette.secondary.main',
                            },
                        }}
                    >
                        <div className="bounce1" />
                        <div className="bounce2" />
                        <div className="bounce3" />
                    </Box>
                </div>
            </>
        )
    };

    return (
        <>
            <div className="w-full"
                style={{
                    overflow: isMobile ? "auto" : "hidden",
                    height: isMobile ? "auto" : "100vh",
                }}
            >
                <video className="w-full h-full object-cover absolute top-0 left-0 z-0" src={videoBg} autoPlay loop muted />
                {overlayVisible && (
                    <video className="w-full h-full object-cover absolute top-0 left-0 z-1" src={videoOv} autoPlay loop muted style={{ mixBlendMode: mixBlend[mezcla], opacity: 0.5 }} />
                )}
                <div className="absolute w-full h-full top-0 left-0 z-10">                   
                    {!isMobile && (
                        <div className="fixed bottom-0 left-0 pb-16 pl-16">
                            <IconButton
                                onClick={handleOpenDialog}
                                color="primary"
                                sx={{
                                    backgroundColor: '#161616',
                                    '&:hover': {
                                        backgroundColor: '#212121'
                                    },
                                    transition: 'background 0.2s ease-in-out'
                                }}
                            >
                                <QuestionMark fontSize="large" sx={{ color: "white" }} />
                            </IconButton>
                        </div>
                    )}
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
                </div>
                <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-4 md:px-56 md:py-28 h-full overflow-auto md:overflow-hidden">
                    <div className="flex flex-1 flex-col p-24"
                        style={{ justifyContent: "flex-start" }}
                    >
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
                            text={text}
                            titulo={titulo}
                            transferTeclaPresionada={transferTeclaPresionada}
                            setTransferTeclaPresionada={setTransferTeclaPresionada}
                            cambios={cambios}
                            duracion={duracion}
                            isMobile={isMobile}
                        />
                    </div>
                </div>
                <audio ref={audioRef} src={miAudio} loop />
            </div>
            <DialogCustom
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            />
        </>

    )
}

export default Componente;