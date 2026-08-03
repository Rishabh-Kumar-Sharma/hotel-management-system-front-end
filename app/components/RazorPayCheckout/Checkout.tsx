"use client";
import { ToastType } from "@/app/types";
import { showToast } from "../Toast";
import { Translations } from "@/app/utils/Translations";
import { useEffect } from "react";
import { useAppSelector } from "@/app/lib";
import { selectBooking } from "@/app/lib/slices/BookingSlice";
import { useConfirmBooking } from "@/app/hooks";

const Checkout = ({
  onClose,
  refreshData,
}: {
  onClose?: () => void;
  refreshData?: () => void;
}) => {
  const { selectedBooking } = useAppSelector(selectBooking);
  const bookingRoomMutation = useConfirmBooking();

  const loadScript = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const LoadRazorpay = async () => {
    try {
      const res = await loadScript();
      if (!res) {
        showToast(Translations.RAZORPAY_LOADING_FAILED, ToastType.ERROR);
      } else {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
          amount: selectedBooking?.pricePerNight, // Amount is in currency subunits.
          currency: selectedBooking?.currency,
          name: "HotelFlow", //your business name
          description: "Booking Room",
          image: "https://example.com/your_logo",
          order_id: selectedBooking?.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          handler: async function (response) {
            try {
              const data = await bookingRoomMutation.mutateAsync({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: selectedBooking?.bookingId,
              });
              if (data) {
                refreshData?.();
                showToast(
                  Translations.PAYMENT_VERIFIED_SUCCESSFULLY,
                  ToastType.SUCCESS,
                );
              }
            } catch (e) {
              showToast(
                Translations.PAYMENT_VERIFICATION_FAILED,
                ToastType.ERROR,
              );
            } finally {
              rzp.close();
              onClose?.();
            }
          },
          prefill: {
            //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            name: "Test User", //your customer's name
            email: "TestUser@test.com",
            contact: "+911233456789", //Provide the customer's phone number for better conversion rates
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          rzp.close();
          onClose?.();
          showToast(Translations.PAYMENT_FAILED, ToastType.ERROR);
        });
        rzp.open();
      }
    } catch (e) {
      showToast(Translations.RAZORPAY_LOADING_FAILED, ToastType.ERROR);
    }
  };

  useEffect(() => {
    LoadRazorpay();
    return () => {
      onClose?.();
    };
  }, []);

  return <div></div>;
};

export { Checkout as RazorpayCheckout };
