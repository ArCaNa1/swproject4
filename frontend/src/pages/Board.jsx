// src/pages/Board.jsx
import React from "react";
import { useParams } from "react-router-dom";
import ListBoard from "./ListBoard";

export default function Board() {
  const { teamId } = useParams();
  const email = localStorage.getItem("email");

  if (!teamId || !email) return <div>잘못된 접근입니다.</div>;

  const user = { email };

  return <ListBoard teamId={teamId} user={user} />;
}
