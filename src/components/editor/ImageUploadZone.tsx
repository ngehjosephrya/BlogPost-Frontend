import {useRef, useState} from "react";
import { postService } from "../../service/post.service";

type ImageUploadZoneProps = {
    imageUrl: string | null;
    onUpload: (url: string) => void;
    onRemove: () => void;
};

export function ImageUploadZone({imageUrl, onUpload, onRemove}: ImageUploadZoneProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if(!file) return;

        try {
            setUploading(true);
            setError(null);
            const url = await postService.uploadImage(file);
            onUpload(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        }finally {
            setUploading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = ""; 
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    if(imageUrl) {
        return (
            <div className="relative rounded-xl overflow-hidden border border-gray-100
            dark:border-gray-800">
                <img 
                src={imageUrl} alt="cover"
                className="w-full aspect-video object-cover" />
                <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white
                dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex
                items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Remove Image">
                    <RemoveIcon />
                </button>
            </div>
        );
    }

    return (
        <div>
            <div 
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border border-dashed border-gray-200 dark:border-gray-700
                rounded-xl p-6 text-center cursor-pointer transition-colors hover:bg-gray-50
                dark:hover:bg-gray-800">
                    <input 
                    ref={inputRef}
                    type="file" 
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleChange}
                    className="hidden"
                    />
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <UploadSpinner />
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                Uploading to Image
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <UploadIcon />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Click or Drag to upload image
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-600">
                                (JPEG, PNG, WEBP, GIF - Max 5MB)
                            </p>
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-red-500 mt-2">{error}</p>
                )}
        </div>
    )
}


function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
         className="text-gray-400 dark:text-gray-600">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function UploadSpinner() {
  return (
    <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         aria-hidden="true">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}