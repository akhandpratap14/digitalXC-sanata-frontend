export const parseCsvData = (data: any) => {
  const rows = data
    .trim()
    .split("\n")
    .map((row: any) => row.split(","));
  const headers = rows[0];

  const formattedAssignments = rows.slice(1).map((row) => ({
    employee_name: row[headers.indexOf("Employee_Name")],
    employee_email: row[headers.indexOf("Employee_EmailID")],
    secret_child_name: row[headers.indexOf("Secret_Child_Name")],
    secret_child_email: row[headers.indexOf("Secret_Child_EmailID")],
  }));
  return formattedAssignments;
};
