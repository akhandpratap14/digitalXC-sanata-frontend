import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { parseCsvData } from "./hooks/parseCsvData";
import { downloadCsv } from "./hooks/downloadCsv";
import Instance from "./services/instance";

interface TableDataInterface {
  employee_name: string;
  employee_email: string;
  secret_child_name: string;
  secret_child_email: string;
}

export default function SecretSanta() {
  const [employeesFile, setEmployeesFile] = useState<File | null>(null);
  const [previousFile, setPreviousFile] = useState<File | null>(null);
  const [tableData, setTableData] = useState<TableDataInterface[]>([]);

  const { instance: api } = Instance();

  const csvMutate = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post("secret_santa_assignments", formData);
      return res.data;
    },
    onSuccess: (data) => {
      setTableData(parseCsvData(data));
      downloadCsv(data);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const onFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "employees" | "previous"
  ) => {
    const file = event.target.files?.[0] || null;
    if (file && !file.name.endsWith(".csv")) {
      alert("Only CSV files are allowed.");
      return;
    }
    if (type === "employees") setEmployeesFile(file);
    if (type === "previous") setPreviousFile(file);
  };

  const onButtonSubmit = async () => {
    if (!employeesFile || !previousFile) {
      alert("Please upload both CSV files.");
      return;
    }

    const formData = new FormData();
    formData.append("employees_csv", employeesFile);
    formData.append("previous_assignments_csv", previousFile);

    csvMutate.mutate(formData);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Secret Santa Assignment</h1>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Upload Employees CSV</span>
          <input
            type="file"
            accept=".csv"
            className="mt-1 border p-2 m-2"
            onChange={(e) => onFileSelect(e, "employees")}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">
            Upload Previous Year Assignments CSV
          </span>
          <input
            type="file"
            accept=".csv"
            className="mt-1 border p-2 m-2"
            onChange={(e) => onFileSelect(e, "previous")}
          />
        </label>

        <button
          onClick={() => {
            onButtonSubmit();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          disabled={csvMutate.isPending}
        >
          {csvMutate.isPending ? "Processing..." : "Submit"}
        </button>
      </div>

      {tableData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Employee And Their Children
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">
                  Employee Name
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Employee Email
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Secret Child Name
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Secret Child Email
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((data, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">
                    {data.employee_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {data.employee_email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {data.secret_child_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {data.secret_child_email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
