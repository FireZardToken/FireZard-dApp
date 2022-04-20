import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

export default function useNotification() {
  const addNotification = ({ message, type }) => {
    if(type === 'success') {
        alertify.success(String(message));
    } else if(type === 'warning') {
        alertify.warning(String(message));
    } else if(type === 'error') {
        alertify.error(String(message));
    }
  };

  return { addNotification };
}
