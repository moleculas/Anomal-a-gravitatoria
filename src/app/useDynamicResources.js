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
        let valores;
        const publicHTML = process.env.PUBLIC_URL;
        const loadResource = async (url, type) => {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const resourceUrl = URL.createObjectURL(blob);        
                if (type === 'video') {
                    setLoadingPercentage(prevPercentage => prevPercentage + 10);
                } else if (type === 'audio') {
                    setLoadingPercentage(prevPercentage => prevPercentage + 20);
                };        
                return resourceUrl;
            } catch (error) {
                console.error(`Error al importar el ${type}:`, error);
                return null;
            };
        };
        fetch(`${publicHTML}/assets/contenido/${itemValue}/json/valores.json`)
            .then(response => response.json())
            .then(data => {
                valores = data; 
                setTitulo(valores.titulo);
                setSubtitulo(valores.subtitulo);
                setTextOriginal(valores.textOriginal);         
                setLang(valores.lang);            
                return loadResource(`${publicHTML}/assets/contenido/${itemValue}/images/${valores.poster}`, 'image');
            })
            .then(posterUrl => {
                setPoster(posterUrl);
                const videoPromises = valores.videos.map(video => {
                    return loadResource(`${publicHTML}/assets/contenido/${itemValue}/video/${video}`, 'video');
                });
                return Promise.all(videoPromises);
            })
            .then(videoUrls => {
                setVideosBg(videoUrls);
                const overlayPromises = valores.overlays.map(overlay => {
                    return loadResource(`${publicHTML}/assets/contenido/${itemValue}/video/${overlay}`, 'video');
                });
                return Promise.all(overlayPromises);
            })
            .then(videoUrls => {
                setVideosOv(videoUrls);
                return loadResource(`${publicHTML}/assets/contenido/${itemValue}/audio/${valores.miAudio}`, 'audio');
            })
            .then(audioUrl => {
                setMiAudio(audioUrl);
                setLoadingPercentage(90); 
            })
            .catch(error => {
                console.error('Error al importar los datos:', error);
            });
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