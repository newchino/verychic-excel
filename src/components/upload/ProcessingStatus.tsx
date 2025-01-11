import { FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProcessingStatusProps {
  status: {
    total: number;
    processed: number;
    success: number;
    failed: number;
  };
}

const ProcessingStatus = ({ status }: ProcessingStatusProps) => {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <FileSpreadsheet className="w-16 h-16 text-primary animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
        <p className="text-sm text-muted-foreground">Rédaction en cours...</p>
      </div>
      <Progress value={(status.processed / status.total) * 100} />
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center justify-center space-x-2 p-4 bg-accent rounded-lg">
          <FileSpreadsheet className="w-4 h-4" />
          <span className="text-sm font-medium">{status.total} Total</span>
        </div>
        <div className="flex items-center justify-center space-x-2 p-4 bg-accent rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium">{status.success} Success</span>
        </div>
        <div className="flex items-center justify-center space-x-2 p-4 bg-accent rounded-lg">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className="text-sm font-medium">{status.failed} Failed</span>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;