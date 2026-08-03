import { useMutation } from "@tanstack/react-query";
import { bookRoomConfirm } from "../services";

interface ConfirmBookingRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  bookingId?: number;
}

export const useConfirmBooking = () => {
  return useMutation({
    mutationFn: (request: ConfirmBookingRequest) => bookRoomConfirm(request),
  });
};
