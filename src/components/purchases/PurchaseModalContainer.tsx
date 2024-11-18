"use client";

import { usePurchaseItemStore, usePurchaseStore } from "@/store";
import { DeleteItemModal } from "../purchaseItem/DeleteItemModal";
import { ClosePurchaseModal } from "./ClosePurchaseModal";
import DeletePurchaseModal from "./DeletePurchaseModal";

export const PurchaseModalContainer = () => {
  const { deleteItemModalOpen } = usePurchaseItemStore();
  const { closePurchaseModalOpen, deletePurchaseModalOpen} = usePurchaseStore();

  return (
    <>
      {deleteItemModalOpen && <DeleteItemModal />}
      {closePurchaseModalOpen && <ClosePurchaseModal />}
      {deletePurchaseModalOpen && <DeletePurchaseModal />}
      {/* {isProductModalOpen && <AddProductModal />}
      {isClosePurchaseModalOpen && <ClosePurchaseModal total={total} />}
      {isDeleteProductModalOpen && <DeleteProductModal />} */}
    </>
  );
};