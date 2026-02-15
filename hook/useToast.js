import toast from 'react-hot-toast';
export function useToast() {
    const showToast = (message, type = 'default') => {
        switch (type) {
            case 'success':
                toast.success(message)
                break;
            case 'error':
                toast.error(message, {
                    iconTheme: {
                        primary: '#f44336',
                    },
                    style: {
                        border: '0px',
                        color: 'black',
                        icon: "black"
                    },
                })
                break;
                
            default:
                toast.success(message)
                break;
        }
    };
    return showToast;
}