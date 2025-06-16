# Process and clean the data from each building sheet
import re

def clean_room_data(df, building_name):
    """Clean and process room data for a building"""
    cleaned_rooms = []
    current_floor = None
    
    for idx, row in df.iterrows():
        room_num = str(row['Room #']).strip() if pd.notna(row['Room #']) else ''
        
        # Skip header rows and empty rows
        if room_num in ['Room #', 'nan', ''] or 'FLOOR' in room_num.upper():
            if 'FLOOR' in room_num.upper():
                current_floor = room_num
            continue
            
        # Extract room data
        room_name = str(row['Room Name']).strip() if pd.notna(row['Room Name']) else ''
        room_use_code = str(row['Room Use Code']).strip() if pd.notna(row['Room Use Code']) else ''
        stations = str(row['Stations']).strip() if pd.notna(row['Stations']) else ''
        area = str(row['Area (ft2)']).strip() if pd.notna(row['Area (ft2)']) else ''
        department = str(row['Department']).strip() if pd.notna(row['Department']) else ''
        faculty = str(row['Faculty /Scientist Name']).strip() if pd.notna(row['Faculty /Scientist Name']) else ''
        
        # Skip empty rows
        if not any([room_num, room_name, department]):
            continue
            
        # Extract floor number from room number
        floor_num = None
        if room_num.isdigit() and len(room_num) >= 3:
            floor_num = int(room_num[0])
        elif room_num.startswith('00'):
            floor_num = 1  # Basement/ground level rooms
        else:
            # Try to extract floor from room number pattern
            match = re.match(r'(\d+)', room_num)
            if match:
                first_digit = int(match.group(1)[0]) if match.group(1) else 1
                floor_num = first_digit if first_digit > 0 else 1
        
        if floor_num is None:
            floor_num = 1  # Default to first floor
            
        cleaned_rooms.append({
            'roomId': f"{building_name}-{room_num}",
            'roomNumber': room_num,
            'roomName': room_name,
            'floor': floor_num,
            'roomUseCode': room_use_code,
            'stations': stations,
            'area': area,
            'department': department,
            'faculty': faculty,
            'building': building_name
        })
    
    return cleaned_rooms

# Process each building
buildings_data = {}

# McNair Hall
mcnair_rooms = clean_room_data(sheets_data['McNair'], 'McNair')
buildings_data['McNair'] = {
    'name': 'McNair Hall',
    'totalRooms': len(mcnair_rooms),
    'floors': max([room['floor'] for room in mcnair_rooms]) if mcnair_rooms else 6,
    'departments': list(set([room['department'] for room in mcnair_rooms if room['department'] and room['department'] != 'nan'])),
    'rooms': mcnair_rooms
}

# Graham Hall  
graham_rooms = clean_room_data(sheets_data['Graham'], 'Graham')
buildings_data['Graham'] = {
    'name': 'Graham Hall',
    'totalRooms': len(graham_rooms),
    'floors': max([room['floor'] for room in graham_rooms]) if graham_rooms else 3,
    'departments': list(set([room['department'] for room in graham_rooms if room['department'] and room['department'] != 'nan'])),
    'rooms': graham_rooms
}

# Monroe Hall
monroe_rooms = clean_room_data(sheets_data['Monroe'], 'Monroe')
buildings_data['Monroe'] = {
    'name': 'Monroe Hall', 
    'totalRooms': len(monroe_rooms),
    'floors': max([room['floor'] for room in monroe_rooms]) if monroe_rooms else 3,
    'departments': list(set([room['department'] for room in monroe_rooms if room['department'] and room['department'] != 'nan'])),
    'rooms': monroe_rooms
}

# Hines Hall
hines_rooms = clean_room_data(sheets_data['Hines'], 'Hines')
buildings_data['Hines'] = {
    'name': 'Hines Hall',
    'totalRooms': len(hines_rooms),
    'floors': 2,  # Only 2nd floor according to data
    'departments': list(set([room['department'] for room in hines_rooms if room['department'] and room['department'] != 'nan'])),
    'rooms': hines_rooms
}

# Print summary
for building, data in buildings_data.items():
    print(f"\n=== {building} ===")
    print(f"Total Rooms: {data['totalRooms']}")
    print(f"Floors: {data['floors']}")
    print(f"Departments: {data['departments'][:3]}..." if len(data['departments']) > 3 else f"Departments: {data['departments']}")
    print(f"Sample rooms: {[r['roomNumber'] + ' - ' + r['roomName'] for r in data['rooms'][:3]]}")