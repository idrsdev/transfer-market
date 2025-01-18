import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PurchaseConfirmDialogProps {
  open?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  playerName?: string;
  originalPrice?: number;
  discountedPrice?: number;
  remainingBudget?: number;
}

const PurchaseConfirmDialog = ({
  open = true,
  onConfirm = () => {},
  onCancel = () => {},
  playerName = "John Doe",
  originalPrice = 1000000,
  discountedPrice = 950000,
  remainingBudget = 5000000,
}: PurchaseConfirmDialogProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const newBudget = remainingBudget - discountedPrice;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Are you sure you want to purchase{" "}
              <span className="font-semibold">{playerName}</span>?
            </p>
            <div className="space-y-2">
              <p>Original Price: {formatPrice(originalPrice)}</p>
              <p className="text-green-600">
                Discounted Price (5% off): {formatPrice(discountedPrice)}
              </p>
              <div className="border-t pt-2">
                <p>Current Budget: {formatPrice(remainingBudget)}</p>
                <p className="font-semibold">
                  Remaining Budget after purchase: {formatPrice(newBudget)}
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={newBudget < 0 ? "bg-gray-400 cursor-not-allowed" : ""}
            disabled={newBudget < 0}
          >
            Confirm Purchase
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PurchaseConfirmDialog;
