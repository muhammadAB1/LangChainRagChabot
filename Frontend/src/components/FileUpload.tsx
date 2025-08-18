import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

interface UploadedFile {
    name: string;
    size: number;
    type: string;
    id: string;
    fileName?: string; // Store the filename from backend response
}

interface FileUploadProps {
    files: UploadedFile[];
    onFilesChange: (files: UploadedFile[]) => void;
}

export function FileUpload({ files, onFilesChange }: FileUploadProps) {
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        // Only take the first file dropped
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            console.log('File dropped:', droppedFile.name); // Debug log
            handleFiles([droppedFile]);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Only take the first file selected
            const selectedFile = e.target.files[0];
            handleFiles([selectedFile]);
            
            // Reset the input value so the same file can be selected again
            e.target.value = '';
        }
    };

    const handleFiles = async (fileList: File[]) => {
        if (fileList.length === 0) return;

        setUploading(true);

        try {
            // Only process the first file
            const file = fileList[0];
            const formData = new FormData();
            formData.append('file', file);

            console.log('Uploading file:', file.name); // Debug log

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed for ${file.name}`);
            }

            const result = await response.json();
            console.log('Upload response:', result); // Debug log
            
            const newFile: UploadedFile = {
                name: file.name,
                size: file.size,
                type: file.type,
                id: Math.random().toString(36).substr(2, 9),
                fileName: result.fileName || file.name
            };

            console.log('New file object:', newFile); // Debug log
            console.log('Replacing files with:', [newFile]); // Debug log

            // Replace all files with just this one file
            onFilesChange([newFile]);
            
            // Clear the file input after successful upload
            const fileInput = document.getElementById("file-input") as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
            
            // Force a small delay to ensure state update
            setTimeout(() => {
                console.log('State update completed');
            }, 100);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (id: string) => {
        onFilesChange(files.filter(file => file.id !== id));
        // Clear the file input when removing files
        const fileInput = document.getElementById("file-input") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold mb-2">Upload Files</h2>
                <p className="text-muted-foreground">
                    Upload PDF or text files to get started
                </p>
            </div>

            <div
                className={`upload-zone p-8 text-center cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm ${dragOver ? "drag-over" : ""
                    } ${uploading ? "upload-success" : ""}`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => document.getElementById("file-input")?.click()}
            >
                <input
                    id="file-input"
                    type="file"
                    accept="*/*"
                    onChange={handleFileInput}
                    className="hidden"
                />

                {uploading ? (
                    <div className="space-y-4">
                        <div className="animate-spin mx-auto w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                        <p className="text-sm text-muted-foreground">Uploading files...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div>
                            <p className="text-lg font-medium">
                                {files.length > 0 ? 'Drop new file to replace current file' : 'Drop files here or click to upload'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {files.length > 0 ? 'Uploading a new file will replace the current one' : 'Supports any file type'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {files.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-medium">Uploaded Files</h3>
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="p-4 flex items-center justify-between float-in rounded-lg border bg-card text-card-foreground shadow-sm"
                        >
                            <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium text-sm">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-success" />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(file.id);
                                    }}
                                    className="h-8 w-8 rounded-md border border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}