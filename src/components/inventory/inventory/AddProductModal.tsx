"use client";

import { LoadingSpinner } from "@/components/UI/LoadingSpinner";
import { ProductData } from "@/interfaces";
import { registerProductWithMovement } from "@/server-actions";
import { useInventoryStore } from "@/store";
import { Ban, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  productData: ProductData | null;
  itemQtyRemaining: number;
  setProductData: React.Dispatch<React.SetStateAction<ProductData | null>>;
  setItemQtyRemaining: React.Dispatch<React.SetStateAction<number>>;
};

const AddProductModal = ({
  productData,
  itemQtyRemaining,
  setProductData,
  setItemQtyRemaining,
}: Props) => {
  const router = useRouter();
  const [qtyReceive, setQtyReceive] = useState<number>(0);
  const [lotNumber, setLotNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { toggleProductModal } = useInventoryStore();
  const handleCancel = () => {
    toggleProductModal();
    setProductData(null);
    setItemQtyRemaining(0);
  };

  const handleStock = async () => {
    //Recibimos la cantidad faltante como parámetro
    // Verificar si el valor es negativo
    if (qtyReceive <= 0) {
      toast.error("La cantidad no puede ser negativa o cero");
      return;
    }
    // Verificar si el valor no es un número entero
    else if (!Number.isInteger(qtyReceive)) {
      toast.error("La cantidad debe ser un número entero.");
      return;
    }
    // Verificar si el valor es mayor que los faltantes
    else if (qtyReceive > itemQtyRemaining) {
      toast.error("La cantidad no puede ser mayor que los faltantes.");
      return;
    } else {
      //* Actualizamos o creamos la bbdd del inventario con la cantidad recibida.

      if (!productData) return;
      setLoading(true);
      try {
        const { ok, data, message } = await registerProductWithMovement(
          {
            Product_name: productData.Product_name,
            Product_ref: productData.Product_ref,
            Product_qtyReceive: qtyReceive,
            Product_location: productData.Product_location,
            Product_lotNumber: lotNumber,
            Product_categoryId: productData.Product_categoryId,
            Item_id: productData.Item_id,
          },
          4, // TODO: ACTUALIZAR EL USERID
          "nota" // TODO: REASON
        );

        if (ok && data) {
          toast.success(message);
          setQtyReceive(0);
          setLotNumber("");
          toggleProductModal();
          router.refresh();
        } else {
          toast.error(message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 z-20 flex justify-center items-start md:items-center overflow-auto pt-5 md:pt-0 backdrop-blur-[1px]`}
      onClick={handleCancel}
    >
      <div
        className={`bg-white dark:bg-slate-600 p-5 w-11/12 max-w-[300px] shadow`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`italic font-bold text-center mb-2`}>
          Ingresar: <span>{productData?.Product_name}</span> al Inventario
        </h3>
        <form>
          <label className={`flex gap-5 justify-start items-center mb-2`}>
            <span className={`w-16 italic`}>Cantidad:</span>
            <input
              type="number"
              className={`bg-slate-300 dark:bg-slate-800 p-2 focus:outline-none text-base rounded h-8 flex-1 max-w-20`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQtyReceive(Number(e.target.value))
              }
            />
          </label>
          <label className={`flex gap-5 justify-start items-center`}>
            <span className={`w-16 italic`}>Lote:</span>
            <input
              type="text"
              className={`bg-slate-300 dark:bg-slate-800 p-2 focus:outline-none text-base rounded h-8 flex-1 max-w-40`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLotNumber(e.target.value)
              }
            />
          </label>
          <div className={`flex gap-5`}>
            <button
              className={`flex justify-center items-center py-1 px-2 text-white gap-1 my-1 bg-gradient-to-b from-rose-500 to-rose-600 rounde hover:from-rose-700 hover:to-rose-700 mx-auto rounded mt-2 w-28 transition-all duration-300`}
              onClick={handleCancel}
              disabled={loading}
            >
              <Ban className={`w-5`} />
              Cancelar
            </button>

            <button
              className={`flex justify-center items-center py-1 px-2 text-white gap-1 my-1 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-800 hover:to-indigo-800 rounde mx-auto rounded mt-2 w-28 transition-all duration-300`}
              onClick={handleStock}
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <LogIn className={`w-5`} />
                  Enviar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddProductModal;