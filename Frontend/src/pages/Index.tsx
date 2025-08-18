import { useState, useEffect } from "react";

import { FileUpload } from "../components/FileUpload";
import { ChatInterface } from "../components/ChatInterface";

interface UploadedFile {
    name: string;
    size: number;
    type: string;
    id: string;
    fileName?: string;
}

const Index = () => {
    const [files, setFiles] = useState<UploadedFile[]>([]);

    // Debug function to track file changes
    const handleFilesChange = (newFiles: UploadedFile[]) => {
        console.log('Index: Files changing from', files, 'to', newFiles);
        setFiles(newFiles);
    };

    // Debug effect to track files state
    useEffect(() => {
        console.log('Index: Files state updated:', files);
    }, [files]);

    return (
        <div className="min-h-screen bg-background">
            {/* <ThemeToggle /> */}

            <div className="container mx-auto p-4 h-screen">
                <div className="grid lg:grid-cols-2 gap-6 h-full">
                    {/* Left Column - File Upload */}
                    <div className="flex flex-col">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 h-full">
                            <FileUpload files={files} onFilesChange={handleFilesChange} />
                        </div>
                    </div>

                    {/* Right Column - Chat Interface */}
                    <div className="flex flex-col">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full overflow-hidden">
                            <ChatInterface hasFiles={files.length > 0} files={files} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;