import FileUpload from "@/components/FileUpload";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-4">
          <img 
            src="/lovable-uploads/f88625c4-aa8c-4bd4-a5f2-b2e25bf4888b.png" 
            alt="Verychic Logo" 
            className="h-13 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold tracking-tight">Rédacteur de fiches produits</h1>
          <p className="text-lg text-muted-foreground">
            Rédigez vos fiches produits en un temps record grâce à la puissance de l'IA.
          </p>
        </div>
        <FileUpload />
      </div>
      <div className="mt-16 flex items-center justify-center gap-2">
        <p className="text-sm text-muted-foreground">Powered by</p>
        <img 
          src="/lovable-uploads/39543920-c875-4be1-84e5-36faaab22346.png" 
          alt="Genial Logo" 
          className="h-8"
        />
      </div>
    </div>
  );
};

export default Index;