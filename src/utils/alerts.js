import Swal from "sweetalert2";

const baseConfig = {
  background: "#0f172a",
  color: "#ffffff",

  allowOutsideClick: false,
  allowEscapeKey: false,

  showClass: {
    popup: "animate__animated animate__zoomIn",
  },

  hideClass: {
    popup: "animate__animated animate__zoomOut",
  },

  customClass: {
    popup: "rounded-3xl shadow-2xl",

    title: "text-2xl font-bold",

    htmlContainer: "text-base",

    confirmButton:
      "px-7 py-3 rounded-xl font-bold",

    cancelButton:
      "px-7 py-3 rounded-xl font-bold",
  },
};

export const successAlert = (title, text) =>
  Swal.fire({
    ...baseConfig,

    icon: "success",

    title,

    text,

    confirmButtonText: "OK",

    confirmButtonColor: "#ffc114",
  });

export const errorAlert = (title, text) =>
  Swal.fire({
    ...baseConfig,

    icon: "error",

    title,

    text,

    confirmButtonText: "Close",

    confirmButtonColor: "#ef4444",
  });

export const warningAlert = (title, text) =>
  Swal.fire({
    ...baseConfig,

    icon: "warning",

    title,

    text,

    confirmButtonText: "OK",

    confirmButtonColor: "#f59e0b",
  });

export const infoAlert = (title, text) =>
  Swal.fire({
    ...baseConfig,

    icon: "info",

    title,

    text,

    confirmButtonText: "OK",

    confirmButtonColor: "#3b82f6",
  });

export const loadingAlert = (title = "Please Wait") =>
  Swal.fire({
    ...baseConfig,

    title,

    text: "Processing...",

    allowOutsideClick: false,

    allowEscapeKey: false,

    didOpen: () => {
      Swal.showLoading();
    },
  });

  
export const confirmDelete = () =>
  Swal.fire({
    ...baseConfig,

    icon: "warning",

    title: "Delete Record?",

    text: "This action cannot be undone.",

    showCancelButton: true,

    confirmButtonText: "Delete",

    cancelButtonText: "Cancel",

    confirmButtonColor: "#dc2626",

    cancelButtonColor: "#475569",
  });

 export const confirmAlert = async ({
  title,
  text,
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel",
  icon = "warning",
}) => {
  const result = await Swal.fire({
    ...baseConfig,

    icon,

    title,

    text,

    showCancelButton: true,

    confirmButtonText,

    cancelButtonText,

    confirmButtonColor: "#dc2626",

    cancelButtonColor: "#475569",

    reverseButtons: true,

    allowOutsideClick: false,

    allowEscapeKey: false,
  });

  return result.isConfirmed;
};