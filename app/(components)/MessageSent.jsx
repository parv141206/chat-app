import React from "react";

export default function MessageSent(props) {
  const { content, time } = props;
  return (
    <div className="message-sent ">
      <p>{content}</p>
    </div>
  );
}
