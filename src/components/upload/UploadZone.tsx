import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  getInputProps: () => any;
  getRootProps: () => any;
  isDragActive: boolean;
  isProcessing: boolean;
}

const UploadZone = ({ getInputProps, getRootProps, isDragActive, isProcessing }: UploadZoneProps) => {
  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-12 transition-all duration-200 ease-in-out",
        "hover:border-primary/50 hover:bg-accent/50",
        isDragActive ? "border-primary bg-accent" : "border-muted",
        isProcessing ? "pointer-events-none opacity-50" : "cursor-pointer"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Upload className="w-12 h-12 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">
            {isDragActive ? "Drop the file here" : "Upload Excel File"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop your Excel file here, or click to select
          </p>
          <p className="text-xs text-muted-foreground italic">
            Note: The first line of the file must be a header row
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;