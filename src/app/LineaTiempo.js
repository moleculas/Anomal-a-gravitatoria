import React, { useState, useEffect, useRef } from 'react';
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator,
} from '@mui/lab';
import { motion, useAnimate } from 'framer-motion';
import {
    Typography,
    Box,
    Paper,
    IconButton
} from '@mui/material/';
import shuffleLetters from 'shuffle-letters';
import useDynamicRefs from 'use-dynamic-refs';

import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

//importación acciones
import useWindowHeight from './useWindowHeight';

function LineaTiempo(props) {
    const {
        poema,
        setPoema,
        titulo,      
        cambios,
        isMobile,
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
    const [scope, animate] = useAnimate();
    const [sliderValue, setSliderValue] = useState(null);
    const [parrafoAumentado, setParrafoAumentado] = useState(null);
    const [visibleScroller, setVisibleScroller] = useState(false);
    const [valueLabelDisplayState, setValueLabelDisplayState] = useState("auto");

    //useEffect

    useEffect(() => {
        if (!poema) {
            setItemsTimeline(null);
        } else {
            setTimeout(() => {
                setItemsTimeline(poema.versos);
            }, 150);
        };
    }, [poema]);

    useEffect(() => {
        if (!itemsTimeline) return;
        setItem2({
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { delay: 0.5 } },
            initial: {
                y: 0,
            },
        });
        if (scope.current) {
            if (scope.current.scrollHeight > scope.current.clientHeight) {
                setVisibleScroller(true);
            };
        };
        setSliderValue(poema.versos.length);
    }, [itemsTimeline]);

    useEffect(() => {
        if (parrafoAumentado) {
            const parrafo = getRef(parrafoAumentado);
            parrafo.current.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            parrafo.current.style.scale = 1.15;
            parrafo.current.style.marginLeft = "35px";
            parrafo.current.style.width = "90%";
        };
    }, [parrafoAumentado]);

    useEffect(() => {
        if (!itemsTimeline || !sliderValue || !visibleScroller) return;
        window.addEventListener('wheel', handleMouseWheel);
        return () => {
            window.removeEventListener('wheel', handleMouseWheel);
        };
    }, [itemsTimeline, sliderValue, visibleScroller]);

    //funciones

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
                    className="text-16 text-[#F5F5F5]"
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
                                {index + 1}
                            </TimelineDot>
                            {!last && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent className="flex flex-col items-start pt-0 pb-48">
                            <Typography className="text-sm text-[#F5F5F5]">{poema.titulo}</Typography>
                            <Box className="mt-16 py-16 pl-20 rounded-lg border border-[rgba(255,255,255,0.25)] w-full"
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
        setVisibleScroller(false);
        setPoema(null);
        setCambioParte(parte);
        setValueLabelDisplayState("auto");
    };

    const valueLabelFormat = (value) => {
        return poema.versos[poema.versos.length - value].split('\n')[0];
    };

    const handleSliderChange = (event, newValue) => {
        setParrafoAumentado(`ref-${poema.versos.length - newValue}`);
        setSliderValue(newValue);
        animacion(newValue);
        setValueLabelDisplayState("on");
    };

    const handleSliderReleased = () => {
        if (parrafoAumentado) {
            setParrafoAumentado(null);
        };
    };

    const handleMouseWheel = (event) => {      
        const direction = event.deltaY < 0 ? 1 : -1;
        const newValue = sliderValue + direction;
        const clampedValue = Math.max(1, Math.min(poema.versos.length, newValue));
        setParrafoAumentado(`ref-${poema.versos.length - clampedValue}`);
        setSliderValue(clampedValue);
        animacion(clampedValue, newValue);
        setValueLabelDisplayState("on");
    };

    const animacion = (valor) => {
        const numVersos = poema.versos.length;
        const desplazamiento = (scope.current.scrollHeight - scope.current.clientHeight) * ((numVersos - valor) / numVersos);
        const variacionDesplazamiento = valor === numVersos - (numVersos - 1) ? 250 : valor === numVersos ? 0 : (250 * ((numVersos - valor) + 1)) / numVersos;
        animate(scope.current, { y: -1 * (desplazamiento + variacionDesplazamiento) }, { ease: 'easeOut' });
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
                    {isMobile ? (
                        <div className="w-full relative h-full md:pr-16">
                            <TimelineComp />
                        </div>
                    ) : (
                        <Stack sx={{ height: windowHeight - 200 }} spacing={3} direction="row" className="w-full relative z-99">
                            {visibleScroller ? (
                                <Slider
                                    orientation="vertical"
                                    valueLabelFormat={valueLabelFormat}
                                    valueLabelDisplay={valueLabelDisplayState}
                                    min={1}
                                    max={poema.versos.length}
                                    value={sliderValue}
                                    onChange={handleSliderChange}
                                    size="small"
                                    color="secondary"
                                    sx={{
                                        color: '#F5F5F5',
                                        '& .MuiSlider-valueLabel': {
                                            lineHeight: 1.2,
                                            fontSize: 12,
                                            fontFamily: 'Mukta',
                                            marginRight: '10px',
                                            background: "unset"
                                        },
                                    }}
                                    onChangeCommitted={handleSliderReleased}
                                />
                            ) : (
                                <div className="w-[25px]"></div>
                            )}
                            <Paper elevation={3} className="w-full overflow-hidden shadow-2xl bg-[transparent] border border-[rgba(255,255,255,0.1)] border-solid">
                                <motion.div
                                    id="elementId"
                                    variants={item2}
                                    className="h-auto md:pr-16 mt-16"
                                    ref={scope}
                                    style={{ height: windowHeight - 200 }}
                                    initial="initial"
                                >
                                    <TimelineComp />
                                </motion.div>
                            </Paper>
                        </Stack>
                    )}
                </motion.div >
            </>
        )
    );
}

export default LineaTiempo;