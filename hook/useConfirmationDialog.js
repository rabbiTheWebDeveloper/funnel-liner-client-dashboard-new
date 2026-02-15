import Swal from 'sweetalert2';
const useConfirmationDialog = (title, text, confirmButtonText) => {
    const confirmAction = async () => {
        const result = await Swal.fire({
            text: text,
            iconHtml: '<img src="/images/delete.png">',
            customClass: {
                icon: 'no-border',
            },
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#894bca",
            confirmButtonText: confirmButtonText,
        });
        return result.isConfirmed;
    }
    return confirmAction;
}
export default useConfirmationDialog;