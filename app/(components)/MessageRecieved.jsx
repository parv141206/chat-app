import React from "react";

export default function MessageRecieved(props) {
  const { content, time } = props;
  return (
    <div className="message-recieved ">
      <p>{content}</p>
    </div>
  );
}
