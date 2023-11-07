import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

const Scanner = () => {
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox:{
                width:250,
                height:250
            },
            fps: 3,
        });

        
        const onSuccess = (result) => {
            console.log(result)
            setScanResult(result);
        }
        
        scanner.render(onSuccess);
    },[]);
    
    return (
        <div id="reader"></div>
    )

    
}

export default Scanner;