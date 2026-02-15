// import React, { useEffect, useState } from "react";
// import Echo from "laravel-echo";
// import Pusher from "pusher-js";
// import { shopId } from "../pages/api";
// import { createNewOrder } from "../utlit/createNewOrder";
// import { useToast } from "./useToast";
// import { showToastNotification } from "../service";


// const useOrderLiveData = (setOrders) => {
//   // const [isSubscribed, setIsSubscribed] = useState(false);
//   useEffect(() => {
//     if (typeof window !== "undefined" && !window.Echo) {
//       window.Pusher = Pusher;
//       window.Echo = new Echo({
//         broadcaster: process.env.NEXT_PUBLIC_PUSHER_APP_BROADCAST_DRIVER,
//         key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
//         wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST,
//         wsPort: process.env.NEXT_PUBLIC_PUSHER_APP_PORT,
//         wssPort: process.env.NEXT_PUBLIC_PUSHER_APP_PORT,
//         forceTLS: false,
//         enabledTransports: ["ws", "wss"],
//       });
//     }
//     const echoInstance = window.Echo;
//     if (echoInstance) {
//       const channel = window.Echo.channel(`order-channel-${shopId}`).listen(
//         "OrderWebsocketEvent",
//         e => {
//           setOrders(prevOrders => [e.data ,...prevOrders]);
//           if(e.data.id){
//           const audio = new Audio("/iphone_sound.mp3");
//           console.log(e.data);
//           audio.play();
//           showToastNotification(e.data.id,`An order of ৳${e?.data?.grand_total} received.`);
         
//           // return e.data
//           // showToast("New Order Arrived", "success");

//           }
        
//         }
//       );
//       // setIsSubscribed(true);
//       return () => {
//         // if (isSubscribed) {
//           channel.stopListening("OrderWebsocketEvent");
//           echoInstance.leaveChannel(`order-channel-${shopId}`);
//           // setIsSubscribed(false);
//         // }
//       };
//     }
//   }, []);
//   // return ;
// };

// export default useOrderLiveData;