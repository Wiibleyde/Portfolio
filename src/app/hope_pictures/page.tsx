"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { File, Folder, ImageAlt } from "react-bootstrap-icons";

interface Contents {
    folders: string[];
    files: string[];
}

export default function Home() {
    const [path, setPath] = useState("");
    const [contents, setContents] = useState<Contents>({ folders: [], files: [] });
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        fetch(`/api/v1/hope/pictures/find?path=${path}`)
            .then((response) => response.json())
            .then((data) => setContents(data));
    }, [path]);

    const handleFolderClick = (folder: string) => {
        setPath((prevPath) => `${prevPath}/${folder}`);
    };

    const handleFileClick = (file: string) => {
        setSelectedImage(`/hope_pictures${path}/${file}`);
    };

    const handleBackClick = () => {
        setPath((prevPath) => prevPath.split("/").slice(0, -1).join("/"));
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
            <h1 className="text-4xl font-bold mb-8 text-center">Hope Pictures</h1>

            <div className="w-full max-w-5xl">
                {selectedImage && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-semibold mb-4 text-center">
                            Selected Image
                        </h2>
                        <div className="flex flex-col items-center">
                            <Image
                                src={selectedImage}
                                alt="Selected"
                                width={500}
                                height={500}
                                className="rounded-lg shadow-lg border border-gray-700"
                                onClick={() => window.open(selectedImage, "_blank")}
                            />
                            <p className="text-sm mt-2 text-gray-600">Cliquez sur l'image pour l'ouvrir dans un nouvel onglet</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-center mb-6">
                    <button
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
                        onClick={handleBackClick}
                        disabled={!path}
                    >
                        Back
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-3xl font-semibold mb-4 text-center">Folders</h2>
                        <ul className="space-y-3">
                            {contents.folders.map((folder) => (
                                <li
                                    key={folder}
                                    className="p-3 text-center border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-sm flex items-center justify-center"
                                    onClick={() => handleFolderClick(folder)}
                                >
                                    <Folder className="mr-2" /> {folder}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-3xl font-semibold mb-4 text-center">Files</h2>
                        <ul className="grid grid-cols-2 gap-3">
                            {contents.files.map((file) => (
                                <li
                                    key={file}
                                    className="p-3 text-center border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-sm flex items-center justify-center"
                                    onClick={() => handleFileClick(file)}
                                >
                                    {/* End of filename */}
                                    <ImageAlt className="mr-2" /> {file.split("_").pop()}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
