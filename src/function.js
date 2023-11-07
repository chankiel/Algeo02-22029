import axios from "axios";

function addData(newData,url) {
    console.log(newData, url)
    axios.post(url, newData)
        .then(response => {
            console.log(response.data.message); // Response message from the API
        })
        .catch(error => {
            console.error(error);
        });
}

// Contoh pemakaian

// const url="https://parkir-api.vercel.app/data/user" //API untuk data user
// const newdata={
//     nama:"Farel", //Bebas pakek data apapun misal username,password,dll
//     id:1 //Ini harus id 1
// }
// addData(newdata,url)

// NANTI TINGGAL DI IMPORT FUNCTION addData ke manapun

export{addData}