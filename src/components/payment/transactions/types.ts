
export interface Transaction {
  id: string;
  type: "payment" | "refund" | "escrow" | "withdrawal";
  status: "pending" | "completed" | "failed" | "disputed" | "escrow";
  amount: number;
  fee: number;
  currency: string;
  date: string;
  description: string;
  paymentMethod: string;
  recipient?: string;
}

export interface TransactionHandlers {
  onRefund?: (transactionId: string) => void;
  onDispute?: (transactionId: string, reason: string) => void;
  onDownloadReceipt?: (transactionId: string) => void;
  onReleaseEscrow?: (transactionId: string) => void;
}

export const getStatusBadge = (status: Transaction["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "pending":
      return "text-yellow-600 border-yellow-600";
    case "failed":
      return "bg-destructive";
    case "disputed":
      return "bg-orange-500";
    case "escrow":
      return "bg-blue-500";
    default:
      return "variant-outline";
  }
};

export const getStatusLabel = (status: Transaction["status"]) => {
  switch (status) {
    case "completed":
      return "Complété";
    case "pending":
      return "En attente";
    case "failed":
      return "Échoué";
    case "disputed":
      return "Litigieux";
    case "escrow":
      return "En séquestre";
    default:
      return status;
  }
};

export const getTypeLabel = (type: Transaction["type"]) => {
  switch (type) {
    case "payment":
      return "Paiement";
    case "refund":
      return "Remboursement";
    case "escrow":
      return "Dépôt séquestre";
    case "withdrawal":
      return "Retrait";
    default:
      return type;
  }
};

// Mock transactions for demo purposes
export const mockTransactions: Transaction[] = [
  {
    id: "TXN123456",
    type: "payment",
    status: "completed",
    amount: 450,
    fee: 22.50,
    currency: "TND",
    date: "2023-10-15",
    description: "Paiement pour cueillette d'olives - 3 jours",
    paymentMethod: "Carte bancaire",
    recipient: "Ahmed Ben Ali",
  },
  {
    id: "TXN123457",
    type: "escrow",
    status: "escrow",
    amount: 600,
    fee: 30,
    currency: "TND",
    date: "2023-10-18",
    description: "Réservation pour cueillette - Oliveraie à Sfax",
    paymentMethod: "Virement bancaire",
    recipient: "Leila Turki",
  },
  {
    id: "TXN123458",
    type: "refund",
    status: "completed",
    amount: 200,
    fee: 0,
    currency: "TND",
    date: "2023-10-10",
    description: "Remboursement partiel - Service annulé",
    paymentMethod: "Crédit sur carte",
  },
  {
    id: "TXN123459",
    type: "payment",
    status: "disputed",
    amount: 750,
    fee: 37.50,
    currency: "TND",
    date: "2023-10-05",
    description: "Paiement pour cueillette d'olives - 5 jours",
    paymentMethod: "Mobile Money",
    recipient: "Sami Maatoug",
  },
  {
    id: "TXN123460",
    type: "payment",
    status: "pending",
    amount: 525,
    fee: 26.25,
    currency: "TND",
    date: "2023-10-20",
    description: "Paiement en attente - Cueillette à Nabeul",
    paymentMethod: "D17",
    recipient: "Fatma Khelifi",
  },
];
