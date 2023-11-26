import React, { useState, useEffect, useRef } from 'react';
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator,
} from '@mui/lab';
import { motion } from 'framer-motion';
import {
    Typography,
    Box,
    Paper,
    IconButton
} from '@mui/material/';
import useDynamicRefs from 'use-dynamic-refs';

//importación acciones
import useWindowHeight from './useWindowHeight';

function LineaTiempo(props) {
    const {
        poema,
        setPoema,
        titulo,
        cambios,
        isMobile,
        isPortrait,
        setCambioParte,
        traduccions
    } = props;
    const text2Ref = useRef(null);
    const windowHeight = useWindowHeight();
    const container = {
        show: {
            transition: {
                staggerChildren: 0.01,
            },
        },
    };
    const [itemsTimeline, setItemsTimeline] = useState(null);
    const [item2, setItem2] = useState(null);
    const [getRef, setRef] = useDynamicRefs();
    const [numTimeline, setNumTimeline] = useState(null);

    //useEffect

    useEffect(() => {
        if (!poema) {
            setItemsTimeline(null);
        };
    }, [poema]);

    useEffect(() => {
        if (!itemsTimeline) {
            setTimeout(() => {
                generarNumeroAleatorioConsecutivo();
            }, 150);
        };
    }, [itemsTimeline]);

    useEffect(() => {
        if (!itemsTimeline) return;
        setItem2({
            hidden: { opacity: 0, y: 50 },
            show: { opacity: 1, y: 0, transition: { delay: 0.2 } },
            initial: {
                y: 0,
            },
        });
    }, [itemsTimeline]);

    useEffect(() => {
        const resetItemsTimeline = () => {
            setItemsTimeline(null);
        };
        const intervalId = setInterval(resetItemsTimeline, 33000);
        return () => clearInterval(intervalId);
    }, []);

    //funciones

    const generarNumeroAleatorioConsecutivo = () => {
        const numeroAleatorio = Math.floor(Math.random() * poema.versos.length);
        if (numeroAleatorio === (poema.versos.length - 1)) {
            setItemsTimeline([poema.versos[poema.versos.length - 2], poema.versos[poema.versos.length - 1]]);
            setNumTimeline([(poema.versos.length - 2) + 1, (poema.versos.length - 1) + 1]);
        } else {
            setItemsTimeline([poema.versos[numeroAleatorio], poema.versos[numeroAleatorio + 1]]);
            setNumTimeline([(numeroAleatorio) + 1, (numeroAleatorio + 1) + 1]);
        };
    };

    const generarStringAlfanumerico = () => {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let resultado = '';
        for (let i = 0; i < 5; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            resultado += caracteres.charAt(indice);
        }
        return resultado;
    };

    const gestionaEstrofa = (item, indexEstrofa) => {
        const estrofa = item.split('\n');
        const resultado = estrofa.map((verso, index) => {
            return (
                <Typography
                    key={`verso-${index}`}
                    variant="body2"
                    className="text-2xl xl:text-3xl text-[#F5F5F5]"
                >
                    {verso}
                </Typography>
            )
        });
        return resultado;
    };

    const TimelineComp = () => (
        <Timeline
            position="right"
            sx={{
                '& .MuiTimelineItem-root:before': {
                    display: 'none',
                },
                cursor: "default"
            }}
        >
            {itemsTimeline.map((item, index) => {
                const last = itemsTimeline.length === index + 1;
                return (
                    <TimelineItem key={`nodo-${index}`}>
                        <TimelineSeparator>
                            <TimelineDot
                                className="w-32 h-32 p-0 mt-0 flex items-center justify-center"
                                sx={{
                                    backgroundColor: "#161616",
                                    color: "#F5F5F5"
                                }}
                            >
                                {numTimeline[0] + index}
                            </TimelineDot>
                            {!last && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent className="flex flex-col items-start pt-0 pb-48">
                            <Typography className="text-sm text-[#F5F5F5]">{poema.titulo}</Typography>
                            <Box className="mt-16 py-16 px-20 rounded-lg border border-[rgba(255,255,255,0.25)] w-full"
                                ref={setRef(`ref-${index}`)}
                                sx={{
                                    backgroundColor: "rgba(0, 0, 0, 0.2)"
                                }}
                            >
                                <div className="flex flex-col mt-8 md:mt-4 text-md leading-5">
                                    {gestionaEstrofa(item, index)}
                                </div>
                            </Box>
                        </TimelineContent>
                    </TimelineItem>
                )
            })}
        </Timeline>
    );

    const Botonera = ({ poema, cambioParte }) => {
        const iconButtons = [];
        for (let i = 1; i <= poema.partes; i++) {
            iconButtons.push(
                <IconButton
                    key={i}
                    onMouseUp={() => cambioParte(i)}
                    sx={{
                        backgroundColor: '#F5F5F5',
                        '&:hover': {
                            backgroundColor: '#FFFFFF',
                        },
                        '&:disabled': {
                            backgroundColor: '#FFFFFF',
                            opacity: 0.8,
                        },
                        transition: 'background 0.2s ease-in-out',
                        color: "#161616",
                        zIndex: 99,
                        width: '35px',
                        height: '35px',
                    }}
                    disabled={poema.activo === i}
                >
                    {i}
                </IconButton>
            );
        };
        return iconButtons;
    };

    const cambioParte = (parte) => {
        setPoema(null);
        setCambioParte(parte);
    };

    if (!poema) {
        return null
    };

    return (
        itemsTimeline && (
            <>
                <motion.div
                    className="w-full p-24 md:p-36"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >                   
                    <div className="flex flex-col sm:flex-row mb-24 justify-between">
                        <div>
                            <Typography variant="h2" ref={text2Ref} className="text-24 text-[#F5F5F5] uppercase font-bold">
                                {`${traduccions[0]}: [ ${titulo} - ${generarStringAlfanumerico()} ]`}
                            </Typography>
                            <Typography className="mt-2 text-12 text-[#F5F5F5] uppercase font-semibold tracking-widest">{`${traduccions[1]} ${cambios.producto} - ${traduccions[2]} ${cambios.dinamico}`}</Typography>
                        </div>
                        {Number(poema.partes) > 1 && (
                            <div className="flex flex-row gap-8">
                                <Botonera
                                    poema={poema}
                                    cambioParte={cambioParte}
                                />
                            </div>
                        )}
                    </div>
                    {(isMobile || isPortrait) ? (
                        <div className="w-full relative h-full md:pr-16">
                            <TimelineComp />
                        </div>
                    ) : (
                        <motion.div
                            className="w-full"
                            variants={item2}
                            initial="hidden"
                            animate="show"
                        >
                            <Paper elevation={3} className="w-full overflow-hidden shadow-2xl bg-[transparent] border border-[rgba(255,255,255,0.1)] border-solid">
                                <div
                                    id="elementId"
                                    className="h-auto md:pr-16 mt-16"
                                //style={{ height: windowHeight - 200 }}
                                >
                                    <TimelineComp />
                                </div>
                            </Paper>
                        </motion.div>
                    )}
                </motion.div >
            </>
        )
    );
}

export default LineaTiempo;