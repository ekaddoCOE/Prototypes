import pandas as pd
import json

# Load the Excel file and examine its structure
file_path = "COE-Room-Utilizations_2023-3.xlsx"

# Get all sheet names
excel_file = pd.ExcelFile(file_path)
sheet_names = excel_file.sheet_names
print("Available sheets:", sheet_names)

# Load each sheet and examine structure
sheets_data = {}
for sheet in sheet_names:
    df = pd.read_excel(file_path, sheet_name=sheet)
    sheets_data[sheet] = df
    print(f"\n=== {sheet} Sheet ===")
    print(f"Shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    print(f"First 3 rows:")
    print(df.head(3))