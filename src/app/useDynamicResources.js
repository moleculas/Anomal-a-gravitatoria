import { useEffect, useState } from 'react';

export function useDynamicResources(itemValue) {
    const [videosBg, setVideosBg] = useState(null);
    const [videosOv, setVideosOv] = useState(null);
    const [miAudio, setMiAudio] = useState(null);
    const [textOriginal, setTextOriginal] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");
    const [poster, setPoster] = useState(null);
    const [lang, setLang] = useState(null);
    const [loadingPercentage, setLoadingPercentage] = useState(0);

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
                setSubtitulo(valores.subtitulo);
                setTextOriginal(valores.textOriginal);
                setLang(valores.lang);
                const proporcionCarga = 90 / (valores.videos.length + valores.overlays.length + 2);                
                const fetchBlobAndCreateObjectURL = async (url) => {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                };
                const posterUrl = await fetchBlobAndCreateObjectURL(`${publicHTML}/assets/contenido/${itemValue}/images/${valores.poster}`);
                setLoadingPercentage(prevPercentage => prevPercentage + proporcionCarga);
                setPoster(posterUrl);
                const videoUrls = await Promise.all(
                    valores.videos.map(async (video) => {
                        setLoadingPercentage(prevPercentage => prevPercentage + proporcionCarga);
                        try {
                            return await fetchBlobAndCreateObjectURL(`${publicHTML}/assets/contenido/${itemValue}/video/${video}`);
                        } catch (error) {
                            console.error('Error al importar el video:', error);
                            return null;
                        }
                    })
                );
                setVideosBg(videoUrls);
                const overlayUrls = await Promise.all(
                    valores.overlays.map(async (overlay) => {
                        setLoadingPercentage(prevPercentage => prevPercentage + proporcionCarga);
                        try {
                            return await fetchBlobAndCreateObjectURL(`${publicHTML}/assets/contenido/${itemValue}/video/${overlay}`);
                        } catch (error) {
                            console.error('Error al importar el video:', error);
                            return null;
                        };
                    })
                );
                setVideosOv(overlayUrls);                
                const audioUrl = await fetchBlobAndCreateObjectURL(`${publicHTML}/assets/contenido/${itemValue}/audio/${valores.miAudio}`);
                setMiAudio(audioUrl);
                setLoadingPercentage(90);
            } catch (error) {
                console.error('Error al importar los datos:', error);
            };
        };
        fetchData();
        return () => {
            isMounted = false;
            URL.revokeObjectURL(poster);
            videosBg.forEach((url) => URL.revokeObjectURL(url));
            videosOv.forEach((url) => URL.revokeObjectURL(url));
            URL.revokeObjectURL(miAudio);
        };
    }, [itemValue]);

    return {
        loadingPercentage,
        titulo,
        subtitulo,
        textOriginal,
        videosBg,
        videosOv,
        miAudio,
        poster,
        lang
    };
}