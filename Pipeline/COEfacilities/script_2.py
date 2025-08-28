# Add M-ERIC and FortIRC with basic structure (since no detailed data sheets provided)
buildings_data['M-ERIC'] = {
    'name': 'M-ERIC (Martin Sr. Engineering Research & Innovation Complex)',
    'totalRooms': 50,  # From previous conversation
    'floors': 4,
    'departments': ['MULTI-DISCIPLINARY RESEARCH', 'INNOVATION SPACES'],
    'rooms': [
        {'roomId': 'M-ERIC-200', 'roomNumber': '200', 'roomName': 'LARGE CLASSROOM', 'floor': 2, 'roomUseCode': '110.0', 'stations': '90', 'area': '2400', 'department': 'GENERAL USE', 'faculty': '', 'building': 'M-ERIC'},
        {'roomId': 'M-ERIC-300', 'roomNumber': '300', 'roomName': 'CLASSROOM', 'floor': 3, 'roomUseCode': '110.0', 'stations': '75', 'area': '2100', 'department': 'GENERAL USE', 'faculty': '', 'building': 'M-ERIC'},
        {'roomId': 'M-ERIC-400', 'roomNumber': '400', 'roomName': 'CLASSROOM', 'floor': 4, 'roomUseCode': '110.0', 'stations': '75', 'area': '2100', 'department': 'GENERAL USE', 'faculty': '', 'building': 'M-ERIC'}
    ]
}

buildings_data['FortIRC'] = {
    'name': 'Fort IRC (Innovation Research Center)',
    'totalRooms': 30,  # From previous conversation  
    'floors': 3,
    'departments': ['ADVANCED RESEARCH', 'DEVELOPMENT'],
    'rooms': [
        {'roomId': 'FortIRC-101', 'roomNumber': '101', 'roomName': 'RESEARCH LAB', 'floor': 1, 'roomUseCode': '250.0', 'stations': '15', 'area': '800', 'department': 'RESEARCH', 'faculty': '', 'building': 'FortIRC'},
        {'roomId': 'FortIRC-201', 'roomNumber': '201', 'roomName': 'DEVELOPMENT LAB', 'floor': 2, 'roomUseCode': '250.0', 'stations': '20', 'area': '1000', 'department': 'RESEARCH', 'faculty': '', 'building': 'FortIRC'}
    ]
}

# Convert to JSON for the HTML application
facilities_json = json.dumps(buildings_data, indent=2)
print("Data structure created successfully!")
print(f"Total buildings: {len(buildings_data)}")
print(f"Buildings: {list(buildings_data.keys())}")

# Save the JSON data to a variable for the HTML
with open('facilities_data.json', 'w') as f:
    f.write(facilities_json)
    
print("JSON data file created: facilities_data.json")