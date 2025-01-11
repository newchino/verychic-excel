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
        isDragActive ? "border-primary bg-accent" : "border-accent",
        isProcessing ? "pointer-events-none opacity-50" : "cursor-pointer"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Upload className="w-12 h-12 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">
            {isDragActive ? "Déposez votre fichier ici" : "Uploadez votre fichier Excel"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Glissez-déposez votre fichier Excel ici, ou cliquez pour le sélectionner
          </p>
          <p className="text-xs text-muted-foreground italic">
            Note: La première ligne du fichier doit être une ligne d'en-tête
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;