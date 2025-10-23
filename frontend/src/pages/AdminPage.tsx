import NewProductForm from "@/components/ui/NewProductForm";

const AdminPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 border-b pb-2">Panel de Administración</h1>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Añadir Nuevo Producto</h2>
        <NewProductForm />
      </div>

      {/* Aquí podrías añadir más componentes de administración en el futuro,
          como una lista de pedidos, gestión de usuarios, etc. */}
    </div>
  );
};

export default AdminPage;