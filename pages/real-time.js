import React, { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import toast from "react-hot-toast";
import { shopId } from "./api";

const Index = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Echo) {
      window.Pusher = Pusher;
      window.Echo = new Echo({
        broadcaster: process.env.NEXT_PUBLIC_PUSHER_APP_BROADCAST_DRIVER,
        key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
        wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST,
        wsPort: process.env.NEXT_PUBLIC_PUSHER_APP_PORT,
        wssPort: process.env.NEXT_PUBLIC_PUSHER_APP_PORT,
        forceTLS: false,
        enabledTransports: ["ws", "wss"],
      });
    }

    const echoInstance = window.Echo;
    if (echoInstance) {
      const channel = window.Echo.channel(`order-channel-${shopId}`).listen(
        "OrderWebsocketEvent",
        e => {
          console.log("Order Event: ", e);
          // toast.success('New Bid Placed');
        }
      );
      setIsSubscribed(true);
      return () => {
        if (isSubscribed) {
          channel.stopListening("OrderWebsocketEvent");
          echoInstance.leaveChannel(`order-channel-${shopId}`);
          setIsSubscribed(false);
        }
      };
    }
  }, [isSubscribed]);

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          marginTop: "100px",
          color: "red",
          fontSize: "50px",
        }}
      >
        Welcome to Real Time
      </h1>
    </>
  );
};

export default Index;
