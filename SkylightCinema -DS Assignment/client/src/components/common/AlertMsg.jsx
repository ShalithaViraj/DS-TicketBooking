import Swal from "sweetalert2";

const AlertMsg = ( booSucess, msg ) => {
    return Swal.fire({
        icon: booSucess ? "success" : "error",
        title: msg
    });
}

export default AlertMsg;