import React, { useCallback, useEffect, useRef, useState } from "react";
import { category } from "..";
import styles from "../../styles/Create.module.css";
import { Unity, useUnityContext } from "react-unity-webgl";
import recorder from "react-canvas-recorder";
import { uploadMetadata } from "../../lib/uploadMetadata";
import { toast } from "react-toastify";
import { mint } from "../../lib/tronAdaptor";

const Create = () => {
    const [state, setState] = useState({
        title: "",
        description: "",
        category: "",
    });

    const ref = useRef();

    const { unityProvider, sendMessage, unload } = useUnityContext({
        loaderUrl: "Build/Build.loader.js",
        dataUrl: "Build/Build.data",
        frameworkUrl: "Build/Build.framework.js",
        codeUrl: "Build/Build.wasm",
        webGLContextAttributes: {
            preserveDrawingBuffer: true,
        },
    });

    useEffect(() => {
        return () => {
            unload();
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.currentTarget;
        if (name === "title") {
            console.log(value);
            sendMessage("GameController", "SetText", value);
        }
        setState((val) => {
            return { ...val, [name]: value };
        });
    };

    const getImage = async (videoSource) => {
        let canvas = document.createElement("canvas");
        let video = document.createElement("video");
        video.src = videoSource;
        video.play();
        canvas.width = 350;
        canvas.height = 350;
        await new Promise((resolve) => setTimeout(resolve, 100));

        let ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        let image = canvas.toDataURL("image/png");
        console.log(image);
        canvas.remove();
        video.remove();
        await new Promise((resolve) => setTimeout(resolve, 100));
        return image;
    };

    const upload = async () => {
        recorder.createStream(ref.current);
        recorder.start();

        await new Promise((resolve) => setTimeout(resolve, 4450));
        recorder.stop();
        const file = recorder.save();
        console.log(file);
        const image = await getImage(URL.createObjectURL(file));

        return await uploadMetadata(
            state.title,
            state.category,
            state.description,
            image,
            file
        );
    };


    const handleMinting = async (cid) => {
        await mint("ipfs://" + cid, state.category);
    };
    const handleSubmit = async () => {
        const cid = await toast.promise(upload, {
            pending: "Uploading Metadata",
            success: "Metadata Uploaded",
            error: "Error Uploading Metadata",
        });

        await toast.promise(handleMinting(cid), {
            pending: "Minting NFT",
            success: "NFT Minted",
            error: "Error Minting NFT",
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.editdetails}>
                <div className={styles.label}>Title</div>
                <input
                    className={styles.input}
                    name="title"
                    value={state.title}
                    onChange={handleChange}
                    maxLength={20}
                />
                <div className={styles.label}>Category</div>
                <select
                    className={styles.input}
                    name="category"
                    value={state.category}
                    onChange={handleChange}
                >
                    {category.map((e) => (
                        <option value={e} key={e}>{e}</option>
                    ))}
                </select>
                <div className={styles.label}>Description</div>
                <textarea
                    className={styles.input}
                    style={{ height: "190px", resize: "vertical", padding: "20px" }}
                    name="description"
                    onChange={handleChange}
                />
                <div className={styles.button} onClick={handleSubmit}>
                    Mint
                </div>
            </div>
            <div className={styles.unityground}>
                <Unity
                    unityProvider={unityProvider}
                    className={styles.unity}
                    ref={ref}
                    style={{ width: 560, height: 560 }}
                />
            </div>
        </div>
    );
};

export default Create;
