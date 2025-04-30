import React from "react";

export const Table = ({ children }) => {
  return <table className="table-auto w-full border-collapse">{children}</table>;
};

export const TableRow = ({ children }) => {
  return <tr className="border-b">{children}</tr>;
};

export const TableCell = ({ children }) => {
  return <td className="p-2 border">{children}</td>;
};

export const TableHeader = ({ children }) => {
  return <thead className="bg-gray-200">{children}</thead>;
};

export const TableBody = ({ children }) => {
  return <tbody>{children}</tbody>;
};
