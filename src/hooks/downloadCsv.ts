export const downloadCsv = (text: any) => {
  const url = window.URL.createObjectURL(
    new Blob([text], { type: "text/csv" })
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "Secret_Santa_Assignments.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
