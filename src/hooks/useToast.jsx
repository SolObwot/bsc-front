import { useEffect } from "react";
import { toast as reactToast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function toast({ title, description, variant }) {
  const options = {
    type: variant === "destructive" ? "error" : "success",
    autoClose: 5000,
    position: "top-right",
  };

  reactToast(`${title}: ${description}`, options);
}

function useToast() {
  return {
    toast: (message) => {
      // Store message in sessionStorage for persistence across navigation
      if (message.variant === "success") {
        sessionStorage.setItem("toastMessage", JSON.stringify(message));
      }
      toast(message);
    },
  };
}

// Component to check for stored toast messages and display them
function ShowStoredToast() {
  useEffect(() => {
    const storedMessage = sessionStorage.getItem("toastMessage");
    if (storedMessage) {
      toast(JSON.parse(storedMessage));
      sessionStorage.removeItem("toastMessage"); // Remove to prevent duplicate toasts
    }
  }, []);

  return null;
}

export { useToast, ToastContainer, ShowStoredToast };
