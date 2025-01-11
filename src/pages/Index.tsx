import FileUpload from "@/components/FileUpload";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-4">
          <img 
            src="/lovable-uploads/f88625c4-aa8c-4bd4-a5f2-b2e25bf4888b.png" 
            alt="Verychic Logo" 
            className="h-8 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold tracking-tight">Créateur fiche produit</h1>
          <p className="text-lg text-muted-foreground">
            Uploadez votre fichier Excel pour lancer la génération des fiches produits
          </p>
        </div>
        <FileUpload />
      </div>
    </div>
  );
};

export default Index;