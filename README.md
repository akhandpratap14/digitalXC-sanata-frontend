# Secret Santa Assignment Frontend

This is the frontend implementation for the Secret Santa assignment system. It allows users to upload employee and previous assignments CSV files, view the generated Secret Santa pairs in a table, and download the assignments as a CSV file.

## Features

- Upload employees and previous assignments CSV files
- Submit the files and receive Secret Santa assignments
- Display assignments in a table format
- Download the generated assignments as a CSV file

## Tech Stack

- React (with TypeScript)
- TanStack React Query
- Axios
- Vite

## Installation

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/secret-santa-frontend.git
   cd secret-santa-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and set the backend API URL:
   ```sh
   VITE_API_APIURL=http://localhost:3000/api/v1/
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Open the app in your browser at `http://localhost:5173/`

## Usage

### Uploading CSV Files

1. Click on "Upload Employees CSV" and select a valid CSV file.
2. Click on "Upload Previous Year Assignments CSV" and select a valid CSV file.
3. Click the "Submit" button to generate Secret Santa assignments.
4. The assignments will be displayed in a table.
5. The generated CSV file will automatically download.

## Project Structure

```
/src
├── components/               # Reusable UI components
├── hooks/                    # Custom hooks (parseCsvData, downloadCsv)
├── pages/                    # Page components
├── services/                 # API service (Axios instance)
├── App.tsx                   # Main application component
├── main.tsx                  # Entry point
└── vite.config.ts             # Vite configuration
```

## API Integration

### Sending Files to Backend

The app sends a `POST` request to the backend with the selected CSV files:

```ts
const formData = new FormData();
formData.append("employees_csv", employeesFile);
formData.append("previous_assignments_csv", previousFile);
csvMutate.mutate(formData);
```

### Handling Response

Upon success, the response is processed to:

- Display assignments in a table
- Download the CSV file

## Functions Explained

### `parseCsvData(data: any)`

Parses CSV data and returns formatted objects:

```ts
export const parseCsvData = (data: any) => {
  const rows = data
    .trim()
    .split("\n")
    .map((row: any) => row.split(","));
  const headers = rows[0];
  return rows.slice(1).map((row) => ({
    employee_name: row[headers.indexOf("Employee_Name")],
    employee_email: row[headers.indexOf("Employee_EmailID")],
    secret_child_name: row[headers.indexOf("Secret_Child_Name")],
    secret_child_email: row[headers.indexOf("Secret_Child_EmailID")],
  }));
};
```

### `downloadCsv(data: any)`

Handles CSV download in the browser:

```ts
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
```
