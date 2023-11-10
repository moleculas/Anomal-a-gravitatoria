import { useEffect, useState } from 'react';

export function useDynamicResources(itemValue) {
    const [videosBg, setVideosBg] = useState(null);
    const [videosOv, setVideosOv] = useState(null);
    const [miAudio, setMiAudio] = useState(null);
    const [textOriginal, setTextOriginal] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");
    const [poster, setPoster] = useState(null);

    useEffect(() => {
        let valores;
        const publicHTML = process.env.PUBLIC_URL;
        fetch(`${publicHTML}/assets/contenido/${itemValue}/json/valores.json`)
            .then(response => response.json())
            .then(data => {
                valores = data; 
                setTitulo(valores.titulo);
                setSubtitulo(valores.subtitulo);
                setTextOriginal(valores.textOriginal);                
                return fetch(`${publicHTML}/assets/contenido/${itemValue}/images/${valores.poster}`);
            })
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(posterUrl => {
                setPoster(posterUrl);
                const videoPromises = valores.videos.map(video => {
                    return fetch(`${publicHTML}/assets/contenido/${itemValue}/video/${video}`)
                        .then(response => response.blob())
                        .then(blob => URL.createObjectURL(blob))
                        .catch(error => {
                            console.error('Error al importar el video:', error);
                            return null;
                        });
                });
                return Promise.all(videoPromises);
            })
            .then(videoUrls => {
                setVideosBg(videoUrls);
                const overlayPromises = valores.overlays.map(overlay => {
                    return fetch(`${publicHTML}/assets/contenido/${itemValue}/video/${overlay}`)
                        .then(response => response.blob())
                        .then(blob => URL.createObjectURL(blob))
                        .catch(error => {
                            console.error('Error al importar el video:', error);
                            return null;
                        });
                });
                return Promise.all(overlayPromises);
            })
            .then(videoUrls => {
                setVideosOv(videoUrls);
                return fetch(`${publicHTML}/assets/contenido/${itemValue}/audio/${valores.miAudio}`);
            })
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(audioUrl => {
                setMiAudio(audioUrl);
            })
            .catch(error => {
                console.error('Error al importar los datos:', error);
            });
    }, [itemValue]);

    return {
        titulo,
        subtitulo,
        textOriginal,
        videosBg,
        videosOv,
        miAudio,       
        poster
    };
}