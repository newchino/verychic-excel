import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompletionStatusProps {
  status: {
    success: number;
    failed: number;
  };
  processingTime: string;
  onReset: () => void;
}

const CompletionStatus = ({ status, processingTime, onReset }: CompletionStatusProps) => {
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
        <h3 className="text-lg font-semibold">Traitement terminé</h3>
        <p className="text-sm text-muted-foreground">
          {status.success} requêtes traitées avec succès et {status.failed} échecs
        </p>
        <p className="text-sm text-muted-foreground">
          Temps de traitement: {processingTime}
        </p>
      </div>
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onReset}>
          Uploadez nouveau fichier
        </Button>
        <Button onClick={() => window.open('https://factory.wearegenial.com/logs', '_blank')}>
          Voir les fiches produits
        </Button>
      </div>
    </div>
  );
};

export default CompletionStatus;