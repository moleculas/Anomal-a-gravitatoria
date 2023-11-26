import { useEffect, useState } from 'react';

export function useDynamicResources(itemValue) {
    const [textOriginal, setTextOriginal] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [tituloDialog, setTituloDialog] = useState("");
    const [subtitulo, setSubtitulo] = useState("");
    const [poster, setPoster] = useState(null);
    const [lang, setLang] = useState(null);
    const [loadingPercentage, setLoadingPercentage] = useState(0);
    const [miAudio, setMiAudio] = useState(null);

    //useEffect

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const publicHTML = process.env.PUBLIC_URL;
                const responseJSON = await fetch(`${publicHTML}/assets/contenido/${itemValue}/json/valores.json`);
                const valores = await responseJSON.json();
                if (!isMounted) {
                    return;
                };
                setTitulo(valores.titulo);
                setTituloDialog(valores.tituloDialog);
                setSubtitulo(valores.subtitulo);
                setTextOriginal(valores.textOriginal);    
                setLang(valores.lang);
                setMiAudio(valores.miAudio);    
                const proporcionCarga = 90;
                const fetchBlobAndCreateObjectURL = async (url) => {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                };
                const posterUrl = await fetchBlobAndCreateObjectURL(`${publicHTML}/assets/contenido/${itemValue}/images/${valores.poster}`);
                setLoadingPercentage(prevPercentage => prevPercentage + proporcionCarga);
                setPoster(posterUrl); 
                setLoadingPercentage(90);
            } catch (error) {
                console.error('Error al importar los datos:', error);
            };
        };
        fetchData();
        return () => {
            isMounted = false;
            URL.revokeObjectURL(poster);     
        };
    }, [itemValue]);

    return {
        loadingPercentage,
        titulo,
        tituloDialog,
        subtitulo,
        textOriginal,  
        poster,
        lang,
        miAudio
    };
}